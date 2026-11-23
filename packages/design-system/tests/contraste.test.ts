import { describe, expect, it } from 'vitest';
import { darkColors, lightColors, type ColorToken } from '../src/core/tokens.ts';

type ColorSet = Record<ColorToken, string>;

/** Razão de contraste WCAG 2.x entre dois hexadecimais #RRGGBB. */
function luminancia(hex: string): number {
  const h = hex.replace('#', '');
  const canais = [0, 2, 4].map((i) => Number.parseInt(h.slice(i, i + 2), 16) / 255);
  const [r = 0, g = 0, b = 0] = canais.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function razao(a: string, b: string): number {
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x) as [number, number];
  return (claro + 0.05) / (escuro + 0.05);
}

/** Pares de texto: exigem 4,5:1 (WCAG 2.2 AA, texto normal). */
const paresTexto = (c: ColorSet): Array<[string, string, string]> => [
  ['texto sobre superfície', c.text, c.surface],
  ['texto secundário sobre cartão', c.textMuted, c.card],
  ['ação (texto) sobre superfície', c.action, c.surface],
  ['texto sobre ação', c.onAction, c.action],
  ['texto sobre erro', c.onError, c.error],
  ['texto de atenção sobre fundo de atenção', c.warnText, c.warnBg],
  ['texto de erro sobre fundo de erro', c.errorText, c.errorBg],
  ['sucesso sobre cartão', c.success, c.card],
  ['texto sobre seleção', c.onSelected, c.selected],
  ['texto do snackbar', c.snackbarText, c.snackbar],
];

/** Elementos gráficos (barras, bordas de foco): exigem 3:1. */
const paresGrafico = (c: ColorSet): Array<[string, string, string]> => [
  ['barra de atenção sobre linha', c.warnBar, c.line],
];

describe('contraste WCAG 2.2 AA · tema claro', () => {
  for (const [nome, texto, fundo] of paresTexto(lightColors)) {
    it(`${nome} >= 4.5:1`, () => {
      expect(razao(texto, fundo)).toBeGreaterThanOrEqual(4.5);
    });
  }
  for (const [nome, cor, fundo] of paresGrafico(lightColors)) {
    it(`${nome} >= 3:1`, () => {
      expect(razao(cor, fundo)).toBeGreaterThanOrEqual(3);
    });
  }
});

describe('contraste WCAG 2.2 AA · tema escuro', () => {
  for (const [nome, texto, fundo] of paresTexto(darkColors)) {
    it(`${nome} >= 4.5:1`, () => {
      expect(razao(texto, fundo)).toBeGreaterThanOrEqual(4.5);
    });
  }
  for (const [nome, cor, fundo] of paresGrafico(darkColors)) {
    it(`${nome} >= 3:1`, () => {
      expect(razao(cor, fundo)).toBeGreaterThanOrEqual(3);
    });
  }
});
