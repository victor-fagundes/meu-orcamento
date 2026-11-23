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

/**
 * Lê o valor do plano em texto pt-BR e devolve centavos inteiros.
 * Vazio, negativo e terceira casa decimal não passam por ponto flutuante.
 */
export function lerValorDoPlano(
  texto: string,
): { ok: true; centavos: number } | { ok: false; error: string } {
  const bruto = texto.trim();
  if (bruto === "") return { ok: false, error: "Informe o valor do plano." };
  const limpo = bruto.replace(/R\$/gi, "").replace(/\s/g, "");
  if (limpo.startsWith("-") || limpo.startsWith("−")) {
    return { ok: false, error: "Informe um valor maior ou igual a zero." };
  }
  const partes = limpo.split(",");
  if (partes.length > 2) return { ok: false, error: "Use no máximo duas casas decimais." };
  const reaisTexto = partes[0] ?? "";
  const decimal = partes[1];
  if (decimal !== undefined && decimal.length > 2) {
    return { ok: false, error: "Use no máximo duas casas decimais." };
  }
  const reaisOk = /^\d{1,3}(\.\d{3})*$/.test(reaisTexto) || /^\d+$/.test(reaisTexto);
  const decimalOk = decimal === undefined || /^\d{1,2}$/.test(decimal);
  if (!reaisOk || !decimalOk) return { ok: false, error: "Informe o valor do plano." };
  const reais = Number(reaisTexto.replace(/\./g, ""));
  const centavosParte = Number((decimal ?? "").padEnd(2, "0") || "0");
  if (!Number.isSafeInteger(reais) || !Number.isInteger(centavosParte)) {
    return { ok: false, error: "Informe o valor do plano." };
  }
  return { ok: true, centavos: reais * 100 + centavosParte };
}

/** Grava o valor só no índice do mês aberto (0 = janeiro). */
export function aplicarValorAoMes(plano: number[], indice: number, centavos: number): number[] {
  const atual = ensurePlano12(plano);
  const mes = Math.trunc(indice);
  if (mes < 0 || mes > 11) return atual;
  const proximo = [...atual];
  proximo[mes] = Math.max(0, Math.trunc(centavos));
  return proximo;
}

/** Grava o valor no mês aberto e em cada mês posterior do mesmo ano. */
export function aplicarValorAoMesESeguintes(plano: number[], indice: number, centavos: number): number[] {
  const atual = ensurePlano12(plano);
  const mes = Math.trunc(indice);
  if (mes < 0 || mes > 11) return atual;
  const valor = Math.max(0, Math.trunc(centavos));
  return atual.map((item, i) => (i >= mes ? valor : item));
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
