import { describe, expect, it } from "vitest";
import { buildCatalogSeeds, planoJsonFromBRL, zeroPlanoJson } from "./catalog";

describe("buildCatalogSeeds", () => {
  it("gera catálogo com tipos R F V E e dívida marcada", () => {
    const seeds = buildCatalogSeeds();
    expect(seeds.length).toBeGreaterThan(40);
    expect(seeds.some((s) => s.tipo === "R" && s.nome === "Salário")).toBe(true);
    expect(seeds.find((s) => s.nome === "Financiamento casa")?.divida).toBe(true);
    expect(seeds.every((s) => ["R", "F", "V", "E"].includes(s.tipo))).toBe(true);
  });
});

describe("plano json", () => {
  it("zero e exemplo em centavos", () => {
    expect(JSON.parse(zeroPlanoJson())).toEqual(Array(12).fill(0));
    expect(JSON.parse(planoJsonFromBRL(65))).toEqual(Array(12).fill(6500));
  });
});
