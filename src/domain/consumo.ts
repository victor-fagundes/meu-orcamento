export type ConsumoEstado =
  | "ok"
  | "preventivo"
  | "atingido"
  | "estourado"
  | "sem_planejado"
  | "vazio";

export const LIMITE_PREVENTIVO_PADRAO = 80;

export function consumoPct(realizado: number, planejado: number): number {
  if (planejado <= 0) return realizado > 0 ? 100 : 0;
  return (realizado / planejado) * 100;
}

export function barraPctVisual(realizado: number, planejado: number): number {
  return Math.min(100, consumoPct(realizado, planejado));
}

export function estadoConsumo(
  realizado: number,
  planejado: number,
  limitePreventivo = LIMITE_PREVENTIVO_PADRAO,
): ConsumoEstado {
  if (planejado <= 0 && realizado > 0) return "sem_planejado";
  if (planejado <= 0 && realizado <= 0) return "vazio";
  const pct = consumoPct(realizado, planejado);
  if (pct > 100) return "estourado";
  if (pct >= 100) return "atingido";
  if (pct >= limitePreventivo) return "preventivo";
  return "ok";
}

export function textoConsumoDespesa(
  realizado: number,
  planejado: number,
  format: (cents: number) => string,
  limitePreventivo = LIMITE_PREVENTIVO_PADRAO,
): string {
  const est = estadoConsumo(realizado, planejado, limitePreventivo);
  if (est === "sem_planejado") return "Gasto sem orçamento planejado";
  if (est === "vazio") return "Sem movimento neste mês";
  if (est === "atingido") return "Orçamento atingido";
  if (est === "estourado") return `Estourou em ${format(realizado - planejado)}`;
  return `Ainda pode gastar ${format(planejado - realizado)}`;
}

export function textoConsumoReceita(
  realizado: number,
  planejado: number,
  format: (cents: number) => string,
): string {
  if (planejado <= 0 && realizado <= 0) return "Sem meta de receita neste mês";
  if (planejado <= 0 && realizado > 0) return "Recebido sem meta planejada";
  if (realizado >= planejado) return "Meta de receita atingida";
  return `Falta receber ${format(planejado - realizado)}`;
}
