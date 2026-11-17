import { toCents } from "./money";

export const MESES_LABEL = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
] as const;

export function ensurePlano12(raw: unknown): number[] {
  if (!Array.isArray(raw) || raw.length !== 12) return Array(12).fill(0);
  return raw.map((n) => (typeof n === "number" && Number.isFinite(n) ? Math.max(0, Math.trunc(n)) : 0));
}

export function parsePlanoFromJson(json: string): number[] {
  try {
    return ensurePlano12(JSON.parse(json));
  } catch {
    return Array(12).fill(0);
  }
}

export function planoToJson(plano: number[]): string {
  return JSON.stringify(ensurePlano12(plano));
}

/** UI: 12 strings em reais → centavos. */
export function parsePlanoFromBRLInputs(inputs: string[]): { ok: true; plano: number[] } | { ok: false; error: string } {
  if (inputs.length !== 12) return { ok: false, error: "Informe os 12 meses." };
  const plano = inputs.map((s) => toCents(s));
  if (plano.some((c) => c < 0)) return { ok: false, error: "Valores devem ser ≥ 0." };
  return { ok: true, plano };
}

export function aplicarATodos(valorCents: number): number[] {
  const v = Math.max(0, Math.trunc(valorCents));
  return Array(12).fill(v);
}

/**
 * Copia o mês anterior para o mês corrente (índice 0–11).
 * Em janeiro (0) não há mês anterior no mesmo ano → sem alteração.
 */
export function copiarMesAnterior(plano: number[], mesCorrente: number): number[] {
  const p = ensurePlano12(plano);
  const m = Math.trunc(mesCorrente);
  if (m < 1 || m > 11) return p;
  const next = [...p];
  next[m] = p[m - 1] ?? 0;
  return next;
}

/**
 * Sem histórico multi-ano no MVP: retorna o mesmo plano e flag.
 * UI mostra mensagem (SPRINT2 risco).
 */
export function copiarAnoAnterior(plano: number[]): { plano: number[]; available: false } {
  return { plano: ensurePlano12(plano), available: false };
}
