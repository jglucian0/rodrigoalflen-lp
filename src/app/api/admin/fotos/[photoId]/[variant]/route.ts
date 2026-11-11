import { eq } from "drizzle-orm";
import { db } from "@/db";
import { photos } from "@/db/schema";
import { getAdminOrNull } from "@/lib/auth/guards";
import { getObjectStream } from "@/lib/storage/r2";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ photoId: string; variant: string }> },
) {
  if (!(await getAdminOrNull())) {
    return new Response("Não autorizado", { status: 401 });
  }

  const { photoId, variant } = await ctx.params;
  if (!UUID_RE.test(photoId) || (variant !== "thumb" && variant !== "preview")) {
    return new Response("Não encontrado", { status: 404 });
  }

  const [photo] = await db
    .select({ thumbKey: photos.thumbKey, previewKey: photos.previewKey })
    .from(photos)
    .where(eq(photos.id, photoId))
    .limit(1);
  if (!photo) return new Response("Não encontrado", { status: 404 });

  const object = await getObjectStream(
    variant === "thumb" ? photo.thumbKey : photo.previewKey,
  );
  if (!object) return new Response("Não encontrado", { status: 404 });

  return new Response(object.stream, {
    headers: {
      "Content-Type": "image/webp",
      // O id da foto é único e o arquivo nunca muda: pode guardar por muito tempo
      "Cache-Control": "private, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      ...(object.contentLength ? { "Content-Length": String(object.contentLength) } : {}),
    },
  });
}