const TZ = "America/Sao_Paulo";

/** "2026-03-14" (data pura) ou Date -> "14/03/2026" */
export function formatDateBR(value: string | Date | null): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(`${value}T12:00:00`) : value;
  return date.toLocaleDateString("pt-BR", { timeZone: TZ });
}

/** Date -> "YYYY-MM-DD" no fuso de São Paulo (para <input type="date">) */
export function toDateInput(date: Date): string {
  return date.toLocaleDateString("sv-SE", { timeZone: TZ });
}

export function formatBytes(bytes: number): string {
  const MB = 1024 * 1024;
  if (bytes < MB) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  if (bytes < 1024 * MB) {
    return `${(bytes / MB).toFixed(bytes < 10 * MB ? 1 : 0)} MB`.replace(".", ",");
  }
  return `${(bytes / (1024 * MB)).toFixed(1)} GB`.replace(".", ",");
}