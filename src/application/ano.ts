import { and, eq, like } from "drizzle-orm";
import type { Db } from "@/db";
import { itens, lancamentos } from "@/db/schema";
import { gradeDoAno, type GradeAno, type TipoAno } from "@/domain/ano-grade";
import { parsePlanoFromJson } from "@/domain/plano";

const TIPOS = new Set<TipoAno>(["R", "F", "V", "E"]);

export function dataCivil(data = new Date()): string {
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
}

export function anoCivil(pedido: string | undefined, hoje = dataCivil()): string {
  if (pedido && /^\d{4}$/.test(pedido)) return pedido;
  return hoje.slice(0, 4);
}

export async function lerAno(db: Db, orcamentoId: string, ano: string, hoje: string): Promise<GradeAno> {
  const rows = await db.select().from(itens).where(eq(itens.orcamentoId, orcamentoId));
  const lancs = await db
    .select({
      itemId: lancamentos.itemId,
      competencia: lancamentos.competencia,
      valorCentavos: lancamentos.valorCentavos,
    })
    .from(lancamentos)
    .where(and(eq(lancamentos.orcamentoId, orcamentoId), like(lancamentos.competencia, `${ano}-%`)));

  return gradeDoAno({
    ano,
    hoje,
    itens: rows.flatMap((row) => {
      if (!TIPOS.has(row.tipo as TipoAno)) return [];
      return [
        {
          id: row.id,
          tipo: row.tipo as TipoAno,
          grupo: row.grupo,
          nome: row.nome,
          arquivado: row.arquivado === 1,
          plano: parsePlanoFromJson(row.planoCentavosJson),
        },
      ];
    }),
    lancamentos: lancs,
  });
}
