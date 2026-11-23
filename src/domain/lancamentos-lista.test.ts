import { describe, expect, it } from "vitest";
import { buildLancamentoDraft } from "@/domain/lancamentos";
import {
  filtrarLancamentos,
  textoFatura,
  textoFaturaSe,
  textoParcela,
  textoPrevia,
  type LinhaFiltro,
} from "@/domain/lancamentos-lista";

const LINHAS: LinhaFiltro[] = [
  { id: "1", descricao: "Uber", itemNome: "Transporte", itemId: "taxi", meio: "deb" },
  { id: "2", descricao: "Feira", itemNome: "açúcar", itemId: "feira", meio: "pix" },
  { id: "3", descricao: "Notebook", itemNome: "Eletrônicos", itemId: "abc", meio: "cartao" },
  { id: "4", descricao: "Mercado", itemNome: "Eletrônicos", itemId: "abc", meio: "deb" },
  { id: "5", descricao: "Posto", itemNome: "Combustível", itemId: "comb", meio: "cartao" },
];

describe("textos da lista", () => {
  it("escreve a parcela e omite a vista", () => {
    expect(textoParcela(2, 6)).toBe("Parcela 2 de 6 · restam 4");
    expect(textoParcela(3, 3)).toBe("Parcela 3 de 3 · restam 0");
    expect(textoParcela(null, null)).toBeNull();
    expect(textoParcela(1, 1)).toBeNull();
  });

  it("escreve a fatura só no cartão com fechamento de 1 a 28", () => {
    expect(textoFatura("2026-06")).toBe("Fatura 06/2026");
    expect(textoFaturaSe("cartao", null, "2026-06")).toBeNull();
    expect(textoFaturaSe("cartao", 0, "2026-06")).toBeNull();
    expect(textoFaturaSe("cartao", 29, "2026-06")).toBeNull();
    expect(textoFaturaSe("deb", 25, "2026-06")).toBeNull();
    expect(textoFaturaSe("cartao", 25, "2026-06")).toBe("Fatura 06/2026");
  });
});

describe("filtrarLancamentos", () => {
  it("compara descrição e item sem tirar o acento e conserva a ordem", () => {
    expect(filtrarLancamentos(LINHAS, "uber", "", "").map((linha) => linha.id)).toEqual(["1"]);
    expect(filtrarLancamentos(LINHAS, "UBER", "", "").map((linha) => linha.id)).toEqual(["1"]);
    expect(filtrarLancamentos(LINHAS, "acucar", "", "")).toEqual([]);
    expect(filtrarLancamentos(LINHAS, "açúcar", "", "").map((linha) => linha.id)).toEqual(["2"]);
    expect(filtrarLancamentos(LINHAS, "", "", "").map((linha) => linha.id)).toEqual(["1", "2", "3", "4", "5"]);
  });

  it("cruza item e crédito e o crédito reúne os cartões", () => {
    expect(filtrarLancamentos(LINHAS, "", "abc", "cartao").map((linha) => linha.id)).toEqual(["3"]);
    expect(filtrarLancamentos(LINHAS, "", "", "cartao").map((linha) => linha.id)).toEqual(["3", "5"]);
    expect(filtrarLancamentos(LINHAS, "", "", "deb").map((linha) => linha.id)).toEqual(["1", "4"]);
  });
});

describe("prévia", () => {
  it("mostra centavos desiguais a partir do rascunho de R$ 100,00 em 3x", () => {
    const draft = buildLancamentoDraft({
      itemId: "item",
      itemNome: "Notebook",
      itemTipo: "V",
      valorBRL: "100,00",
      dataISO: "2026-05-26",
      pagamento: "cartao-1",
      parcelas: 3,
      diaFechamentoCartao: 25,
    });
    expect(draft.ok).toBe(true);
    if (!draft.ok) return;
    expect(draft.parcelas.map((parcela) => parcela.valorCentavos)).toEqual([3334, 3333, 3333]);
    expect(draft.parcelas.map((parcela) => parcela.competencia)).toEqual(["2026-06", "2026-07", "2026-08"]);
    const previa = textoPrevia(draft.parcelas, { cartao: true, diaFechamento: 25 });
    expect(previa.titulo).toBe("Prévia: 3 parcelas");
    expect(previa.linhas).toEqual([
      "Jun/2026 · R$ 33,34",
      "Jul/2026 · R$ 33,33",
      "Ago/2026 · R$ 33,33",
    ]);
    expect(previa.aviso).toBeNull();
  });

  it("junta o valor quando as parcelas são iguais", () => {
    const previa = textoPrevia(
      [
        { competencia: "2026-11", valorCentavos: 100000 },
        { competencia: "2026-12", valorCentavos: 100000 },
        { competencia: "2027-01", valorCentavos: 100000 },
      ],
      { cartao: true, diaFechamento: 25 },
    );
    expect(previa.titulo).toBe("Prévia: 3 parcelas de R$ 1.000,00");
  });

  it("avisa quando o cartão não tem dia de fechamento e não escreve Fatura", () => {
    const draft = buildLancamentoDraft({
      itemId: "item",
      itemNome: "Notebook",
      itemTipo: "V",
      valorBRL: "100,00",
      dataISO: "2026-05-26",
      pagamento: "cartao-1",
      parcelas: 3,
      diaFechamentoCartao: null,
    });
    expect(draft.ok).toBe(true);
    if (!draft.ok) return;
    const previa = textoPrevia(draft.parcelas, { cartao: true, diaFechamento: null });
    expect(previa.aviso).toBe("Sem dia de fechamento, a competência é o mês da compra.");
    expect(previa.linhas.join(" ")).not.toContain("Fatura");
  });
});
