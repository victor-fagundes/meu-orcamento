export function iniciaisDaConta(nome: string): string {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "";
  const primeira = partes[0]?.[0] ?? "";
  if (partes.length === 1) return primeira.toLocaleUpperCase("pt-BR");
  const ultima = partes[partes.length - 1]?.[0] ?? "";
  return `${primeira}${ultima}`.toLocaleUpperCase("pt-BR");
}
