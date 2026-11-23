import { LimitesTela } from "@/components/limites-tela";
import { getLimites } from "@/application/limites";
import { requireSessionOrcamento } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function LimitesPage() {
  const { db, orcamento } = await requireSessionOrcamento();
  const limites = await getLimites(db, orcamento.id);
  return <LimitesTela globalPct={limites.globalPct} />;
}
