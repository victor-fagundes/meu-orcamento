import { describe, expect, it } from "vitest";
import { formatBRL, fromCents, splitParcelas, toCents } from "./money";

describe("toCents", () => {
  it("converte string pt-BR", () => {
    expect(toCents("100,00")).toBe(10000);
    expect(toCents("1.234,56")).toBe(123456);
    expect(toCents("R$ 90")).toBe(9000);
  });

  it("não aceita negativo", () => {
    expect(toCents("-10")).toBe(0);
  });
});

describe("fromCents / formatBRL", () => {
  it("round-trip básico", () => {
    expect(fromCents(10000)).toBe(100);
    expect(formatBRL(3334)).toMatch(/33,34/);
  });
});

describe("splitParcelas — AC-103.1", () => {
  it("R$ 100,00 em 3× → 33,34 + 33,33 + 33,33", () => {
    expect(splitParcelas(10000, 3)).toEqual([3334, 3333, 3333]);
  });

  it("soma das parcelas = total", () => {
    const parts = splitParcelas(10001, 3);
    expect(parts.reduce((a, b) => a + b, 0)).toBe(10001);
  });

  it("1 parcela devolve o total", () => {
    expect(splitParcelas(5000, 1)).toEqual([5000]);
  });

  it("rejeita n < 1", () => {
    expect(() => splitParcelas(100, 0)).toThrow();
  });
});
