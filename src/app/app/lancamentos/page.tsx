import { listCartoesAtivos } from "@/application/cartoes";
import { listItensAtivosParaLancamento } from "@/application/itens";
import {
  competenciaAtual,
  listLancamentosCompetencia,
  listParcelasIrmas,
} from "@/application/lancamentos";
import { LancamentosTela } from "@/components/lancamentos-tela";
import { parseCompetencia } from "@/lib/competencia-nav";
import { requireSessionOrcamento } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function LancamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const { db, orcamento } = await requireSessionOrcamento();
  const sp = await searchParams;
  const requested = sp.mes ?? competenciaAtual();
  const competencia = parseCompetencia(requested) ? requested : competenciaAtual();
  const rows = await listLancamentosCompetencia(db, orcamento.id, competencia);
  const irmas = await listParcelasIrmas(db, orcamento.id, competencia);
  const itens = await listItensAtivosParaLancamento(db, orcamento.id);
  const cartoes = await listCartoesAtivos(db, orcamento.id);

  return (
    <LancamentosTela
      competencia={competencia}
      linhas={rows.map((r) => ({
        id: r.id,
        itemId: r.itemId,
        cartaoId: r.cartaoId,
        descricao: r.descricao,
        valorCentavos: r.valorCentavos,
        dataTransacao: r.dataTransacao,
        competencia: r.competencia,
        meio: r.meio,
        parcelaN: r.parcelaN,
        parcelaTotal: r.parcelaTotal,
        grupoParcelaId: r.grupoParcelaId,
        itemNome: r.itemNome,
        itemGrupo: r.itemGrupo,
        itemTipo: r.itemTipo,
        itemArquivado: r.itemArquivado === 1,
        cartaoApelido: r.cartaoApelido,
        cartaoFechamento: r.cartaoFechamento,
      }))}
      irmas={irmas}
      itens={itens.map((i) => ({
        id: i.id,
        tipo: i.tipo,
        grupo: i.grupo,
        nome: i.nome,
      }))}
      cartoes={cartoes.map((c) => ({
        id: c.id,
        apelido: c.apelido,
        diaFechamento: c.diaFechamento,
      }))}
    />
  );
}
