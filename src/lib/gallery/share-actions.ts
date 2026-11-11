"use server";

import { and, count, eq, gt, isNull, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { galleries, shareLinks } from "@/db/schema";
import { requireClient } from "@/lib/auth/guards";
import { appUrl } from "@/lib/email/send";
import { MAX_ACTIVE_LINKS } from "@/lib/gallery/share";
import { rateLimit } from "@/lib/security/rate-limit";
import { generateToken, hashToken } from "@/lib/security/tokens";

export type ShareState = {
  error?: string;
  link?: string;
  message?: string;
} | null;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Validades permitidas (dias). "gallery" = até a galeria expirar. */
const DURATIONS: Record<string, number | null> = {
  "7": 7,
  "30": 30,
  "90": 90,
  gallery: null,
};

export async function createShareLink(
  galleryId: string,
  _prev: ShareState,
  formData: FormData,
): Promise<ShareState> {
  const user = await requireClient();
  if (!UUID_RE.test(galleryId)) return { error: "Galeria inválida." };

  const limit = await rateLimit(`share:user:${user.id}`, 20, 60 * 60);
  if (!limit.allowed) {
    return { error: "Muitos links criados. Tente novamente mais tarde." };
  }

  // A galeria precisa ser do cliente e estar válida
  const [gallery] = await db
    .select({ id: galleries.id })
    .from(galleries)
    .where(
      and(
        eq(galleries.id, galleryId),
        eq(galleries.userId, user.id),
        gt(galleries.expiresAt, sql`now()`),
      ),
    )
    .limit(1);
  if (!gallery) return { error: "Galeria não encontrada ou expirada." };

  const label =
    String(formData.get("label") ?? "").trim().slice(0, 60) || "Link para família";

  const duration = String(formData.get("duration") ?? "30");
  if (!(duration in DURATIONS)) return { error: "Validade inválida." };
  const days = DURATIONS[duration];

  const [{ total }] = await db
    .select({ total: count() })
    .from(shareLinks)
    .where(
      and(
        eq(shareLinks.galleryId, galleryId),
        isNull(shareLinks.revokedAt),
        or(isNull(shareLinks.expiresAt), gt(shareLinks.expiresAt, sql`now()`)),
      ),
    );
  if (total >= MAX_ACTIVE_LINKS) {
    return {
      error: `Você já tem ${MAX_ACTIVE_LINKS} links ativos. Desative algum para criar outro.`,
    };
  }

  const token = generateToken();
  await db.insert(shareLinks).values({
    galleryId,
    createdBy: user.id,
    tokenHash: hashToken(token), // o token em si nunca é salvo
    label,
    expiresAt:
      days === null
        ? null
        : sql`now() + make_interval(days => ${sql.raw(String(days))})`,
  });

  revalidatePath(`/cliente/galeria/${galleryId}`);
  return { link: `${appUrl()}/ver/${token}` };
}

export async function revokeShareLink(
  galleryId: string,
  linkId: string,
): Promise<ShareState> {
  const user = await requireClient();
  if (!UUID_RE.test(galleryId) || !UUID_RE.test(linkId)) {
    return { error: "Link inválido." };
  }

  const [gallery] = await db
    .select({ id: galleries.id })
    .from(galleries)
    .where(and(eq(galleries.id, galleryId), eq(galleries.userId, user.id)))
    .limit(1);
  if (!gallery) return { error: "Galeria não encontrada." };

  const [revoked] = await db
    .update(shareLinks)
    .set({ revokedAt: sql`now()` })
    .where(
      and(
        eq(shareLinks.id, linkId),
        eq(shareLinks.galleryId, galleryId),
        isNull(shareLinks.revokedAt),
      ),
    )
    .returning({ id: shareLinks.id });

  if (!revoked) return { error: "Link não encontrado." };

  revalidatePath(`/cliente/galeria/${galleryId}`);
  return { message: "Link desativado." };
}