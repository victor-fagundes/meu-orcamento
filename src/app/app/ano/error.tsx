"use client";

import { EstadoErro } from "@meu-orcamento/design-system";

export default function AnoError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mo-ano">
      <EstadoErro mensagem="Não foi possível carregar o ano." onTentarNovamente={reset} />
    </div>
  );
}
