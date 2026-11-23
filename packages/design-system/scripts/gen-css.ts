import { writeFileSync } from 'node:fs';
import { buildCss } from '../src/core/css.ts';

writeFileSync(new URL('../src/core/tokens.css', import.meta.url), buildCss(), 'utf8');
console.log('tokens.css gerado.');
