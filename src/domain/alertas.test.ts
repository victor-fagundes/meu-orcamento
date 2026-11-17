import { describe, expect, it } from "vitest";
import { alertasDoMes, limiteDaCategoria, validateGlobalPct } from "./alertas";

describe("alertas", () => {
  it("global 80 e override de categoria", () => {
    expect(validateGlobalPct(80)).toBe(80);
    expect(limiteDaCategoria({ globalPct: 80, cats: { Habitação: 70 } }, "Habitação")).toBe(70);
    expect(limiteDaCategoria({ globalPct: 80, cats: {} }, "Habitação")).toBe(80);
  });

  it("gera wa e er", () => {
    const als = alertasDoMes(10000, 8500, [{ grupo: "Moradia", plano: 5000, realizado: 5000 }], {
      globalPct: 80,
      cats: {},
    });
    expect(als.some((a) => a.escopo === "total" && a.nivel === "wa")).toBe(true);
    expect(als.some((a) => a.escopo === "cat" && a.nivel === "er")).toBe(true);
  });
});
