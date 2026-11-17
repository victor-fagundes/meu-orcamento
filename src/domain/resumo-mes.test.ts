import { describe, expect, it } from "vitest";
import { textoConsumoDespesa, textoConsumoReceita } from "./consumo";
import { formatBRL } from "./money";
import { totaisDoMes, type ItemDoMes, type LancamentoDoMes } from "./resumo-mes";

function item(partial: Partial<ItemDoMes> & Pick<ItemDoMes, "id" | "tipo" | "grupo">): ItemDoMes {
  return { planoMesCentavos: 0, ...partial };
}

function lanc(partial: Partial<LancamentoDoMes> & Pick<LancamentoDoMes, "itemId" | "valorCentavos">): LancamentoDoMes {
  return { itemTipo: "V", itemGrupo: "Outros", ...partial };
}

describe("totaisDoMes", () => {
  it("ainda pode gastar é o planejado de despesas menos o gasto", () => {
    const totais = totaisDoMes(
      [item({ id: "a", tipo: "F", grupo: "Moradia", planoMesCentavos: 10_000 })],
      [lanc({ itemId: "a", valorCentavos: 4_000, itemTipo: "F", itemGrupo: "Moradia" })],
    );
    expect(totais.aindaPodeGastarCentavos).toBe(6_000);
    expect(totais.totalOrcadoDespesasCentavos).toBe(10_000);
    expect(totais.totalGastoDespesasCentavos).toBe(4_000);
  });

  it("mês estourado fica negativo", () => {
    const totais = totaisDoMes(
      [item({ id: "a", tipo: "V", grupo: "Mercado", planoMesCentavos: 1_000 })],
      [lanc({ itemId: "a", valorCentavos: 2_500, itemTipo: "V", itemGrupo: "Mercado" })],
    );
    expect(totais.aindaPodeGastarCentavos).toBe(-1_500);
  });

  it("receita não entra no que ainda pode gastar", () => {
    const totais = totaisDoMes(
      [item({ id: "r", tipo: "R", grupo: "Receitas", planoMesCentavos: 50_000 })],
      [lanc({ itemId: "r", valorCentavos: 50_000, itemTipo: "R", itemGrupo: "Receitas" })],
    );
    expect(totais.aindaPodeGastarCentavos).toBe(0);
    expect(totais.porTipo.find((t) => t.tipo === "R")).toMatchObject({
      tipo: "R",
      planoCentavos: 50_000,
      realizadoCentavos: 50_000,
    });
  });

  it("linha de fixas mostra realizado e planejado", () => {
    const totais = totaisDoMes(
      [item({ id: "a", tipo: "F", grupo: "Moradia", planoMesCentavos: 2_000 })],
      [lanc({ itemId: "a", valorCentavos: 500, itemTipo: "F", itemGrupo: "Moradia" })],
    );
    expect(totais.porTipo.find((t) => t.tipo === "F")).toMatchObject({
      tipo: "F",
      planoCentavos: 2_000,
      realizadoCentavos: 500,
    });
  });

  it("soma os itens do mesmo grupo e calcula o que ainda cabe", () => {
    const totais = totaisDoMes(
      [
        item({ id: "a", tipo: "F", grupo: "Moradia", planoMesCentavos: 1_000 }),
        item({ id: "b", tipo: "F", grupo: "Moradia", planoMesCentavos: 700 }),
      ],
      [
        lanc({ itemId: "a", valorCentavos: 400, itemTipo: "F", itemGrupo: "Moradia" }),
        lanc({ itemId: "b", valorCentavos: 100, itemTipo: "F", itemGrupo: "Moradia" }),
      ],
    );
    expect(totais.porGrupo).toMatchObject([
      {
        tipo: "F",
        grupo: "Moradia",
        planoCentavos: 1_700,
        realizadoCentavos: 500,
        aindaCabeCentavos: 1_200,
      },
    ]);
    expect(totais.porGrupo[0]?.frase).toBe(textoConsumoDespesa(500, 1_700, formatBRL));
    expect(totais.porTipo.find((t) => t.tipo === "R")?.frase).toBe(
      textoConsumoReceita(0, 0, formatBRL),
    );
  });

  it("grupo zerado continua na lista", () => {
    const totais = totaisDoMes(
      [
        item({ id: "a", tipo: "F", grupo: "Moradia", planoMesCentavos: 100 }),
        item({ id: "b", tipo: "F", grupo: "Educação", planoMesCentavos: 0 }),
      ],
      [lanc({ itemId: "a", valorCentavos: 100, itemTipo: "F", itemGrupo: "Moradia" })],
    );
    expect(totais.porGrupo.map((g) => g.grupo)).toEqual(["Moradia", "Educação"]);
    expect(totais.porGrupo[1]).toMatchObject({
      planoCentavos: 0,
      realizadoCentavos: 0,
      aindaCabeCentavos: 0,
    });
  });

  it("lançamento sem item entra no gasto e no tipo, e não cria grupo", () => {
    const totais = totaisDoMes(
      [],
      [lanc({ itemId: "sumiu", valorCentavos: 300, itemTipo: "V", itemGrupo: "Fantasma" })],
    );
    expect(totais.totalGastoDespesasCentavos).toBe(300);
    expect(totais.porTipo.find((t) => t.tipo === "V")?.realizadoCentavos).toBe(300);
    expect(totais.porGrupo).toEqual([]);
    expect(totais.aindaPodeGastarCentavos).toBe(-300);
  });
});
