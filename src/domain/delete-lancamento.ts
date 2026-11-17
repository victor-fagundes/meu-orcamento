import type { LancamentoRow } from "./edit-lancamento";

export type DeleteScope = "one" | "future" | "all";

export function planDeleteLancamento(
  target: LancamentoRow,
  group: LancamentoRow[],
  scope: DeleteScope,
): { ok: true; ids: string[]; count: number } | { ok: false; error: string } {
  const isGroup = !!target.grupoParcelaId && group.length > 1;
  if (!isGroup) {
    return { ok: true, ids: [target.id], count: 1 };
  }

  const sorted = [...group].sort((a, b) => (a.parcelaN ?? 0) - (b.parcelaN ?? 0));
  let targets: LancamentoRow[];
  if (scope === "all") {
    targets = sorted;
  } else if (scope === "one") {
    targets = [target];
  } else {
    const from = sorted.findIndex((x) => x.id === target.id);
    if (from < 0) return { ok: false, error: "Parcela não encontrada no grupo." };
    targets = sorted.slice(from);
  }

  return { ok: true, ids: targets.map((t) => t.id), count: targets.length };
}
