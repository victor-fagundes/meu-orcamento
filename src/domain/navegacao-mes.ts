/** Destino depois de gravar lançamentos importados. Sem Next, DB ou React. */

const COMPETENCIA = /^(\d{4})-(0[1-9]|1[0-2])$/;

export function competenciaDestinoImport(
  competencias: readonly string[],
  mesCorrente: string,
): string | null {
  const valid = [...new Set(competencias.filter((c) => COMPETENCIA.test(c)))].sort();
  if (valid.length === 0) return null;
  if (COMPETENCIA.test(mesCorrente) && valid.includes(mesCorrente)) return mesCorrente;
  return valid[valid.length - 1]!;
}

export function hrefLancamentosMes(competencia: string): string {
  return `/app/lancamentos?mes=${competencia}`;
}

export function textoDestinoImport(destino: string, total: number): string {
  const base = `ver Lançamentos em ${destino}`;
  if (total <= 1) return base;
  const outras = total - 1;
  const palavra = outras === 1 ? "competência gravada" : "competências gravadas";
  return `${base} · mais ${outras} ${palavra}`;
}
