import { describe, expect, it } from "vitest";
import { abertasDaQuery, hrefAlternarCategoria, hrefDoTipo, tipoDaQuery } from "./orcamento-query";

describe("query do orçamento", () => {
  it("cai em Fixas quando o tipo falta ou é inválido", () => {
    expect(tipoDaQuery(undefined)).toBe("F");
    expect(tipoDaQuery("")).toBe("F");
    expect(tipoDaQuery("X")).toBe("F");
    expect(tipoDaQuery(["nope", "V"])).toBe("F");
  });

  it("aceita só R, F, V e E", () => {
    expect(tipoDaQuery("R")).toBe("R");
    expect(tipoDaQuery("F")).toBe("F");
    expect(tipoDaQuery("V")).toBe("V");
    expect(tipoDaQuery("E")).toBe("E");
  });

  it("lê aberta repetida, um nome por chave", () => {
    expect(abertasDaQuery(undefined)).toEqual([]);
    expect(abertasDaQuery("Moradia")).toEqual(["Moradia"]);
    expect(abertasDaQuery(["Moradia", "Lazer"])).toEqual(["Moradia", "Lazer"]);
  });

  it("trocar o tipo tira aberta", () => {
    expect(hrefDoTipo("2026-11", "V")).toBe("/app/orcamento?mes=2026-11&tipo=V");
  });

  it("abrir acrescenta o nome e fechar tira só esse nome", () => {
    expect(hrefAlternarCategoria("2026-11", "F", [], "Moradia")).toBe(
      "/app/orcamento?mes=2026-11&tipo=F&aberta=Moradia",
    );
    expect(hrefAlternarCategoria("2026-11", "F", ["Moradia", "Saúde"], "Moradia")).toBe(
      "/app/orcamento?mes=2026-11&tipo=F&aberta=Sa%C3%BAde",
    );
  });
});
