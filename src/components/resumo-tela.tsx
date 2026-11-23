"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BlocoSaldo,
  Botao,
  CartaoVazio,
  Chips,
  GradeTotais,
  GraficoSemanas,
  Icone,
  LinhaLancamento,
  Painel,
  Select,
} from "@meu-orcamento/design-system";
import type { AlertaMes } from "@/domain/alertas";
import type { ItemDoMes } from "@/domain/resumo-mes";
import {
  hrefOrcamentoMes,
  hrefResumo,
  montarResumo,
  type FiltrosResumo,
  type LancFiltro,
  type TipoFiltro,
} from "./resumo-filtro";

const CHAVE_OCULTAR = "mo-ocultar-valores";

const TIPOS: { valor: TipoFiltro; rotulo: string }[] = [
  { valor: "todas", rotulo: "Todas" },
  { valor: "R", rotulo: "Receitas" },
  { valor: "F", rotulo: "Fixas" },
  { valor: "V", rotulo: "Variáveis" },
  { valor: "E", rotulo: "Anuais" },
];

export type ResumoTelaProps = {
  competencia: string;
  hoje: string;
  itens: ItemDoMes[];
  lancamentos: LancFiltro[];
  cartoes: { id: string; apelido: string }[];
  grupos: string[];
  alertas: AlertaMes[];
  filtros: FiltrosResumo;
};

type PainelAberto = { tipo: "alertas" } | { tipo: "semana"; indice: number } | null;

function rotuloMeio(meio: string, cartaoId: string | null, cartoes: { id: string; apelido: string }[]): string {
  if (meio === "deb") return "Débito";
  if (meio === "pix") return "PIX";
  if (meio === "din") return "Dinheiro";
  if (meio === "cartao" || cartaoId) return cartoes.find((cartao) => cartao.id === cartaoId)?.apelido ?? "Cartão";
  return meio;
}

export function ResumoTela({
  competencia,
  hoje,
  itens,
  lancamentos,
  cartoes,
  grupos,
  alertas,
  filtros,
}: ResumoTelaProps) {
  const router = useRouter();
  const [ocultado, setOcultado] = useState(false);
  const [painel, setPainel] = useState<PainelAberto>(null);
  const modelo = montarResumo({ competencia, hoje, itens, lancamentos, filtros });

  useEffect(() => {
    setOcultado(window.localStorage.getItem(CHAVE_OCULTAR) === "1");
  }, []);

  function alternarOcultar() {
    const proximo = !ocultado;
    setOcultado(proximo);
    if (proximo) window.localStorage.setItem(CHAVE_OCULTAR, "1");
    else window.localStorage.removeItem(CHAVE_OCULTAR);
  }

  function ir(parcial: Partial<FiltrosResumo>) {
    router.push(hrefResumo(competencia, { ...filtros, ...parcial }));
  }

  if (modelo.vazio) {
    return (
      <CartaoVazio
        titulo="Nenhuma receita neste mês"
        frase="Defina as receitas para acompanhar o disponível."
        acao={{ rotulo: "Definir receitas", onPress: () => router.push(hrefOrcamentoMes(competencia, "R")) }}
      />
    );
  }

  const pagamentos = [
    { valor: "todas", rotulo: "Todas" },
    { valor: "deb", rotulo: "Débito" },
    { valor: "pix", rotulo: "PIX" },
    { valor: "din", rotulo: "Dinheiro" },
    ...cartoes.map((cartao) => ({ valor: `cartao:${cartao.id}`, rotulo: cartao.apelido })),
  ];
  const semana = painel?.tipo === "semana" ? modelo.semanas[painel.indice] : undefined;

  return (
    <div className="mo-resumo">
      <div className="mo-resumo__ferramentas">
        <button
          type="button"
          className="mo-resumo__sino"
          aria-label={alertas.length > 0 ? `Alertas, ${alertas.length}` : "Alertas"}
          onClick={() => setPainel({ tipo: "alertas" })}
        >
          <Icone nome="notifications" tamanho={20} />
          {alertas.length > 0 ? <span>{alertas.length}</span> : null}
        </button>
      </div>
      <BlocoSaldo
        rotulo="Disponível neste mês"
        valorCentavos={modelo.disponivelCentavos}
        percentualUsado={modelo.percentual}
        fraseApoio={modelo.frase}
        ocultado={ocultado}
        onAlternarOcultar={alternarOcultar}
      />
      <GradeTotais
        ocultado={ocultado}
        itens={modelo.cartoes.map((cartao) => ({
          rotulo: cartao.rotulo,
          realizadoCentavos: cartao.realizadoCentavos,
          planejadoCentavos: cartao.planejadoCentavos,
        }))}
        onAbrir={(rotulo) => {
          const cartao = modelo.cartoes.find((item) => item.rotulo === rotulo);
          if (cartao) router.push(hrefOrcamentoMes(competencia, cartao.tipo));
        }}
      />
      <div className="mo-resumo__filtros">
        <Chips rotuloGrupo="Tipo" opcoes={TIPOS} selecionado={filtros.tipo} onSelecionar={(valor) => ir({ tipo: valor })} />
        <Chips
          rotuloGrupo="Pagamento"
          opcoes={pagamentos}
          selecionado={filtros.pagamento}
          onSelecionar={(valor) => ir({ pagamento: valor })}
        />
        <Select
          id="resumo-categoria"
          rotulo="Categoria"
          valor={filtros.categoria}
          grupos={[
            {
              rotulo: "Categorias",
              opcoes: [{ valor: "todas", rotulo: "Todas" }, ...grupos.map((grupo) => ({ valor: grupo, rotulo: grupo }))],
            },
          ]}
          onMudar={(valor) => ir({ categoria: valor })}
        />
        <div className="mo-resumo__limpar">
          <Botao variante="secundario" onPress={() => router.push(hrefResumo(competencia, filtros, true))}>
            Limpar filtros
          </Botao>
        </div>
      </div>
      <GraficoSemanas
        semanas={modelo.semanas}
        mediaCentavos={modelo.mediaCentavos}
        ocultado={ocultado}
        onVerDetalhes={(indice) => setPainel({ tipo: "semana", indice })}
      />
      <Painel aberto={painel?.tipo === "alertas"} titulo="Alertas" onFechar={() => setPainel(null)}>
        {alertas.length === 0 ? (
          <p className="mo-painel__vazio">Nenhum alerta neste mês.</p>
        ) : (
          <ul className="mo-painel__lista">
            {alertas.map((alerta, indice) => (
              <li key={`${alerta.msg}-${indice}`}>
                <a href={`/app/orcamento?mes=${competencia}`}>{alerta.msg}</a>
              </li>
            ))}
          </ul>
        )}
      </Painel>
      <Painel aberto={semana !== undefined} titulo={semana?.nome ?? "Semana"} onFechar={() => setPainel(null)}>
        {semana && semana.lancamentos.length === 0 ? (
          <p className="mo-painel__vazio">Nenhum lançamento nesta semana.</p>
        ) : (
          semana?.lancamentos.map((lancamento, indice) => (
            <LinhaLancamento
              key={`${lancamento.data}-${lancamento.descricao}-${indice}`}
              descricao={lancamento.descricao}
              valorCentavos={lancamento.valorCentavos}
              dataIso={lancamento.data}
              item={lancamento.item}
              meio={rotuloMeio(lancamento.meio, lancamento.cartaoId, cartoes)}
              ocultado={ocultado}
            />
          ))
        )}
      </Painel>
    </div>
  );
}
