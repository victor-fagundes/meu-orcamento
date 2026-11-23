import { CartoesTela, type CartaoLinha } from "@/components/cartoes-tela";
import { listCartoes } from "@/application/cartoes";
import { requireSessionOrcamento } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CartoesPage() {
  const { db, orcamento } = await requireSessionOrcamento();
  const rows = await listCartoes(db, orcamento.id);
  const cartoes: CartaoLinha[] = rows.map((cartao) => ({
    id: cartao.id,
    apelido: cartao.apelido,
    diaFechamento: cartao.diaFechamento,
    diaVencimento: cartao.diaVencimento,
    instituicao: cartao.instituicao,
    ultimos4: cartao.ultimos4,
    ativo: cartao.ativo === 1,
  }));
  return <CartoesTela cartoes={cartoes} />;
}
