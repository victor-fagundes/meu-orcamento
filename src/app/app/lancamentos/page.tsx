import { listCartoesAtivos } from "@/application/cartoes";
import { listItensAtivosParaLancamento } from "@/application/itens";
import {
  competenciaAtual,
  listLancamentosCompetencia,
} from "@/application/lancamentos";
import { LancamentosView } from "@/components/lancamentos-view";
import { labelCompetencia, parseCompetencia } from "@/lib/competencia-nav";
import { requireSessionOrcamento } from "@/lib/session";

function planoDoze(json: string): number[] {
  try {
    const raw = JSON.parse(json) as unknown;
    if (!Array.isArray(raw)) return Array(12).fill(0);
    const out = raw
      .slice(0, 12)
      .map((n) => (Number.isFinite(Number(n)) ? Math.trunc(Number(n)) : 0));
    while (out.length < 12) out.push(0);
    return out;
  } catch {
    return Array(12).fill(0);
  }
}

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
  const itens = await listItensAtivosParaLancamento(db, orcamento.id);
  const cartoes = await listCartoesAtivos(db, orcamento.id);

  return (
    <LancamentosView
      competencia={competencia}
      mesLabel={labelCompetencia(competencia)}
      rows={rows.map((r) => ({
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
        cartaoApelido: r.cartaoApelido,
      }))}
      itens={itens.map((i) => ({
        id: i.id,
        tipo: i.tipo,
        grupo: i.grupo,
        nome: i.nome,
        plano: planoDoze(i.planoCentavosJson),
      }))}
      cartoes={cartoes.map((c) => ({
        id: c.id,
        apelido: c.apelido,
        diaFechamento: c.diaFechamento,
      }))}
    />
  );
}
