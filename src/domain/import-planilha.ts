import { toCents } from "./money";

export type LayoutKind = "lanc" | "vf" | "plano";

export type ColumnMap = {
  data: string;
  valor: string;
  desc: string;
  cat: string;
  item: string;
  tipo: string;
  meio: string;
};

export type PreviewRow = {
  n: number;
  ok: boolean;
  why?: string;
  dt: string | null;
  /** Competência pós-regra (cartão/meio), preenchida na prévia da application */
  competencia?: string | null;
  desc: string;
  valCents: number;
  tipo: "R" | "V";
  grupo: string;
  itemNome: string;
  meio: string;
  duplicate?: boolean;
  /** true se o ano da data veio do cabeçalho de seção/fatura */
  dateYearFromSection?: boolean;
};

const IMP_HDR: Record<keyof ColumnMap, string[]> = {
  data: ["data", "dt", "date", "dia", "vencimento"],
  valor: ["valor", "amount", "vlr", "preco", "preco total", "total"],
  desc: ["descricao", "desc", "historico", "memo", "lancamento"],
  cat: ["categoria", "grupo", "classificacao"],
  item: ["item", "subcategoria", "conta", "nome"],
  tipo: ["tipo", "natureza"],
  meio: ["pagamento", "forma", "meio", "cartao"],
};

