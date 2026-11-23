import { brandYellow, darkColors, elevation, grid, lightColors, motion, radius, spacing, stateTokens, typography } from './tokens.ts';

const kebab = (s: string): string => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

function colorVars(cores: Record<string, string>): string {
  return Object.entries(cores)
    .map(([nome, valor]) => `  --md-${kebab(nome)}: ${valor};`)
    .join('\n');
}

/**
 * Gera o tokens.css a partir de tokens.ts. Nunca editar o CSS à mão:
 * o teste tokens-sync.test.ts falha se os dois divergirem.
 */
export function buildCss(): string {
  const espaco = Object.entries(spacing).map(([k, v]) => `  --space-${k}: ${v}px;`).join('\n');
  const raios = Object.entries(radius).map(([k, v]) => `  --radius-${k}: ${v === 999 ? '999px' : `${v}px`};`).join('\n');
  const sombras = Object.entries(elevation).map(([k, v]) => `  --elevation-${k}: ${v.css};`).join('\n');
  const tipo = [
    `  --type-display-lg-size: ${typography.displayLg.size}px;`,
    `  --type-display-lg-line: ${typography.displayLg.line}px;`,
    `  --type-display-md-size: ${typography.displayMd.size}px;`,
    `  --type-display-md-line: ${typography.displayMd.line}px;`,
    `  --type-title-lg-size: ${typography.titleLg.size}px;`,
    `  --type-title-lg-line: ${typography.titleLg.line}px;`,
    `  --type-title-md-size: ${typography.titleMd.size}px;`,
    `  --type-title-md-line: ${typography.titleMd.line}px;`,
    `  --type-body-size: ${typography.body.size}px;`,
    `  --type-body-line: ${typography.body.line}px;`,
    `  --type-label-size: ${typography.label.size}px;`,
    `  --type-label-line: ${typography.label.line}px;`,
    `  --type-caption-size: ${typography.caption.size}px;`,
    `  --type-caption-line: ${typography.caption.line}px;`,
  ].join('\n');
  const movimento = [
    `  --motion-fast: ${motion.fast}ms;`,
    `  --motion-base: ${motion.base}ms;`,
    `  --motion-slow: ${motion.slow}ms;`,
    `  --motion-easing: ${motion.easing};`,
  ].join('\n');
  const estados = [
    `  --state-hover-filter: ${stateTokens.hoverFilter};`,
    `  --state-pressed-scale: ${stateTokens.pressedScale};`,
    `  --state-focus-width: ${stateTokens.focusWidth}px;`,
    `  --state-focus-offset: ${stateTokens.focusOffset}px;`,
    `  --state-disabled-opacity: ${stateTokens.disabledOpacity};`,
  ].join('\n');
  const gradeVars = [
    `  --breakpoint-desktop: ${grid.breakpointDesktop}px;`,
    `  --sidebar-width: ${grid.sidebarWidth}px;`,
    `  --bottom-bar-height: ${grid.bottomBarHeight}px;`,
    `  --content-max-width: ${grid.contentMaxWidth}px;`,
    `  --grid-columns-mobile: ${grid.mobile.columns};`,
    `  --grid-margin-mobile: ${grid.mobile.margin}px;`,
    `  --grid-gutter-mobile: ${grid.mobile.gutter}px;`,
    `  --grid-columns-desktop: ${grid.desktop.columns};`,
    `  --grid-margin-desktop: ${grid.desktop.margin}px;`,
    `  --grid-gutter-desktop: ${grid.desktop.gutter}px;`,
  ].join('\n');

  return `/* Gerado por scripts/gen-css.ts a partir de src/core/tokens.ts. Não editar à mão. */
:root {
  --font-family: var(--font-manrope), "Segoe UI", sans-serif;
  --md-brand-yellow: ${brandYellow};
${colorVars(lightColors)}
${espaco}
${raios}
${sombras}
${tipo}
${movimento}
${estados}
${gradeVars}
}

:root[data-theme="dark"] {
${colorVars(darkColors)}
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
${colorVars(darkColors)}
  }
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-fast: 0ms;
    --motion-base: 0ms;
    --motion-slow: 0ms;
  }
}
`;
}
