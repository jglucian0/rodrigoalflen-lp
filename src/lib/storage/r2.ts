import {
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { Readable } from "node:stream";


function config() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    throw new Error("Variáveis do R2 não configuradas (.env.local).");
  }
  return { accountId, accessKeyId, secretAccessKey, bucket };
}

let client: S3Client | undefined;

function s3() {
  if (!client) {
    const c = config();
    client = new S3Client({
      region: "auto",
      endpoint: `https://${c.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: c.accessKeyId,
        secretAccessKey: c.secretAccessKey,
      },
      // Sem isso, versões novas do SDK adicionam cabeçalhos de checksum
      // que o R2 rejeita em uploads feitos pelo navegador
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
    });
  }
  return client;
}

const bucket = () => config().bucket;

function isNotFound(error: unknown) {
  const e = error as { name?: string; $metadata?: { httpStatusCode?: number } };
  return (
    e?.name === "NotFound" ||
    e?.name === "NoSuchKey" ||
    e?.$metadata?.httpStatusCode === 404
  );
}

/** Endereço temporário (10 min) para o navegador enviar UM arquivo direto ao R2 */
export function presignUpload(key: string, contentType: string, expiresIn = 600) {
  return getSignedUrl(
    s3(),
    new PutObjectCommand({ Bucket: bucket(), Key: key, ContentType: contentType }),
    { expiresIn },
  );
}

export async function headObject(key: string): Promise<{ size: number } | null> {
  try {
    const res = await s3().send(new HeadObjectCommand({ Bucket: bucket(), Key: key }));
    return { size: res.ContentLength ?? 0 };
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

export async function getObjectBuffer(key: string): Promise<Buffer> {
  const res = await s3().send(new GetObjectCommand({ Bucket: bucket(), Key: key }));
  if (!res.Body) throw new Error("Arquivo vazio no armazenamento.");
  return Buffer.from(await res.Body.transformToByteArray());
}

export async function getObjectStream(key: string) {
  try {
    const res = await s3().send(new GetObjectCommand({ Bucket: bucket(), Key: key }));
    if (!res.Body) return null;
    return { stream: res.Body.transformToWebStream(), contentLength: res.ContentLength };
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

export async function putObject(key: string, body: Buffer, contentType: string) {
  await s3().send(
    new PutObjectCommand({ Bucket: bucket(), Key: key, Body: body, ContentType: contentType }),
  );
}

/** Apaga vários arquivos (em lotes de 1000) */
export async function deleteObjects(keys: string[]) {
  for (let i = 0; i < keys.length; i += 1000) {
    const chunk = keys.slice(i, i + 1000);
    await s3().send(
      new DeleteObjectsCommand({
        Bucket: bucket(),
        Delete: { Objects: chunk.map((Key) => ({ Key })), Quiet: true },
      }),
    );
  }
}

export async function getObjectNodeStream(key: string): Promise<Readable | null> {
  try {
    const res = await s3().send(new GetObjectCommand({ Bucket: bucket(), Key: key }));
    return (res.Body as Readable | undefined) ?? null;
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

/** Lista todos os arquivos de um prefixo (usado pelo script de auditoria) */
export async function listObjects(prefix: string) {
  const found: { key: string; size: number; modified: Date }[] = [];
  let token: string | undefined;

  do {
    const res = await s3().send(
      new ListObjectsV2Command({
        Bucket: bucket(),
        Prefix: prefix,
        ContinuationToken: token,
      }),
    );
    for (const object of res.Contents ?? []) {
      if (!object.Key) continue;
      found.push({
        key: object.Key,
        size: object.Size ?? 0,
        modified: object.LastModified ?? new Date(0),
      });
    }
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);

  return found;
}