const IMP_MON = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const IMP_MON_FULL = [
  "janeiro",
  "fevereiro",
  "marco",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

export function normalizeHeader(s: string): string {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function isPlausibleIsoDate(iso: string): boolean {
  const y = Number(iso.slice(0, 4));
  return y >= 2000 && y <= 2099;
}

export function emptyMap(): ColumnMap {
  return { data: "", valor: "", desc: "", cat: "", item: "", tipo: "", meio: "" };
}

export function guessMap(headers: string[]): ColumnMap {
  const m = emptyMap();
  headers.forEach((h, i) => {
    const n = normalizeHeader(h);
    (Object.keys(IMP_HDR) as (keyof ColumnMap)[]).forEach((k) => {
      if (!m[k] && IMP_HDR[k].some((a) => n.includes(a))) m[k] = String(i);
    });
  });
  return m;
}

export function detectLayout(rows: unknown[][]): LayoutKind {
  if (!rows?.length) return "lanc";
  const headerRow = rows.find((r) => r.some((c) => String(c).trim())) || [];
  const headers = headerRow.map((c) => String(c ?? ""));
  const h0 = headers.map(normalizeHeader);
  const mon = h0.filter(
    (x) => IMP_MON.includes(x) || IMP_MON_FULL.includes(x) || /^\d{1,2}$/.test(x),
  ).length;
  const hasPipe = rows.some((r) => String(r[0] || "").match(/^(R|F|V|E)\|/));
  const map = guessMap(headers);
  // Lista de lançamentos (ex.: Cartão Inter: Data / Descrição / Valor / Mês)
  const looksLanc = !!(map.data && map.valor);

  if (mon >= 6 && (h0.some((x) => x.includes("tipo")) || hasPipe)) {
    return "vf";
  }
  if (mon >= 4) return "plano";
  if (looksLanc) return "lanc";

  // Planilha de controle (mês como linha / textos de UI) — não é lista de lançamentos
  const sample = rows.slice(0, 50).flat().map((c) => normalizeHeader(String(c ?? "")));
  const monthLabels = sample.filter(
    (x) => IMP_MON.includes(x) || IMP_MON_FULL.includes(x),
  ).length;
  const planSignal = sample.some(
    (x) =>
      x.includes("selecione o mes") ||
      x.includes("meta de investimento") ||
      x.includes("planejado") ||
      x.includes("orcado") ||
      x.includes("orcamento mensal"),
  );
  if (hasPipe) return "vf";
  if (planSignal || monthLabels >= 4) return "plano";

  return "lanc";
}

/** Detecta delimitador e decodifica UTF-8 ou Latin-1. */
export function parseCsvText(raw: string): string[][] {
  let text = raw;
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const delim = text.split("\n")[0]?.includes(";") && !text.split("\n")[0]?.includes(",") ? ";" : ",";
  const lines = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const rows: string[][] = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    rows.push(splitCsvLine(line, delim));
  }
  while (rows.length && !rows[0]!.some((c) => String(c).trim())) rows.shift();
  return rows;
}

function splitCsvLine(line: string, delim: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (ch === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else inQ = !inQ;
      continue;
    }
    if (ch === delim && !inQ) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

export function decodeCsvBuffer(buf: ArrayBuffer): string {
  const u8 = new Uint8Array(buf);
  try {
    const utf8 = new TextDecoder("utf-8", { fatal: true }).decode(u8);
    if (!utf8.includes("\uFFFD")) return utf8;
  } catch {
    /* fallthrough */
  }
  return new TextDecoder("latin1").decode(u8);
}

export type ParseDateOpts = {
  /** Ano da fatura/seção (ex.: MARÇO / 2026 → 2026) */
  defaultYear?: number;
  /** Mês 0–11 da fatura; se compra for em mês “maior”, usa ano anterior */
  billMonthIndex?: number;
};

/** Cabeçalho de fatura: "MARÇO / 2026" */
export function parseFaturaSection(label: string): { year: number; monthIndex: number } | null {
  const s = String(label || "").trim();
  const m = s.match(/^(.+?)\s*\/\s*(\d{4})\s*$/);
  if (!m) return null;
  const monthIndex = monthIndexFromLabel(m[1]!);
  if (monthIndex < 0) return null;
  return { year: Number(m[2]), monthIndex };
}

export function parseDateCell(v: unknown, opts?: ParseDateOpts): string | null {
  if (v == null || v === "") return null;
  if (typeof v === "number" && Number.isFinite(v)) {
    // Excel serial (~2000-01-01 … 2099-12-31). Rejeita 0 / frações / money.
    const serial = Math.floor(v);
    if (serial < 36526 || serial > 73415) return null;
    const epoch = Date.UTC(1899, 11, 30);
    const d = new Date(epoch + serial * 86400000);
    if (Number.isNaN(d.getTime())) return null;
    const iso = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
    return isPlausibleIsoDate(iso) ? iso : null;
  }
  const s = String(v).trim();
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    const out = `${iso[1]}-${iso[2]}-${iso[3]}`;
    return isPlausibleIsoDate(out) ? out : null;
  }
  const br = s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/);
  if (br) {
    let y = Number(br[3]);
    if (y < 100) y += 2000;
    const out = `${y}-${String(Number(br[2])).padStart(2, "0")}-${String(Number(br[1])).padStart(2, "0")}`;
    return isPlausibleIsoDate(out) ? out : null;
  }
  // Ex.: 05/jan, 14/fev/2026 (fatura Inter)
  const abbr = s.match(
    /^(\d{1,2})[\/\-.](jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)(?:[\/\-.](\d{2,4}))?$/i,
  );
  if (abbr) {
    const mon = monthIndexFromLabel(abbr[2]!);
    if (mon < 0) return null;
    const yRaw = abbr[3] ? Number(abbr[3]) : opts?.defaultYear;
    if (yRaw == null) return null;
    let y = yRaw;
    if (y < 100) y += 2000;
    // Parcela antiga na fatura: 28/nov em fatura SET/2026 → 2025-11-28
    if (abbr[3] == null && opts?.billMonthIndex != null && mon > opts.billMonthIndex) {
      y -= 1;
    }
    const out = `${y}-${String(mon + 1).padStart(2, "0")}-${String(Number(abbr[1])).padStart(2, "0")}`;
    return isPlausibleIsoDate(out) ? out : null;
  }
  return null;
}

export function parseMoneyCellToCents(v: unknown): number {
  if (v == null || v === "") return 0;
  if (typeof v === "number" && Number.isFinite(v)) {
    return Math.max(0, Math.round(v * 100));
  }
  return toCents(String(v));
}

