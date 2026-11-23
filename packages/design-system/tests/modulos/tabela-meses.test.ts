import { describe, expect, it } from 'vitest';
import { linhaValida, totalDaLinha } from '../../src/modulos/tabela-meses.ts';

describe('totalDaLinha', () => {
  it('soma meses com movimento e ignora null, em centavos inteiros', () => {
    const valores = [170000, null, 40000, ...Array<number | null>(9).fill(null)];
    expect(totalDaLinha(valores)).toBe(210000);
  });
  it('linha sem movimento soma zero', () => {
    expect(totalDaLinha(Array<number | null>(12).fill(null))).toBe(0);
  });
});

describe('linhaValida', () => {
  it('exige exatamente 12 meses', () => {
    expect(linhaValida({ rotulo: 'x', valoresPorMes: Array<number | null>(12).fill(null) })).toBe(true);
    expect(linhaValida({ rotulo: 'x', valoresPorMes: [1, 2] })).toBe(false);
  });
});
