import { exportOrcamentoJson } from "@/application/export-orcamento";
import { isApiError, requireApiSession } from "@/lib/api-session";
import { jsonError } from "@/lib/api-v1";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;

  const arquivo = await exportOrcamentoJson(ctx.db, ctx.orcamento.id);
  if (!arquivo.ok) return jsonError(400, arquivo.error);
  const day = new Date().toISOString().slice(0, 10);
  return new Response(arquivo.content, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="meu-orcamento-${day}.json"`,
    },
  });
}
