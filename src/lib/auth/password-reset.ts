import { and, eq, gt, isNull, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { passwordResets, sessions, users } from "@/db/schema";
import { generateToken, hashToken } from "@/lib/security/tokens";

/** Cria um token de redefinição (válido por 1 hora). Devolve o token em texto, só para o e-mail. */
export async function createResetToken(userId: string): Promise<string> {
  const token = generateToken();

  await db.transaction(async (tx) => {
    // Um novo pedido invalida os anteriores ainda abertos
    await tx
      .update(passwordResets)
      .set({ usedAt: sql`now()` })
      .where(and(eq(passwordResets.userId, userId), isNull(passwordResets.usedAt)));

    await tx.insert(passwordResets).values({
      userId,
      tokenHash: hashToken(token),
      expiresAt: sql`now() + interval '1 hour'`,
    });

    // Limpeza de registros antigos
    await tx
      .delete(passwordResets)
      .where(lt(passwordResets.expiresAt, sql`now() - interval '7 days'`));
  });

  return token;
}

/** Confere se o link ainda vale (sem consumir). Usado pela página e pela API. */
export async function getResetTokenInfo(token: string) {
  const [row] = await db
    .select({ role: users.role, name: users.name })
    .from(passwordResets)
    .innerJoin(users, eq(users.id, passwordResets.userId))
    .where(
      and(
        eq(passwordResets.tokenHash, hashToken(token)),
        isNull(passwordResets.usedAt),
        gt(passwordResets.expiresAt, sql`now()`),
        eq(users.active, true),
      ),
    )
    .limit(1);

  return row ?? null;
}

/**
 * Consome o token e troca a senha numa única transação:
 * o link só funciona uma vez, mesmo com dois cliques simultâneos.
 * Também desbloqueia a conta e encerra todas as sessões abertas.
 */
export async function resetPasswordWithToken(
  token: string,
  passwordHash: string,
): Promise<{ id: string; role: "admin" | "client" } | null> {
  return db.transaction(async (tx) => {
    const [used] = await tx
      .update(passwordResets)
      .set({ usedAt: sql`now()` })
      .where(
        and(
          eq(passwordResets.tokenHash, hashToken(token)),
          isNull(passwordResets.usedAt),
          gt(passwordResets.expiresAt, sql`now()`),
        ),
      )
      .returning({ userId: passwordResets.userId });

    if (!used) return null;

    const [user] = await tx
      .update(users)
      .set({ passwordHash, failedAttempts: 0, lockedUntil: null })
      .where(and(eq(users.id, used.userId), eq(users.active, true)))
      .returning({ id: users.id, role: users.role });

    if (!user) return null;

    // Quem tinha a senha antiga sai de todos os aparelhos
    await tx.delete(sessions).where(eq(sessions.userId, user.id));

    // Fecha qualquer outro pedido que ainda estivesse aberto
    await tx
      .update(passwordResets)
      .set({ usedAt: sql`now()` })
      .where(
        and(eq(passwordResets.userId, user.id), isNull(passwordResets.usedAt)),
      );

    return user;
  });
}