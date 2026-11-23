import { describe, expect, it } from "vitest";
import {
  alertasDoMes,
  ERRO_LIMITE_PCT,
  limiteDaCategoria,
  validarLimitePct,
  validateGlobalPct,
} from "./alertas";

describe("alertas", () => {
  it("aceita 1 e 100 e recusa o resto sem apertar", () => {
    expect(validarLimitePct(1)).toEqual({ ok: true, valor: 1 });
    expect(validarLimitePct(100)).toEqual({ ok: true, valor: 100 });
    expect(validarLimitePct(0)).toEqual({ ok: false, error: ERRO_LIMITE_PCT });
    expect(validarLimitePct(101)).toEqual({ ok: false, error: ERRO_LIMITE_PCT });
    expect(validarLimitePct(80.5).ok).toBe(false);
    expect(validarLimitePct("80").ok).toBe(false);
    expect(validateGlobalPct(80)).toBe(80);
    expect(() => validateGlobalPct(0)).toThrow(ERRO_LIMITE_PCT);
  });

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
