import { toCents } from "./money";
import { competenciaMeio, type MeioPagamento } from "./competencia";

export type EditScope = "one" | "future";

export type LancamentoRow = {
  id: string;
  itemId: string;
  cartaoId: string | null;
  descricao: string;
  valorCentavos: number;
  dataTransacao: string;
  competencia: string;
  meio: string;
  parcelaN: number | null;
  parcelaTotal: number | null;
  grupoParcelaId: string | null;
};

export type EditPatchInput = {
  itemId: string;
  itemNome: string;
  descricao?: string;
  valorBRL: string | number;
  dataISO: string;
  /** deb | pix | din | cartaoId */
  pagamento: string;
  diaFechamentoCartao?: number | null;
};

export type PlannedUpdate = {
  id: string;
  itemId: string;
  cartaoId: string | null;
  descricao: string;
  valorCentavos: number;
  dataTransacao: string;
  competencia: string;
  meio: MeioPagamento;
};

/** Avança N meses mantendo o dia, ajustando ao último dia do mês. */
export function addMonthsKeepingDay(iso: string, months: number): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return null;
  const y0 = Number(m[1]);
  const mo0 = Number(m[2]) - 1;
  const d0 = Number(m[3]);
  const total = mo0 + months;
  const y = y0 + Math.floor(total / 12);
  const mo = ((total % 12) + 12) % 12;
  const last = new Date(y, mo + 1, 0).getDate();
  const d = Math.min(d0, last);
  return `${y}-${String(mo + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function resolvePagamento(pagamento: string): { meio: MeioPagamento; cartaoId: string | null } {
  if (pagamento === "deb" || pagamento === "pix" || pagamento === "din") {
    return { meio: pagamento, cartaoId: null };
  }
  return { meio: "cartao", cartaoId: pagamento };
}

/**
 * Planeja updates de edição. `group` = todas as parcelas do grupo (ordenadas por parcelaN).
 * Valor é por parcela — não redistribui.
 */
export function planEditLancamento(
  target: LancamentoRow,
  group: LancamentoRow[],
  patch: EditPatchInput,
  scope: EditScope,
): { ok: true; updates: PlannedUpdate[]; affected: number } | { ok: false; error: string } {
  if (!patch.itemId) return { ok: false, error: "Selecione o item." };
  const valorCentavos = toCents(patch.valorBRL);
  if (valorCentavos <= 0) return { ok: false, error: "Informe um valor maior que zero." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(patch.dataISO)) {
    return { ok: false, error: "Data inválida." };
  }

  const { meio, cartaoId } = resolvePagamento(patch.pagamento);
  if (meio === "cartao" && !cartaoId) return { ok: false, error: "Selecione o cartão." };

  const descricao = (patch.descricao ?? "").trim() || patch.itemNome;
  const isGroup = !!target.grupoParcelaId && group.length > 1;
  const effectiveScope: EditScope = isGroup ? scope : "one";

  let targets: LancamentoRow[];
  if (!isGroup || effectiveScope === "one") {
    targets = [target];
  } else {
    const sorted = [...group].sort((a, b) => (a.parcelaN ?? 0) - (b.parcelaN ?? 0));
    const from = sorted.findIndex((x) => x.id === target.id);
    if (from < 0) return { ok: false, error: "Parcela não encontrada no grupo." };
    targets = sorted.slice(from);
  }

  const updates: PlannedUpdate[] = [];
  for (let i = 0; i < targets.length; i++) {
    const row = targets[i]!;
    const dataTransacao =
      i === 0
        ? patch.dataISO
        : addMonthsKeepingDay(patch.dataISO, i) ?? patch.dataISO;
    const competencia = competenciaMeio(
      dataTransacao,
      meio,
      meio === "cartao" ? (patch.diaFechamentoCartao ?? null) : null,
    );
    if (!competencia) return { ok: false, error: "Não foi possível calcular a competência." };

    updates.push({
      id: row.id,
      itemId: patch.itemId,
      cartaoId,
      descricao,
      valorCentavos,
      dataTransacao,
      competencia,
      meio,
    });
  }

  return { ok: true, updates, affected: updates.length };
}
