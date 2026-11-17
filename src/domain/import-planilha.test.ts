import { describe, expect, it } from "vitest";
import { competenciaCartao } from "./competencia";
import { assignPlanoAlvo, type CatalogRef } from "./item-unico";
import {
  buildLancPreview,
  buildPlanoPreview,
  classifyPlanMonthCell,
  detectLayout,
  findMonthColumnIndexes,
  guessMap,
  markDuplicates,
  mergePlanoMonths,
  parseCsvText,
  parseDateCell,
  parseFaturaSection,
  parseMoneyCellToCents,
  pickBestSheet,
} from "./import-planilha";

describe("import planilha", () => {
  it("CSV com ; e Latin headers", () => {
    const rows = parseCsvText("Data;Valor;Descrição\n10/05/2026;12,50;Padaria\n");
    expect(rows[0]?.[0]).toBe("Data");
    expect(detectLayout(rows)).toBe("lanc");
    const map = guessMap(rows[0]!.map(String));
    expect(map.data).toBe("0");
    expect(map.valor).toBe("1");
    const prev = buildLancPreview(rows, map, { createItems: true, defaultMeio: "pix" });
    expect(prev[0]?.ok).toBe(true);
    expect(prev[0]?.valCents).toBe(1250);
    expect(prev[0]?.dt).toBe("2026-05-10");
  });

  it("detecta VF por meses + tipo", () => {
    const rows = [
      ["Tipo", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
      ["R|Receitas|Salário", 100, 100, 100, 100, 100, 100, 100],
    ];
    expect(detectLayout(rows)).toBe("vf");
  });

  it("parse data/valor e duplicata", () => {
    expect(parseDateCell("26/05/2026")).toBe("2026-05-26");
    expect(parseMoneyCellToCents("R$ 1.234,56")).toBe(123456);
    expect(parseMoneyCellToCents(-10)).toBe(0);
    expect(parseMoneyCellToCents("-10")).toBe(0);
    const prev = markDuplicates(
      [
        {
          n: 2,
          ok: true,
          dt: "2026-05-10",
          desc: "X",
          valCents: 100,
          tipo: "V",
          grupo: "G",
          itemNome: "I",
          meio: "pix",
        },
      ],
      [{ dataISO: "2026-05-10", valorCentavos: 100, descricao: "X", meio: "pix" }],
    );
    expect(prev[0]?.duplicate).toBe(true);
    const accent = markDuplicates(
      [{ ...prev[0]!, desc: "Açúcar" }],
      [{ dataISO: "2026-05-10", valorCentavos: 100, descricao: "acucar", meio: "pix" }],
    );
    expect(accent[0]?.duplicate).toBe(true);
  });

  it("meses + VF planejamento", () => {
    const headers = ["Tipo", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
    expect(findMonthColumnIndexes(headers)[0]).toBe(1);
    const rows = [
      headers,
      ["R|Receitas|Salário", "1000", "1000", "1000", "1000", "1000", "1000"],
    ];
    expect(detectLayout(rows)).toBe("vf");
    const prev = buildPlanoPreview(rows);
    expect(prev[0]?.ok).toBe(true);
    expect(prev[0]?.plano[0]).toBe(100000);
    expect(prev[0]?.cellsUpdated).toBe(6);
  });

  it("layout plano com colunas tipo/cat/item", () => {
    const rows = [
      ["Tipo", "Categoria", "Item", "Jan", "Fev", "Mar", "Abr"],
      ["V", "Alimentação", "Feira", "50", "60", "0", "70"],
    ];
    expect(detectLayout(rows)).toBe("plano");
    const prev = buildPlanoPreview(rows);
    expect(prev[0]?.ok).toBe(true);
    expect(prev[0]?.grupo).toBe("Alimentação");
    expect(prev[0]?.plano[1]).toBe(6000);
  });

  it("rejeita serial Excel 0 / fração e detecta controle mensal", () => {
    expect(parseDateCell(0)).toBeNull();
    expect(parseDateCell(0.3)).toBeNull();
    expect(parseDateCell(1899)).toBeNull();
    expect(parseDateCell(46152)).toBe("2026-05-10");
    expect(parseDateCell("05/jan", { defaultYear: 2026, billMonthIndex: 2 })).toBe(
      "2026-01-05",
    );
    expect(parseDateCell("14/fev/2026")).toBe("2026-02-14");
    // 28/nov na fatura de setembro/2026 → ano anterior
    expect(parseDateCell("28/nov", { defaultYear: 2026, billMonthIndex: 8 })).toBe(
      "2025-11-28",
    );

    const controle = [
      ["Controle", "A", "B"],
      ["Selecione o Mês Abaixo", "", ""],
      ["Janeiro", 100, 200],
      ["Fevereiro", 100, 200],
      ["Março", 100, 200],
      ["Abril", 100, 200],
      ["Meta de Investimento / Renda (%)", 0.3, ""],
    ];
    expect(detectLayout(controle)).toBe("plano");
  });

  it("planilha de gastos mensais (seções + meses por extenso)", () => {
    const rows = [
      ["", "Meses", "Outubro", "Novembro", "Dezembro", "janeiro"],
      ["", "Receitas", "", "", "", ""],
      ["", "Salário", 7000, 7000, 7000, 7000],
      ["", "Despesas Fixas", "", "", "", ""],
      ["", "Aluguel", 1580, 1700, 1700, 1700],
      ["", "Receita Total", 1, 1, 1, 1],
    ];
    expect(detectLayout(rows)).toBe("plano");
    const prev = buildPlanoPreview(rows);
    expect(prev.find((r) => r.nome === "Salário")?.tipo).toBe("R");
    expect(prev.find((r) => r.nome === "Aluguel")?.tipo).toBe("F");
    expect(prev.find((r) => r.nome === "Aluguel")?.plano[0]).toBe(170000);
    expect(prev.some((r) => /total/i.test(r.nome))).toBe(false);
  });

  it("seção de fatura define ano da data; competência cartão é regra à parte", () => {
    expect(parseFaturaSection("SETEMBRO / 2026")).toEqual({ year: 2026, monthIndex: 8 });
    const rows = [
      ["Data", "Descrição", "Valor"],
      ["SETEMBRO / 2026", "", ""],
      ["05/jan", "Compra", "10,00"],
      ["28/nov", "Parcela", "20,00"],
    ];
    const map = guessMap(rows[0]!.map(String));
    const prev = buildLancPreview(rows, map, { createItems: true, defaultMeio: "pix" });
    const ok = prev.filter((r) => r.ok);
    expect(ok.find((r) => r.dt === "2026-01-05")?.dateYearFromSection).toBe(true);
    expect(ok.find((r) => r.dt === "2025-11-28")?.dateYearFromSection).toBe(true);
    // Option B: competência cartão a partir da data (fechamento 25 → jan compra vira fev)
    expect(competenciaCartao("2026-01-05", 25)).toBe("2026-01");
    expect(competenciaCartao("2026-01-26", 25)).toBe("2026-02");
  });

  it("pickBestSheet prefer plano evita Relatórios e cartão", () => {
    const allSheets: Record<string, unknown[][]> = {
      Relatórios: [["A", "B"], [1, 2]],
      "Cartão Inter": [
        ["Data", "Descrição", "Valor"],
        ["10/05/2026", "X", "1,00"],
      ],
      "Planilhas de Gastos Mensais": [
        ["", "Meses", "Janeiro", "Fevereiro", "Março", "Abril"],
        ["", "Receitas", "", "", "", ""],
        ["", "Salário", 100, 100, 100, 100],
      ],
    };
    const sheets = Object.keys(allSheets);
    expect(pickBestSheet(sheets, allSheets, "plano")).toBe("Planilhas de Gastos Mensais");
    expect(pickBestSheet(sheets, allSheets, "lanc")).toBe("Cartão Inter");
    expect(pickBestSheet(sheets, allSheets)).not.toBe("Relatórios");
  });

  it("data abreviada sem seção não usa o ano de hoje", () => {
    expect(parseDateCell("05/jan")).toBeNull();
    const rows = [
      ["Data", "Descrição", "Valor"],
      ["05/jan", "Compra", "10,00"],
      ["10/05/2026", "Com ano", "12,00"],
    ];
    const map = guessMap(rows[0]!.map(String));
    const prev = buildLancPreview(rows, map, { createItems: true, defaultMeio: "pix" });
    expect(prev[0]?.ok).toBe(false);
    expect(prev[0]?.dt).toBeNull();
    expect(prev[0]?.why).toMatch(/ano de seção/i);
    expect(prev[1]?.ok).toBe(true);
    expect(prev[1]?.dt).toBe("2026-05-10");
  });

  it("negativo ou ilegível zera o mês; zero literal e vazio não apagam", () => {
    expect(classifyPlanMonthCell(-10)).toEqual({ write: "set", cents: 0 });
    expect(classifyPlanMonthCell("-10,50")).toEqual({ write: "set", cents: 0 });
    expect(classifyPlanMonthCell("abc")).toEqual({ write: "set", cents: 0 });
    expect(classifyPlanMonthCell(0)).toEqual({ write: "keep", cents: 0 });
    expect(classifyPlanMonthCell("0,00")).toEqual({ write: "keep", cents: 0 });
    expect(classifyPlanMonthCell("")).toEqual({ write: "keep", cents: 0 });
    expect(classifyPlanMonthCell(null)).toEqual({ write: "keep", cents: 0 });
    expect(classifyPlanMonthCell("1.234,56")).toEqual({ write: "set", cents: 123456 });

    const rows = [
      ["Tipo", "Categoria", "Item", "Jan", "Fev", "Mar", "Abr"],
      ["V", "Casa", "Aluguel", "100", "-10", "0", ""],
      ["V", "Casa", "Condomínio", "-5", "abc", "", "0"],
    ];
    const prev = buildPlanoPreview(rows);
    const aluguel = prev.find((r) => r.nome === "Aluguel");
    expect(aluguel?.monthWrite.slice(0, 4)).toEqual(["set", "set", "keep", "keep"]);
    expect(aluguel?.plano.slice(0, 4)).toEqual([10000, 0, 0, 0]);
    expect(aluguel?.cellsUpdated).toBe(2);
    const condo = prev.find((r) => r.nome === "Condomínio");
    expect(condo?.monthWrite.slice(0, 4)).toEqual(["set", "set", "keep", "keep"]);
    expect(condo?.cellsUpdated).toBe(2);

    const merged = mergePlanoMonths(
      [5000, 7000, 8000, 9000],
      aluguel!.plano,
      aluguel!.monthWrite,
    );
    expect(merged.plano.slice(0, 4)).toEqual([10000, 0, 8000, 9000]);
    expect(merged.written).toBe(2);
  });

  it("Relatórios sozinho não gera células de plano úteis", () => {
    const rows = [
      ["Indicador", "Valor"],
      ["Saldo", 1000],
      ["Meta", 0.3],
    ];
    const prev = buildPlanoPreview(rows);
    expect(prev.reduce((s, r) => s + r.cellsUpdated, 0)).toBe(0);
  });
});

describe("alvo do plano", () => {
  const gastos = [
    ["", "Meses", "Outubro", "Novembro", "Dezembro", "janeiro"],
    ["", "Despesas Fixas", "", "", "", ""],
    ["", "Aluguel", 1580, 1700, 1700, 1700],
    ["", "Luz", 180, 180, 180, 180],
  ];
  const catalog: CatalogRef[] = [
    { tipo: "F", grupo: "Moradia", nome: "Aluguel", ativo: true },
    { tipo: "V", grupo: "Habitação", nome: "Luz", ativo: true },
    { tipo: "F", grupo: "Despesas Fixas", nome: "Aluguel", ativo: true },
  ];

  it("seção Despesas Fixas + Aluguel resolve para Moradia", () => {
    const row = buildPlanoPreview(gastos).find((r) => r.nome === "Aluguel");
    expect(row?.tipo).toBe("F");
    const alvo = assignPlanoAlvo({ tipo: row!.tipo, nome: row!.nome, grupo: row!.grupo }, catalog);
    expect(alvo.alvo).toBe("catalogo");
    expect(alvo.grupo).toBe("Moradia");
    expect(alvo.tipo).toBe("F");
  });

  it("Luz na seção Despesas Fixas continua variável em Habitação", () => {
    const row = buildPlanoPreview(gastos).find((r) => r.nome === "Luz");
    const alvo = assignPlanoAlvo({ tipo: row!.tipo, nome: "luz", grupo: row!.grupo }, catalog);
    expect(alvo.alvo).toBe("catalogo");
    expect(alvo.tipo).toBe("V");
    expect(alvo.grupo).toBe("Habitação");
  });
});
