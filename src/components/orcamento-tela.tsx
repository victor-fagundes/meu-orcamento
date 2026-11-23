"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Banner,
  Botao,
  CampoMoeda,
  CartaoVazio,
  Chips,
  Dialogo,
  FormularioContainer,
  GrupoComMedidor,
  LinhaItem,
  Switch,
} from "@meu-orcamento/design-system";
import { arquivarItemAction, criarItemAction } from "@/app/actions/itens";
import { salvarPlanoAction } from "@/app/actions/plano";
import {
  ROTULO_TIPO,
  TIPOS_ORCAMENTO,
  hrefAlternarCategoria,
  hrefDoTipo,
  type TipoOrcamentoLista,
} from "@/components/orcamento-query";
import { indiceMesAberto } from "@/components/arquivar-rotulo";
import { bannerFromAlertas, limiteDaCategoria, type AlertaMes, type LimitesConfig } from "@/domain/alertas";
import { AcoesNoCabecalho } from "@/components/slot-cabecalho";
import { validarNomeCategoria } from "@/domain/categorias";
import { categoriasDoTipo, textoDemaisAlertas, totalDoTipo } from "@/domain/orcamento-lista";
import {
  aplicarATodos,
  aplicarValorAoMes,
  aplicarValorAoMesESeguintes,
  copiarAnoAnterior,
  copiarMesAnterior,
  lerValorDoPlano,
} from "@/domain/plano";

const FALHA = "Não foi possível salvar. Os campos continuam preenchidos.";
const ERROS_CONHECIDOS = new Set([
  "Informe o nome da categoria.",
  "Use no máximo 40 caracteres.",
  "Use o nome em uma linha só.",
  "Escolha outro nome. Já existe uma categoria com esse nome neste tipo.",
  "Informe o nome do item.",
  "Categoria ou nome muito longo.",
]);

export type ItemTela = {
  id: string;
  tipo: string;
  grupo: string;
  nome: string;
  planoMes: number;
  realizadoMes: number;
  plano: number[];
};

type Painel = "item" | "plano" | null;

function textoDeErro(error: string): string {
  return ERROS_CONHECIDOS.has(error) ? error : FALHA;
}

function entradasDoPlano(plano: number[]): string[] {
  return plano.map((centavos) => {
    const valor = Math.max(0, Math.trunc(centavos));
    const reais = Math.trunc(valor / 100);
    const cent = valor % 100;
    return `${reais},${String(cent).padStart(2, "0")}`;
  });
}

function CampoNome({ id, valor, onMudar }: { id: string; valor: string; onMudar: (valor: string) => void }) {
  return (
    <div className="mo-campo">
      <label className="mo-campo__rotulo" htmlFor={id}>
        Nome
      </label>
      <input id={id} className="mo-campo__entrada" value={valor} onChange={(evento) => onMudar(evento.target.value)} />
    </div>
  );
}