export function buildLancPreview(
  rows: unknown[][],
  map: ColumnMap,
  opts: { createItems: boolean; defaultMeio: string },
): PreviewRow[] {
  if (!rows.length) return [];
  const headers = (rows[0] || []).map((c) => normalizeHeader(String(c ?? "")));
  const mesColIdx = headers.findIndex(
    (h) => h === "mes" || h.includes("competencia") || h === "fatura",
  );
  const body = rows.slice(1);
  const out: PreviewRow[] = [];

  const cell = (r: unknown[], key: keyof ColumnMap) => {
    if (!map[key]) return "";
    const idx = Number(map[key]);
    if (!Number.isFinite(idx)) return "";
    return r[idx];
  };

  let ctxYear = 0;
  let ctxBillMonth = 0;
  let hasSectionYear = false;

  body.forEach((r, n) => {
    const rawData = cell(r, "data");
    const section = parseFaturaSection(String(rawData ?? ""));
    if (section) {
      ctxYear = section.year;
      ctxBillMonth = section.monthIndex;
      hasSectionYear = true;
      return;
    }

    const mesLabel =
      mesColIdx >= 0 ? String(r[mesColIdx] ?? "").trim() : "";
    const billFromRow = mesLabel ? monthIndexFromLabel(mesLabel) : -1;
    const billMonthIndex = billFromRow >= 0 ? billFromRow : ctxBillMonth;

    const dt = parseDateCell(rawData, {
      defaultYear: hasSectionYear ? ctxYear : undefined,
      billMonthIndex: hasSectionYear ? billMonthIndex : undefined,
    });
    const valCents = parseMoneyCellToCents(cell(r, "valor"));
    const descRaw = String(cell(r, "desc") || cell(r, "item") || "Importado").trim();
    const tp = String(cell(r, "tipo") || "V").toUpperCase();
    const tipo: "R" | "V" = tp.startsWith("R") ? "R" : "V";
    const cat = String(cell(r, "cat") || "").trim();
    const grupo = cat || "Importado";
    // Classificação da fatura vira item; senão usa descrição
    const itemNome = String(cell(r, "item") || cat || descRaw || "Importado").trim() || "Importado";
    const meioCell = String(cell(r, "meio") || "").trim();
    const meio = meioCell || opts.defaultMeio;
    const dateYearFromSection = hasSectionYear;

    if (!dt || !(valCents > 0)) {
      out.push({
        n: n + 2,
        ok: false,
        why: !dt
          ? hasSectionYear
            ? "Data inválida"
            : "Data inválida (sem ano de seção na planilha)"
          : "Valor inválido",
        dt,
        desc: descRaw,
        valCents,
        tipo,
        grupo,
        itemNome,
        meio,
        dateYearFromSection,
      });
      return;
    }

    out.push({
      n: n + 2,
      ok: true,
      dt,
      desc: descRaw,
      valCents,
      tipo,
      grupo,
      itemNome,
      meio,
      dateYearFromSection,
    });
  });

  return out.slice(0, 800);
}

