import { describe, expect, it } from "vitest";
import {
  aplicarATodos,
  aplicarValorAoMes,
  aplicarValorAoMesESeguintes,
  copiarAnoAnterior,
  copiarMesAnterior,
  lerValorDoPlano,
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

  it("lê o valor do plano sem float", () => {
    expect(lerValorDoPlano("")).toEqual({ ok: false, error: "Informe o valor do plano." });
    expect(lerValorDoPlano("-1")).toEqual({ ok: false, error: "Informe um valor maior ou igual a zero." });
    expect(lerValorDoPlano("1,234")).toEqual({ ok: false, error: "Use no máximo duas casas decimais." });
    expect(lerValorDoPlano("0")).toEqual({ ok: true, centavos: 0 });
    expect(lerValorDoPlano("0,00")).toEqual({ ok: true, centavos: 0 });
  });

  it("grava o mês aberto e, com o interruptor, os seguintes", () => {
    const zeros = Array(12).fill(0);
    const novembro = aplicarValorAoMes(zeros, 10, 40000);
    expect(novembro[10]).toBe(40000);
    expect(novembro.filter((valor) => valor === 40000)).toHaveLength(1);
    const seguintes = aplicarValorAoMesESeguintes(zeros, 10, 40000);
    expect(seguintes.slice(0, 10)).toEqual(Array(10).fill(0));
    expect(seguintes[10]).toBe(40000);
    expect(seguintes[11]).toBe(40000);
    expect(aplicarValorAoMesESeguintes(zeros, 11, 40000)[11]).toBe(40000);
    expect(aplicarValorAoMesESeguintes(zeros, 11, 40000).slice(0, 11)).toEqual(Array(11).fill(0));
  });

  it("janeiro não copia e o ano anterior continua indisponível", () => {
    const base = [100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    expect(copiarMesAnterior(base, 0)).toEqual(base);
    const ano = copiarAnoAnterior(base);
    expect(ano.available).toBe(false);
    expect(ano.plano).toEqual(base);
  });

  it("parse inputs BRL", () => {
    const r = parsePlanoFromBRLInputs(Array(12).fill("65,00"));
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.plano[0]).toBe(6500);
  });
});
