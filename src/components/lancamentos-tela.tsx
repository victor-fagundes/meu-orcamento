"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Campo,
  CampoBusca,
  CampoData,
  CampoMoeda,
  CartaoVazio,
  Dialogo,
  FormularioContainer,
  Select,
  Snackbar,
  Switch,
  Tabela,
} from "@meu-orcamento/design-system";
import {
  criarLancamentoAction,
  desfazerExclusaoAction,
  editarLancamentoAction,
  excluirLancamentoAction,
  type RemovedLancamentoDTO,
} from "@/app/actions/lancamentos";
import { competenciaMeio, type MeioPagamento } from "@/domain/competencia";
import { planDeleteLancamento, type DeleteScope } from "@/domain/delete-lancamento";
import type { LancamentoRow } from "@/domain/edit-lancamento";
import { buildLancamentoDraft } from "@/domain/lancamentos";
import {
  filtrarLancamentos,
  textoData,
  textoFaturaSe,
  textoMes,
  textoMesAno,
  textoParcela,
  textoPrevia,
  textoValor,
} from "@/domain/lancamentos-lista";

const CHAVE_OCULTAR = "mo-ocultar-valores";
const MASCARA = "R$ •••••";

const COLUNAS = [
  { id: "data", rotulo: "Data", tipo: "texto" as const },
  { id: "descricao", rotulo: "Descrição", tipo: "texto" as const },
  { id: "item", rotulo: "Item", tipo: "texto" as const },
  { id: "pagamento", rotulo: "Pagamento", tipo: "texto" as const },
  { id: "valor", rotulo: "Valor", tipo: "numero" as const },
];

const ORDEM_ITENS = [
  { tipo: "R", rotulo: "Receitas" },
  { tipo: "F", rotulo: "Fixas" },
  { tipo: "V", rotulo: "Variáveis" },
  { tipo: "E", rotulo: "Anuais" },
] as const;

const PAGAMENTOS = [
  { valor: "deb", rotulo: "Débito" },
  { valor: "pix", rotulo: "Pix" },
  { valor: "din", rotulo: "Dinheiro" },
  { valor: "credito", rotulo: "Crédito" },
] as const;

type PagamentoForm = (typeof PAGAMENTOS)[number]["valor"];

export type ItemTela = {
  id: string;
  tipo: string;
  grupo: string;
  nome: string;
};

export type CartaoTela = {
  id: string;
  apelido: string;
  diaFechamento: number | null;
};

export type LinhaTela = {
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
  itemNome: string;
  itemGrupo: string;
  itemTipo: string;
  itemArquivado: boolean;
  cartaoApelido: string | null;
  cartaoFechamento: number | null;
};

type Erros = {
  item?: string;
  valor?: string;
  data?: string;
  cartao?: string;
  parcelas?: string;
  acao?: string;
};

type Painel = { modo: "novo" } | { modo: "editar"; id: string };

type Aviso =
  | { tipo: "salvo"; ate: number }
  | { tipo: "desfazer"; ate: number; removed: RemovedLancamentoDTO[]; count: number; falha: boolean };

export type LancamentosTelaProps = {
  competencia: string;
  linhas: LinhaTela[];
  irmas: LancamentoRow[];
  itens: ItemTela[];
  cartoes: CartaoTela[];
};

function hojeISO(): string {
  const data = new Date();
  return `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}-${String(data.getDate()).padStart(2, "0")}`;
}

function dataValida(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const [ano, mes, dia] = iso.split("-").map(Number);
  if (ano === undefined || mes === undefined || dia === undefined) return false;
  const data = new Date(ano, mes - 1, dia);
  return data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
}

function centavosParaEntrada(centavos: number): string {
  const inteiro = Math.trunc(centavos);
  const absoluto = Math.abs(inteiro);
  const reais = Math.trunc(absoluto / 100);
  const cent = absoluto % 100;
  return `${inteiro < 0 ? "-" : ""}${reais},${String(cent).padStart(2, "0")}`;
}

function paraRow(linha: LinhaTela): LancamentoRow {
  return {
    id: linha.id,
    itemId: linha.itemId,
    cartaoId: linha.cartaoId,
    descricao: linha.descricao,
    valorCentavos: linha.valorCentavos,
    dataTransacao: linha.dataTransacao,
    competencia: linha.competencia,
    meio: linha.meio,
    parcelaN: linha.parcelaN,
    parcelaTotal: linha.parcelaTotal,
    grupoParcelaId: linha.grupoParcelaId,
  };
}

