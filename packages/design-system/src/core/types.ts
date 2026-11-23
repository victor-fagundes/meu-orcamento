/** Valor monetário em centavos inteiros. Nunca use ponto flutuante para dinheiro. */
export type Centavos = number;

/** Tipos de item do orçamento. */
export type TipoItem = 'R' | 'F' | 'V' | 'E';

/** Rótulo de tipo, como aparece na interface. */
export const rotuloTipo: Record<TipoItem, string> = {
  R: 'Receitas',
  F: 'Despesas fixas',
  V: 'Despesas variáveis',
  E: 'Anuais',
};

/** Estado de consumo de um item ou grupo, a partir do realizado e do planejado. */
export type EstadoConsumo = 'sem-plano' | 'ok' | 'atencao' | 'estourou' | 'no-limite';
