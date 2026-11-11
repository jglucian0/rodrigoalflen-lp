import { eq } from "drizzle-orm";
import { db } from "../src/db";
import { users } from "../src/db/schema";
import {
  hashPassword,
  randomDigits,
  randomLogin,
  randomStrongPassword,
} from "../src/lib/security/passwords";

const [role, name, rawEmail] = process.argv.slice(2);
const email = rawEmail?.trim().toLowerCase();

function fail(message: string): never {
  console.error(`\n✖ ${message}\n`);
  console.error('Uso:  npm run user:create -- <admin|client> "Nome" email@exemplo.com\n');
  process.exit(1);
}

async function main() {
  if (role !== "admin" && role !== "client") fail("O primeiro argumento deve ser admin ou client.");
  if (!name?.trim()) fail("Informe o nome.");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail("Informe um e-mail válido.");

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing) fail(`Já existe uma conta com o e-mail ${email}.`);

  let login: string | null = null;
  let password: string;

  if (role === "admin") {
    password = randomStrongPassword();
  } else {
    // garante um login numérico que ainda não existe
    for (; ;) {
      const candidate = randomLogin();
      const [taken] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.login, candidate))
        .limit(1);
      if (!taken) {
        login = candidate;
        break;
      }
    }
    password = randomDigits(8);
  }

  await db.insert(users).values({
    role,
    name: name.trim(),
    login,
    email,
    passwordHash: await hashPassword(password),
  });

  console.log("\n✔ Conta criada. Guarde agora: a senha não fica salva em texto.\n");
  console.log(`  Tipo:   ${role}`);
  console.log(`  Nome:   ${name.trim()}`);
  console.log(`  E-mail: ${email}`);
  if (login) console.log(`  Login:  ${login}`);
  console.log(`  Senha:  ${password}\n`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});