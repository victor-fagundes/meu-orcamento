import { describe, expect, it } from "vitest";
import { ERRO_NOME_CATEGORIA_LINHA, ERRO_NOME_CATEGORIA_VAZIO } from "./categorias";
import {
  isItemAtivoParaLancamento,
  normalizeItemLabel,
  validateCreateItem,
} from "./itens";

describe("validateCreateItem", () => {
  it("exige categoria e nome", () => {
    expect(validateCreateItem({ tipo: "V", grupo: "", nome: "Netflix" })).toEqual({
      ok: false,
      error: ERRO_NOME_CATEGORIA_VAZIO,
    });
    expect(validateCreateItem({ tipo: "V", grupo: "Habitação", nome: "  " }).ok).toBe(false);
    expect(validateCreateItem({ tipo: "V", grupo: "Lazer\n", nome: "Cinema" })).toEqual({
      ok: false,
      error: ERRO_NOME_CATEGORIA_LINHA,
    });
  });

  it("normaliza e aceita plano mensal", () => {
    const r = validateCreateItem({
      tipo: "V",
      grupo: "  Habitação  ",
      nome: "Assinaturas",
      planoMensalBRL: 49.9,
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.grupo).toBe("Habitação");
    expect(r.nome).toBe("Assinaturas");
    expect(JSON.parse(r.planoCentavosJson)).toEqual(Array(12).fill(4990));
  });
});

describe("normalize / seletor", () => {
  it("colapsa espaços", () => {
    expect(normalizeItemLabel("  A   B ")).toBe("A B");
  });

  it("arquivado some do seletor", () => {
    expect(isItemAtivoParaLancamento(0)).toBe(true);
    expect(isItemAtivoParaLancamento(1)).toBe(false);
  });
});
