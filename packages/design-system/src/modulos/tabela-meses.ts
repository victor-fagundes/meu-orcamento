import type { LinhaTabelaMeses } from '../base/contratos.ts';

function agrupar(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** Reais cortados, sem "R$". Zero é traço. A máscara não troca o traço. */
export function textoCelulaAno(centavos: number, ocultado = false): string {
  const valor = Math.trunc(centavos);
  if (valor === 0) return '—';
  if (ocultado) return '•••••';
  const sinal = valor < 0 ? '−' : '';
  return `${sinal}${agrupar(Math.trunc(Math.abs(valor) / 100))}`;
}

/** Soma dos doze meses, em centavos. */
export function totalDaLinha(valores: ReadonlyArray<number>): number {
  return valores.reduce((soma, valor) => soma + Math.trunc(valor), 0);
}

/** Valida que a linha tem exatamente 12 meses. */
export function linhaValida(linha: LinhaTabelaMeses): boolean {
  return linha.valoresPorMes.length === 12;
}
