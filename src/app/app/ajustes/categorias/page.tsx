import { listarCategorias } from "@/application/categorias";
import { ROTULO_TIPO, tipoDaQuery } from "@/components/orcamento-query";
import { requireSessionOrcamento } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CategoriasDoTipoPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string | string[] }>;
}) {
  const { db, orcamento } = await requireSessionOrcamento();
  const sp = await searchParams;
  const tipo = tipoDaQuery(sp.tipo);
  const categorias = (await listarCategorias(db, orcamento.id)).filter((categoria) => categoria.tipo === tipo);

  return (
    <main id="conteudo">
      <h1>{ROTULO_TIPO[tipo]}</h1>
      <ul>
        {categorias.map((categoria) => (
          <li key={categoria.id}>{categoria.nome}</li>
        ))}
      </ul>
    </main>
  );
}
