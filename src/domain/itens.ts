import type { TipoOrcamento } from "./catalog";
import { planoJsonFromBRL, zeroPlanoJson } from "./catalog";

export type CreateItemInput = {
  tipo: TipoOrcamento;
  grupo: string;
  nome: string;
  /** Valor mensal em reais (UI) — aplica aos 12 meses; opcional. */
  planoMensalBRL?: number;
};

export type CreateItemResult =
  | { ok: true; grupo: string; nome: string; planoCentavosJson: string }
  | { ok: false; error: string };

const TIPOS: TipoOrcamento[] = ["R", "F", "V", "E"];

export function normalizeItemLabel(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

export function validateCreateItem(input: CreateItemInput): CreateItemResult {
  if (!TIPOS.includes(input.tipo)) {
    return { ok: false, error: "Tipo inválido." };
  }
  const grupo = normalizeItemLabel(input.grupo);
  const nome = normalizeItemLabel(input.nome);
  if (!grupo) return { ok: false, error: "Informe a categoria." };
  if (!nome) return { ok: false, error: "Informe o nome do item." };
  if (grupo.length > 80 || nome.length > 80) {
    return { ok: false, error: "Categoria ou nome muito longo." };
  }

  let planoCentavosJson = zeroPlanoJson();
  if (input.planoMensalBRL != null && input.planoMensalBRL !== 0) {
    if (!Number.isFinite(input.planoMensalBRL) || input.planoMensalBRL < 0) {
      return { ok: false, error: "Valor planejado inválido." };
    }
    planoCentavosJson = planoJsonFromBRL(input.planoMensalBRL);
  }

  return { ok: true, grupo, nome, planoCentavosJson };
}

/** Itens elegíveis para novo lançamento (e lista do Orçamento). */
export function isItemAtivoParaLancamento(arquivado: number | boolean): boolean {
  return arquivado !== 1 && arquivado !== true;
}
