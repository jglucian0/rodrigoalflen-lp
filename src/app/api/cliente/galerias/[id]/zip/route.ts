import { rateLimit } from "@/lib/security/rate-limit";
import { getObjectBuffer } from "@/lib/storage/r2";
import {
  findClientGallery,
  getClientUser,
  listPhotosForZip,
} from "@/lib/gallery/access";
import { fileSlug, uniqueName, withExtension } from "@/lib/gallery/http";
import { createZipStream } from "@/lib/gallery/zip-stream";
import { planZipParts } from "@/lib/gallery/zip-plan";

export const maxDuration = 300;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(
  request: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const user = await getClientUser();
  if (!user) return new Response("Não autorizado", { status: 401 });

  const { id } = await ctx.params;
  if (!UUID_RE.test(id)) return new Response("Não encontrado", { status: 404 });

  const gallery = await findClientGallery(id, user.id);
  if (!gallery || gallery.expired) return new Response("Não encontrado", { status: 404 });
  if (!gallery.allowDownload) {
    return new Response("O download está desativado nesta galeria.", { status: 403 });
  }

  const part = Number(new URL(request.url).searchParams.get("part") ?? "1");
  if (!Number.isInteger(part) || part < 1) return new Response("Parte inválida", { status: 400 });

  const limit = await rateLimit(`zip:user:${user.id}`, 20, 60 * 60);
  if (!limit.allowed) {
    return new Response("Muitos downloads. Tente novamente mais tarde.", {
      status: 429,
      headers: { "Retry-After": String(limit.retryAfter) },
    });
  }

  const parts = planZipParts(await listPhotosForZip(id));
  const selected = parts[part - 1];
  if (!selected) return new Response("Parte não encontrada", { status: 404 });

  const used = new Set<string>();
  const files = selected.map((photo) => ({
    name: uniqueName(withExtension(photo.filename, photo.originalKey), used),
    load: async () => {
      try {
        return await getObjectBuffer(photo.originalKey);
      } catch (error) {
        // uma foto com problema não derruba o ZIP inteiro
        console.error("[zip] foto ignorada:", photo.originalKey, error);
        return null;
      }
    },
  }));

  const suffix = parts.length > 1 ? `-parte-${part}-de-${parts.length}` : "";

  return new Response(createZipStream(files, request.signal), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${fileSlug(gallery.title)}${suffix}.zip"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}