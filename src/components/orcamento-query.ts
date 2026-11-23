export const TIPOS_ORCAMENTO = ["R", "F", "V", "E"] as const;

export type TipoOrcamentoLista = (typeof TIPOS_ORCAMENTO)[number];

export const ROTULO_TIPO: Record<TipoOrcamentoLista, string> = {
  R: "Receitas",
  F: "Fixas",
  V: "Variáveis",
  E: "Anuais",
};

function primeiro(valor: string | string[] | undefined): string | undefined {
  return Array.isArray(valor) ? valor[0] : valor;
}

export function tipoDaQuery(valor: string | string[] | undefined): TipoOrcamentoLista {
  const bruto = primeiro(valor);
  if (bruto === "R" || bruto === "F" || bruto === "V" || bruto === "E") return bruto;
  return "F";
}

export function abertasDaQuery(valor: string | string[] | undefined): string[] {
  if (!valor) return [];
  return Array.isArray(valor) ? valor : [valor];
}

function paramsDe(mes: string, tipo: TipoOrcamentoLista, abertas: readonly string[]): URLSearchParams {
  const params = new URLSearchParams();
  if (mes) params.set("mes", mes);
  params.set("tipo", tipo);
  for (const nome of abertas) params.append("aberta", nome);
  return params;
}

export function hrefDoTipo(mes: string, tipo: TipoOrcamentoLista): string {
  return `/app/orcamento?${paramsDe(mes, tipo, []).toString()}`;
}

export function hrefAlternarCategoria(
  mes: string,
  tipo: TipoOrcamentoLista,
  abertas: readonly string[],
  nome: string,
): string {
  const aberta = abertas.includes(nome) ? abertas.filter((item) => item !== nome) : [...abertas, nome];
  return `/app/orcamento?${paramsDe(mes, tipo, aberta).toString()}`;
}
