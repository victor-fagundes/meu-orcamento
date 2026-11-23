import { describe, expect, it } from "vitest";
import { formatBRL } from "@/domain/money";
import type { ItemDoMes } from "@/domain/resumo-mes";
import {
  cartoesDoResumo,
  hrefOrcamentoMes,
  hrefResumo,
  lerFiltrosResumo,
  montarResumo,
  textoFiltroResumo,
  type FiltrosResumo,
  type LancFiltro,
} from "./resumo-filtro";

describe("textoFiltroResumo", () => {
  it("com pagamento filtrado o saldo do mês permanece e a frase cita o recorte", () => {
    const frase = textoFiltroResumo({
      ativo: true,
      saldoMesCentavos: 102_400,
      gastoRecorteCentavos: 64_000,
      rotuloFiltro: "PIX",
    });
    expect(frase).toContain(formatBRL(102_400));
    expect(frase).toContain(formatBRL(64_000));
    expect(frase).toContain("PIX");
  });

  it("filtro de categoria também cita o recorte e o mês", () => {
    const frase = textoFiltroResumo({
      ativo: true,
      saldoMesCentavos: 0,
      gastoRecorteCentavos: 1_500,
      rotuloFiltro: "Mercado",
    });
    expect(frase).toContain("Mercado");
    expect(frase).toContain(formatBRL(0));
    expect(frase).toContain(formatBRL(1_500));
  });

  it("sem filtro não há frase de recorte", () => {
    expect(
      textoFiltroResumo({
        ativo: false,
        saldoMesCentavos: 100,
        gastoRecorteCentavos: 50,
        rotuloFiltro: "PIX",
      }),
    ).toBeNull();
  });
});

describe("hrefOrcamentoMes", () => {
  it("o endereço do mês carrega mes e tipo", () => {
    expect(hrefOrcamentoMes("2026-11", "V")).toBe("/app/orcamento?mes=2026-11&tipo=V");
  });

  it("tipo desconhecido cai em fixas", () => {
    expect(hrefOrcamentoMes("2026-12", "X")).toBe("/app/orcamento?mes=2026-12&tipo=F");
  });

  it("Fixas de novembro abre o orçamento do mesmo mês nesse tipo", () => {
    expect(hrefOrcamentoMes("2026-11", "F")).toBe("/app/orcamento?mes=2026-11&tipo=F");
  });
});

describe("cartões do resumo", () => {
  it("os tipos R, F, V e E viram Receitas, Fixas, Variáveis e Anuais", () => {
    const cartoes = cartoesDoResumo(
      [
        { tipo: "E", planoCentavos: 1, realizadoCentavos: 1 },
        { tipo: "V", planoCentavos: 2, realizadoCentavos: 2 },
        { tipo: "F", planoCentavos: 120_050, realizadoCentavos: 820_099 },
        { tipo: "R", planoCentavos: 4, realizadoCentavos: 4 },
      ],
      true,
    );
    expect(cartoes.map((cartao) => cartao.rotulo)).toEqual(["Receitas", "Fixas", "Variáveis", "Anuais"]);
    expect(cartoes[1]).toMatchObject({ realizadoCentavos: 820_099, planejadoCentavos: 120_050 });
  });
});

const MES = "2026-11";
const HOJE = "2026-11-17";
const TODAS: FiltrosResumo = { tipo: "todas", pagamento: "todas", categoria: "todas" };

function item(parcial: Partial<ItemDoMes> & Pick<ItemDoMes, "id" | "tipo">): ItemDoMes {
  return { grupo: "Casa", planoMesCentavos: 0, ...parcial };
}

function lanc(parcial: Partial<LancFiltro> & Pick<LancFiltro, "valorCentavos" | "itemTipo">): LancFiltro {
  return {
    itemId: "1",
    itemGrupo: "Casa",
    meio: "deb",
    cartaoId: null,
    data: "2026-11-03",
    descricao: "Conta",
    item: "Aluguel",
    ...parcial,
  };
}

