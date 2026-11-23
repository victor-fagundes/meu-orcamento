import { eq } from "drizzle-orm";
import { listarCategorias } from "@/application/categorias";
import { CategoriasTela } from "@/components/categorias-tela";
import { itens, lancamentos } from "@/db/schema";
import { requireSessionOrcamento } from "@/lib/session";

export const dynamic = "force-dynamic";

const TIPOS = new Set(["R", "F", "V", "E"]);

export default async function CategoriasPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string | string[]; aba?: string | string[] }>;
}) {
  const { db, orcamento } = await requireSessionOrcamento();
  const sp = await searchParams;
  const tipoBruto = Array.isArray(sp.tipo) ? sp.tipo[0] : sp.tipo;
  const abaBruta = Array.isArray(sp.aba) ? sp.aba[0] : sp.aba;
  const tipoMarcado = tipoBruto && TIPOS.has(tipoBruto) ? tipoBruto : null;
  const aba = abaBruta === "arquivados" ? "arquivados" : "categorias";

  const [cats, rows, lancs] = await Promise.all([
    listarCategorias(db, orcamento.id),
    db.select().from(itens).where(eq(itens.orcamentoId, orcamento.id)),
    db.select({ itemId: lancamentos.itemId }).from(lancamentos).where(eq(lancamentos.orcamentoId, orcamento.id)),
  ]);
  const comHistorico = new Set(lancs.map((linha) => linha.itemId));
  const categorias = cats
    .filter((categoria) => !categoria.arquivada)
    .map((categoria) => ({
      id: categoria.id,
      tipo: categoria.tipo,
      nome: categoria.nome,
      itens: rows.filter(
        (item) => item.arquivado === 0 && item.tipo === categoria.tipo && item.grupo === categoria.nome,
      ).length,
    }));
  const arquivados = rows
    .filter((item) => item.arquivado === 1)
    .map((item) => ({
      id: item.id,
      nome: item.nome,
      tipo: item.tipo,
      grupo: item.grupo,
      historico: comHistorico.has(item.id),
    }))
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR") || a.id.localeCompare(b.id));

  return <CategoriasTela categorias={categorias} arquivados={arquivados} tipoMarcado={tipoMarcado} aba={aba} />;
}
