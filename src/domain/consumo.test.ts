import { describe, expect, it } from "vitest";
import {
  barraPctVisual,
  estadoConsumo,
  textoConsumoDespesa,
} from "./consumo";

const fmt = (n: number) => `R$${n}`;

describe("consumo", () => {
  it("estados 80 / 100 / >100", () => {
    expect(estadoConsumo(79, 100)).toBe("ok");
    expect(estadoConsumo(80, 100)).toBe("preventivo");
    expect(estadoConsumo(100, 100)).toBe("atingido");
    expect(estadoConsumo(101, 100)).toBe("estourado");
  });

  it("barra máx 100 e sem planejado", () => {
    expect(barraPctVisual(150, 100)).toBe(100);
    expect(estadoConsumo(50, 0)).toBe("sem_planejado");
    expect(textoConsumoDespesa(50, 0, fmt)).toBe("Gasto sem orçamento planejado");
  });
});
