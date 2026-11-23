import { ImportPdfPanel } from "@/components/import-pdf-panel";
import { listCartoesAtivos } from "@/application/cartoes";
import { requireSessionOrcamento } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ImportarFaturaPage() {
  const { db, orcamento } = await requireSessionOrcamento();
  const rows = await listCartoesAtivos(db, orcamento.id);
  return <ImportPdfPanel cartoes={rows.map((cartao) => ({ id: cartao.id, apelido: cartao.apelido }))} />;
}