export function OrcamentoTela({
  competencia,
  tipo,
  abertas,
  itens,
  alertas,
  limites,
}: {
  competencia: string;
  tipo: TipoOrcamentoLista;
  abertas: string[];
  itens: ItemTela[];
  alertas: AlertaMes[];
  limites: LimitesConfig;
}) {
  const router = useRouter();
  const [ocultado, setOcultado] = useState(false);
  const [painel, setPainel] = useState<Painel>(null);
  const [erro, setErro] = useState("");
  const [gravando, setGravando] = useState(false);
  const [nomeItem, setNomeItem] = useState("");
  const [categoriaItem, setCategoriaItem] = useState("");
  const [planoId, setPlanoId] = useState<string | null>(null);
  const [valorPlano, setValorPlano] = useState<number | null>(0);
  const [revisaoPlano, setRevisaoPlano] = useState(0);
  const [aplicarSeguintes, setAplicarSeguintes] = useState(false);
  const [arquivar, setArquivar] = useState<ItemTela | null>(null);

  useEffect(() => {
    setOcultado(window.localStorage.getItem("mo-ocultar-valores") === "1");
  }, [competencia]);

  const doTipo = itens.filter((item) => item.tipo === tipo);
  const categorias = categoriasDoTipo(
    doTipo.map((item) => ({
      nome: item.nome,
      grupo: item.grupo,
      realizadoCentavos: item.realizadoMes,
      planejadoCentavos: item.planoMes,
    })),
  );
  const total = totalDoTipo(
    doTipo.map((item) => ({
      nome: item.nome,
      grupo: item.grupo,
      realizadoCentavos: item.realizadoMes,
      planejadoCentavos: item.planoMes,
    })),
  );
  const sugestoes = [...new Set(doTipo.map((item) => item.grupo))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const banner = bannerFromAlertas(alertas);
  const demais = banner ? textoDemaisAlertas(banner.more) : null;
  const indice = indiceMesAberto(competencia);
  const itemPlano = itens.find((item) => item.id === planoId) ?? null;

  function fecharPainel() {
    setPainel(null);
    setErro("");
    setGravando(false);
  }

  async function salvarItem() {
    const categoria = validarNomeCategoria(categoriaItem);
    if (!categoria.ok) {
      setErro(categoria.error);
      return;
    }
    setGravando(true);
    const res = await criarItemAction({ tipo, grupo: categoria.nome, nome: nomeItem });
    setGravando(false);
    if (!res.ok) {
      setErro(textoDeErro(res.error));
      return;
    }
    const aberta = abertas.includes(categoria.nome) ? abertas : [...abertas, categoria.nome];
    fecharPainel();
    const params = new URLSearchParams();
    params.set("mes", competencia);
    params.set("tipo", tipo);
    for (const nome of aberta) params.append("aberta", nome);
    router.push(`/app/orcamento?${params.toString()}`);
    router.refresh();
  }

  function lerCampoDoPlano(): { ok: true; centavos: number } | { ok: false; error: string } {
    const campo = document.getElementById("plano-valor");
    const texto = campo instanceof HTMLInputElement ? campo.value : "";
    return lerValorDoPlano(texto);
  }

  async function gravarPlano(plano: number[], fechar: boolean) {
    if (!itemPlano) return;
    setGravando(true);
    const res = await salvarPlanoAction({ itemId: itemPlano.id, mesesBRL: entradasDoPlano(plano) });
    setGravando(false);
    if (!res.ok) {
      setErro(FALHA);
      return;
    }
    setErro("");
    setValorPlano(plano[indice] ?? 0);
    setRevisaoPlano((atual) => atual + 1);
    if (fechar) setPainel(null);
    router.refresh();
  }

  async function salvarPlano() {
    if (!itemPlano) return;
    const lido = lerCampoDoPlano();
    if (!lido.ok) {
      setErro(lido.error);
      return;
    }
    const proximo = aplicarSeguintes
      ? aplicarValorAoMesESeguintes(itemPlano.plano, indice, lido.centavos)
      : aplicarValorAoMes(itemPlano.plano, indice, lido.centavos);
    await gravarPlano(proximo, true);
  }

  async function copiarMes() {
    if (!itemPlano) return;
    if (indice < 1) {
      setErro("Janeiro não tem mês anterior neste ano.");
      return;
    }
    await gravarPlano(copiarMesAnterior(itemPlano.plano, indice), false);
  }

  async function aplicarTodos() {
    if (!itemPlano) return;
    const lido = lerCampoDoPlano();
    if (!lido.ok) {
      setErro(lido.error);
      return;
    }
    await gravarPlano(aplicarATodos(lido.centavos), false);
  }

  function copiarAno() {
    if (!itemPlano) return;
    const copia = copiarAnoAnterior(itemPlano.plano);
    if (!copia.available) setErro("Não há plano do ano anterior para copiar.");
  }

  async function confirmarArquivar() {
    if (!arquivar) return;
    setGravando(true);
    const res = await arquivarItemAction(arquivar.id);
    setGravando(false);
    if (!res.ok) {
      setErro(FALHA);
      return;
    }
    setArquivar(null);
    setErro("");
    router.refresh();
  }

  function abrirNovoItem() {
    setNomeItem("");
    setCategoriaItem("");
    setErro("");
    setPainel("item");
  }

  const realizadoVisivel = ocultado ? "R$ •••••" : total.realizado;
  const planejadoVisivel = ocultado ? "de R$ ••••• planejados" : total.planejado;

  return (
    <main id="conteudo">
      <AcoesNoCabecalho>
        <Botao variante="primario" onPress={abrirNovoItem}>
          {`Novo item em ${ROTULO_TIPO[tipo]}`}
        </Botao>
      </AcoesNoCabecalho>
      <Chips
        rotuloGrupo="Tipo"
        opcoes={TIPOS_ORCAMENTO.map((valor) => ({ valor, rotulo: ROTULO_TIPO[valor] }))}
        selecionado={tipo}
        onSelecionar={(valor) => {
          if (valor !== tipo) router.push(hrefDoTipo(competencia, valor));
        }}
      />
      {banner ? <Banner tipo={banner.nivel === "er" ? "erro" : "atencao"}>{banner.msg}</Banner> : null}
      {demais ? <p>{demais}</p> : null}
      <div className={painel === "plano" ? "mo-orcamento__corpo mo-orcamento__corpo--painel" : "mo-orcamento__corpo"}>
        <div className="mo-orcamento__lista">
          <p>
            {realizadoVisivel} {planejadoVisivel}
          </p>
          {doTipo.length === 0 ? (
            <CartaoVazio
              titulo="Nenhum item neste tipo"
              frase="Crie um item para planejar o mês."
              acao={{
                rotulo: "Criar primeiro item",
                onPress: abrirNovoItem,
              }}
            />
          ) : (
            categorias.map((categoria) => {
              const limite = limiteDaCategoria(limites, categoria.nome);
              return (
                <GrupoComMedidor
                  key={categoria.nome}
                  rotulo={categoria.nome}
                  realizadoCentavos={categoria.realizadoCentavos}
                  planejadoCentavos={categoria.planejadoCentavos}
                  aberto={abertas.includes(categoria.nome)}
                  limiteAtencao={limite}
                  ocultado={ocultado}
                  onAlternar={() => router.push(hrefAlternarCategoria(competencia, tipo, abertas, categoria.nome))}
                >
                  {categoria.itens.map((linha) => {
                    const item = doTipo.find((atual) => atual.nome === linha.nome && atual.grupo === categoria.nome);
                    if (!item) return null;
                    return (
                      <div key={item.id}>
                        <LinhaItem
                          nome={item.nome}
                          realizadoCentavos={item.realizadoMes}
                          planejadoCentavos={item.planoMes}
                          limiteAtencao={limite}
                          ocultado={ocultado}
                          onAbrir={() => {
                            setPlanoId(item.id);
                            setValorPlano(item.plano[indice] ?? 0);
                            setAplicarSeguintes(false);
                            setErro("");
                            setRevisaoPlano((atual) => atual + 1);
                            setPainel("plano");
                          }}
                        />
                        <button
                          type="button"
                          className="mo-botao mo-botao--texto"
                          aria-label={`Arquivar ${item.nome}`}
                          onClick={() => setArquivar(item)}
                        >
                          Arquivar
                        </button>
                      </div>
                    );
                  })}
                </GrupoComMedidor>
              );
            })
          )}
        </div>
        <FormularioContainer
          encaixado
          aberto={painel === "plano" && itemPlano !== null}
          titulo={itemPlano?.nome ?? "Plano"}
          textoSalvar="Salvar plano"
          salvarDesabilitado={gravando}
          onCancelar={fecharPainel}
          onSalvar={() => {
            void salvarPlano();
          }}
        >
          <CampoMoeda
            key={`${planoId ?? ""}-${revisaoPlano}`}
            id="plano-valor"
            rotulo="Valor do mês"
            valor={valorPlano}
            onMudar={setValorPlano}
            erro={erro || undefined}
          />
          <Switch
            id="aplicar-seguintes"
            rotulo="Aplicar também aos próximos meses"
            marcado={aplicarSeguintes}
            onMudar={setAplicarSeguintes}
          />
          <button type="button" className="mo-botao mo-botao--texto" onClick={() => void copiarMes()}>
            Copiar mês anterior
          </button>
          <button type="button" className="mo-botao mo-botao--texto" onClick={() => void aplicarTodos()}>
            Aplicar a todos os meses
          </button>
          <button type="button" className="mo-botao mo-botao--texto" onClick={copiarAno}>
            Copiar ano anterior
          </button>
        </FormularioContainer>
      </div>

      <FormularioContainer
        aberto={painel === "item"}
        titulo="Novo item"
        textoSalvar="Salvar"
        salvarDesabilitado={gravando}
        onCancelar={fecharPainel}
        onSalvar={() => {
          void salvarItem();
        }}
      >
        <CampoNome id="nome-item" valor={nomeItem} onMudar={setNomeItem} />
        <div className="mo-campo">
          <label className="mo-campo__rotulo" htmlFor="categoria-item">
            Categoria
          </label>
          <input
            id="categoria-item"
            className="mo-campo__entrada"
            list="categorias-do-tipo"
            value={categoriaItem}
            onChange={(evento) => setCategoriaItem(evento.target.value)}
          />
          <datalist id="categorias-do-tipo">
            {sugestoes.map((nome) => (
              <option key={nome} value={nome} />
            ))}
          </datalist>
        </div>
        {erro ? <p role="alert">{erro}</p> : null}
      </FormularioContainer>

      <Dialogo
        aberto={arquivar !== null}
        titulo={arquivar ? `Arquivar ${arquivar.nome}?` : "Arquivar?"}
        descricao="Ele sai do Orçamento e de novos lançamentos. Os lançamentos antigos continuam."
        textoConfirmar="Arquivar"
        tipoConfirmar="destrutivo"
        onCancelar={() => setArquivar(null)}
        onConfirmar={() => {
          void confirmarArquivar();
        }}
      />
    </main>
  );
}
