import { listCartoes, listCartoesAtivos } from "@/application/cartoes";
import { listItensArquivados, listItensAtivosParaLancamento } from "@/application/itens";
import { getLimites } from "@/application/limites";
import { TIPOS_LABEL, type TipoOrcamento } from "@/domain/catalog";
import { AjustesCards } from "@/components/ajustes-cards";
import { CarregarExemploButton } from "@/components/carregar-exemplo-button";
import { CartoesPanel } from "@/components/cartoes-panel";
import { CompetenciaSimulador } from "@/components/competencia-simulador";
import { ExcluirContaPanel } from "@/components/excluir-conta-panel";
import { ExportPanel } from "@/components/export-panel";
import { ImportPdfPanel } from "@/components/import-pdf-panel";
import { ImportPlanilhaPanel } from "@/components/import-planilha-panel";
import { LimitesPanel } from "@/components/limites-panel";
import { requireSessionOrcamento } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AjustesPage() {
  const { db, orcamento, session } = await requireSessionOrcamento();
  const arquivados = await listItensArquivados(db, orcamento.id);
  const cartoes = await listCartoes(db, orcamento.id);
  const ativos = await listCartoesAtivos(db, orcamento.id);
  const limites = await getLimites(db, orcamento.id);
  const itens = await listItensAtivosParaLancamento(db, orcamento.id);
  const grupos = [
    ...new Set(itens.filter((i) => i.tipo !== "R").map((i) => i.grupo)),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));

  const cartoesView = cartoes.map((c) => ({
    id: c.id,
    apelido: c.apelido,
    diaFechamento: c.diaFechamento,
    diaVencimento: c.diaVencimento,
    instituicao: c.instituicao,
    ultimos4: c.ultimos4,
    ativo: c.ativo,
  }));
  const ativosOpt = ativos.map((c) => ({ id: c.id, apelido: c.apelido }));
  const primeiro = cartoesView.find((c) => c.ativo);
  const nAtivos = cartoesView.filter((c) => c.ativo).length;
  const cartaoSub = primeiro
    ? `${primeiro.apelido} · fecha dia ${primeiro.diaFechamento} · vence dia ${primeiro.diaVencimento}${
        nAtivos > 1 ? ` · e mais ${nAtivos - 1}` : ""
      }`
    : "Nenhum cartão ativo";

  return (
    <main id="conteudo" className="aj-page">
      <h1 className="orc-title">Ajustes</h1>
      <AjustesCards
        cards={[
          {
            id: "cartoes",
            icon: "card",
            title: "Cartões",
            subtitle: cartaoSub,
            content: <CartoesPanel cartoes={cartoesView} />,
          },
          {
            id: "limites",
            icon: "bell",
            title: "Limites de alerta",
            subtitle: `Preventivo em ${limites.globalPct}% do planejado`,
            content: (
              <LimitesPanel globalPct={limites.globalPct} cats={limites.cats} grupos={grupos} />
            ),
          },
          {
            id: "planilha",
            icon: "upload",
            title: "Importar planilha",
            subtitle: "CSV, XLSX ou ODS, com mapeamento",
            content: <ImportPlanilhaPanel cartoes={ativosOpt} />,
          },
          {
            id: "fatura",
            icon: "pdf",
            title: "Importar fatura",
            subtitle: "PDF com texto selecionável",
            content: <ImportPdfPanel cartoes={ativosOpt} />,
          },
          {
            id: "exportar",
            icon: "download",
            title: "Exportar",
            subtitle: "Planilha do orçamento e dos lançamentos",
            content: <ExportPanel />,
          },
          {
            id: "simulador",
            icon: "calendar",
            title: "Simulador de competência",
            subtitle: "Em qual mês a compra no cartão entra",
            content: (
              <CompetenciaSimulador
                cartoes={ativos.map((c) => ({
                  id: c.id,
                  apelido: c.apelido,
                  diaFechamento: c.diaFechamento,
                }))}
              />
            ),
          },
          {
            id: "arquivados",
            icon: "archive",
            title: "Itens arquivados",
            subtitle:
              arquivados.length === 0
                ? "Nenhum item arquivado"
                : `${arquivados.length} fora da lista ativa`,
            content: (
              <section className="aj-block">
                <h2 className="aj-h2">Itens arquivados</h2>
                <p className="aj-help">
                  Arquivados não entram em novos lançamentos nem na lista ativa do Orçamento. O
                  histórico permanece quando houver lançamentos.
                </p>
                {arquivados.length === 0 ? (
                  <p className="aj-msg">Nenhum item arquivado.</p>
                ) : (
                  <ul className="aj-arch-list">
                    {arquivados.map((i) => (
                      <li key={i.id}>
                        <span className="aj-arch-tipo">
                          {TIPOS_LABEL[i.tipo as TipoOrcamento] ?? i.tipo}
                        </span>
                        {i.grupo} · {i.nome}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ),
          },
          {
            id: "exemplo",
            icon: "science",
            title: "Dados de exemplo",
            subtitle: "Preenche o orçamento com um mês de demonstração",
            content: <CarregarExemploButton />,
          },
          {
            id: "excluir",
            icon: "delete",
            title: "Excluir conta",
            subtitle: "Apaga a conta e todos os dados",
            danger: true,
            content: <ExcluirContaPanel email={session.user.email} />,
          },
        ]}
      />
      {process.env.NODE_ENV !== "production" ? (
        <p className="aj-note">
          Dev: PGlite em data/pglite (persiste). Login demo — demo@local.test / demo1234.
        </p>
      ) : null}
    </main>
  );
}
