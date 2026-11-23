"use client";

import { Dialogo } from "@meu-orcamento/design-system";
import { authClient } from "@/lib/auth-client";
import { limparMarcaSessao } from "@/lib/marca-sessao";

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
        limparMarcaSessao();
        void authClient.signOut().then(() => {
          window.location.assign("/login");
        });
      }}
    />
  );
}
