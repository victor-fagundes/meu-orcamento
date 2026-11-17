import { describe, expect, it } from "vitest";
import { alertasDoMes } from "./alertas";
import { estadoConsumo } from "./consumo";
import { planDeleteLancamento } from "./delete-lancamento";
import { planEditLancamento, type LancamentoRow } from "./edit-lancamento";
import { buildLancamentoDraft } from "./lancamentos";
import { splitParcelas } from "./money";
import {
  saldoFinalAno,
  saldoPeriodo,
  somaParcelasOk,
  totalGastoDespesas,
  totalOrcadoDespesas,
} from "./reconciliacao";
import { competenciaCartao, competenciasParcelas } from "./competencia";

/**
 * MO-1102 — casos da seção 6 do PRD (regras transversais).
 */
describe("MO-1102 reconciliação §6", () => {
  it("parcelamento R$ 100 / 3× = 3334+3333+3333", () => {
    const p = splitParcelas(10000, 3);
    expect(p).toEqual([3334, 3333, 3333]);
    expect(somaParcelasOk(10000, p)).toBe(true);
  });

  it("competência fechamento 25", () => {
    expect(competenciaCartao("2026-05-10", 25)).toBe("2026-05");
    expect(competenciaCartao("2026-05-26", 25)).toBe("2026-06");
    expect(competenciasParcelas("2026-05-26", 3, 25)).toEqual([
      "2026-06",
      "2026-07",
      "2026-08",
    ]);
  });

  it("draft 3× usa mesmas competências em todas as telas", () => {
    const d = buildLancamentoDraft({
      itemId: "i",
      itemNome: "Loja",
      itemTipo: "V",
      valorBRL: "100",
      dataISO: "2026-05-26",
      pagamento: "card",
      parcelas: 3,
      diaFechamentoCartao: 25,
    });
    expect(d.ok).toBe(true);
    if (!d.ok) return;
    expect(d.parcelas.map((x) => x.competencia)).toEqual(["2026-06", "2026-07", "2026-08"]);
    expect(d.parcelas.map((x) => x.valorCentavos)).toEqual([3334, 3333, 3333]);
  });

  it("edição só esta vs futuras (3ª de 6×)", () => {
    const group: LancamentoRow[] = [1, 2, 3, 4, 5, 6].map((n) => ({
      id: `p${n}`,
      itemId: "i",
      cartaoId: "c",
      descricao: "x",
      valorCentavos: 15000,
      dataTransacao: "2026-05-26",
      competencia: "2026-06",
      meio: "cartao",
      parcelaN: n,
      parcelaTotal: 6,
      grupoParcelaId: "g",
    }));
    const one = planEditLancamento(
      group[2]!,
      group,
      {
        itemId: "i",
        itemNome: "x",
        valorBRL: "200",
        dataISO: "2026-07-01",
        pagamento: "c",
        diaFechamentoCartao: 25,
      },
      "one",
    );
    expect(one.ok && one.affected).toBe(1);

    const fut = planEditLancamento(
      group[2]!,
      group,
      {
        itemId: "i",
        itemNome: "x",
        valorBRL: "180",
        dataISO: "2026-07-01",
        pagamento: "c",
        diaFechamentoCartao: 25,
      },
      "future",
    );
    expect(fut.ok && fut.updates.map((u) => u.id)).toEqual(["p3", "p4", "p5", "p6"]);
  });

  it("exclusão parcial não remove o grupo inteiro", () => {
    const group: LancamentoRow[] = [1, 2, 3, 4, 5, 6].map((n) => ({
      id: `p${n}`,
      itemId: "i",
      cartaoId: "c",
      descricao: "x",
      valorCentavos: 100,
      dataTransacao: "2026-05-01",
      competencia: "2026-05",
      meio: "cartao",
      parcelaN: n,
      parcelaTotal: 6,
      grupoParcelaId: "g",
    }));
    const del = planDeleteLancamento(group[2]!, group, "future");
    expect(del.ok && del.ids).toEqual(["p3", "p4", "p5", "p6"]);
    expect(del.ok && del.count).toBe(4);
  });

  it("alertas 80 / 100 / 105 / sem planejado", () => {
    expect(estadoConsumo(8000, 10000)).toBe("preventivo");
    expect(estadoConsumo(10000, 10000)).toBe("atingido");
    expect(estadoConsumo(10500, 10000)).toBe("estourado");
    expect(estadoConsumo(2000, 0)).toBe("sem_planejado");

    const als = alertasDoMes(10000, 8000, [{ grupo: "X", plano: 0, realizado: 2000 }], {
      globalPct: 80,
      cats: {},
    });
    expect(als.some((a) => a.nivel === "wa" && a.escopo === "total")).toBe(true);
    expect(als.some((a) => a.msg.includes("sem orçamento"))).toBe(true);
  });

  it("saldos Resumo e Ano", () => {
    const orcado = totalOrcadoDespesas([300000]);
    const gasto = totalGastoDespesas([240000]);
    expect(saldoPeriodo(orcado, gasto)).toBe(60000); // R$ 600
    expect(saldoFinalAno(500000, 240000)).toBe(260000); // R$ 2.600
  });

  it("filtro pagamento: orçado/saldo N/A (conceitual)", () => {
    // Com filtro ≠ Todas, UI mostra "—" para orçado/saldo; gasto continua agregável
    const gastoCartao = totalGastoDespesas([12000, 3000]);
    expect(gastoCartao).toBe(15000);
    // orçado/saldo não se aplicam → null no domínio da UI
    const orcadoVisivel = null as number | null;
    const saldoVisivel = orcadoVisivel == null ? null : saldoPeriodo(orcadoVisivel, gastoCartao);
    expect(saldoVisivel).toBeNull();
  });
});
