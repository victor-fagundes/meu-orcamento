import { ImportPlanilhaPanel } from "@/components/import-planilha-panel";
import { listCartoesAtivos } from "@/application/cartoes";
import { requireSessionOrcamento } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ImportarPlanilhaPage() {
  const { db, orcamento } = await requireSessionOrcamento();
  const rows = await listCartoesAtivos(db, orcamento.id);
  return <ImportPlanilhaPanel cartoes={rows.map((cartao) => ({ id: cartao.id, apelido: cartao.apelido }))} />;
}
