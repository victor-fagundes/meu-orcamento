import type { TipoOrcamento } from "./catalog";
import { isItemAtivoParaLancamento } from "./itens";
import { normalizeHeader } from "./import-planilha";

/** Nomes que a seção da planilha usava como grupo e que repetem a aba do Orçamento. */
export const GRUPOS_NOME_DE_ABA = [
  "Receitas",
  "Despesas Fixas",
  "Despesas Variáveis",
  "Anuais",
] as const;

export function isGrupoNomeDeAba(grupo: string): boolean {
  const n = normalizeHeader(grupo);
  return GRUPOS_NOME_DE_ABA.some((g) => normalizeHeader(g) === n);
}

/** Grupo gravado pela seção da planilha. “Receitas” fica de fora: é o grupo do catálogo de receitas. */
export function isGrupoExtraImportado(grupo: string): boolean {
  const n = normalizeHeader(grupo);
  return (["Despesas Fixas", "Despesas Variáveis", "Anuais"] as const).some(
    (g) => normalizeHeader(g) === n,
  );
}

export type CatalogRef = {
  tipo: TipoOrcamento;
  grupo: string;
  nome: string;
  ativo: boolean;
};

export type PlanoAlvoKind = "catalogo" | "outros" | "escolher";

export type PlanoAlvo = {
  alvo: PlanoAlvoKind;
  tipo: TipoOrcamento;
  grupo: string;
  /** Chaves `tipo|grupo` quando há mais de um item do catálogo com o mesmo nome. */
  candidatos: string[];
};

function catalogItems(items: CatalogRef[]): CatalogRef[] {
  return items.filter((i) => i.ativo && !isGrupoNomeDeAba(i.grupo));
}

function sameName(a: string, b: string): boolean {
  return normalizeHeader(a) === normalizeHeader(b);
}

function candidateKey(tipo: TipoOrcamento, grupo: string): string {
  return `${tipo}|${grupo}`;
}

export function assignPlanoAlvo(
  row: { tipo: TipoOrcamento; nome: string; grupo: string },
  items: CatalogRef[],
  escolha?: string,
): PlanoAlvo {
  const matches = catalogItems(items).filter((i) => sameName(i.nome, row.nome));
  const uniq = new Map<string, CatalogRef>();
  for (const m of matches) uniq.set(candidateKey(m.tipo, m.grupo), m);
  const keys = [...uniq.keys()];

  if (keys.length === 1) {
    const hit = uniq.get(keys[0]!)!;
    return { alvo: "catalogo", tipo: hit.tipo, grupo: hit.grupo, candidatos: [] };
  }

  if (keys.length > 1) {
    const picked = escolha ? uniq.get(escolha) : undefined;
    if (picked) {
      return { alvo: "catalogo", tipo: picked.tipo, grupo: picked.grupo, candidatos: [] };
    }
    return { alvo: "escolher", tipo: row.tipo, grupo: row.grupo, candidatos: keys };
  }

  return { alvo: "outros", tipo: row.tipo, grupo: "Outros", candidatos: [] };
}

/** 12 inteiros. Mês do catálogo > 0 permanece. Mês 0 recebe o maior extra positivo. */
export function mergePlanFromExtras(catalog: number[], extras: number[][]): number[] {
  const out = catalog.slice(0, 12).map((n) => (Number.isFinite(n) ? Math.trunc(n) : 0));
  while (out.length < 12) out.push(0);
  for (let m = 0; m < 12; m++) {
    if ((out[m] ?? 0) > 0) continue;
    let best = 0;
    for (const ex of extras) {
      const v = Math.trunc(ex[m] ?? 0);
      if (Number.isFinite(v) && v > best) best = v;
    }
    if (best > 0) out[m] = best;
  }
  return out;
}

export function ordenarGrupos<T extends { grupo: string; plano: number; realizado: number }>(
  rows: T[],
): T[] {
  return [...rows].sort((a, b) => {
    const aOn = a.plano > 0 || a.realizado > 0;
    const bOn = b.plano > 0 || b.realizado > 0;
    if (aOn !== bOn) return aOn ? -1 : 1;
    return a.grupo.localeCompare(b.grupo, "pt-BR");
  });
}

export function preferirItem<T extends { id: string; nome: string; plano: number[] }>(
  itens: T[],
  monthIndex: number,
): T {
  const first = itens[0];
  if (!first) throw new Error("lista vazia");
  const month = Math.min(11, Math.max(0, monthIndex));
  const scored = itens.map((item) => {
    const plano = item.plano.slice(0, 12).map((n) => (Number.isFinite(n) ? Math.trunc(n) : 0));
    const noMes = (plano[month] ?? 0) > 0 ? 2 : 0;
    const noAno = plano.some((n) => n > 0) ? 1 : 0;
    return { item, rank: Math.max(noMes, noAno) };
  });
  const best = Math.max(...scored.map((s) => s.rank));
  return scored.find((s) => s.rank === best)!.item;
}

export function planoAtivo(arquivado: number | boolean): boolean {
  return isItemAtivoParaLancamento(arquivado);
}