function grupoDa(linha: LinhaTela, irmas: readonly LancamentoRow[]): LancamentoRow[] {
  if (!linha.grupoParcelaId) return [paraRow(linha)];
  const doGrupo = irmas.filter((irma) => irma.grupoParcelaId === linha.grupoParcelaId);
  if (doGrupo.some((irma) => irma.id === linha.id)) return doGrupo;
  return [paraRow(linha), ...doGrupo];
}

function rotuloPagamento(linha: LinhaTela): string {
  if (linha.meio === "deb") return "Débito";
  if (linha.meio === "pix") return "Pix";
  if (linha.meio === "din") return "Dinheiro";
  const apelido = linha.cartaoApelido?.trim();
  return apelido ? apelido : "Crédito";
}

function textoDescricao(linha: LinhaTela): string {
  const partes = [linha.descricao];
  const parcela = textoParcela(linha.parcelaN, linha.parcelaTotal);
  if (parcela) partes.push(parcela);
  const fatura = textoFaturaSe(linha.meio, linha.cartaoFechamento, linha.competencia);
  if (fatura) partes.push(fatura);
  return partes.join(" · ");
}

function gruposDeItens(itens: readonly ItemTela[]) {
  return ORDEM_ITENS.map((grupo) => ({
    rotulo: grupo.rotulo,
    opcoes: itens
      .filter((item) => item.tipo === grupo.tipo)
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
      .map((item) => ({ valor: item.id, rotulo: `${item.nome} · ${item.grupo}` })),
  })).filter((grupo) => grupo.opcoes.length > 0);
}

function itensComALinha(ativos: readonly ItemTela[], linha: LinhaTela | null): ItemTela[] {
  if (!linha || ativos.some((item) => item.id === linha.itemId)) return [...ativos];
  return [
    ...ativos,
    { id: linha.itemId, tipo: linha.itemTipo, grupo: linha.itemGrupo, nome: linha.itemNome },
  ];
}

function cartoesComALinha(ativos: readonly CartaoTela[], linha: LinhaTela | null): CartaoTela[] {
  if (!linha?.cartaoId || ativos.some((cartao) => cartao.id === linha.cartaoId)) return [...ativos];
  return [
    ...ativos,
    {
      id: linha.cartaoId,
      apelido: linha.cartaoApelido?.trim() || "Crédito",
      diaFechamento: linha.cartaoFechamento,
    },
  ];
}

function fraseSaem(quantidade: number): string {
  return quantidade === 1 ? "1 lançamento sai da lista." : `${quantidade} lançamentos saem da lista.`;
}

function mensagemDoAviso(aviso: Aviso): string {
  if (aviso.tipo === "salvo") return "Lançamento salvo.";
  if (aviso.falha) return "Não foi possível desfazer. A exclusão continua.";
  return aviso.count === 1 ? "Lançamento excluído." : `${aviso.count} lançamentos excluídos.`;
}

function pagamentoDaLinha(meio: string): PagamentoForm {
  if (meio === "pix" || meio === "din") return meio;
  if (meio === "cartao") return "credito";
  return "deb";
}

