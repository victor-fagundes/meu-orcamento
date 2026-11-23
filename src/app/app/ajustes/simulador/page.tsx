import { SimuladorTela } from "@/components/simulador-tela";
import { listCartoesAtivos } from "@/application/cartoes";
import { requireSessionOrcamento } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function SimuladorPage() {
  const { db, orcamento } = await requireSessionOrcamento();
  const rows = await listCartoesAtivos(db, orcamento.id);
  return (
    <SimuladorTela
      cartoes={rows.map((cartao) => ({
        id: cartao.id,
        apelido: cartao.apelido,
        diaFechamento: cartao.diaFechamento,
      }))}
    />
  );
}
