import { describe, expect, it } from "vitest";
import {
  aplicarATodos,
  copiarAnoAnterior,
  copiarMesAnterior,
  parsePlanoFromBRLInputs,
} from "./plano";

describe("plano", () => {
  it("aplicar a todos", () => {
    expect(aplicarATodos(650000)).toEqual(Array(12).fill(650000));
  });

  it("copiar mês anterior só no mês corrente", () => {
    const base = [100, 200, 300, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    expect(copiarMesAnterior(base, 2)).toEqual([100, 200, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    expect(copiarMesAnterior(base, 0)).toEqual(base);
  });

  it("copiar ano anterior indisponível no MVP", () => {
    expect(copiarAnoAnterior([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).available).toBe(false);
  });

  it("parse inputs BRL", () => {
    const r = parsePlanoFromBRLInputs(Array(12).fill("65,00"));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.plano[0]).toBe(6500);
  });
});
