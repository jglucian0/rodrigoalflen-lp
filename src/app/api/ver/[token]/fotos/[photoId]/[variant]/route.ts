import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { photos } from "@/db/schema";
import { findActiveShare } from "@/lib/gallery/share";
import { getObjectStream } from "@/lib/storage/r2";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const notFound = () => new Response("Não encontrado", { status: 404 });

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ token: string; photoId: string; variant: string }> },
) {
  const { token, photoId, variant } = await ctx.params;

  if (!UUID_RE.test(photoId) || (variant !== "thumb" && variant !== "preview")) {
    return notFound();
  }

  // Link inválido, revogado ou vencido: 404 sem explicar o motivo
  const share = await findActiveShare(token);
  if (!share) return notFound();

  // A foto precisa ser DESTA galeria
  const [photo] = await db
    .select({ thumbKey: photos.thumbKey, previewKey: photos.previewKey })
    .from(photos)
    .where(and(eq(photos.id, photoId), eq(photos.galleryId, share.galleryId)))
    .limit(1);
  if (!photo) return notFound();

  const object = await getObjectStream(
    variant === "thumb" ? photo.thumbKey : photo.previewKey,
  );
  if (!object) return notFound();

  return new Response(object.stream, {
    headers: {
      "Content-Type": "image/webp",
      // Cache curto: quando o link é desativado, o acesso acaba em poucos minutos
      "Cache-Control": "private, max-age=600",
      "X-Robots-Tag": "noindex, nofollow",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      ...(object.contentLength ? { "Content-Length": String(object.contentLength) } : {}),
    },
  });
}