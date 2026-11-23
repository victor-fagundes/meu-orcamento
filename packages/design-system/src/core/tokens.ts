// Fonte única de verdade dos tokens. Valores vêm de design-system/TOKENS.md e TEMA-ESCURO.md.

export const lightColors = {
  action: '#0058BE',
  onAction: '#FFFFFF',
  text: '#191C20',
  textMuted: '#43474E',
  surface: '#F8F9FF',
  card: '#FFFFFF',
  line: '#E3E6EF',
  field: '#ECEEF6',
  selected: '#D7E3FF',
  onSelected: '#001B3F',
  success: '#2E7D32',
  warnText: '#6B4B00',
  warnBar: '#9A6B00',
  warnBg: '#FFF3C4',
  error: '#BA1A1A',
  onError: '#FFFFFF',
  errorText: '#410002',
  errorBg: '#FFDAD6',
  snackbar: '#2F3033',
  snackbarText: '#F1F0F4',
  snackbarAction: '#ADC6FF',
} as const;

export const darkColors = {
  action: '#ADC6FF',
  onAction: '#002E6B',
  text: '#E2E2E9',
  textMuted: '#C4C6D0',
  surface: '#111318',
  card: '#1B1C20',
  line: '#44474E',
  field: '#282A2F',
  selected: '#00458F',
  onSelected: '#D8E2FF',
  success: '#81C784',
  warnText: '#FFD966',
  warnBar: '#FFD966',
  warnBg: '#3D3000',
  error: '#FFB4AB',
  onError: '#690005',
  errorText: '#FFDAD6',
  errorBg: '#93000A',
  snackbar: '#E2E2E9',
  snackbarText: '#2F3033',
  snackbarAction: '#0058BE',
} as const;

/** Cor da marca: não muda entre temas. */
export const brandYellow = '#FFE600';

export type ColorToken = keyof typeof lightColors;

/** Escala de espaço (base 4). */
export const spacing = { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32, 12: 48 } as const;

/** Raios, em px. */
export const radius = { sm: 8, md: 12, lg: 14, xl: 16, '2xl': 20, sheet: 28, full: 999 } as const;

/** Escala tipográfica: tamanho e linha, em px. */
export const typography = {
  family: 'Manrope',
  displayLg: { size: 56, line: 60 },
  displayMd: { size: 40, line: 44 },
  titleLg: { size: 28, line: 32 },
  titleMd: { size: 20, line: 24 },
  body: { size: 16, line: 24 },
  label: { size: 14, line: 20 },
  caption: { size: 12, line: 16 },
  weights: { regular: 400, medium: 500, bold: 700, extrabold: 800 },
} as const;

/**
 * Elevação. `css` vale para web; `native` vale para React Native
 * (iOS usa shadow*, Android usa elevation).
 */
export const elevation = {
  0: { css: 'none', native: { shadowOpacity: 0, shadowRadius: 0, shadowOffset: { width: 0, height: 0 }, elevation: 0 } },
  1: { css: '0 1px 2px rgba(25, 28, 32, 0.06)', native: { shadowOpacity: 0.06, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 } },
  2: { css: '0 8px 24px rgba(25, 28, 32, 0.16)', native: { shadowOpacity: 0.16, shadowRadius: 24, shadowOffset: { width: 0, height: 8 }, elevation: 6 } },
  fab: { css: '0 4px 12px rgba(0, 88, 190, 0.3)', native: { shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 6 } },
} as const;

/** Movimento, em ms. Com reduzir movimento, a duração é zero (aplicado em css.ts e no hook de tema). */
export const motion = {
  fast: 150,
  base: 200,
  slow: 300,
  easing: 'cubic-bezier(0.2, 0, 0, 1)',
} as const;

/** Estados de interação. */
export const stateTokens = {
  hoverFilter: 'brightness(0.94)',
  pressedScale: 0.98,
  focusWidth: 2,
  focusOffset: 2,
  disabledOpacity: 0.38,
} as const;

/** Grid: celular até 719 px, desktop a partir de 720 px. */
export const grid = {
  breakpointDesktop: 720,
  sidebarWidth: 240,
  bottomBarHeight: 76,
  contentMaxWidth: 960,
  entradaLargura: 400,
  mobile: { columns: 4, margin: 16, gutter: 16 },
  desktop: { columns: 12, margin: 40, gutter: 24 },
} as const;
