/**
 * Nome usado para cumprimentar o cliente.
 * - Com "&" (casal): aparece inteiro, ex.: "Camila & Fernando"
 * - Sem "&": só o primeiro nome, ex.: "João Gabriel Luciano" -> "João"
 */
export function greetingName(fullName: string): string {
  const name = fullName.trim().replace(/\s+/g, " ");

  if (name.includes("&")) {
    // padroniza o espaçamento: "Camila&Fernando" -> "Camila & Fernando"
    return name.replace(/\s*&\s*/g, " & ");
  }

  return name.split(" ")[0] ?? name;
}