import { and, desc, eq, gt, isNull, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { galleries, shareLinks, users } from "@/db/schema";
import { hashToken } from "@/lib/security/tokens";

export const MAX_ACTIVE_LINKS = 10;

/** Token de 32 bytes em base64url = 43 caracteres */
const TOKEN_RE = /^[A-Za-z0-9_-]{43}$/;

/**
 * Link válido agora: não revogado, não vencido, galeria não expirada
 * e dono ainda ativo. Qualquer falha devolve null (sem dizer o motivo).
 */
export async function findActiveShare(token: string) {
  if (!TOKEN_RE.test(token)) return null;

  const [row] = await db
    .select({
      linkId: shareLinks.id,
      galleryId: galleries.id,
      title: galleries.title,
      eventDate: galleries.eventDate,
    })
    .from(shareLinks)
    .innerJoin(galleries, eq(galleries.id, shareLinks.galleryId))
    .innerJoin(users, eq(users.id, galleries.userId))
    .where(
      and(
        eq(shareLinks.tokenHash, hashToken(token)),
        isNull(shareLinks.revokedAt),
        or(isNull(shareLinks.expiresAt), gt(shareLinks.expiresAt, sql`now()`)),
        gt(galleries.expiresAt, sql`now()`),
        eq(users.active, true),
      ),
    )
    .limit(1);

  return row ?? null;
}

/** Links não revogados de uma galeria (os vencidos aparecem marcados) */
export function listShareLinks(galleryId: string) {
  return db
    .select({
      id: shareLinks.id,
      label: shareLinks.label,
      createdAt: shareLinks.createdAt,
      expiresAt: shareLinks.expiresAt,
      viewCount: shareLinks.viewCount,
      lastViewedAt: shareLinks.lastViewedAt,
      expired: sql<boolean>`${shareLinks.expiresAt} is not null and ${shareLinks.expiresAt} <= now()`,
    })
    .from(shareLinks)
    .where(and(eq(shareLinks.galleryId, galleryId), isNull(shareLinks.revokedAt)))
    .orderBy(desc(shareLinks.createdAt));
}