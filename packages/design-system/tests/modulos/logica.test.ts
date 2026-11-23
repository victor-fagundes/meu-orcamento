import { describe, expect, it } from 'vitest';
import { estadoDoSaldo, fraseDoEstado, textoDoSaldo } from '../../src/modulos/logica.ts';
import { formatarBRLInteiro } from '../../src/core/formatters.ts';

describe('fraseDoEstado', () => {
  it('cobre os cinco estados com frases da ficha', () => {
    expect(fraseDoEstado(100, 0)).toBe('Sem valor planejado');
    expect(fraseDoEstado(50, 100)).toBe('Dentro do planejado');
    expect(fraseDoEstado(81, 100)).toBe('Perto do limite · 81%');
    expect(fraseDoEstado(100, 100)).toBe('No limite do planejado');
    expect(fraseDoEstado(50000, 20000)).toBe('Estourou em R$ 300,00');
  });
});

describe('estadoDoSaldo', () => {
  it('mapeia percentual para estado do medidor', () => {
    expect(estadoDoSaldo(87)).toBe('atencao');
    expect(estadoDoSaldo(50)).toBe('ok');
    expect(estadoDoSaldo(100)).toBe('no-limite');
    expect(estadoDoSaldo(101)).toBe('estourou');
  });
});

describe('textoDoSaldo e formatarBRLInteiro', () => {
  it('oculta o valor quando pedido', () => {
    expect(textoDoSaldo(69820, true)).toBe('R$ •••••');
    expect(textoDoSaldo(69820, false)).toBe('R$ 698,20');
  });
  it('mostra total sem centavos, truncado', () => {
    expect(formatarBRLInteiro(820000)).toBe('R$ 8.200');
    expect(formatarBRLInteiro(359099)).toBe('R$ 3.590');
  });
});
