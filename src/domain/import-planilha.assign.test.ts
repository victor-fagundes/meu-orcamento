import { describe, expect, it } from "vitest";
import { buildPlanoPreview } from "./import-planilha";
import { assignPlanoAlvo, type CatalogRef } from "./item-unico";

const gastos = [
  ["", "Meses", "Outubro", "Novembro", "Dezembro", "janeiro"],
  ["", "Despesas Fixas", "", "", "", ""],
  ["", "Aluguel", 1580, 1700, 1700, 1700],
  ["", "Luz", 180, 180, 180, 180],
];

describe("assignPlanoAlvo", () => {
  const catalog: CatalogRef[] = [
    { tipo: "F", grupo: "Moradia", nome: "Aluguel", ativo: true },
    { tipo: "V", grupo: "Habitação", nome: "Luz", ativo: true },
    { tipo: "F", grupo: "Despesas Fixas", nome: "Aluguel", ativo: true },
  ];

  it("seção Despesas Fixas + Aluguel resolve para Moradia", () => {
    const row = buildPlanoPreview(gastos).find((r) => r.nome === "Aluguel");
    expect(row?.tipo).toBe("F");
    const alvo = assignPlanoAlvo(
      { tipo: row!.tipo, nome: row!.nome, grupo: row!.grupo },
      catalog,
    );
    expect(alvo.alvo).toBe("catalogo");
    expect(alvo.grupo).toBe("Moradia");
    expect(alvo.tipo).toBe("F");
  });

  it("Luz na seção Despesas Fixas continua variável em Habitação", () => {
    const row = buildPlanoPreview(gastos).find((r) => r.nome === "Luz");
    const alvo = assignPlanoAlvo(
      { tipo: row!.tipo, nome: "luz", grupo: row!.grupo },
      catalog,
    );
    expect(alvo.alvo).toBe("catalogo");
    expect(alvo.tipo).toBe("V");
    expect(alvo.grupo).toBe("Habitação");
  });
});
