import { describe, expect, it } from "vitest";
import { formatBRL } from "@/domain/money";
import { hrefOrcamentoMes, textoFiltroResumo } from "./resumo-filtro";

describe("textoFiltroResumo", () => {
  it("com pagamento filtrado o saldo do mês permanece e a frase cita o recorte", () => {
    const frase = textoFiltroResumo({
      ativo: true,
      saldoMesCentavos: 102_400,
      gastoRecorteCentavos: 64_000,
      rotuloFiltro: "PIX",
    });
    expect(frase).toContain(formatBRL(102_400));
    expect(frase).toContain(formatBRL(64_000));
    expect(frase).toContain("PIX");
  });

  it("filtro de categoria também cita o recorte e o mês", () => {
    const frase = textoFiltroResumo({
      ativo: true,
      saldoMesCentavos: 0,
      gastoRecorteCentavos: 1_500,
      rotuloFiltro: "Mercado",
    });
    expect(frase).toContain("Mercado");
    expect(frase).toContain(formatBRL(0));
    expect(frase).toContain(formatBRL(1_500));
  });

  it("sem filtro não há frase de recorte", () => {
    expect(
      textoFiltroResumo({
        ativo: false,
        saldoMesCentavos: 100,
        gastoRecorteCentavos: 50,
        rotuloFiltro: "PIX",
      }),
    ).toBeNull();
  });
});

describe("hrefOrcamentoMes", () => {
  it("o endereço do mês carrega mes e tipo", () => {
    expect(hrefOrcamentoMes("2026-11", "V")).toBe("/app/orcamento?mes=2026-11&tipo=V");
  });

  it("tipo desconhecido cai em fixas", () => {
    expect(hrefOrcamentoMes("2026-12", "X")).toBe("/app/orcamento?mes=2026-12&tipo=F");
  });
});
