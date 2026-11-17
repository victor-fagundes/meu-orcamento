import type { TipoOrcamento } from "./catalog";
import { textoConsumoDespesa, textoConsumoReceita } from "./consumo";
import { ordenarGrupos } from "./item-unico";
import { formatBRL } from "./money";

const TIPOS: TipoOrcamento[] = ["R", "F", "V", "E"];

export type ItemDoMes = {
  id: string;
  tipo: string;
  grupo: string;
  planoMesCentavos: number;
};

export type LancamentoDoMes = {
  itemId: string;
  valorCentavos: number;
  itemTipo: string;
  itemGrupo: string;
};

export type TotalTipo = {
  tipo: TipoOrcamento;
  planoCentavos: number;
  realizadoCentavos: number;
  frase: string;
};

export type TotalGrupo = {
  tipo: string;
  grupo: string;
  planoCentavos: number;
  realizadoCentavos: number;
  aindaCabeCentavos: number;
  frase: string;
};

function fraseDe(tipo: string, plano: number, realizado: number): string {
  return tipo === "R"
    ? textoConsumoReceita(realizado, plano, formatBRL)
    : textoConsumoDespesa(realizado, plano, formatBRL);
}

export type TotaisMes = {
  aindaPodeGastarCentavos: number;
  totalOrcadoDespesasCentavos: number;
  totalGastoDespesasCentavos: number;
  porTipo: TotalTipo[];
  porGrupo: TotalGrupo[];
};

function cents(value: number): number {
  return Math.trunc(value);
}

/**
 * Totais do mês que o Resumo e o Orçamento mostram.
 * Receita não entra em ainda pode gastar, no orçado nem no gasto de despesas.
 */
export function totaisDoMes(itens: ItemDoMes[], lancamentos: LancamentoDoMes[]): TotaisMes {
  const totalOrcadoDespesasCentavos = itens
    .filter((item) => item.tipo !== "R")
    .reduce((sum, item) => sum + cents(item.planoMesCentavos), 0);
  const totalGastoDespesasCentavos = lancamentos
    .filter((lanc) => lanc.itemTipo !== "R")
    .reduce((sum, lanc) => sum + cents(lanc.valorCentavos), 0);

  const porTipo = TIPOS.map((tipo) => ({
    tipo,
    planoCentavos: itens
      .filter((item) => item.tipo === tipo)
      .reduce((sum, item) => sum + cents(item.planoMesCentavos), 0),
    realizadoCentavos: lancamentos
      .filter((lanc) => lanc.itemTipo === tipo)
      .reduce((sum, lanc) => sum + cents(lanc.valorCentavos), 0),
  })).map((row) => ({
    ...row,
    frase: fraseDe(row.tipo, row.planoCentavos, row.realizadoCentavos),
  }));

  const porItem = new Map<string, { tipo: string; grupo: string }>();
  const grupos = new Map<string, { tipo: string; grupo: string; plano: number; realizado: number }>();
  for (const item of itens) {
    porItem.set(item.id, { tipo: item.tipo, grupo: item.grupo });
    const key = `${item.tipo}|${item.grupo}`;
    const row = grupos.get(key) ?? { tipo: item.tipo, grupo: item.grupo, plano: 0, realizado: 0 };
    row.plano += cents(item.planoMesCentavos);
    grupos.set(key, row);
  }
  for (const lanc of lancamentos) {
    const item = porItem.get(lanc.itemId);
    if (!item) continue;
    const row = grupos.get(`${item.tipo}|${item.grupo}`);
    if (!row) continue;
    row.realizado += cents(lanc.valorCentavos);
  }

  const porGrupo = ordenarPorTipo(
    [...grupos.values()].map((row) => ({
      tipo: row.tipo,
      grupo: row.grupo,
      planoCentavos: row.plano,
      realizadoCentavos: row.realizado,
      aindaCabeCentavos: row.plano - row.realizado,
      frase: fraseDe(row.tipo, row.plano, row.realizado),
    })),
  );

  return {
    aindaPodeGastarCentavos: totalOrcadoDespesasCentavos - totalGastoDespesasCentavos,
    totalOrcadoDespesasCentavos,
    totalGastoDespesasCentavos,
    porTipo,
    porGrupo,
  };
}

function ordenarPorTipo(rows: TotalGrupo[]): TotalGrupo[] {
  const byTipo = TIPOS.flatMap((tipo) => {
    const doTipo = rows.filter((row) => row.tipo === tipo);
    return ordenarGrupos(
      doTipo.map((row) => ({
        ...row,
        plano: row.planoCentavos,
        realizado: row.realizadoCentavos,
      })),
    ).map(({ plano: _plano, realizado: _realizado, ...row }) => row);
  });
  const outros = rows.filter((row) => !TIPOS.includes(row.tipo as TipoOrcamento));
  return [...byTipo, ...outros];
}