/** D-05: trim, minúsculas, sem acento. */
export function normalizarDescricaoDuplicata(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function markDuplicates(
  preview: PreviewRow[],
  existing: { dataISO: string; valorCentavos: number; descricao: string; meio: string }[],
): PreviewRow[] {
  return preview.map((row) => {
    if (!row.ok || !row.dt) return row;
    const desc = normalizarDescricaoDuplicata(row.desc ?? "");
    const dup = existing.some(
      (e) =>
        e.dataISO === row.dt &&
        e.valorCentavos === row.valCents &&
        normalizarDescricaoDuplicata(e.descricao) === desc &&
        e.meio === row.meio,
    );
    return dup ? { ...row, duplicate: true } : row;
  });
}

/** Hash simples do arquivo (para aviso de reimportação). */
export async function hashFileBytes(buf: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

/** Índice 0–11 a partir de jan/janeiro/etc.; -1 se não for mês. */
export function monthIndexFromLabel(raw: string): number {
  const n = normalizeHeader(raw);
  const abbr = IMP_MON.indexOf(n);
  if (abbr >= 0) return abbr;
  const full = IMP_MON_FULL.indexOf(n);
  if (full >= 0) return full;
  return -1;
}

/** Índices das colunas Jan–Dez (ou 1–12) no header; -1 se ausente. */
export function findMonthColumnIndexes(headers: string[]): number[] {
  const idxs = Array.from({ length: 12 }, () => -1);
  headers.forEach((h, i) => {
    const n = normalizeHeader(h);
    const mon = monthIndexFromLabel(h);
    if (mon >= 0 && idxs[mon]! < 0) {
      idxs[mon] = i;
      return;
    }
    const num = n.match(/^(\d{1,2})$/);
    if (num) {
      const m = Number(num[1]) - 1;
      if (m >= 0 && m < 12 && idxs[m]! < 0) idxs[m] = i;
    }
  });
  return idxs;
}

/** Escolhe a aba útil (evita Relatórios/Dashboard). Prefere cartão/lançamentos ou planejamento. */
export function pickBestSheet(
  sheets: string[],
  allSheets: Record<string, unknown[][]>,
  prefer?: "lanc" | "plano",
): string {
  let best = sheets[0] ?? "";
  let bestScore = -Infinity;
  for (const name of sheets) {
    const rows = allSheets[name] || [];
    const nn = normalizeHeader(name);
    let score = 0;
    if (/relatorio|dashboard|^sheet\s*\d*$/.test(nn)) score -= 200;
    const kind = detectLayout(rows);
    const headers = (rows[0] || []).map((c) => String(c ?? ""));
    const map = guessMap(headers);
    if (kind === "lanc" && map.data && map.valor) score += 120;
    if (kind === "vf") score += 100;
    if (kind === "plano") score += 90;
    if (/cartao|lancamento|extrato|fatura/.test(nn)) score += 50;
    if (/gasto|orcamento|planilha|mensal|planej/.test(nn)) score += 40;
    if (prefer === "lanc") {
      if (kind === "lanc") score += 80;
      if (kind === "plano") score -= 40;
    }
    if (prefer === "plano") {
      if (kind === "plano" || kind === "vf") score += 100;
      if (kind === "lanc") score -= 50;
      if (/gasto|mensal|planej|orcamento/.test(nn)) score += 60;
      if (/cartao|fatura/.test(nn)) score -= 30;
    }
    score += Math.min(rows.length, 80);
    if (score > bestScore) {
      bestScore = score;
      best = name;
    }
  }
  return best;
}

export type PlanoImportRow = {
  n: number;
  ok: boolean;
  why?: string;
  tipo: "R" | "F" | "V" | "E";
  grupo: string;
  nome: string;
  plano: number[];
  cellsUpdated: number;
  /** `set` grava `plano[m]` (inclusive 0). `keep` não altera o mês já gravado. */
  monthWrite: Array<"keep" | "set">;
};

export type PlanMonthWrite = "keep" | "set";

/** Mês de plano: vazio ou zero literal não apaga; negativo ou ilegível grava 0; positivo grava centavos. */
export function classifyPlanMonthCell(v: unknown): { write: PlanMonthWrite; cents: number } {
  if (v == null) return { write: "keep", cents: 0 };
  if (typeof v === "number") {
    if (!Number.isFinite(v)) return { write: "set", cents: 0 };
    if (v === 0) return { write: "keep", cents: 0 };
    if (v < 0) return { write: "set", cents: 0 };
    return { write: "set", cents: parseMoneyCellToCents(v) };
  }
  const raw = String(v).trim();
  if (!raw) return { write: "keep", cents: 0 };
  const cleaned = raw.replace(/[R$\s]/gi, "");
  if (!cleaned) return { write: "keep", cents: 0 };
  if (cleaned.startsWith("-")) return { write: "set", cents: 0 };
  if (isLiteralZeroMoney(cleaned)) return { write: "keep", cents: 0 };
  const cents = parseMoneyCellToCents(raw);
  if (cents > 0) return { write: "set", cents };
  return { write: "set", cents: 0 };
}

function isLiteralZeroMoney(cleaned: string): boolean {
  let s = cleaned;
  if (s.includes(",") && s.includes(".")) s = s.replace(/\./g, "").replace(",", ".");
  else if (s.includes(",")) s = s.replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(s)) return false;
  return Number(s) === 0;
}

/** Aplica o merge de FR-005 sobre os 12 meses já gravados. */
export function mergePlanoMonths(
  existing: number[],
  incoming: number[],
  monthWrite: Array<PlanMonthWrite>,
): { plano: number[]; written: number } {
  const plano = existing.slice(0, 12).map((n) => (Number.isFinite(n) ? Math.trunc(n) : 0));
  while (plano.length < 12) plano.push(0);
  let written = 0;
  for (let m = 0; m < 12; m++) {
    if (monthWrite[m] !== "set") continue;
    plano[m] = Math.trunc(incoming[m] ?? 0);
    written += 1;
  }
  return { plano, written };
}

function parseTipoCell(v: unknown): "R" | "F" | "V" | "E" | null {
  const s = String(v || "")
    .trim()
    .toUpperCase();
  if (!s) return null;
  const c = s[0];
  if (c === "R" || c === "F" || c === "V" || c === "E") return c;
  return null;
}

function isPlanoSkipLabel(nome: string): boolean {
  const n = normalizeHeader(nome);
  return (
    !n ||
    n === "meses" ||
    /total|meta|poupanca|acumulad|%|media mensal|selecione/.test(n)
  );
}

function sectionTipoGrupo(label: string): { tipo: "R" | "F" | "V" | "E"; grupo: string } | null {
  const n = normalizeHeader(label);
  if (n === "receitas" || n.startsWith("receita ")) return { tipo: "R", grupo: "Receitas" };
  if (n.includes("despesas fixas") || n === "fixas") return { tipo: "F", grupo: "Despesas Fixas" };
  if (n.includes("despesas variaveis") || n === "variaveis")
    return { tipo: "V", grupo: "Despesas Variáveis" };
  if (n.includes("anuais") || n.includes("eventuais")) return { tipo: "E", grupo: "Anuais" };
  if (n === "cartoes" || n.startsWith("cartao")) return { tipo: "V", grupo: "Cartões" };
  return null;
}

/** Prévia de planejamento: VF `T|G|N`, colunas tipo/cat/item, ou planilha de gastos (seções + meses). */
export function buildPlanoPreview(rows: unknown[][]): PlanoImportRow[] {
  if (!rows.length) return [];
  const headers = (rows[0] || []).map((c) => String(c ?? ""));
  const monthIdx = findMonthColumnIndexes(headers);
  const hasMonths = monthIdx.filter((i) => i >= 0).length >= 4;
  const hNorm = headers.map(normalizeHeader);
  const tipoCol = hNorm.findIndex((h) => h.includes("tipo") || h === "t");
  const grupoCol = hNorm.findIndex(
    (h) => h.includes("categoria") || h.includes("grupo") || h.includes("classific"),
  );
  const itemCol = hNorm.findIndex(
    (h) =>
      h.includes("item") ||
      h.includes("subcategoria") ||
      h === "nome" ||
      h.includes("conta") ||
      h === "meses",
  );

  const out: PlanoImportRow[] = [];
  let currentTipo: "R" | "F" | "V" | "E" = "V";
  let currentGrupo = "Importado";

  rows.slice(1).forEach((r, n) => {
    const line = String(r[0] ?? "").trim();
    let tipo: "R" | "F" | "V" | "E" | null = null;
    let grupo = "";
    let nome = "";

    if (line.includes("|")) {
      const [tp, g, nm] = line.split("|");
      tipo = parseTipoCell(tp);
      grupo = String(g || "").trim();
      nome = String(nm || "").trim();
    } else if (hasMonths && (tipoCol >= 0 || grupoCol >= 0 || itemCol >= 0)) {
      const labelCol = itemCol >= 0 ? itemCol : grupoCol >= 0 ? grupoCol : 1;
      nome = String(r[labelCol] ?? "").trim();
      if (!nome) return;

      const section = sectionTipoGrupo(nome);
      if (section) {
        currentTipo = section.tipo;
        currentGrupo = section.grupo;
        return;
      }
      if (isPlanoSkipLabel(nome)) return;

      if (tipoCol >= 0) tipo = parseTipoCell(r[tipoCol]) ?? currentTipo;
      else tipo = currentTipo;
      grupo =
        grupoCol >= 0
          ? String(r[grupoCol] || currentGrupo).trim() || currentGrupo
          : currentGrupo;
    } else if (hasMonths) {
      // Controles tipo Victor: rótulo na col 0 ou 1
      nome = String(r[1] ?? r[0] ?? "").trim();
      if (!nome) return;
      const section = sectionTipoGrupo(nome);
      if (section) {
        currentTipo = section.tipo;
        currentGrupo = section.grupo;
        return;
      }
      if (isPlanoSkipLabel(nome)) return;
      tipo = currentTipo;
      grupo = currentGrupo;
    } else {
      return;
    }

    if (!tipo || !grupo || !nome) {
      out.push({
        n: n + 2,
        ok: false,
        why: "Tipo/categoria/item inválidos",
        tipo: tipo ?? "V",
        grupo: grupo || "—",
        nome: nome || "—",
        plano: Array(12).fill(0),
        cellsUpdated: 0,
        monthWrite: Array(12).fill("keep"),
      });
      return;
    }

    const classified = Array.from({ length: 12 }, (_, m) => {
      const idx = hasMonths ? monthIdx[m]! : m + 1;
      if (idx < 0) return { write: "keep" as const, cents: 0 };
      return classifyPlanMonthCell(r[idx]);
    });
    const plano = classified.map((c) => c.cents);
    const monthWrite = classified.map((c) => c.write);
    const cellsUpdated = monthWrite.filter((w) => w === "set").length;
    if (cellsUpdated === 0) return;

    out.push({
      n: n + 2,
      ok: true,
      tipo,
      grupo,
      nome,
      plano,
      cellsUpdated,
      monthWrite,
    });
  });

  return out;
}
