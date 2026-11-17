export type ExportItem = {
  id: string;
  tipo: string;
  grupo: string;
  nome: string;
  planoCentavos: number[];
  arquivado: boolean;
  divida: boolean;
};

export type ExportCartao = {
  id: string;
  apelido: string;
  diaFechamento: number | null;
  diaVencimento: number | null;
  instituicao: string | null;
  ultimos4: string | null;
  ativo: boolean;
};

export type ExportLancamento = {
  id: string;
  itemId: string;
  cartaoId: string | null;
  descricao: string;
  valorCentavos: number;
  dataTransacao: string;
  competencia: string;
  meio: string;
  parcelaN: number | null;
  parcelaTotal: number | null;
  grupoParcelaId: string | null;
};

export type OrcamentoExport = {
  version: 1;
  exportedAt: string;
  itens: ExportItem[];
  cartoes: ExportCartao[];
  lancamentos: ExportLancamento[];
};

export function buildExportJson(data: Omit<OrcamentoExport, "version" | "exportedAt">): string {
  const payload: OrcamentoExport = {
    version: 1,
    exportedAt: new Date().toISOString(),
    ...data,
  };
  return JSON.stringify(payload, null, 2);
}

function csvEscape(v: string | number | null | boolean): string {
  const s = v == null ? "" : String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** CSV multi-seção (centavos inteiros). */
export function buildExportCsv(data: Omit<OrcamentoExport, "version" | "exportedAt">): string {
  const lines: string[] = [];
  lines.push("# itens");
  lines.push("id,tipo,grupo,nome,planoCentavos,arquivado,divida");
  for (const i of data.itens) {
    lines.push(
      [
        csvEscape(i.id),
        csvEscape(i.tipo),
        csvEscape(i.grupo),
        csvEscape(i.nome),
        csvEscape(i.planoCentavos.join("|")),
        csvEscape(i.arquivado ? 1 : 0),
        csvEscape(i.divida ? 1 : 0),
      ].join(","),
    );
  }
  lines.push("# cartoes");
  lines.push("id,apelido,diaFechamento,diaVencimento,instituicao,ultimos4,ativo");
  for (const c of data.cartoes) {
    lines.push(
      [
        csvEscape(c.id),
        csvEscape(c.apelido),
        csvEscape(c.diaFechamento),
        csvEscape(c.diaVencimento),
        csvEscape(c.instituicao),
        csvEscape(c.ultimos4),
        csvEscape(c.ativo ? 1 : 0),
      ].join(","),
    );
  }
  lines.push("# lancamentos");
  lines.push(
    "id,itemId,cartaoId,descricao,valorCentavos,dataTransacao,competencia,meio,parcelaN,parcelaTotal,grupoParcelaId",
  );
  for (const l of data.lancamentos) {
    lines.push(
      [
        csvEscape(l.id),
        csvEscape(l.itemId),
        csvEscape(l.cartaoId),
        csvEscape(l.descricao),
        csvEscape(l.valorCentavos),
        csvEscape(l.dataTransacao),
        csvEscape(l.competencia),
        csvEscape(l.meio),
        csvEscape(l.parcelaN),
        csvEscape(l.parcelaTotal),
        csvEscape(l.grupoParcelaId),
      ].join(","),
    );
  }
  return lines.join("\n") + "\n";
}
