import { and, eq } from "drizzle-orm";
import type { Db } from "@/db";
import { cartoes, itens, lancamentos } from "@/db/schema";
import { competenciaMeio, type MeioPagamento } from "@/domain/competencia";
import { isCartaoAtivo } from "@/domain/cartoes";
import {
  buildLancPreview,
  mergePlanoMonths,
  buildPlanoPreview,
  markDuplicates,
  type ColumnMap,
  type PreviewRow,
} from "@/domain/import-planilha";
import { zeroPlanoJson } from "@/domain/catalog";
import { isItemAtivoParaLancamento } from "@/domain/itens";
import {
  assignPlanoAlvo,
  type CatalogRef,
  type PlanoAlvoKind,
} from "@/domain/item-unico";
import type { TipoOrcamento } from "@/domain/catalog";

function norm(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function catalogRefs(
  rows: { tipo: string; grupo: string; nome: string; arquivado: number }[],
): CatalogRef[] {
  return rows.map((i) => ({
    tipo: i.tipo as TipoOrcamento,
    grupo: i.grupo,
    nome: i.nome,
    ativo: isItemAtivoParaLancamento(i.arquivado),
  }));
}

export type PlanoPreviewLine = {
  n: number;
  ok: boolean;
  why?: string;
  nome: string;
  tipo: TipoOrcamento;
  grupo: string;
  alvo: PlanoAlvoKind;
  candidatos: string[];
  cellsUpdated: number;
};

export async function previewVfPlano(
  db: Db,
  orcamentoId: string,
  rows: unknown[][],
): Promise<PlanoPreviewLine[]> {
  const preview = buildPlanoPreview(rows);
  const all = await db.select().from(itens).where(eq(itens.orcamentoId, orcamentoId));
  const refs = catalogRefs(all);
  return preview.map((row) => {
    const alvo = assignPlanoAlvo({ tipo: row.tipo, nome: row.nome, grupo: row.grupo }, refs);
    return {
      n: row.n,
      ok: row.ok,
      why: row.why,
      nome: row.nome,
      tipo: alvo.tipo,
      grupo: alvo.alvo === "escolher" ? row.grupo : alvo.grupo,
      alvo: alvo.alvo,
      candidatos: alvo.candidatos,
      cellsUpdated: row.cellsUpdated,
    };
  });
}

async function resolveItem(
  db: Db,
  orcamentoId: string,
  row: PreviewRow,
  createItems: boolean,
): Promise<string | null> {
  const all = await db.select().from(itens).where(eq(itens.orcamentoId, orcamentoId));
  const ativos = all.filter((i) => isItemAtivoParaLancamento(i.arquivado));
  const found = ativos.find(
    (i) =>
      i.tipo === row.tipo &&
      norm(i.grupo) === norm(row.grupo) &&
      norm(i.nome) === norm(row.itemNome),
  );
  if (found) return found.id;

  if (createItems) {
    const id = crypto.randomUUID();
    await db.insert(itens).values({
      id,
      orcamentoId,
      tipo: row.tipo,
      grupo: row.grupo,
      nome: row.itemNome,
      planoCentavosJson: zeroPlanoJson(),
      arquivado: 0,
      divida: 0,
    });
    return id;
  }

  const fallback =
    ativos.find((i) => i.tipo === row.tipo && i.grupo === "Outros" && i.nome === "Outros") ||
    ativos.find((i) => i.tipo === row.tipo) ||
    ativos[0];
  return fallback?.id ?? null;
}

function resolveMeio(meio: string): { meio: MeioPagamento; cartaoId: string | null } {
  const m = meio.toLowerCase();
  if (m === "deb" || m === "débito" || m === "debito") return { meio: "deb", cartaoId: null };
  if (m === "pix") return { meio: "pix", cartaoId: null };
  if (m === "din" || m === "dinheiro") return { meio: "din", cartaoId: null };
  return { meio: "cartao", cartaoId: meio };
}

export async function previewImportLancamentos(
  db: Db,
  orcamentoId: string,
  rows: unknown[][],
  map: ColumnMap,
  opts: { createItems: boolean; defaultMeio: string },
): Promise<PreviewRow[]> {
  const preview = buildLancPreview(rows, map, opts);
  const cards = await db.select().from(cartoes).where(eq(cartoes.orcamentoId, orcamentoId));
  const cardById = new Map(cards.map((c) => [c.id, c]));

  const withCompetencia = preview.map((row) => {
    if (!row.ok || !row.dt) return { ...row, competencia: null };
    const { meio, cartaoId } = resolveMeio(row.meio);
    let meioFinal: MeioPagamento = meio;
    let diaFechamento: number | null = null;
    if (meio === "cartao") {
      const card = cartaoId ? cardById.get(cartaoId) : undefined;
      if (card && isCartaoAtivo(card.ativo)) {
        diaFechamento = card.diaFechamento;
      } else {
        meioFinal = "pix";
      }
    }
    return {
      ...row,
      competencia: competenciaMeio(row.dt, meioFinal, diaFechamento),
    };
  });

  const existing = await db
    .select({
      dataTransacao: lancamentos.dataTransacao,
      valorCentavos: lancamentos.valorCentavos,
      descricao: lancamentos.descricao,
      meio: lancamentos.meio,
      cartaoId: lancamentos.cartaoId,
    })
    .from(lancamentos)
    .where(eq(lancamentos.orcamentoId, orcamentoId));

  return markDuplicates(
    withCompetencia,
    existing.map((e) => ({
      dataISO: e.dataTransacao,
      valorCentavos: e.valorCentavos,
      descricao: e.descricao,
      meio: e.meio === "cartao" ? (e.cartaoId ?? "cartao") : e.meio,
    })),
  );
}

export async function commitImportLancamentos(
  db: Db,
  orcamentoId: string,
  rows: PreviewRow[],
  opts: { createItems: boolean; importDuplicates: boolean },
): Promise<{
  imported: number;
  skipped: number;
  rejected: number;
  itemsCreated: number;
  competencias: string[];
}> {
  let imported = 0;
  let skipped = 0;
  let rejected = 0;
  let itemsCreated = 0;
  const compSet = new Set<string>();

  const cards = await db.select().from(cartoes).where(eq(cartoes.orcamentoId, orcamentoId));
  const cardById = new Map(cards.map((c) => [c.id, c]));

  for (const row of rows) {
    if (!row.ok) {
      rejected += 1;
      continue;
    }
    if (row.duplicate && !opts.importDuplicates) {
      skipped += 1;
      continue;
    }

    const before = await db.select().from(itens).where(eq(itens.orcamentoId, orcamentoId));
    const itemId = await resolveItem(db, orcamentoId, row, opts.createItems);
    if (!itemId || !row.dt) {
      rejected += 1;
      continue;
    }
    const after = await db.select().from(itens).where(eq(itens.orcamentoId, orcamentoId));
    if (after.length > before.length) itemsCreated += 1;

    const { meio, cartaoId } = resolveMeio(row.meio);
    let cartaoFinal: string | null = null;
    let meioFinal: MeioPagamento = meio;
    let diaFechamento: number | null = null;
    if (meio === "cartao") {
      const card = cartaoId ? cardById.get(cartaoId) : undefined;
      if (card && isCartaoAtivo(card.ativo)) {
        cartaoFinal = card.id;
        diaFechamento = card.diaFechamento;
      } else {
        meioFinal = "pix";
      }
    }

    const competencia = competenciaMeio(row.dt, meioFinal, diaFechamento);
    if (!competencia) {
      rejected += 1;
      continue;
    }
    compSet.add(competencia);

    await db.insert(lancamentos).values({
      id: crypto.randomUUID(),
      orcamentoId,
      itemId,
      cartaoId: meioFinal === "cartao" ? cartaoFinal : null,
      descricao: row.desc,
      valorCentavos: row.valCents,
      dataTransacao: row.dt,
      competencia,
      meio: meioFinal,
      parcelaN: null,
      parcelaTotal: null,
      grupoParcelaId: null,
    });
    imported += 1;
  }

  return {
    imported,
    skipped,
    rejected,
    itemsCreated,
    competencias: [...compSet].sort(),
  };
}

export async function importVfPlano(
  db: Db,
  orcamentoId: string,
  rows: unknown[][],
  opts: { createItems: boolean; escolhas?: { n: number; grupo: string }[] } = {
    createItems: false,
  },
): Promise<{ imported: number; itemsCreated: number; rejected: number }> {
  const preview = buildPlanoPreview(rows);
  const all = await db.select().from(itens).where(eq(itens.orcamentoId, orcamentoId));
  const refs = catalogRefs(all);
  let imported = 0;
  let itemsCreated = 0;
  let rejected = 0;

  for (const row of preview) {
    if (!row.ok) {
      rejected += 1;
      continue;
    }

    const escolha = opts.escolhas?.find((e) => e.n === row.n)?.grupo;
    const alvo = assignPlanoAlvo(
      { tipo: row.tipo, nome: row.nome, grupo: row.grupo },
      refs,
      escolha,
    );
    if (alvo.alvo === "escolher") {
      rejected += 1;
      continue;
    }
    if (alvo.alvo === "outros" && !opts.createItems) {
      rejected += 1;
      continue;
    }

    let it = all.find(
      (i) =>
        isItemAtivoParaLancamento(i.arquivado) &&
        i.tipo === alvo.tipo &&
        norm(i.grupo) === norm(alvo.grupo) &&
        norm(i.nome) === norm(row.nome),
    );

    if (!it && alvo.alvo === "outros" && opts.createItems) {
      const id = crypto.randomUUID();
      const created = {
        id,
        orcamentoId,
        tipo: alvo.tipo,
        grupo: alvo.grupo,
        nome: row.nome,
        planoCentavosJson: JSON.stringify(row.plano),
        arquivado: 0,
        divida: 0,
      };
      await db.insert(itens).values(created);
      all.push({ ...created, createdAt: new Date(), updatedAt: new Date() });
      refs.push({ tipo: alvo.tipo, grupo: alvo.grupo, nome: row.nome, ativo: true });
      itemsCreated += 1;
      imported += row.cellsUpdated;
      continue;
    }

    if (!it) {
      rejected += 1;
      continue;
    }

    const existing = JSON.parse(it.planoCentavosJson) as number[];
    const merged = mergePlanoMonths(existing, row.plano, row.monthWrite);
    if (merged.written === 0) continue;
    imported += merged.written;
    const json = JSON.stringify(merged.plano);
    await db
      .update(itens)
      .set({ planoCentavosJson: json, updatedAt: new Date() })
      .where(and(eq(itens.id, it.id), eq(itens.orcamentoId, orcamentoId)));
    it.planoCentavosJson = json;
  }

  return { imported, itemsCreated, rejected };
}
