import { describe, expect, it } from "vitest";
import { addMonthsKeepingDay, planEditLancamento, type LancamentoRow } from "./edit-lancamento";

function row(partial: Partial<LancamentoRow> & Pick<LancamentoRow, "id" | "parcelaN">): LancamentoRow {
  return {
    itemId: "item-1",
    cartaoId: "card-1",
    descricao: "Compra",
    valorCentavos: 15000,
    dataTransacao: "2026-05-26",
    competencia: "2026-06",
    meio: "cartao",
    parcelaTotal: 6,
    grupoParcelaId: "g1",
    ...partial,
  };
}

describe("addMonthsKeepingDay", () => {
  it("ajusta 31 jan + 1 → 28 fev 2026", () => {
    expect(addMonthsKeepingDay("2026-01-31", 1)).toBe("2026-02-28");
  });
});

describe("planEditLancamento", () => {
  const group = [1, 2, 3, 4, 5, 6].map((n) =>
    row({
      id: `p${n}`,
      parcelaN: n,
      dataTransacao: addMonthsKeepingDay("2026-05-26", n - 1)!,
      competencia: `2026-${String(5 + n).padStart(2, "0")}`.replace("2026-13", "2027-01"),
    }),
  );

  // fix competencias manually for clarity
  group[0]!.competencia = "2026-06";
  group[1]!.competencia = "2026-07";
  group[2]!.competencia = "2026-08";
  group[3]!.competencia = "2026-09";
  group[4]!.competencia = "2026-10";
  group[5]!.competencia = "2026-11";

  it("só esta: altera só a 3ª", () => {
    const r = planEditLancamento(
      group[2]!,
      group,
      {
        itemId: "item-1",
        itemNome: "Compra",
        valorBRL: "200",
        dataISO: "2026-07-26",
        pagamento: "card-1",
        diaFechamentoCartao: 25,
      },
      "one",
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.affected).toBe(1);
    expect(r.updates[0]!.id).toBe("p3");
    expect(r.updates[0]!.valorCentavos).toBe(20000);
  });

  it("esta e as próximas: 3ª–6ª", () => {
    const r = planEditLancamento(
      group[2]!,
      group,
      {
        itemId: "item-1",
        itemNome: "Compra",
        valorBRL: "180",
        dataISO: "2026-07-26",
        pagamento: "card-1",
        diaFechamentoCartao: 25,
      },
      "future",
    );
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.updates.map((u) => u.id)).toEqual(["p3", "p4", "p5", "p6"]);
    expect(r.updates.every((u) => u.valorCentavos === 18000)).toBe(true);
    // datas +1 mês
    expect(r.updates[0]!.dataTransacao).toBe("2026-07-26");
    expect(r.updates[1]!.dataTransacao).toBe("2026-08-26");
  });
});
