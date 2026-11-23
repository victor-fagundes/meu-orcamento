import { expect, it } from 'vitest';
import { iconPaths, type IconName } from '../src/core/icons-paths.ts';

const nomesNovos = [
  'edit',
  'add',
  'search',
  'close',
  'filter_list',
  'logout',
  'more_vert',
  'expand_more',
  'expand_less',
  'arrow_upward',
  'arrow_downward',
] as const satisfies readonly IconName[];

it('todo nome de IconName tem caminho', () => {
  for (const nome of Object.keys(iconPaths) as IconName[]) {
    expect(iconPaths[nome].length).toBeGreaterThan(0);
  }
});

it('os nomes desta spec existem no mapa', () => {
  for (const nome of nomesNovos) {
    expect(iconPaths[nome].length).toBeGreaterThan(0);
  }
});
