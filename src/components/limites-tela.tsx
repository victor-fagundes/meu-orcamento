"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Botao, Campo } from "@meu-orcamento/design-system";
import { salvarLimiteGlobalAction } from "@/app/actions/limites";

const FORA = "Fora de 1 a 100. O valor salvo foi mantido.";
const ERRO_SALVAR = "Não foi possível salvar. Os campos continuam preenchidos.";

function inteiroValido(valor: string): number | null {
  if (!/^\d+$/.test(valor.trim())) return null;
  const n = Number(valor.trim());
  if (!Number.isInteger(n) || n < 1 || n > 100) return null;
  return n;
}

export function LimitesTela({ globalPct }: { globalPct: number }) {
  const router = useRouter();
  const [valor, setValor] = useState(String(globalPct));
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState(false);

  async function salvar() {
    const n = inteiroValido(valor);
    if (n == null) {
      setErro(true);
      setMensagem(FORA);
      return;
    }
    const res = await salvarLimiteGlobalAction(n);
    if (!res.ok) {
      setErro(true);
      setMensagem(ERRO_SALVAR);
      return;
    }
    setErro(false);
    setMensagem("Limites salvos.");
    setValor(String(res.globalPct));
    router.refresh();
  }

  return (
    <section>
      <h2>Limites de alerta</h2>
      <p>
        Preventivo em {globalPct}% do planejado. O valor é um inteiro de 1 a 100.
      </p>
      <Campo
        id="limite-global"
        rotulo="Limite global (%)"
        teclado="numerico"
        valor={valor}
        onMudar={setValor}
        erro={erro ? (mensagem ?? undefined) : undefined}
      />
      <p className="mo-ajustes__apoio">Os alertas valem para todos os itens com plano definido.</p>
      {!erro && mensagem ? <p role="status">{mensagem}</p> : null}
      <Botao
        variante="primario"
        onPress={() => {
          void salvar();
        }}
      >
        Salvar limites
      </Botao>
    </section>
  );
}
