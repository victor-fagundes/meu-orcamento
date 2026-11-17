import { and, eq } from "drizzle-orm";
import type { Db } from "@/db";
import { itens } from "@/db/schema";
import { parsePlanoFromBRLInputs, planoToJson } from "@/domain/plano";

export async function updateItemPlano(
  db: Db,
  orcamentoId: string,
  itemId: string,
  inputsBRL: string[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = parsePlanoFromBRLInputs(inputsBRL);
  if (!parsed.ok) return parsed;

  const [row] = await db
    .select({ id: itens.id })
    .from(itens)
    .where(and(eq(itens.id, itemId), eq(itens.orcamentoId, orcamentoId)))
    .limit(1);

  if (!row) return { ok: false, error: "Item não encontrado." };

  await db
    .update(itens)
    .set({
      planoCentavosJson: planoToJson(parsed.plano),
      updatedAt: new Date(),
    })
    .where(and(eq(itens.id, itemId), eq(itens.orcamentoId, orcamentoId)));

  return { ok: true };
}
