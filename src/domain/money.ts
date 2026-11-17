/**
 * Domínio monetário — centavos inteiros apenas (PRD §6, MO-103).
 * Sem I/O. Sem float no caminho de cálculo.
 */

export function toCents(input: string | number): number {
  if (typeof input === "number") {
    if (!Number.isFinite(input)) return 0;
    return Math.max(0, Math.round(input * 100));
  }
  let s = String(input).replace(/[R$\s]/gi, "").trim();
  if (!s) return 0;
  if (s.includes(",") && s.includes(".")) {
    s = s.replace(/\./g, "").replace(",", ".");
  } else if (s.includes(",")) {
    s = s.replace(",", ".");
  }
  const n = Number(s);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.round(n * 100));
}

export function fromCents(cents: number): number {
  return Math.trunc(cents) / 100;
}

export function formatBRL(cents: number): string {
  return fromCents(cents).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * Divisão exata em centavos (PRD 5.8).
 * As primeiras `resto` parcelas recebem base + 1.
 */
export function splitParcelas(totalCents: number, n: number): number[] {
  const T = Math.trunc(totalCents);
  const N = Math.trunc(n);
  if (T < 0) throw new Error("totalCents deve ser >= 0");
  if (N < 1) throw new Error("n deve ser >= 1");
  if (N === 1) return [T];

  const base = Math.floor(T / N);
  const rem = T - base * N;
  return Array.from({ length: N }, (_, i) => base + (i < rem ? 1 : 0));
}
