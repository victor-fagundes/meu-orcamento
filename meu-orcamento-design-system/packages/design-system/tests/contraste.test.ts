import { describe, expect, it } from 'vitest';
import { darkColors, lightColors, type ColorTokens } from '../src/core/tokens';

interface RgbColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

function parseHexToRgb(hex: string): RgbColor {
  const clean = hex.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
    throw new Error(`Cor hexadecimal inválida para cálculo de contraste: ${hex}`);
  }
  return {
    r: Number.parseInt(clean.slice(0, 2), 16),
    g: Number.parseInt(clean.slice(2, 4), 16),
    b: Number.parseInt(clean.slice(4, 6), 16),
  };
}

function channelLuminance(channel8Bit: number): number {
  const srgb = channel8Bit / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(rgb: RgbColor): number {
  const r = channelLuminance(rgb.r);
  const g = channelLuminance(rgb.g);
  const b = channelLuminance(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(foregroundHex: string, backgroundHex: string): number {
  const l1 = relativeLuminance(parseHexToRgb(foregroundHex));
  const l2 = relativeLuminance(parseHexToRgb(backgroundHex));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

interface ParContraste {
  readonly nome: string;
  readonly fg: keyof ColorTokens;
  readonly bg: keyof ColorTokens;
  readonly minimo: number;
}

const PARES_OBRIGATORIOS: readonly ParContraste[] = [
  { nome: 'Texto primário sobre bg', fg: 'textPrimary', bg: 'bg', minimo: 4.5 },
  { nome: 'Texto primário sobre surface', fg: 'textPrimary', bg: 'surface', minimo: 4.5 },
  { nome: 'Texto primário sobre surfaceMuted', fg: 'textPrimary', bg: 'surfaceMuted', minimo: 4.5 },
  { nome: 'Texto secundário sobre bg', fg: 'textSecondary', bg: 'bg', minimo: 4.5 },
  { nome: 'Texto secundário sobre surface', fg: 'textSecondary', bg: 'surface', minimo: 4.5 },
  { nome: 'Texto secundário sobre surfaceMuted', fg: 'textSecondary', bg: 'surfaceMuted', minimo: 4.5 },
  { nome: 'Texto muted sobre surface', fg: 'textMuted', bg: 'surface', minimo: 4.5 },
  { nome: 'Texto sobre action (botão primário)', fg: 'onAction', bg: 'action', minimo: 4.5 },
  { nome: 'Ação textual sobre surface', fg: 'action', bg: 'surface', minimo: 4.5 },
  { nome: 'Texto selecionado sobre selected (chip/aba)', fg: 'onSelected', bg: 'selected', minimo: 4.5 },
  { nome: 'Sucesso sobre surface', fg: 'success', bg: 'surface', minimo: 4.5 },
  { nome: 'Texto sucesso sobre successBg', fg: 'onSuccessBg', bg: 'successBg', minimo: 4.5 },
  { nome: 'Texto alerta (--md-warn-text) sobre surface', fg: 'warnText', bg: 'surface', minimo: 4.5 },
  { nome: 'Texto alerta (--md-warn-text) sobre warnBg', fg: 'warnText', bg: 'warnBg', minimo: 4.5 },
  { nome: 'Erro sobre surface', fg: 'error', bg: 'surface', minimo: 4.5 },
  { nome: 'Texto erro sobre errorBg', fg: 'onErrorBg', bg: 'errorBg', minimo: 4.5 },
  { nome: 'Info sobre surface', fg: 'info', bg: 'surface', minimo: 4.5 },
  { nome: 'Texto info sobre infoBg', fg: 'onInfoBg', bg: 'infoBg', minimo: 4.5 },
  { nome: 'Texto inverso sobre textPrimary (Snackbar)', fg: 'textInverse', bg: 'textPrimary', minimo: 4.5 },
];

describe('Contraste WCAG 2.2 AA (>= 4.5:1)', () => {
  describe('Tema Claro (lightColors)', () => {
    for (const par of PARES_OBRIGATORIOS) {
      it(`${par.nome} (${lightColors[par.fg]} em ${lightColors[par.bg]})`, () => {
        const ratio = contrastRatio(lightColors[par.fg], lightColors[par.bg]);
        expect(ratio).toBeGreaterThanOrEqual(par.minimo);
      });
    }
  });

  describe('Tema Escuro (darkColors)', () => {
    for (const par of PARES_OBRIGATORIOS) {
      it(`${par.nome} (${darkColors[par.fg]} em ${darkColors[par.bg]})`, () => {
        const ratio = contrastRatio(darkColors[par.fg], darkColors[par.bg]);
        expect(ratio).toBeGreaterThanOrEqual(par.minimo);
      });
    }
  });
});