describe("filtros da query", () => {
  it("valor ausente ou desconhecido volta para Todas", () => {
    expect(lerFiltrosResumo({}, ["Mercado"], ["c1"])).toEqual(TODAS);
    expect(
      lerFiltrosResumo({ tipo: "Z", pagamento: "boleto", categoria: "NaoExiste" }, ["Mercado"], ["c1"]),
    ).toEqual(TODAS);
  });

  it("aceita tipo, débito, pix, dinheiro, cartão ativo e categoria ativa", () => {
    expect(
      lerFiltrosResumo({ tipo: "V", pagamento: "pix", categoria: "Mercado" }, ["Mercado"], ["c1"]),
    ).toEqual({ tipo: "V", pagamento: "pix", categoria: "Mercado" });
    expect(lerFiltrosResumo({ pagamento: "deb" }, [], []).pagamento).toBe("deb");
    expect(lerFiltrosResumo({ pagamento: "din" }, [], []).pagamento).toBe("din");
    expect(lerFiltrosResumo({ pagamento: "cartao:c1" }, [], ["c1"]).pagamento).toBe("cartao:c1");
    expect(lerFiltrosResumo({ pagamento: "cartao:c2" }, [], ["c1"]).pagamento).toBe("todas");
  });

  it("pagamento diferente de Todas zera disponível e planejado e soma só aquele meio", () => {
    const modelo = montarResumo({
      competencia: MES,
      hoje: HOJE,
      itens: [item({ id: "f", tipo: "F", planoMesCentavos: 100_000 }), item({ id: "v", tipo: "V", planoMesCentavos: 50_000 })],
      lancamentos: [
        lanc({ valorCentavos: 3_000, itemTipo: "F", meio: "pix" }),
        lanc({ valorCentavos: 7_000, itemTipo: "F", meio: "deb" }),
        lanc({ valorCentavos: 1_000, itemTipo: "V", meio: "pix" }),
      ],
      filtros: { ...TODAS, pagamento: "pix" },
    });
    expect(modelo.disponivelCentavos).toBeNull();
    expect(modelo.percentual).toBeNull();
    expect(modelo.frase).toBe("Faltam 13 dias");
    expect(modelo.cartoes.every((cartao) => cartao.planejadoCentavos === null)).toBe(true);
    expect(modelo.cartoes.find((cartao) => cartao.tipo === "F")?.realizadoCentavos).toBe(3_000);
    expect(modelo.cartoes.find((cartao) => cartao.tipo === "V")?.realizadoCentavos).toBe(1_000);
  });

  it("categoria restringe o disponível e não mexe na lista de alertas", () => {
    const alertas = [{ msg: "Total estourou" }];
    const base = {
      competencia: MES,
      hoje: HOJE,
      itens: [
        item({ id: "m", tipo: "F", grupo: "Mercado", planoMesCentavos: 10_000 }),
        item({ id: "c", tipo: "F", grupo: "Casa", planoMesCentavos: 90_000 }),
      ],
      lancamentos: [
        lanc({ valorCentavos: 2_000, itemTipo: "F", itemGrupo: "Mercado" }),
        lanc({ valorCentavos: 8_000, itemTipo: "F", itemGrupo: "Casa" }),
      ],
    };
    const mercado = montarResumo({ ...base, filtros: { ...TODAS, categoria: "Mercado" } });
    const tudo = montarResumo({ ...base, filtros: TODAS });
    expect(mercado.disponivelCentavos).toBe(8_000);
    expect(tudo.disponivelCentavos).toBe(90_000);
    expect(alertas).toEqual([{ msg: "Total estourou" }]);
  });

  it("tipo muda o gráfico e não muda o disponível nem os cartões", () => {
    const base = {
      competencia: MES,
      hoje: HOJE,
      itens: [item({ id: "f", tipo: "F", planoMesCentavos: 10_000 })],
      lancamentos: [
        lanc({ valorCentavos: 4_000, itemTipo: "F" }),
        lanc({ valorCentavos: 6_000, itemTipo: "V" }),
      ],
    };
    const todas = montarResumo({ ...base, filtros: TODAS });
    const fixas = montarResumo({ ...base, filtros: { ...TODAS, tipo: "F" } });
    expect(fixas.disponivelCentavos).toBe(todas.disponivelCentavos);
    expect(fixas.cartoes).toEqual(todas.cartoes);
    expect(fixas.semanas[0]?.valorCentavos).toBe(4_000);
    expect(todas.semanas[0]?.valorCentavos).toBe(10_000);
  });

  it("limpar tira tipo, pagamento e categoria e conserva o mês", () => {
    expect(hrefResumo(MES, { tipo: "F", pagamento: "pix", categoria: "Mercado" }, true)).toBe(
      "/app/resumo?mes=2026-11",
    );
  });

  it("montar a leitura não grava nos itens", () => {
    const itens = [item({ id: "f", tipo: "F", planoMesCentavos: 10_000 })];
    montarResumo({
      competencia: MES,
      hoje: HOJE,
      itens,
      lancamentos: [lanc({ valorCentavos: 1, itemTipo: "F" })],
      filtros: TODAS,
    });
    expect(itens[0]?.planoMesCentavos).toBe(10_000);
  });

  it("mês sem receita planejada e sem lançamento continua vazio mesmo com filtro", () => {
    const modelo = montarResumo({
      competencia: MES,
      hoje: HOJE,
      itens: [item({ id: "f", tipo: "F", planoMesCentavos: 5_000 })],
      lancamentos: [],
      filtros: { ...TODAS, pagamento: "pix" },
    });
    expect(modelo.vazio).toBe(true);
  });

  it("um lançamento impede o vazio mesmo que o filtro o esconda", () => {
    const modelo = montarResumo({
      competencia: MES,
      hoje: HOJE,
      itens: [item({ id: "f", tipo: "F", planoMesCentavos: 0 })],
      lancamentos: [lanc({ valorCentavos: 100, itemTipo: "F", meio: "deb" })],
      filtros: { ...TODAS, pagamento: "pix" },
    });
    expect(modelo.vazio).toBe(false);
  });
});
