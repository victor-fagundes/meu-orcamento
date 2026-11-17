import {
  commitImportLancamentos,
  importVfPlano,
  previewImportLancamentos,
} from "@/application/import-planilha";
import type { ColumnMap, LayoutKind } from "@/domain/import-planilha";
import { competenciaAtual } from "@/application/lancamentos";
import { competenciaDestinoImport } from "@/domain/navegacao-mes";
import { isApiError, requireApiSession } from "@/lib/api-session";
import { jsonError, jsonOk } from "@/lib/api-v1";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;

  let body: {
    kind?: LayoutKind;
    rowsJson?: string;
    map?: ColumnMap;
    createItems?: boolean;
    importDuplicates?: boolean;
    defaultMeio?: string;
    escolhas?: { n: number; grupo: string }[];
  };
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "JSON inválido");
  }

  if (!body.kind || !body.rowsJson) return jsonError(400, "kind e rowsJson obrigatórios");
  const rows = JSON.parse(body.rowsJson) as unknown[][];

  if (body.kind === "vf" || body.kind === "plano") {
    const report = await importVfPlano(ctx.db, ctx.orcamento.id, rows, {
      createItems: body.createItems ?? true,
      escolhas: body.escolhas,
    });
    return jsonOk({
      imported: report.imported,
      skipped: 0,
      rejected: report.rejected,
      itemsCreated: report.itemsCreated,
      competencias: [] as string[],
      abrirCompetencia: null,
    });
  }

  if (!body.map) return jsonError(400, "Mapa de colunas ausente.");
  const preview = await previewImportLancamentos(ctx.db, ctx.orcamento.id, rows, body.map, {
    createItems: body.createItems ?? true,
    defaultMeio: body.defaultMeio ?? "pix",
  });
  const report = await commitImportLancamentos(ctx.db, ctx.orcamento.id, preview, {
    createItems: body.createItems ?? true,
    importDuplicates: body.importDuplicates ?? false,
  });
  const abrirCompetencia = competenciaDestinoImport(report.competencias ?? [], competenciaAtual());
  return jsonOk({ ...report, abrirCompetencia });
}
