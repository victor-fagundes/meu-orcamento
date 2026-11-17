import { parseDateCell, parseMoneyCellToCents } from "./import-planilha";

export type PdfIssuer = "inter" | "nubank" | "itau" | "bradesco" | "c6" | "generico";

export type PdfPreviewRow = {
  n: number;
  ok: boolean;
  why?: string;
  dt: string | null;
  desc: string;
  valCents: number;
  /** total da compra (todas as parcelas); se null = valor da linha */
  totalCents: number;
  parcelaN: number | null;
  parcelaTotal: number | null;
  estorno: boolean;
  ignore: boolean;
  itemId: string | null;
  itemHint: string;
};

const SKIP_RE =
  /total|saldo|pagamento|limite|fatura|demonstrativo|juros|iof|encargos|vencimento|mínimo|minimo|anuidade|cet\b|resumo|per[ií]odo/i;

const LINE_RE =
  /^(\d{2}[\/\-]\d{2}(?:[\/\-]\d{2,4})?)\s+(.+?)\s+([\d.,]+-?)\s*$/;
const LINE_RE_LOOSE =
  /(\d{2}[\/\-]\d{2}(?:[\/\-]\d{2,4})?)\s+(.+?)\s+([\d.,]+-?)\s*$/;

const PARC_RE =
  /(?:parc\.?\s*)?(\d{1,2})\s*(?:\/|de)\s*(\d{1,2})/i;

export function detectPdfIssuer(text: string): PdfIssuer {
  const t = text.toLowerCase();
  if (
    t.includes("banco inter") ||
    t.includes("inter bank") ||
    (/\binter\b/.test(t) && t.includes("fatura"))
  )
    return "inter";
  if (t.includes("nubank") || t.includes("nu pagamentos")) return "nubank";
  if (t.includes("itaú") || t.includes("itau")) return "itau";
  if (t.includes("bradesco")) return "bradesco";
  if (t.includes("c6 bank") || /\bc6\b/.test(t)) return "c6";
  return "generico";
}

export function detectPdfScan(text: string): boolean {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length < 40) return true;
  const digitRatio = (cleaned.match(/\d/g) || []).length / cleaned.length;
  const letterRatio = (cleaned.match(/[a-zA-ZÀ-ÿ]/g) || []).length / cleaned.length;
  return letterRatio < 0.15 || (digitRatio > 0.5 && letterRatio < 0.25);
}

export function parseParcelaFromDesc(desc: string): { n: number; total: number } | null {
  const m = desc.match(PARC_RE);
  if (!m) return null;
  const n = Number(m[1]);
  const total = Number(m[2]);
  if (!n || !total || n < 1 || total < 1 || n > total || total > 60) return null;
  return { n, total };
}

/** Sugestão simples de item por palavra-chave na descrição. */
export function suggestItemHint(desc: string): string {
  const d = desc.toLowerCase();
  if (/uber|99\b|taxi|posto|shell|ipiranga|combust/.test(d)) return "Transporte";
  if (/ifood|rappi|restaurante|padaria|mercado|super|feira|carrefour|assai/.test(d))
    return "Alimentação";
  if (/netflix|spotify|disney|prime|cinema|bar\b/.test(d)) return "Lazer";
  if (/farmac|droga|raia|pacheco|medico|hospital/.test(d)) return "Saúde";
  if (/amazon|magazine|shopee|mercado livre|ml\b/.test(d)) return "Outros";
  return "Importado";
}

/**
 * Extrai linhas de compra de texto de fatura (genérico + pequenos ajustes por emissor).
 * Valores em centavos. Não grava nada.
 */
export function buildPdfPreview(text: string): {
  issuer: PdfIssuer;
  rows: PdfPreviewRow[];
  confidence: number;
} {
  const issuer = detectPdfIssuer(text);
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const rows: PdfPreviewRow[] = [];
  let considered = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (SKIP_RE.test(line) && !/\d{2}[\/\-]\d{2}/.test(line)) continue;

    const m = line.match(LINE_RE) || line.match(LINE_RE_LOOSE);
    if (!m) continue;
    considered += 1;

    const rawDate = m[1]!;
    let desc = m[2]!.replace(/\s+/g, " ").trim();
    const rawVal = m[3]!;
    const negative = /-$/.test(rawVal) || rawVal.trim().startsWith("-");
    const valCents = parseMoneyCellToCents(rawVal.replace(/-/g, ""));
    // Datas sem ano: assume ano corrente (ajustável na prévia)
    const withYear =
      rawDate.match(/\d{4}$/) || rawDate.split(/[\/\-]/).length >= 3
        ? rawDate
        : `${rawDate}/${new Date().getFullYear()}`;
    const dt = parseDateCell(withYear);
    const parc = parseParcelaFromDesc(desc);
    if (parc) {
      desc = desc.replace(PARC_RE, "").replace(/\s+/g, " ").trim();
    }

    const estorno = negative || /estorno|cancelamento|ajuste\s*cr[eé]dito/i.test(desc);

    if (!dt || !(valCents > 0)) {
      rows.push({
        n: rows.length + 1,
        ok: false,
        why: !dt ? "Data inválida" : "Valor inválido",
        dt,
        desc,
        valCents,
        totalCents: valCents,
        parcelaN: parc?.n ?? null,
        parcelaTotal: parc?.total ?? null,
        estorno,
        ignore: true,
        itemId: null,
        itemHint: suggestItemHint(desc),
      });
      continue;
    }

    rows.push({
      n: rows.length + 1,
      ok: true,
      dt,
      desc,
      valCents,
      totalCents: valCents,
      parcelaN: parc?.n ?? null,
      parcelaTotal: parc?.total ?? null,
      estorno,
      ignore: false,
      itemId: null,
      itemHint: suggestItemHint(desc),
    });
  }

  const okCount = rows.filter((r) => r.ok).length;
  const confidence = considered === 0 ? 0 : Math.round((okCount / considered) * 100);

  // Inter: às vezes descrição e valor em linhas separadas — MVP genérico cobre o comum
  void issuer;

  return { issuer, rows: rows.slice(0, 300), confidence };
}
