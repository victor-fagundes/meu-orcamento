import { describe, expect, it } from "vitest";
import { indiceMesAberto, nomeAnunciadoArquivar, textoVisivelArquivar } from "./arquivar-rotulo";

describe("arquivar", () => {
  it("repouso mostra Arquivar e anuncia o item", () => {
    expect(textoVisivelArquivar("Aluguel", "repouso")).toBe("Arquivar");
    expect(nomeAnunciadoArquivar("Aluguel", "repouso")).toBe("Arquivar Aluguel");
  });

  it("armado mostra o nome", () => {
    expect(textoVisivelArquivar("Aluguel", "armado")).toBe("Arquivar Aluguel?");
    expect(nomeAnunciadoArquivar("Aluguel", "armado")).toBe("Arquivar Aluguel?");
  });

  it("gravando anuncia o item", () => {
    expect(textoVisivelArquivar("Luz", "gravando")).toBe("…");
    expect(nomeAnunciadoArquivar("Luz", "gravando")).toBe("Arquivando Luz");
  });
});

describe("indiceMesAberto", () => {
  it("novembro de 2026 é o índice 10", () => {
    expect(indiceMesAberto("2026-11")).toBe(10);
  });

  it("competência inválida cai em janeiro", () => {
    expect(indiceMesAberto("")).toBe(0);
    expect(indiceMesAberto("2026-13")).toBe(0);
  });
});
