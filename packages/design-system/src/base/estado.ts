import type { EstadoConsumo } from '../core/types.ts';

/** Nome do token de cor de cada estado de consumo (web usa var(); nativo usa o valor do token). */
export const tokenDoEstado: Record<EstadoConsumo, 'success' | 'action' | 'warnBar' | 'error' | 'textMuted'> = {
  ok: 'success',
  'no-limite': 'action',
  atencao: 'warnBar',
  estourou: 'error',
  'sem-plano': 'textMuted',
};

/** Percentual da barra: inteiro entre 0 e 100. */
export function larguraDaBarra(valor: number): number {
  if (!Number.isFinite(valor)) return 0;
  return Math.min(100, Math.max(0, Math.floor(valor)));
}

/** Texto de exibição de um valor em centavos para o campo de moeda (sem "R$"): 18640 -> "186,40". */
export function textoDoCampoMoeda(centavos: number | null): string {
  if (centavos === null) return '';
  const abs = Math.abs(centavos);
  const reais = Math.trunc(abs / 100);
  const cent = abs % 100;
  const sinal = centavos < 0 ? '-' : '';
  return `${sinal}${reais},${String(cent).padStart(2, '0')}`;
}
