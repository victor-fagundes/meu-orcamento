import { deleteLancamentos, updateLancamento } from "@/application/lancamentos";
import type { DeleteScope } from "@/domain/delete-lancamento";
import type { EditScope } from "@/domain/edit-lancamento";
import { isApiError, requireApiSession } from "@/lib/api-session";
import { centavosToBrlString, jsonError, jsonOk } from "@/lib/api-v1";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Ctx) {
  const session = await requireApiSession(request);
  if (isApiError(session)) return session;
  const { id } = await params;

  let body: {
    itemId?: string;
    descricao?: string;
    valorCentavos?: number;
    dataISO?: string;
    pagamento?: string;
    scope?: EditScope;
  };
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "JSON inválido");
  }

  if (!body.itemId || body.valorCentavos == null || !body.dataISO || !body.pagamento) {
    return jsonError(400, "Campos obrigatórios: itemId, valorCentavos, dataISO, pagamento");
  }

  let valorBRL: string;
  try {
    valorBRL = centavosToBrlString(body.valorCentavos);
  } catch (e) {
    return jsonError(400, e instanceof Error ? e.message : "valorCentavos inválido");
  }

  const res = await updateLancamento(session.db, session.orcamento.id, {
    id,
    itemId: body.itemId,
    descricao: body.descricao,
    valorBRL,
    dataISO: body.dataISO,
    pagamento: body.pagamento,
    scope: body.scope ?? "one",
  });
  if (!res.ok) return jsonError(400, res.error);
  return jsonOk(res);
}

export async function DELETE(request: Request, { params }: Ctx) {
  const session = await requireApiSession(request);
  if (isApiError(session)) return session;
  const { id } = await params;

  const url = new URL(request.url);
  const scope = (url.searchParams.get("scope") as DeleteScope | null) ?? "one";

  const res = await deleteLancamentos(session.db, session.orcamento.id, {
    id,
    scope,
  });
  if (!res.ok) return jsonError(400, res.error);
  return jsonOk(res);
}
