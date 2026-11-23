"use client";

import { Dialogo } from "@meu-orcamento/design-system";
import { authClient } from "@/lib/auth-client";

export function DialogoSair({ aberto, onCancelar }: { aberto: boolean; onCancelar: () => void }) {
  return (
    <Dialogo
      aberto={aberto}
      titulo="Sair da conta"
      descricao="A sessão desta conta será encerrada neste navegador."
      textoCancelar="Cancelar"
      textoConfirmar="Sair"
      tipoConfirmar="primario"
      onCancelar={onCancelar}
      onConfirmar={() => {
        void authClient.signOut().then(() => {
          window.location.assign("/login");
        });
      }}
    />
  );
}
