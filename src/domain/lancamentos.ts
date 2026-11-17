import { splitParcelas, toCents } from "./money";
import {
  competenciaMeio,
  competenciasParcelas,
  type Competencia,
  type MeioPagamento,
} from "./competencia";

export type NovoLancamentoInput = {
  itemId: string;
  itemNome: string;
  itemTipo: string; // R | F | V | E
  descricao?: string;
  valorBRL: string | number;
  dataISO: string;
  /** deb | pix | din | cartaoId */
  pagamento: string;
  parcelas?: number;
  diaFechamentoCartao?: number | null;
};

export type ParcelaPreview = {
  n: number;
  total: number;
  valorCentavos: number;
  competencia: Competencia;
};

export type LancamentoDraft =
  | {
      ok: true;
      descricao: string;
      valorTotalCentavos: number;
      meio: MeioPagamento;
      cartaoId: string | null;
      dataTransacao: string;
      parcelas: ParcelaPreview[];
    }
  | { ok: false; error: string };

function resolveMeio(pagamento: string): { meio: MeioPagamento; cartaoId: string | null } {
  if (pagamento === "deb" || pagamento === "pix" || pagamento === "din") {
    return { meio: pagamento, cartaoId: null };
  }
  return { meio: "cartao", cartaoId: pagamento };
}

export function buildLancamentoDraft(input: NovoLancamentoInput): LancamentoDraft {
  if (!input.itemId) return { ok: false, error: "Selecione o item." };
  const valorTotalCentavos = toCents(input.valorBRL);
  if (valorTotalCentavos <= 0) return { ok: false, error: "Informe um valor maior que zero." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.dataISO)) {
    return { ok: false, error: "Data inválida." };
  }

  const { meio, cartaoId } = resolveMeio(input.pagamento);
  let n = Math.trunc(input.parcelas ?? 1);
  if (meio !== "cartao") n = 1;
  if (n < 1 || n > 60) return { ok: false, error: "Parcelas devem ser entre 1 e 60." };
  if (meio === "cartao" && !cartaoId) return { ok: false, error: "Selecione o cartão." };

  const valores = splitParcelas(valorTotalCentavos, n);
  const comps =
    meio === "cartao"
      ? competenciasParcelas(input.dataISO, n, input.diaFechamentoCartao ?? null)
      : Array.from({ length: n }, () => competenciaMeio(input.dataISO, meio));

  if (!comps || comps.some((c) => !c)) {
    return { ok: false, error: "Não foi possível calcular a competência." };
  }

  const desc = (input.descricao ?? "").trim() || input.itemNome;

  return {
    ok: true,
    descricao: desc,
    valorTotalCentavos,
    meio,
    cartaoId,
    dataTransacao: input.dataISO,
    parcelas: valores.map((valorCentavos, i) => ({
      n: i + 1,
      total: n,
      valorCentavos,
      competencia: comps[i] as Competencia,
    })),
  };
}
