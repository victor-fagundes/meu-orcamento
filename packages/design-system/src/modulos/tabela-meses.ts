import type { LinhaTabelaMeses } from '../base/contratos.ts';

/** Soma dos meses com movimento (null não entra). Inteiros em centavos. */
export function totalDaLinha(valores: ReadonlyArray<number | null>): number {
  return valores.reduce<number>((soma, valor) => (valor === null ? soma : soma + valor), 0);
}

/** Valida que a linha tem exatamente 12 meses. */
export function linhaValida(linha: LinhaTabelaMeses): boolean {
  return linha.valoresPorMes.length === 12;
}
