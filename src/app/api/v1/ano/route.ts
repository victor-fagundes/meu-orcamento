import { eq } from "drizzle-orm";
import { listItensAtivosParaLancamento } from "@/application/itens";
import type { TipoOrcamento } from "@/domain/catalog";
import { parsePlanoFromJson } from "@/domain/plano";
import { lancamentos } from "@/db/schema";
import { isApiError, requireApiSession } from "@/lib/api-session";
import { jsonOk } from "@/lib/api-v1";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;

  const url = new URL(request.url);
  const year = Number(url.searchParams.get("ano")) || new Date().getFullYear();
  const ano = String(year);

  const itens = await listItensAtivosParaLancamento(ctx.db, ctx.orcamento.id);
  const lanc = await ctx.db
    .select({
      itemId: lancamentos.itemId,
      valorCentavos: lancamentos.valorCentavos,
      competencia: lancamentos.competencia,
    })
    .from(lancamentos)
    .where(eq(lancamentos.orcamentoId, ctx.orcamento.id));

  const planejado = itens.map((i) => ({
    id: i.id,
    tipo: i.tipo as TipoOrcamento,
    grupo: i.grupo,
    nome: i.nome,
    valoresCentavos: parsePlanoFromJson(i.planoCentavosJson),
  }));

  const realMap = new Map<string, number[]>();
  for (const i of itens) {
    realMap.set(i.id, Array(12).fill(0));
  }
  for (const l of lanc) {
    if (!l.competencia.startsWith(`${ano}-`)) continue;
    const month = Number(l.competencia.slice(5, 7)) - 1;
    if (month < 0 || month > 11) continue;
    const arr = realMap.get(l.itemId);
    if (!arr) continue;
    arr[month] = (arr[month] ?? 0) + l.valorCentavos;
  }

  const realizado = itens.map((i) => ({
    id: i.id,
    tipo: i.tipo as TipoOrcamento,
    grupo: i.grupo,
    nome: i.nome,
    valoresCentavos: realMap.get(i.id) ?? Array(12).fill(0),
  }));

  return jsonOk({ ano, planejado, realizado });
}
