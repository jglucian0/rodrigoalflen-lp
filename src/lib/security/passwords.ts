import bcrypt from "bcryptjs";
import { randomBytes, randomInt } from "node:crypto";

const ROUNDS = 12;

export const hashPassword = (plain: string) => bcrypt.hash(plain, ROUNDS);
export const verifyPassword = (plain: string, hash: string) =>
  bcrypt.compare(plain, hash);

/** Senha numérica do cliente: mínimo de 8 dígitos */
export const MIN_PASSWORD_DIGITS = 8;
export const isValidClientPassword = (value: string) =>
  new RegExp(`^\\d{${MIN_PASSWORD_DIGITS},32}$`).test(value);

/** `length` dígitos aleatórios (criptograficamente seguros) */
export function randomDigits(length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) out += randomInt(0, 10);
  return out;
}

/** Login do cliente: 8 dígitos, sem começar por zero */
export const randomLogin = () => String(randomInt(1, 10)) + randomDigits(7);

/** Senha forte para o administrador */
export const randomStrongPassword = () => randomBytes(12).toString("base64url");