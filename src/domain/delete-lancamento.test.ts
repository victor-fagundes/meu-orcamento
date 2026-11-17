import { describe, expect, it } from "vitest";
import { planDeleteLancamento } from "./delete-lancamento";
import type { LancamentoRow } from "./edit-lancamento";

function row(n: number): LancamentoRow {
  return {
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
  };
}

describe("planDeleteLancamento", () => {
  const group = [1, 2, 3, 4, 5, 6].map(row);

  it("one / future / all", () => {
    const one = planDeleteLancamento(group[2]!, group, "one");
    expect(one.ok).toBe(true);
    if (one.ok) expect(one.ids).toEqual(["p3"]);

    const future = planDeleteLancamento(group[2]!, group, "future");
    expect(future.ok).toBe(true);
    if (future.ok) expect(future.ids).toEqual(["p3", "p4", "p5", "p6"]);

    const all = planDeleteLancamento(group[2]!, group, "all");
    expect(all.ok).toBe(true);
    if (all.ok) expect(all.count).toBe(6);
  });
});
