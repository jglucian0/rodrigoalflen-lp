export type Role = "admin" | "client";

/** Senha numérica do cliente */
export const CLIENT_PASSWORD_MIN = 8;
export const CLIENT_PASSWORD_MAX = 32;
/** Senha do administrador */
export const ADMIN_PASSWORD_MIN = 12;
export const PASSWORD_MAX = 72; // bcrypt ignora o que passar de 72 bytes

/** 11111111, 12345678, 87654321, 12121212, 123123123... */
function isWeakNumeric(value: string): boolean {
  if (/^(\d)\1+$/.test(value)) return true;

  const digits = Array.from(value, Number);
  const step = digits[1] - digits[0];
  if (
    Math.abs(step) === 1 &&
    digits.every((d, i) => i === 0 || d - digits[i - 1] === step)
  ) {
    return true;
  }

  for (let size = 2; size <= value.length / 2; size++) {
    if (
      value.length % size === 0 &&
      value.slice(0, size).repeat(value.length / size) === value
    ) {
      return true;
    }
  }
  return false;
}

/** Devolve a mensagem de erro, ou null se a senha é aceitável */
export function validateNewPassword(role: Role, value: string): string | null {
  if (role === "client") {
    if (!/^\d+$/.test(value)) return "A senha deve ter apenas números.";
    if (value.length < CLIENT_PASSWORD_MIN)
      return `A senha precisa ter pelo menos ${CLIENT_PASSWORD_MIN} números.`;
    if (value.length > CLIENT_PASSWORD_MAX)
      return `A senha pode ter no máximo ${CLIENT_PASSWORD_MAX} números.`;
    if (isWeakNumeric(value))
      return "Essa senha é fácil de adivinhar. Evite sequências e números repetidos.";
    return null;
  }

  if (value.length < ADMIN_PASSWORD_MIN)
    return `A senha precisa ter pelo menos ${ADMIN_PASSWORD_MIN} caracteres.`;
  if (value.length > PASSWORD_MAX)
    return `A senha pode ter no máximo ${PASSWORD_MAX} caracteres.`;
  return null;
}