export function LancamentosTela({ competencia, linhas, irmas, itens, cartoes }: LancamentosTelaProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const itemFiltro = params.get("item") ?? "";
  const pagamentoFiltro = params.get("pagamento") ?? "";
  const [textoBusca, setTextoBusca] = useState(q);

  const [ocultar, setOcultar] = useState(false);
  const [painel, setPainel] = useState<Painel | null>(null);
  const [dialogo, setDialogo] = useState<null | "corrigir" | "excluir">(null);
  const [itemId, setItemId] = useState<string | null>(null);
  const [valor, setValor] = useState<number | null>(null);
  const [data, setData] = useState("");
  const [descricao, setDescricao] = useState("");
  const [pagamento, setPagamento] = useState<PagamentoForm>("deb");
  const [cartaoId, setCartaoId] = useState<string | null>(null);
  const [parcelar, setParcelar] = useState(false);
  const [parcelasTexto, setParcelasTexto] = useState("2");
  const [erros, setErros] = useState<Erros>({});
  const [gravando, setGravando] = useState(false);
  const [escopoEditar, setEscopoEditar] = useState<"one" | "future" | null>(null);
  const [escopoExcluir, setEscopoExcluir] = useState<DeleteScope | null>(null);
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const origem = useRef("registrar");
  const focoPendente = useRef<string | null>(null);

  useEffect(() => {
    setOcultar(window.localStorage.getItem(CHAVE_OCULTAR) === "1");
  }, []);

  useEffect(() => {
    setTextoBusca(q);
  }, [q]);

  useEffect(() => {
    if (!aviso) return undefined;
    const espera = aviso.ate - Date.now();
    const timer = window.setTimeout(() => setAviso(null), Math.max(0, espera));
    return () => window.clearTimeout(timer);
  }, [aviso]);

  useEffect(() => {
    if (painel) return;
    const id = focoPendente.current;
    if (!id) return;
    const elemento = id === "vazio"
      ? document.querySelector<HTMLElement>(".mo-cartao-vazio button")
      : document.getElementById(id);
    const destino = elemento ?? (id.startsWith("lancamento-") ? document.getElementById("registrar") : null);
    if (!destino) return;
    focoPendente.current = null;
    destino.focus();
  }, [painel, linhas]);

  useEffect(() => {
    if (!painel) return undefined;
    const aoVoltar = () => {
      setDialogo(null);
      setPainel(null);
    };
    window.addEventListener("popstate", aoVoltar);
    return () => window.removeEventListener("popstate", aoVoltar);
  }, [painel]);

  const linhaEdit = painel?.modo === "editar" ? linhas.find((linha) => linha.id === painel.id) ?? null : null;
  const novo = painel?.modo === "novo";
  const itensForm = itensComALinha(itens, novo ? null : linhaEdit);
  const cartoesForm = cartoesComALinha(cartoes, novo ? null : linhaEdit);
  const grupo = linhaEdit ? grupoDa(linhaEdit, irmas) : [];
  const formularioAberto = painel !== null && dialogo === null;

  function escreverQuery(parcial: Partial<Record<"q" | "item" | "pagamento", string>>) {
    const proximo = new URLSearchParams(params.toString());
    for (const chave of ["q", "item", "pagamento"] as const) {
      if (!(chave in parcial)) continue;
      const valorChave = parcial[chave];
      if (!valorChave) proximo.delete(chave);
      else proximo.set(chave, valorChave);
    }
    const texto = proximo.toString();
    router.replace(texto ? `${pathname}?${texto}` : pathname);
  }

  function mostrarSalvo() {
    setAviso((atual) => (atual?.tipo === "desfazer" ? atual : { tipo: "salvo", ate: Date.now() + 5000 }));
  }

  function abrirNovo(de: "registrar" | "vazio") {
    origem.current = de;
    setPainel({ modo: "novo" });
    setDialogo(null);
    setItemId(null);
    setValor(null);
    setData(hojeISO());
    setDescricao("");
    setPagamento("deb");
    setCartaoId(null);
    setParcelar(false);
    setParcelasTexto("2");
    setErros({});
  }

  function abrirEdicao(id: string) {
    const linha = linhas.find((atual) => atual.id === id);
    if (!linha) return;
    origem.current = `lancamento-${id}`;
    setPainel({ modo: "editar", id });
    setDialogo(null);
    setItemId(linha.itemId);
    setValor(linha.valorCentavos);
    setData(linha.dataTransacao.slice(0, 10));
    setDescricao(linha.descricao);
    setPagamento(pagamentoDaLinha(linha.meio));
    setCartaoId(linha.cartaoId);
    setParcelar(false);
    setParcelasTexto("2");
    setErros({});
  }

  function fecharPainel() {
    focoPendente.current = painel?.modo === "editar" ? `lancamento-${painel.id}` : origem.current;
    setDialogo(null);
    setPainel(null);
  }

  function validar(): Erros | null {
    const achados: Erros = {};
    if (!itemId) achados.item = "Selecione o item.";
    if (valor == null || valor <= 0) achados.valor = "Informe um valor maior que zero.";
    if (!dataValida(data)) achados.data = "Data inválida.";
    if (pagamento === "credito" && !cartaoId) achados.cartao = "Selecione o cartão.";
    if (novo && pagamento === "credito" && parcelar) {
      if (!/^\d+$/.test(parcelasTexto.trim())) {
        achados.parcelas = "Parcelas devem ser entre 1 e 60.";
      } else {
        const n = Number(parcelasTexto);
        if (n < 1 || n > 60) achados.parcelas = "Parcelas devem ser entre 1 e 60.";
      }
    }
    return Object.keys(achados).length > 0 ? achados : null;
  }

  async function criar() {
    const achados = validar();
    if (achados) {
      setErros(achados);
      return;
    }
    const item = itensForm.find((atual) => atual.id === itemId);
    if (!item || valor == null) return;
    const n = pagamento === "credito" && parcelar ? Number(parcelasTexto) : 1;
    setGravando(true);
    const res = await criarLancamentoAction({
      itemId: item.id,
      descricao: descricao.trim() ? descricao : undefined,
      valorBRL: centavosParaEntrada(valor),
      dataISO: data,
      pagamento: pagamento === "credito" ? (cartaoId ?? "") : pagamento,
      parcelas: n,
    });
    setGravando(false);
    if (!res.ok) {
      setErros({ acao: "Não foi possível salvar. Os campos continuam preenchidos." });
      return;
    }
    focoPendente.current = "registrar";
    setPainel(null);
    mostrarSalvo();
    router.refresh();
  }

  async function gravar(scope: "one" | "future") {
    const achados = validar();
    if (achados || !linhaEdit || valor == null || !itemId) {
      if (achados) setErros(achados);
      setDialogo(null);
      return;
    }
    const cartao = cartoesForm.find((atual) => atual.id === cartaoId);
    const meio: MeioPagamento = pagamento === "credito" ? "cartao" : pagamento;
    setGravando(true);
    const res = await editarLancamentoAction({
      id: linhaEdit.id,
      itemId,
      descricao: descricao.trim() ? descricao : undefined,
      valorBRL: centavosParaEntrada(valor),
      dataISO: data,
      pagamento: pagamento === "credito" ? (cartaoId ?? "") : pagamento,
      scope,
    });
    setGravando(false);
    if (!res.ok) {
      setErros({ acao: "Não foi possível salvar. Os campos continuam preenchidos." });
      setDialogo(null);
      return;
    }
    const competenciaNova = competenciaMeio(data, meio, cartao?.diaFechamento ?? null);
    focoPendente.current = competenciaNova === competencia ? `lancamento-${linhaEdit.id}` : "registrar";
    setDialogo(null);
    setPainel(null);
    mostrarSalvo();
    router.refresh();
  }

  function aoSalvar() {
    const achados = validar();
    if (achados) {
      setErros(achados);
      return;
    }
    if (painel?.modo === "editar" && grupo.length > 1) {
      setEscopoEditar(null);
      setDialogo("corrigir");
      return;
    }
    if (painel?.modo === "editar") {
      void gravar("one");
      return;
    }
    void criar();
  }

  async function confirmarExclusao() {
    if (!linhaEdit) return;
    if (grupo.length > 1 && !escopoExcluir) return;
    const scope: DeleteScope = grupo.length > 1 ? (escopoExcluir ?? "one") : "one";
    setGravando(true);
    const res = await excluirLancamentoAction({ id: linhaEdit.id, scope });
    setGravando(false);
    if (!res.ok) {
      setErros({ acao: "Não foi possível excluir. O lançamento continua na lista." });
      setDialogo(null);
      window.requestAnimationFrame(() => document.getElementById("excluir-lancamento")?.focus());
      return;
    }
    focoPendente.current = "registrar";
    setDialogo(null);
    setPainel(null);
    setAviso({
      tipo: "desfazer",
      ate: Date.now() + 10000,
      removed: res.removed,
      count: res.count,
      falha: false,
    });
    router.refresh();
  }

  async function desfazer() {
    if (!aviso || aviso.tipo !== "desfazer") return;
    const res = await desfazerExclusaoAction(aviso.removed);
    if (!res.ok) {
      setAviso((atual) => (atual && atual.tipo === "desfazer" ? { ...atual, falha: true } : atual));
      return;
    }
    setAviso(null);
    setDialogo(null);
    setPainel(null);
    router.refresh();
  }

  const visiveis = filtrarLancamentos(linhas, textoBusca, itemFiltro, pagamentoFiltro);
  const mesVazio = linhas.length === 0 && textoBusca.trim() === "" && q.trim() === "";
  const buscaVazia = textoBusca.trim() !== "" && visiveis.length === 0;
  const filtroVazio = !mesVazio && textoBusca.trim() === "" && visiveis.length === 0;
  const itensFiltro = [...new Map(linhas.map((linha) => [linha.itemId, linha.itemNome])).entries()]
    .map(([valorOpcao, rotulo]) => ({ valor: valorOpcao, rotulo }))
    .sort((a, b) => a.rotulo.localeCompare(b.rotulo, "pt-BR"));

  const itemSelecionado = itensForm.find((item) => item.id === itemId) ?? null;
  const cartaoSelecionado = cartoesForm.find((cartao) => cartao.id === cartaoId) ?? null;
  const quantidadeParcelas = novo && pagamento === "credito" && parcelar ? Number(parcelasTexto) : 1;
  const parcelasValidas = Number.isInteger(quantidadeParcelas) && quantidadeParcelas >= 1 && quantidadeParcelas <= 60;
  const draft = novo && itemSelecionado && valor != null && valor > 0 && dataValida(data) && parcelasValidas && (pagamento !== "credito" || cartaoId)
    ? buildLancamentoDraft({
        itemId: itemSelecionado.id,
        itemNome: itemSelecionado.nome,
        itemTipo: itemSelecionado.tipo,
        descricao,
        valorBRL: centavosParaEntrada(valor),
        dataISO: data,
        pagamento: pagamento === "credito" ? (cartaoId ?? "") : pagamento,
        parcelas: quantidadeParcelas,
        diaFechamentoCartao: cartaoSelecionado?.diaFechamento ?? null,
      })
    : null;
  const previa = draft && draft.ok
    ? textoPrevia(draft.parcelas, {
        cartao: pagamento === "credito",
        diaFechamento: cartaoSelecionado?.diaFechamento ?? null,
      })
    : null;
  const descricaoDialogo = descricao.trim() || itemSelecionado?.nome || linhaEdit?.descricao || "";
  const planoExclusao = linhaEdit && escopoExcluir
    ? planDeleteLancamento(paraRow(linhaEdit), grupo, escopoExcluir)
    : null;

  return (
    <main id="conteudo" className="mo-lancamentos">
      <div className="mo-lancamentos__topo">
        <button id="registrar" type="button" className="mo-botao mo-botao--primario" onClick={() => abrirNovo("registrar")}>
          Registrar
        </button>
      </div>

      {mesVazio ? (
        <CartaoVazio
          titulo={`Nenhum lançamento em ${textoMes(competencia)}`}
          frase="Registre cada gasto ou receita para acompanhar o que já foi usado no mês."
          acao={{ rotulo: "Registrar lançamento", onPress: () => abrirNovo("vazio") }}
        />
      ) : (
        <div className="mo-lancamentos__filtros">
          <CampoBusca
            id="busca-lancamentos"
            rotulo="Buscar por descrição"
            valor={textoBusca}
            rotuloLimpar="Limpar busca"
            controlesId="tabela-lancamentos"
            onMudar={(texto) => {
              setTextoBusca(texto);
              escreverQuery({ q: texto });
            }}
          />
          <Select
            id="filtro-item"
            rotulo="Item"
            valor={itemFiltro}
            grupos={[{ rotulo: "Itens", opcoes: [{ valor: "", rotulo: "Todos os itens" }, ...itensFiltro] }]}
            onMudar={(valorEscolhido) => escreverQuery({ item: valorEscolhido })}
          />
          <Select
            id="filtro-pagamento"
            rotulo="Pagamento"
            valor={pagamentoFiltro}
            grupos={[{
              rotulo: "Pagamentos",
              opcoes: [
                { valor: "", rotulo: "Todos os pagamentos" },
                { valor: "deb", rotulo: "Débito" },
                { valor: "pix", rotulo: "Pix" },
                { valor: "din", rotulo: "Dinheiro" },
                { valor: "cartao", rotulo: "Crédito" },
              ],
            }]}
            onMudar={(valorEscolhido) => escreverQuery({ pagamento: valorEscolhido })}
          />
        </div>
      )}

      <div id="tabela-lancamentos" className="mo-lancamentos__resultado">
        {visiveis.length > 0 ? (
          <Tabela
            caption={`Lançamentos de ${textoMesAno(competencia)}`}
            colunas={COLUNAS}
            linhas={visiveis.map((linha) => ({
              id: linha.id,
              nomeAcao: `Editar ${linha.descricao}`,
              celulas: {
                data: textoData(linha.dataTransacao),
                descricao: textoDescricao(linha),
                item: linha.itemNome,
                pagamento: rotuloPagamento(linha),
                valor: ocultar ? MASCARA : textoValor(linha.valorCentavos),
              },
            }))}
            onSelecionar={abrirEdicao}
          />
        ) : null}
        {buscaVazia ? (
          <>
            <p>{`Nenhum resultado para "${textoBusca.trim()}"`}</p>
            <p>Confira a descrição ou limpe a busca para ver todos os lançamentos.</p>
          </>
        ) : null}
        {filtroVazio ? <p>Nenhum lançamento com esses filtros.</p> : null}
      </div>

      <FormularioContainer
        aberto={formularioAberto}
        titulo={novo ? "Registrar lançamento" : "Editar lançamento"}
        textoSalvar="Salvar"
        salvarDesabilitado={gravando}
        onCancelar={fecharPainel}
        onSalvar={aoSalvar}
      >
        <div key={painel?.modo === "editar" ? painel.id : "novo"}>
          <Select
            id="item"
            rotulo="Item"
            valor={itemId}
            placeholder="Escolha"
            erro={erros.item}
            grupos={gruposDeItens(itensForm)}
            onMudar={(valorEscolhido) => {
              setItemId(valorEscolhido);
              setErros((atual) => ({ ...atual, item: undefined, acao: undefined }));
            }}
          />
          <CampoMoeda
            id="valor"
            rotulo="Valor (R$)"
            valor={valor}
            erro={erros.valor}
            onMudar={(centavos) => {
              setValor(centavos);
              setErros((atual) => ({ ...atual, valor: undefined, acao: undefined }));
            }}
          />
          <CampoData
            id="data"
            rotulo="Data"
            valor={data}
            erro={erros.data}
            onMudar={(valorEscolhido) => {
              setData(valorEscolhido);
              setErros((atual) => ({ ...atual, data: undefined, acao: undefined }));
            }}
          />
          <Campo
            id="descricao"
            rotulo="Descrição"
            valor={descricao}
            onMudar={(valorEscolhido) => {
              setDescricao(valorEscolhido);
              setErros((atual) => ({ ...atual, acao: undefined }));
            }}
          />
          <Select
            id="pagamento"
            rotulo="Pagamento"
            valor={pagamento}
            grupos={[{ rotulo: "Formas", opcoes: [...PAGAMENTOS] }]}
            onMudar={(valorEscolhido) => {
              const proximo = valorEscolhido === "pix" || valorEscolhido === "din" || valorEscolhido === "credito" ? valorEscolhido : "deb";
              setPagamento(proximo);
              if (proximo !== "credito") {
                setCartaoId(null);
                setParcelar(false);
              }
              setErros((atual) => ({ ...atual, cartao: undefined, parcelas: undefined, acao: undefined }));
            }}
          />
          {pagamento === "credito" ? (
            cartoesForm.length === 0 ? (
              <p>Nenhum cartão ativo.</p>
            ) : (
              <Select
                id="cartao"
                rotulo="Cartão"
                valor={cartaoId}
                placeholder="Escolha"
                erro={erros.cartao}
                grupos={[{
                  rotulo: "Cartões",
                  opcoes: cartoesForm.map((cartao) => ({ valor: cartao.id, rotulo: cartao.apelido })),
                }]}
                onMudar={(valorEscolhido) => {
                  setCartaoId(valorEscolhido);
                  setErros((atual) => ({ ...atual, cartao: undefined, acao: undefined }));
                }}
              />
            )
          ) : null}
          {novo && pagamento === "credito" ? (
            <Switch id="parcelar" rotulo="Parcelar" marcado={parcelar} onMudar={(marcado) => {
              setParcelar(marcado);
              if (marcado) setParcelasTexto("2");
              setErros((atual) => ({ ...atual, parcelas: undefined, acao: undefined }));
            }} />
          ) : null}
          {novo && pagamento === "credito" && parcelar ? (
            <Campo
              id="parcelas"
              rotulo="Parcelas"
              valor={parcelasTexto}
              teclado="numerico"
              erro={erros.parcelas}
              onMudar={(valorEscolhido) => {
                setParcelasTexto(valorEscolhido);
                setErros((atual) => ({ ...atual, parcelas: undefined, acao: undefined }));
              }}
            />
          ) : null}
          {previa ? (
            <div className="mo-lancamentos__previa">
              {previa.titulo ? <p>{previa.titulo}</p> : null}
              {previa.linhas.map((linha) => <p key={linha}>{linha}</p>)}
              {previa.aviso ? <p>{previa.aviso}</p> : null}
            </div>
          ) : null}
          {erros.acao ? <p role="alert">{erros.acao}</p> : null}
          {painel?.modo === "editar" ? (
            <button
              id="excluir-lancamento"
              type="button"
              className="mo-botao mo-botao--destrutivo"
              onClick={() => {
                setEscopoExcluir(null);
                setDialogo("excluir");
              }}
            >
              Excluir lançamento
            </button>
          ) : null}
        </div>
      </FormularioContainer>

      {dialogo === "corrigir" && linhaEdit ? (
        <Dialogo
          aberto
          titulo="Corrigir parcelamento"
          descricao={`${descricaoDialogo} · parcela ${linhaEdit.parcelaN} de ${linhaEdit.parcelaTotal}. Escolha o alcance da correção.`}
          textoConfirmar="Salvar"
          tipoConfirmar="primario"
          confirmarDesabilitado={escopoEditar === null || gravando}
          onCancelar={() => setDialogo(null)}
          onConfirmar={() => {
            if (escopoEditar) void gravar(escopoEditar);
          }}
        >
          <fieldset className="mo-lancamentos__opcoes">
            <label>
              <input type="radio" name="alcance-edicao" checked={escopoEditar === "one"} onChange={() => setEscopoEditar("one")} />
              Só esta parcela
            </label>
            <label>
              <input type="radio" name="alcance-edicao" checked={escopoEditar === "future"} onChange={() => setEscopoEditar("future")} />
              Esta e as próximas
            </label>
          </fieldset>
        </Dialogo>
      ) : null}

      {dialogo === "excluir" && linhaEdit ? (
        <Dialogo
          aberto
          titulo={grupo.length > 1 ? "Excluir parcela?" : "Excluir lançamento?"}
          descricao={grupo.length > 1
            ? `${linhaEdit.descricao} · parcela ${linhaEdit.parcelaN} de ${linhaEdit.parcelaTotal}. Escolha o alcance da exclusão.`
            : "1 lançamento sai da lista. Você pode desfazer por 10 segundos."}
          textoConfirmar="Excluir lançamento"
          tipoConfirmar="destrutivo"
          confirmarDesabilitado={gravando || (grupo.length > 1 && escopoExcluir === null)}
          onCancelar={() => setDialogo(null)}
          onConfirmar={() => void confirmarExclusao()}
        >
          {grupo.length > 1 ? (
            <fieldset className="mo-lancamentos__opcoes">
              <label>
                <input type="radio" name="alcance-exclusao" checked={escopoExcluir === "one"} onChange={() => setEscopoExcluir("one")} />
                Só esta parcela
              </label>
              <label>
                <input type="radio" name="alcance-exclusao" checked={escopoExcluir === "future"} onChange={() => setEscopoExcluir("future")} />
                Esta e as próximas
              </label>
              <label>
                <input type="radio" name="alcance-exclusao" checked={escopoExcluir === "all"} onChange={() => setEscopoExcluir("all")} />
                Todas do parcelamento
              </label>
              {planoExclusao && planoExclusao.ok ? <p>{fraseSaem(planoExclusao.count)}</p> : null}
              <p>Você pode desfazer por 10 segundos.</p>
            </fieldset>
          ) : null}
        </Dialogo>
      ) : null}

      {aviso ? (
        <Snackbar
          mensagem={mensagemDoAviso(aviso)}
          onDesfazer={aviso.tipo === "desfazer" ? () => void desfazer() : undefined}
        />
      ) : null}
    </main>
  );
}
