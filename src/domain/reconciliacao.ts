/**
 * Totais compartilhados (PRD §6) — mesma fórmula em Resumo, Orçamento e Ano.
 * Centavos inteiros apenas.
 */

export function totalOrcadoDespesas(planosCentavos: number[]): number {
  return planosCentavos.reduce((s, n) => s + Math.max(0, Math.trunc(n)), 0);
}

export function totalGastoDespesas(gastosCentavos: number[]): number {
  return gastosCentavos.reduce((s, n) => s + Math.max(0, Math.trunc(n)), 0);
}

/** Saldo do período (Resumo) = orçado − gasto */
export function saldoPeriodo(orcadoCentavos: number, gastoCentavos: number): number {
  return Math.trunc(orcadoCentavos) - Math.trunc(gastoCentavos);
}

/** Saldo final (Ano) = receitas − despesas */
export function saldoFinalAno(receitasCentavos: number, despesasCentavos: number): number {
  return Math.trunc(receitasCentavos) - Math.trunc(despesasCentavos);
}

export function restante(planejado: number, realizado: number): number {
  return Math.trunc(planejado) - Math.trunc(realizado);
}

/**
 * Soma por competência a partir de lançamentos { competencia, valorCentavos, isDespesa }.
 */
export function agregarPorCompetencia(
  rows: { competencia: string; valorCentavos: number; isDespesa: boolean }[],
): Record<string, { orcado?: never; gasto: number; receitas: number }> {
  const out: Record<string, { gasto: number; receitas: number }> = {};
  for (const r of rows) {
    const cur = out[r.competencia] ?? { gasto: 0, receitas: 0 };
    if (r.isDespesa) cur.gasto += r.valorCentavos;
    else cur.receitas += r.valorCentavos;
    out[r.competencia] = cur;
  }
  return out;
}

/** Reconciliia: soma de parcelas = total da compra */
export function somaParcelasOk(totalCentavos: number, parcelas: number[]): boolean {
  return parcelas.reduce((s, n) => s + n, 0) === Math.trunc(totalCentavos);
}
