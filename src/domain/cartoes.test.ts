import { describe, expect, it } from "vitest";
import {
  cartaoSemFechamento,
  isCartaoAtivo,
  validateCreateCartao,
} from "./cartoes";

describe("validateCreateCartao", () => {
  it("exige apelido", () => {
    expect(validateCreateCartao({ apelido: "  " }).ok).toBe(false);
  });

  it("aceita fechamento 1–28 e últimos 4", () => {
    const r = validateCreateCartao({
      apelido: "Inter",
      diaFechamento: 25,
      ultimos4: "1234",
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.diaFechamento).toBe(25);
      expect(r.ultimos4).toBe("1234");
    }
  });

  it("rejeita dia 31", () => {
    expect(validateCreateCartao({ apelido: "X", diaFechamento: 31 }).ok).toBe(false);
  });
});

describe("flags", () => {
  it("ativo e sem fechamento", () => {
    expect(isCartaoAtivo(1)).toBe(true);
    expect(isCartaoAtivo(0)).toBe(false);
    expect(cartaoSemFechamento(null)).toBe(true);
    expect(cartaoSemFechamento(25)).toBe(false);
  });
});
