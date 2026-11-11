import { createHash, randomBytes } from "node:crypto";

/** Token aleatório de 256 bits, seguro para usar em links e cookies */
export const generateToken = (bytes = 32) =>
  randomBytes(bytes).toString("base64url");

/** O banco guarda só o hash: vazamento do banco não revela os tokens */
export const hashToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");