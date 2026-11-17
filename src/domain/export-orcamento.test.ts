import { describe, expect, it } from "vitest";
import { buildExportCsv, buildExportJson } from "./export-orcamento";

describe("export orcamento", () => {
  const sample = {
    itens: [
      {
        id: "i1",
        tipo: "V",
        grupo: "Outros",
        nome: "Outros",
        planoCentavos: [100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        arquivado: false,
        divida: false,
      },
    ],
    cartoes: [
      {
        id: "c1",
        apelido: "Inter",
        diaFechamento: 25,
        diaVencimento: 5,
        instituicao: "Inter",
        ultimos4: "1234",
        ativo: true,
      },
    ],
    lancamentos: [
      {
        id: "l1",
        itemId: "i1",
        cartaoId: "c1",
        descricao: "Padaria",
        valorCentavos: 1250,
        dataTransacao: "2026-05-10",
        competencia: "2026-05",
        meio: "cartao",
        parcelaN: null,
        parcelaTotal: null,
        grupoParcelaId: null,
      },
    ],
  };

  it("JSON preserva centavos inteiros", () => {
    const json = buildExportJson(sample);
    const parsed = JSON.parse(json);
    expect(parsed.version).toBe(1);
    expect(parsed.lancamentos[0].valorCentavos).toBe(1250);
    expect(parsed.itens[0].planoCentavos[0]).toBe(100);
  });

  it("CSV inclui seções e centavos", () => {
    const csv = buildExportCsv(sample);
    expect(csv).toContain("# itens");
    expect(csv).toContain("# cartoes");
    expect(csv).toContain("# lancamentos");
    expect(csv).toContain("1250");
    expect(csv).toContain("100|0|0|0|0|0|0|0|0|0|0|0");
  });
});
