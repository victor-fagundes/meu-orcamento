import { describe, expect, it } from "vitest";
import {
  cartaoSemFechamento,
  isCartaoAtivo,
  textoLinhaCartao,
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

  it("separa fechamento de vencimento", () => {
    const ok28 = validateCreateCartao({ apelido: "  Nubank  ", diaFechamento: 28, diaVencimento: 31 });
    expect(ok28.ok).toBe(true);
    if (ok28.ok) {
      expect(ok28.apelido).toBe("Nubank");
      expect(ok28.diaFechamento).toBe(28);
      expect(ok28.diaVencimento).toBe(31);
    }
    expect(validateCreateCartao({ apelido: "X", diaFechamento: 29 })).toEqual({
      ok: false,
      error: "Dia de fechamento deve ser entre 1 e 28.",
    });
    expect(validateCreateCartao({ apelido: "X", diaFechamento: 0 }).ok).toBe(false);
    expect(validateCreateCartao({ apelido: "X", diaVencimento: 32 })).toEqual({
      ok: false,
      error: "Dia de vencimento deve ser entre 1 e 31.",
    });
    expect(validateCreateCartao({ apelido: "X", diaVencimento: 0 }).ok).toBe(false);
    const vazio = validateCreateCartao({ apelido: "X" });
    expect(vazio.ok).toBe(true);
    if (vazio.ok) {
      expect(vazio.diaFechamento).toBeNull();
      expect(vazio.diaVencimento).toBeNull();
    }
    expect(validateCreateCartao({ apelido: "x".repeat(61) })).toEqual({
      ok: false,
      error: "Apelido muito longo.",
    });
  });
});

describe("textoLinhaCartao", () => {
  it("não inventa dia ausente", () => {
    expect(textoLinhaCartao({ diaFechamento: 2, diaVencimento: 9 })).toBe("Fecha dia 2 · vence dia 9");
    expect(textoLinhaCartao({ diaFechamento: 2, diaVencimento: null })).toBe("Fecha dia 2");
    expect(textoLinhaCartao({ diaFechamento: null, diaVencimento: null })).toBe(
      "Sem dia de fechamento, a competência é o mês da compra.",
    );
    expect(textoLinhaCartao({ diaFechamento: null, diaVencimento: 9 })).toBe(
      "Sem dia de fechamento, a competência é o mês da compra. · vence dia 9",
    );
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
