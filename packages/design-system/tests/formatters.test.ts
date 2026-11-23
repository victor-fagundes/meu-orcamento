import { describe, expect, it } from 'vitest';
import {
  calcularPercentual,
  estadoConsumo,
  formatarBRL,
  formatarDataBR,
  formatarMesAno,
  formatarPercentual,
  lerBRL,
} from '../src/core/formatters.ts';

describe('formatarBRL', () => {
  it('formata centavos inteiros em pt-BR', () => {
    expect(formatarBRL(123456)).toBe('R$ 1.234,56');
    expect(formatarBRL(18640)).toBe('R$ 186,40');
    expect(formatarBRL(0)).toBe('R$ 0,00');
    expect(formatarBRL(5)).toBe('R$ 0,05');
  });
  it('usa sinal de menos Unicode para negativos', () => {
    expect(formatarBRL(-4000)).toBe('−R$ 40,00');
  });
  it('recusa valor que não é inteiro (sem ponto flutuante)', () => {
    expect(() => formatarBRL(10.5)).toThrow();
  });
});

describe('lerBRL', () => {
  it('lê texto digitado e devolve centavos', () => {
    expect(lerBRL('R$ 1.234,56')).toBe(123456);
    expect(lerBRL('186,40')).toBe(18640);
    expect(lerBRL('1234,5')).toBe(123450);
    expect(lerBRL('0')).toBe(0);
    expect(lerBRL('0,1')).toBe(10);
  });
  it('devolve null para texto inválido ou vazio', () => {
    expect(lerBRL('')).toBeNull();
    expect(lerBRL('abc')).toBeNull();
    expect(lerBRL('1,234')).toBeNull();
    expect(lerBRL('1,2,3')).toBeNull();
  });
  it('nunca devolve valor fracionário', () => {
    for (const texto of ['0,10', '12,99', '1.000,01']) {
      const v = lerBRL(texto);
      expect(v === null || Number.isInteger(v)).toBe(true);
    }
  });
  it('ida e volta: lerBRL(formatarBRL(x)) === x', () => {
    for (const x of [0, 5, 100, 18640, 123456, 99999999]) {
      expect(lerBRL(formatarBRL(x))).toBe(x);
    }
  });
});

describe('datas e competência', () => {
  it('formata data ISO em DD/MM/AAAA', () => {
    expect(formatarDataBR('2026-11-15')).toBe('15/11/2026');
  });
  it('recusa data inválida', () => {
    expect(() => formatarDataBR('15/11/2026')).toThrow();
  });
  it('formata competência por extenso', () => {
    expect(formatarMesAno('2026-11')).toBe('novembro de 2026');
    expect(formatarMesAno('2027-01')).toBe('janeiro de 2027');
  });
  it('recusa competência fora do intervalo', () => {
    expect(() => formatarMesAno('2026-13')).toThrow();
  });
});

describe('percentual e estado de consumo (inteiros)', () => {
  it('formata percentual arredondado para baixo', () => {
    expect(formatarPercentual(81.9)).toBe('81%');
  });
  it('calcula percentual sem ponto flutuante', () => {
    expect(calcularPercentual(64640, 80000)).toBe(80);
    expect(calcularPercentual(0, 0)).toBe(0);
  });
  it('classifica consumo: sem plano, ok, atenção, no limite e estourou', () => {
    expect(estadoConsumo(100, 0)).toBe('sem-plano');
    expect(estadoConsumo(50, 100)).toBe('ok');
    expect(estadoConsumo(81, 100)).toBe('atencao');
    expect(estadoConsumo(100, 100)).toBe('no-limite');
    expect(estadoConsumo(101, 100)).toBe('estourou');
  });
});
