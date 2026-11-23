import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildCss } from '../src/core/css.ts';

describe('tokens.css sincronizado com tokens.ts', () => {
  it('o arquivo commitado é exatamente o gerado a partir de tokens.ts', () => {
    const arquivo = readFileSync(new URL('../src/core/tokens.css', import.meta.url), 'utf8');
    expect(arquivo).toBe(buildCss());
  });
  it('contém as variáveis de tema escuro e de movimento reduzido', () => {
    const css = buildCss();
    expect(css).toContain(':root[data-theme="dark"]');
    expect(css).toContain('@media (prefers-color-scheme: dark)');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('--bottom-bar-height: 76px');
    expect(css).toContain('--content-max-width: 960px');
    expect(css).not.toContain('@font-face');
  });
});
