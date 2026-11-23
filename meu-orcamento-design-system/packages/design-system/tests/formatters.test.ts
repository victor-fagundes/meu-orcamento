import { describe, expect, it } from 'vitest';
import {
  calcularPercentualCentavos,
  formatarBRL,
  formatarDataBR,
  formatarMesAno,
  formatarPercentual,
  lerBRL,
} from '../src/core/formatters';

describe('formatarBRL e lerBRL (centavos inteiros sem float)', () => {
  it('formata centavos positivos, zero e negativos corretamente', () => {
    expect(formatarBRL(0)).toBe('R$ 0,00');
    expect(formatarBRL(5)).toBe('R$ 0,05');
    expect(formatarBRL(99)).toBe('R$ 0,99');
    expect(formatarBRL(100)).toBe('R$ 1,00');
    expect(formatarBRL(15025)).toBe('R$ 150,25');
    expect(formatarBRL(123456789)).toBe('R$ 1.234.567,89');
    expect(formatarBRL(-4590)).toBe('-R$ 45,90');
    expect(formatarBRL(250000, { omitirSimbolo: true })).toBe('2.500,00');
  });

  it('rejeita valores decimais (float) em formatarBRL para prevenir imprecisão IEEE-754', () => {
    expect(() => formatarBRL(19.99)).toThrow(TypeError);
    expect(() => formatarBRL(0.1 + 0.2)).toThrow(TypeError);
    expect(() => formatarBRL(Number.NaN)).toThrow(TypeError);
  });

  it('converte entradas textuais pt-BR e dígitos de máscara para centavos inteiros exatos', () => {
    expect(lerBRL('')).toBe(0);
    expect(lerBRL('R$ 0,00')).toBe(0);
    expect(lerBRL('R$ 1.234,56')).toBe(123456);
    expect(lerBRL('45,90')).toBe(4590);
    expect(lerBRL('-120,50')).toBe(-12050);
    // Modo máscara dígito-a-dígito (sem separador decimal)
    expect(lerBRL('1')).toBe(1);
    expect(lerBRL('150')).toBe(150);
    expect(lerBRL('15025')).toBe(15025);
  });

  it('garante ida e volta exata sem perda de precisão (0.10 + 0.20 = 30 centavos)', () => {
    const a = lerBRL('R$ 0,10');
    const b = lerBRL('R$ 0,20');
    const soma = a + b;
    expect(soma).toBe(30);
    expect(Number.isInteger(soma)).toBe(true);
    expect(formatarBRL(soma)).toBe('R$ 0,30');
  });
});

describe('formatarDataBR, formatarMesAno e formatarPercentual', () => {
  it('formata datas ISO e Date para DD/MM/AAAA', () => {
    expect(formatarDataBR('2026-11-21')).toBe('21/11/2026');
    expect(formatarDataBR(new Date(Date.UTC(2026, 0, 5)))).toBe('05/01/2026');
  });

  it('formata mês e ano por extenso e abreviado', () => {
    expect(formatarMesAno(11, 2026)).toBe('Novembro 2026');
    expect(formatarMesAno(11, 2026, { abreviado: true })).toBe('Nov/2026');
  });

  it('formata percentuais e calcula progresso em centavos', () => {
    expect(formatarPercentual(0.75)).toBe('75%');
    expect(formatarPercentual(82.5, { entradaEmPorcento: true, casasDecimais: 1 })).toBe('82,5%');
    expect(calcularPercentualCentavos(75000, 100000)).toBe(75);
    expect(calcularPercentualCentavos(120000, 100000)).toBe(120);
  });
});
