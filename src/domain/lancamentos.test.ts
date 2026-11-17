import { describe, expect, it } from "vitest";
import { buildLancamentoDraft } from "./lancamentos";

describe("buildLancamentoDraft", () => {
  it("descrição vazia usa nome do item", () => {
    const r = buildLancamentoDraft({
      itemId: "i1",
      itemNome: "Supermercado",
      itemTipo: "V",
      valorBRL: "50",
      dataISO: "2026-05-10",
      pagamento: "pix",
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.descricao).toBe("Supermercado");
  });

  it("R$ 100 / 3× no cartão fecha 25 em 26/05", () => {
    const r = buildLancamentoDraft({
      itemId: "i1",
      itemNome: "Loja",
      itemTipo: "V",
      valorBRL: "100",
      dataISO: "2026-05-26",
      pagamento: "card-1",
      parcelas: 3,
      diaFechamentoCartao: 25,
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.parcelas.map((p) => p.valorCentavos)).toEqual([3334, 3333, 3333]);
    expect(r.parcelas.map((p) => p.competencia)).toEqual(["2026-06", "2026-07", "2026-08"]);
  });

  it("débito força 1 parcela", () => {
    const r = buildLancamentoDraft({
      itemId: "i1",
      itemNome: "X",
      itemTipo: "F",
      valorBRL: "10",
      dataISO: "2026-05-10",
      pagamento: "deb",
      parcelas: 5,
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.parcelas).toHaveLength(1);
  });
});
