import { and, eq } from "drizzle-orm";
import type { Db } from "@/db";
import { cartoes, itens, lancamentos } from "@/db/schema";
import { isCartaoAtivo } from "@/domain/cartoes";
import { competenciaCartao } from "@/domain/competencia";
import { buildPdfPreview, type PdfPreviewRow } from "@/domain/import-pdf";
import { isItemAtivoParaLancamento } from "@/domain/itens";
import { splitParcelas } from "@/domain/money";
import { competenciasParcelas } from "@/domain/competencia";

export async function previewImportPdf(text: string): Promise<ReturnType<typeof buildPdfPreview>> {
  return buildPdfPreview(text);
}

async function defaultItemId(
  db: Db,
  orcamentoId: string,
  preferTipo: "R" | "V",
): Promise<string | null> {
  const all = await db.select().from(itens).where(eq(itens.orcamentoId, orcamentoId));
  const ativos = all.filter((i) => isItemAtivoParaLancamento(i.arquivado));
  return (
    ativos.find((i) => i.tipo === preferTipo && i.grupo === "Outros" && i.nome === "Outros")?.id ||
    ativos.find((i) => i.tipo === preferTipo)?.id ||
    ativos[0]?.id ||
    null
  );
}

export async function commitImportPdf(
  db: Db,
  orcamentoId: string,
  input: {
    cartaoId: string;
    rows: PdfPreviewRow[];
    estornoMode: "R" | "ignore";
  },
): Promise<{ imported: number; skipped: number; rejected: number }> {
  const [card] = await db
    .select()
    .from(cartoes)
    .where(and(eq(cartoes.id, input.cartaoId), eq(cartoes.orcamentoId, orcamentoId)))
    .limit(1);
  if (!card || !isCartaoAtivo(card.ativo)) {
    throw new Error("Cartão inválido ou inativo.");
  }

  let imported = 0;
  let skipped = 0;
  let rejected = 0;

  const defV = await defaultItemId(db, orcamentoId, "V");
  const defR = await defaultItemId(db, orcamentoId, "R");

  for (const row of input.rows) {
    if (row.ignore || !row.ok) {
      skipped += 1;
      continue;
    }
    if (row.estorno && input.estornoMode === "ignore") {
      skipped += 1;
      continue;
    }
    if (!row.dt || !(row.valCents > 0)) {
      rejected += 1;
      continue;
    }

    const asReceita = row.estorno && input.estornoMode === "R";
    let itemId = row.itemId;
    if (!itemId) {
      itemId = asReceita ? defR : defV;
    } else {
      const [it] = await db
        .select()
        .from(itens)
        .where(and(eq(itens.id, itemId), eq(itens.orcamentoId, orcamentoId)))
        .limit(1);
      if (!it || !isItemAtivoParaLancamento(it.arquivado)) itemId = asReceita ? defR : defV;
    }
    if (!itemId) {
      rejected += 1;
      continue;
    }

    // 1/N na fatura: gera as N parcelas a partir do valor da linha × N (aproximação MVP)
    // N/N intermediária: só esta parcela
    const isFirstOfMany = row.parcelaN === 1 && (row.parcelaTotal ?? 1) > 1;
    const totalParc = isFirstOfMany ? row.parcelaTotal! : 1;
    const totalCents = isFirstOfMany
      ? row.totalCents > row.valCents
        ? row.totalCents
        : row.valCents * totalParc
      : row.valCents;
    const valores = splitParcelas(totalCents, totalParc);
    const comps = competenciasParcelas(row.dt, totalParc, card.diaFechamento);
    if (!comps || comps.some((c) => !c)) {
      rejected += 1;
      continue;
    }

    if (!isFirstOfMany && (row.parcelaTotal ?? 1) > 1) {
      // parcela intermediária: uma linha com metadados
      const comp = competenciaCartao(row.dt, card.diaFechamento);
      if (!comp) {
        rejected += 1;
        continue;
      }
      await db.insert(lancamentos).values({
        id: crypto.randomUUID(),
        orcamentoId,
        itemId,
        cartaoId: input.cartaoId,
        descricao: row.desc,
        valorCentavos: row.valCents,
        dataTransacao: row.dt,
        competencia: comp,
        meio: "cartao",
        parcelaN: row.parcelaN,
        parcelaTotal: row.parcelaTotal,
        grupoParcelaId: null,
      });
      imported += 1;
      continue;
    }

    const grupoId = totalParc > 1 ? crypto.randomUUID() : null;
    for (let i = 0; i < totalParc; i++) {
      await db.insert(lancamentos).values({
        id: crypto.randomUUID(),
        orcamentoId,
        itemId,
        cartaoId: input.cartaoId,
        descricao: row.desc,
        valorCentavos: valores[i]!,
        dataTransacao: row.dt,
        competencia: comps[i]!,
        meio: "cartao",
        parcelaN: totalParc > 1 ? i + 1 : null,
        parcelaTotal: totalParc > 1 ? totalParc : null,
        grupoParcelaId: grupoId,
      });
      imported += 1;
    }
  }

  return { imported, skipped, rejected };
}
