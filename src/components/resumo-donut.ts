/** AC-602.1 / FR-006: 5 ou mais categorias viram as 4 maiores mais Outros. */
export function collapseDonutGroups(groups: [string, number][]): [string, number][] {
  const entries = [...groups].sort((a, b) => b[1] - a[1]);
  if (entries.length < 5) return entries;
  const top = entries.slice(0, 4);
  const outros = entries.slice(4).reduce((sum, [, value]) => sum + value, 0);
  return [...top, ["Outros", outros]];
}
