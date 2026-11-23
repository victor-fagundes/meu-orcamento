"use client";

import { EstadoErro } from "@meu-orcamento/design-system";

export default function AjustesError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <EstadoErro mensagem="Não foi possível carregar." onTentarNovamente={reset} />;
}
