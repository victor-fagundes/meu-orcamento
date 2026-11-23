import { anoCivil, dataCivil, lerAno } from "@/application/ano";
import { AnoTela } from "@/components/ano-tela";
import { runDb } from "@/db";
import { requireSessionOrcamento } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AnoPage({
  searchParams,
}: {
  searchParams: Promise<{ ano?: string }>;
}) {
  const { orcamento } = await requireSessionOrcamento();
  const sp = await searchParams;
  const hoje = dataCivil();
  const ano = anoCivil(sp.ano, hoje);
  const grade = await runDb((db) => lerAno(db, orcamento.id, ano, hoje));
  return <AnoTela grade={grade} />;
}
