import { describe, expect, it } from 'vitest';
import { linhaValida, textoCelulaAno, totalDaLinha } from '../../src/modulos/tabela-meses.ts';

describe('textoCelulaAno', () => {
  it('corta os centavos sem R$ e usa traço no zero', () => {
    expect(textoCelulaAno(0, false)).toBe('—');
    expect(textoCelulaAno(650099, false)).toBe('6.500');
    expect(textoCelulaAno(50, false)).toBe('0');
    expect(textoCelulaAno(-50, false)).toBe('−0');
    expect(textoCelulaAno(-4000, false)).toBe('−40');
  });

  it('mascara número e preserva o traço', () => {
    expect(textoCelulaAno(0, true)).toBe('—');
    expect(textoCelulaAno(650099, true)).toBe('•••••');
    expect(textoCelulaAno(50, true)).toBe('•••••');
    expect(textoCelulaAno(-50, true)).toBe('•••••');
    expect(textoCelulaAno(-4000, true)).toBe('•••••');
  });

  it('o total soma os centavos antes de cortar', () => {
    const meses = Array<number>(12).fill(50);
    expect(totalDaLinha(meses)).toBe(600);
    expect(textoCelulaAno(600, false)).toBe('6');
  });
});

describe('linhaValida', () => {
  it('exige exatamente 12 meses', () => {
    const linha = {
      id: 'x',
      nivel: 'item' as const,
      rotulo: 'x',
      valoresPorMes: Array<number>(12).fill(0),
    };
    expect(linhaValida(linha)).toBe(true);
    expect(linhaValida({ ...linha, valoresPorMes: [1, 2] })).toBe(false);
  });
});
