import { redirect } from "next/navigation";

export default async function AjustesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const query = new URLSearchParams();
  for (const [chave, valor] of Object.entries(sp)) {
    if (Array.isArray(valor)) {
      for (const item of valor) query.append(chave, item);
    } else if (valor) {
      query.set(chave, valor);
    }
  }
  const texto = query.toString();
  redirect(texto ? `/app/ajustes/categorias?${texto}` : "/app/ajustes/categorias");
}
