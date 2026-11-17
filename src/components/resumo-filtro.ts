import { formatBRL } from "@/domain/money";

const TIPOS = new Set(["R", "F", "V", "E"]);

export function textoFiltroResumo(input: {
  ativo: boolean;
  saldoMesCentavos: number;
  gastoRecorteCentavos: number;
  rotuloFiltro: string;
}): string | null {
  if (!input.ativo) return null;
  return `No ${input.rotuloFiltro} foram ${formatBRL(input.gastoRecorteCentavos)}. O mês inteiro ainda pode gastar ${formatBRL(input.saldoMesCentavos)}.`;
}

export function hrefOrcamentoMes(mes: string, tipo: string): string {
  const safe = TIPOS.has(tipo) ? tipo : "F";
  return `/app/orcamento?mes=${mes}&tipo=${safe}`;
}
