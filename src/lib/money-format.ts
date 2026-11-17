import { formatBRL } from "@/domain/money";

export function parsePlano(json: string): number[] {
  try {
    const arr = JSON.parse(json) as unknown;
    if (!Array.isArray(arr) || arr.length !== 12) return Array(12).fill(0);
    return arr.map((n) => (typeof n === "number" ? Math.trunc(n) : 0));
  } catch {
    return Array(12).fill(0);
  }
}

export function planoMesAtual(json: string, date = new Date()): number {
  const plano = parsePlano(json);
  return plano[date.getMonth()] ?? 0;
}

export { formatBRL };
