/**
 * Competência por fatura (PRD 5.7, D-04 / Q-05).
 * Compra no dia do fechamento → fatura do mês seguinte.
 */

export type MeioPagamento = "deb" | "pix" | "din" | "cartao";

/** YYYY-MM */
export type Competencia = string;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function toCompetencia(year: number, monthIndex0: number): Competencia {
  let y = year;
  let m = monthIndex0;
  while (m > 11) {
    m -= 12;
    y += 1;
  }
  while (m < 0) {
    m += 12;
    y -= 1;
  }
  return `${y}-${pad2(m + 1)}`;
}

export function parseISODate(iso: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return { y, m: mo - 1, d };
}

/**
 * Competência de uma compra no cartão.
 * @param diaFechamento 1–28 ou null (sem fechamento → mês da compra)
 */
export function competenciaCartao(
  dataISO: string,
  diaFechamento: number | null | undefined,
): Competencia | null {
  const dt = parseISODate(dataISO);
  if (!dt) return null;

  if (diaFechamento == null) {
    return toCompetencia(dt.y, dt.m);
  }

  const fech = Math.trunc(diaFechamento);
  if (fech < 1 || fech > 28) return null;

  // Antes do dia de fechamento → fatura que fecha neste mês
  // No dia ou depois → fatura do mês seguinte
  if (dt.d < fech) {
    return toCompetencia(dt.y, dt.m);
  }
  return toCompetencia(dt.y, dt.m + 1);
}

export function competenciaMeio(
  dataISO: string,
  meio: MeioPagamento,
  diaFechamento?: number | null,
): Competencia | null {
  if (meio === "cartao") return competenciaCartao(dataISO, diaFechamento ?? null);
  const dt = parseISODate(dataISO);
  if (!dt) return null;
  return toCompetencia(dt.y, dt.m);
}

/** Parcelas: cada parcela avança 1 mês de competência a partir da 1ª. */
export function competenciasParcelas(
  dataISO: string,
  n: number,
  diaFechamento: number | null | undefined,
): Competencia[] | null {
  const first = competenciaCartao(dataISO, diaFechamento);
  if (!first) return null;
  const N = Math.max(1, Math.min(60, Math.trunc(n)));
  const [ys, ms] = first.split("-").map(Number);
  const out: Competencia[] = [];
  for (let i = 0; i < N; i++) {
    out.push(toCompetencia(ys, ms - 1 + i));
  }
  return out;
}

export function formatCompetenciaBR(comp: Competencia): string {
  const [y, m] = comp.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}
