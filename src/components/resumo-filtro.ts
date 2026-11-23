import { formatBRL } from "@/domain/money";
import type { ItemDoMes } from "@/domain/resumo-mes";
import { totaisDoMes } from "@/domain/resumo-mes";
import {
  divisorDaMedia,
  fraseDoResumo,
  mediaDiariaCentavos,
  mesVazio,
  semanasDoGasto,
  type LinhaSemana,
  type SemanaResumo,
} from "@/domain/resumo-semana";

const TIPOS = new Set(["R", "F", "V", "E"]);

export function textoFiltroResumo(input: {
  ativo: boolean;
  saldoMesCentavos: number;
  gastoRecorteCentavos: number;
  rotuloFiltro: string;
}): string | null {
  if (!input.ativo) return null;
  return `No ${input.rotuloFiltro} foram ${formatBRL(input.gastoRecorteCentavos)}. O mês inteiro ainda pode gastar ${formatBRL(input.saldoMesCentavos)}.`;
}

export function hrefOrcamentoMes(mes: string, tipo: string): string {
  const safe = TIPOS.has(tipo) ? tipo : "F";
  return `/app/orcamento?mes=${mes}&tipo=${safe}`;
}

export type TipoFiltro = "todas" | "R" | "F" | "V" | "E";

export type FiltrosResumo = {
  tipo: TipoFiltro;
  pagamento: string;
  categoria: string;
};

export type LancFiltro = {
  itemId: string;
  valorCentavos: number;
  itemTipo: string;
  itemGrupo: string;
  meio: string;
  cartaoId: string | null;
  data: string;
  descricao: string;
  item: string;
};

export type CartaoResumo = {
  tipo: "R" | "F" | "V" | "E";
  rotulo: string;
  realizadoCentavos: number;
  planejadoCentavos: number | null;
};

const ROTULOS_CARTAO: CartaoResumo[] = [
  { tipo: "R", rotulo: "Receitas", realizadoCentavos: 0, planejadoCentavos: 0 },
  { tipo: "F", rotulo: "Fixas", realizadoCentavos: 0, planejadoCentavos: 0 },
  { tipo: "V", rotulo: "Variáveis", realizadoCentavos: 0, planejadoCentavos: 0 },
  { tipo: "E", rotulo: "Anuais", realizadoCentavos: 0, planejadoCentavos: 0 },
];

const PAGAMENTOS = new Set(["deb", "pix", "din"]);

export function lerFiltrosResumo(
  query: { tipo?: string | null; pagamento?: string | null; categoria?: string | null },
  grupos: readonly string[],
  cartaoIds: readonly string[],
): FiltrosResumo {
  const tipo: TipoFiltro =
    query.tipo === "R" || query.tipo === "F" || query.tipo === "V" || query.tipo === "E" ? query.tipo : "todas";
  const pedido = query.pagamento ?? "";
  let pagamento = "todas";
  if (PAGAMENTOS.has(pedido)) pagamento = pedido;
  else if (pedido.startsWith("cartao:") && cartaoIds.includes(pedido.slice("cartao:".length))) pagamento = pedido;
  const categoria = query.categoria && grupos.includes(query.categoria) ? query.categoria : "todas";
  return { tipo, pagamento, categoria };
}

export function hrefResumo(mes: string, filtros: FiltrosResumo, limpar = false): string {
  const params = new URLSearchParams();
  if (mes) params.set("mes", mes);
  if (!limpar) {
    if (filtros.tipo !== "todas") params.set("tipo", filtros.tipo);
    if (filtros.pagamento !== "todas") params.set("pagamento", filtros.pagamento);
    if (filtros.categoria !== "todas") params.set("categoria", filtros.categoria);
  }
  const texto = params.toString();
  return texto ? `/app/resumo?${texto}` : "/app/resumo";
}

export function cartoesDoResumo(
  porTipo: readonly { tipo: string; realizadoCentavos: number; planoCentavos: number }[],
  pagamentoTodas: boolean,
): CartaoResumo[] {
  return ROTULOS_CARTAO.map((cartao) => {
    const linha = porTipo.find((item) => item.tipo === cartao.tipo);
    return {
      tipo: cartao.tipo,
      rotulo: cartao.rotulo,
      realizadoCentavos: linha?.realizadoCentavos ?? 0,
      planejadoCentavos: pagamentoTodas ? (linha?.planoCentavos ?? 0) : null,
    };
  });
}

function casaPagamento(lancamento: Pick<LancFiltro, "meio" | "cartaoId">, pagamento: string): boolean {
  if (pagamento === "todas") return true;
  if (pagamento.startsWith("cartao:")) return lancamento.cartaoId === pagamento.slice("cartao:".length);
  return lancamento.meio === pagamento;
}

export type ModeloResumo = {
  vazio: boolean;
  disponivelCentavos: number | null;
  percentual: number | null;
  frase: string;
  cartoes: CartaoResumo[];
  semanas: SemanaResumo[];
  mediaCentavos: number;
};

export function montarResumo(input: {
  competencia: string;
  hoje: string;
  itens: readonly ItemDoMes[];
  lancamentos: readonly LancFiltro[];
  filtros: FiltrosResumo;
}): ModeloResumo {
  const planoReceitas = input.itens
    .filter((item) => item.tipo === "R")
    .reduce((soma, item) => soma + item.planoMesCentavos, 0);
  const vazio = mesVazio(planoReceitas, input.lancamentos.length);

  const itensCategoria =
    input.filtros.categoria === "todas"
      ? input.itens
      : input.itens.filter((item) => item.grupo === input.filtros.categoria);
  const porCategoria =
    input.filtros.categoria === "todas"
      ? input.lancamentos
      : input.lancamentos.filter((lancamento) => lancamento.itemGrupo === input.filtros.categoria);
  const pagamentoTodas = input.filtros.pagamento === "todas";
  const porPagamento = pagamentoTodas
    ? porCategoria
    : porCategoria.filter((lancamento) => casaPagamento(lancamento, input.filtros.pagamento));

  const totaisCategoria = totaisDoMes([...itensCategoria], [...porCategoria]);
  const totaisGasto = pagamentoTodas ? totaisCategoria : totaisDoMes([...itensCategoria], [...porPagamento]);
  const apoio = fraseDoResumo({
    gastoCentavos: totaisCategoria.totalGastoDespesasCentavos,
    planejadoCentavos: totaisCategoria.totalOrcadoDespesasCentavos,
    competencia: input.competencia,
    hoje: input.hoje,
    pagamentoTodas,
  });

  const linhas: LinhaSemana[] = porPagamento.map((lancamento) => ({
    data: lancamento.data,
    descricao: lancamento.descricao,
    valorCentavos: lancamento.valorCentavos,
    tipo: lancamento.itemTipo,
    item: lancamento.item,
    meio: lancamento.meio,
    cartaoId: lancamento.cartaoId,
  }));
  const semanas = semanasDoGasto({
    competencia: input.competencia,
    tipo: input.filtros.tipo,
    lancamentos: linhas,
  });
  const gasto = semanas.reduce((soma, semana) => soma + semana.valorCentavos, 0);

  return {
    vazio,
    disponivelCentavos: pagamentoTodas ? totaisCategoria.aindaPodeGastarCentavos : null,
    percentual: apoio.percentual,
    frase: apoio.frase,
    cartoes: cartoesDoResumo(pagamentoTodas ? totaisCategoria.porTipo : totaisGasto.porTipo, pagamentoTodas),
    semanas,
    mediaCentavos: mediaDiariaCentavos(gasto, divisorDaMedia(input.competencia, input.hoje)),
  };
}
