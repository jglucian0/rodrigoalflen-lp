import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { galleries } from "@/db/schema";
import { getAdminOrNull } from "@/lib/auth/guards";
import { isSameOrigin } from "@/lib/security/request";
import { presignUpload } from "@/lib/storage/r2";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_BYTES = 40 * 1024 * 1024;
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 403 });
  }
  if (!(await getAdminOrNull())) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await ctx.params;
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "Galeria inválida." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const { contentType, size } = (body ?? {}) as { contentType?: unknown; size?: unknown };
  const ext = typeof contentType === "string" ? TYPES[contentType] : undefined;

  if (!ext || typeof contentType !== "string") {
    return NextResponse.json(
      { error: "Formato não aceito. Use JPG, PNG ou WebP." },
      { status: 415 },
    );
  }
  if (typeof size !== "number" || size <= 0 || size > MAX_BYTES) {
    return NextResponse.json(
      { error: `O arquivo deve ter até ${MAX_BYTES / 1024 / 1024} MB.` },
      { status: 413 },
    );
  }

  const [gallery] = await db
    .select({ id: galleries.id })
    .from(galleries)
    .where(eq(galleries.id, id))
    .limit(1);
  if (!gallery) {
    return NextResponse.json({ error: "Galeria não encontrada." }, { status: 404 });
  }

  const key = `galleries/${id}/orig/${randomUUID()}.${ext}`;
  const uploadUrl = await presignUpload(key, contentType);

  return NextResponse.json({ key, uploadUrl });
}