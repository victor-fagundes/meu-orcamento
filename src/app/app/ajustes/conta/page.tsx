import { ContaTela } from "@/components/conta-tela";
import { requireSessionOrcamento } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ContaPage() {
  const { session } = await requireSessionOrcamento();
  return <ContaTela nome={session.user.name} email={session.user.email} />;
}
