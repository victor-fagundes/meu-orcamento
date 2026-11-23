import { eq } from "drizzle-orm";
import type { Db } from "@/db";
import { cartoes, itens, lancamentos } from "@/db/schema";
import {
  buildExportCsv,
  buildExportJson,
  haMovimentoParaExportar,
  MSG_ARQUIVO_INCOMPLETO,
  MSG_SEM_MOVIMENTO,
  type ExportCartao,
  type ExportItem,
  type ExportLancamento,
} from "@/domain/export-orcamento";

async function loadExportData(db: Db, orcamentoId: string) {
  const itensRows = await db.select().from(itens).where(eq(itens.orcamentoId, orcamentoId));
  const cartoesRows = await db.select().from(cartoes).where(eq(cartoes.orcamentoId, orcamentoId));
  const lancRows = await db
    .select()
    .from(lancamentos)
    .where(eq(lancamentos.orcamentoId, orcamentoId));

  const exportItens: ExportItem[] = itensRows.map((i) => ({
    id: i.id,
    tipo: i.tipo,
    grupo: i.grupo,
    nome: i.nome,
    planoCentavos: JSON.parse(i.planoCentavosJson) as number[],
    arquivado: i.arquivado === 1,
    divida: i.divida === 1,
  }));

  const exportCartoes: ExportCartao[] = cartoesRows.map((c) => ({
    id: c.id,
    apelido: c.apelido,
    diaFechamento: c.diaFechamento,
    diaVencimento: c.diaVencimento,
    instituicao: c.instituicao,
    ultimos4: c.ultimos4,
    ativo: c.ativo === 1,
  }));

  const exportLanc: ExportLancamento[] = lancRows.map((l) => ({
    id: l.id,
    itemId: l.itemId,
    cartaoId: l.cartaoId,
    descricao: l.descricao,
    valorCentavos: l.valorCentavos,
    dataTransacao: l.dataTransacao,
    competencia: l.competencia,
    meio: l.meio,
    parcelaN: l.parcelaN,
    parcelaTotal: l.parcelaTotal,
    grupoParcelaId: l.grupoParcelaId,
  }));

  return { itens: exportItens, cartoes: exportCartoes, lancamentos: exportLanc };
}

export type ExportArquivo =
  | { ok: true; content: string }
  | { ok: false; error: string };

async function exportar(
  db: Db,
  orcamentoId: string,
  build: (data: Awaited<ReturnType<typeof loadExportData>>) => string,
): Promise<ExportArquivo> {
  const data = await loadExportData(db, orcamentoId);
  if (!haMovimentoParaExportar(data)) {
    return { ok: false, error: MSG_SEM_MOVIMENTO };
  }
  try {
    return { ok: true, content: build(data) };
  } catch {
    return { ok: false, error: MSG_ARQUIVO_INCOMPLETO };
  }
}

export async function exportOrcamentoJson(db: Db, orcamentoId: string): Promise<ExportArquivo> {
  return exportar(db, orcamentoId, buildExportJson);
}

export async function exportOrcamentoCsv(db: Db, orcamentoId: string): Promise<ExportArquivo> {
  return exportar(db, orcamentoId, buildExportCsv);
}
