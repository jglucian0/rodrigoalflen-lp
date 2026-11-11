import { rateLimit } from "@/lib/security/rate-limit";
import { getObjectStream } from "@/lib/storage/r2";
import { findClientPhoto, getClientUser } from "@/lib/gallery/access";
import { contentDisposition, IMAGE_TYPES, withExtension } from "@/lib/gallery/http";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VARIANTS = new Set(["thumb", "preview", "download"]);

const notFound = () => new Response("Não encontrado", { status: 404 });

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ photoId: string; variant: string }> },
) {
  const user = await getClientUser();
  if (!user) return new Response("Não autorizado", { status: 401 });

  const { photoId, variant } = await ctx.params;
  if (!UUID_RE.test(photoId) || !VARIANTS.has(variant)) return notFound();

  // Só retorna se a foto é do cliente logado e a galeria não expirou.
  // Qualquer outra situação responde 404, para não revelar se a foto existe.
  const photo = await findClientPhoto(photoId, user.id);
  if (!photo) return notFound();

  if (variant === "download") {
    if (!photo.allowDownload) {
      return new Response("O download está desativado nesta galeria.", { status: 403 });
    }

    const limit = await rateLimit(`dl:user:${user.id}`, 600, 60 * 60);
    if (!limit.allowed) {
      return new Response("Muitos downloads. Tente novamente mais tarde.", {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfter) },
      });
    }

    const object = await getObjectStream(photo.originalKey);
    if (!object) return notFound();

    const ext = photo.originalKey.split(".").pop() ?? "jpg";
    return new Response(object.stream, {
      headers: {
        "Content-Type": IMAGE_TYPES[ext] ?? "application/octet-stream",
        "Content-Disposition": contentDisposition(
          withExtension(photo.filename, photo.originalKey),
        ),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        ...(object.contentLength ? { "Content-Length": String(object.contentLength) } : {}),
      },
    });
  }

  const object = await getObjectStream(
    variant === "thumb" ? photo.thumbKey : photo.previewKey,
  );
  if (!object) return notFound();

  return new Response(object.stream, {
    headers: {
      "Content-Type": "image/webp",
      // O arquivo de cada foto nunca muda: pode ficar no cache do navegador
      "Cache-Control": "private, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      ...(object.contentLength ? { "Content-Length": String(object.contentLength) } : {}),
    },
  });
}