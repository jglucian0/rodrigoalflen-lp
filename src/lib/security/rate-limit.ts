import { lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { rateLimits } from "@/db/schema";

/**
 * Conta uma tentativa para `key` e diz se ainda está dentro do limite.
 * A contagem é atômica no banco, então funciona em hospedagem serverless.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<{ allowed: boolean; retryAfter: number }> {
  const secs = sql.raw(String(Math.floor(windowSeconds)));

  const [row] = await db
    .insert(rateLimits)
    .values({
      key,
      count: 1,
      resetAt: sql`now() + make_interval(secs => ${secs})`,
    })
    .onConflictDoUpdate({
      target: rateLimits.key,
      set: {
        count: sql`CASE WHEN ${rateLimits.resetAt} <= now() THEN 1 ELSE ${rateLimits.count} + 1 END`,
        resetAt: sql`CASE WHEN ${rateLimits.resetAt} <= now() THEN now() + make_interval(secs => ${secs}) ELSE ${rateLimits.resetAt} END`,
      },
    })
    .returning({ count: rateLimits.count, resetAt: rateLimits.resetAt });

  // Limpeza ocasional de registros antigos
  if (Math.random() < 0.02) {
    await db
      .delete(rateLimits)
      .where(lt(rateLimits.resetAt, sql`now() - interval '1 day'`));
  }

  return {
    allowed: row.count <= limit,
    retryAfter: Math.max(
      1,
      Math.ceil((row.resetAt.getTime() - Date.now()) / 1000),
    ),
  };
}