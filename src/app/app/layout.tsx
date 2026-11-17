import { listCartoesAtivos } from "@/application/cartoes";
import { listItensAtivosParaLancamento } from "@/application/itens";
import { AppChrome } from "@/components/app-chrome";
import { SessionTelemetry } from "@/components/session-telemetry";
import { requireSessionOrcamento } from "@/lib/session";

function planoDoze(json: string): number[] {
  try {
    const raw = JSON.parse(json) as unknown;
    if (!Array.isArray(raw)) return Array(12).fill(0);
    const out = raw
      .slice(0, 12)
      .map((n) => (Number.isFinite(Number(n)) ? Math.trunc(Number(n)) : 0));
    while (out.length < 12) out.push(0);
    return out;
  } catch {
    return Array(12).fill(0);
  }
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { session, db, orcamento } = await requireSessionOrcamento();
  const itens = await listItensAtivosParaLancamento(db, orcamento.id);
  const cartoes = await listCartoesAtivos(db, orcamento.id);

  return (
    <div className="app-shell">
      <SessionTelemetry />
      <AppChrome
        userName={session.user.name}
        itens={itens.map((i) => ({
          id: i.id,
          tipo: i.tipo,
          grupo: i.grupo,
          nome: i.nome,
          plano: planoDoze(i.planoCentavosJson),
        }))}
        cartoes={cartoes.map((c) => ({
          id: c.id,
          apelido: c.apelido,
          diaFechamento: c.diaFechamento,
        }))}
      >
        {children}
      </AppChrome>
    </div>
  );
}
