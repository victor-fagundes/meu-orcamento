"use client";

import { EstadoErro } from "@meu-orcamento/design-system";

export default function OrcamentoError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="conteudo">
      <EstadoErro mensagem="Não foi possível carregar o mês." onTentarNovamente={reset} />
    </main>
  );
}
