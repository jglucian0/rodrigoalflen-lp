import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL não definida (.env.local)");

// Reaproveita a conexão no modo dev (hot reload) e usa pool pequeno em produção
const globalForDb = globalThis as unknown as {
  pg?: ReturnType<typeof postgres>;
};

const client =
  globalForDb.pg ??
  postgres(url, {
    max: process.env.NODE_ENV === "production" ? 5 : 1,
    prepare: false, // necessário para o pooler da Neon/Supabase
  });

if (process.env.NODE_ENV !== "production") globalForDb.pg = client;

export const db = drizzle(client, { schema });