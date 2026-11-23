"use client";

import { useState } from "react";
import { Banner, Botao, Campo } from "@meu-orcamento/design-system";
import {
  FRASE_FALHA,
  FRASE_LINK_CONVITE,
  FRASE_LINK_PRAZO,
  emailAparado,
  fraseLinkEnviado,
  mensagemEmail,
  respostaIncompleta,
} from "@/domain/entrada";
import { authClient } from "@/lib/auth-client";
import { EntradaMoldura } from "@/components/entrada-moldura";

export function EsqueciSenhaForm() {
  const [email, setEmail] = useState("");
  const [erroEmail, setErroEmail] = useState<string | undefined>();
  const [enviado, setEnviado] = useState<string | null>(null);
  const [falha, setFalha] = useState(false);
  const [pendente, setPendente] = useState(false);

  async function enviar(atual: string) {
    if (pendente) return;
    const msg = mensagemEmail(atual);
    setErroEmail(msg ?? undefined);
    if (msg) return;
    setPendente(true);
    setFalha(false);
    try {
      const { error } = await authClient.requestPasswordReset({
        email: emailAparado(atual),
        redirectTo: "/login",
      });
      setPendente(false);
      if (error && respostaIncompleta(error.status)) {
        setFalha(true);
        return;
      }
      setEnviado(emailAparado(atual));
    } catch {
      setPendente(false);
      setFalha(true);
    }
  }

  if (enviado) {
    return (
      <EntradaMoldura>
        {falha ? <Banner tipo="erro">{FRASE_FALHA}</Banner> : null}
        <Banner tipo="atencao">{fraseLinkEnviado(enviado)}</Banner>
        <h1>Verifique seu e-mail</h1>
        <p className="mo-entrada__texto">{FRASE_LINK_PRAZO}</p>
        <a className="mo-entrada__link mo-entrada__centro" href="/login">
          Voltar para entrar
        </a>
        <Botao variante="texto" onPress={() => void enviar(enviado)} disabled={pendente}>
          Reenviar link
        </Botao>
      </EntradaMoldura>
    );
  }

  return (
    <EntradaMoldura>
      {falha ? <Banner tipo="erro">{FRASE_FALHA}</Banner> : null}
      <h1>Esqueci a senha</h1>
      <p className="mo-entrada__texto">{FRASE_LINK_CONVITE}</p>
      <Campo
        id="email"
        rotulo="E-mail"
        tipo="email"
        completar="email"
        valor={email}
        onMudar={setEmail}
        erro={erroEmail}
      />
      <Botao variante="primario" largura="total" onPress={() => void enviar(email)} disabled={pendente}>
        Enviar link
      </Botao>
      <a className="mo-entrada__link mo-entrada__centro" href="/login">
        Voltar para entrar
      </a>
    </EntradaMoldura>
  );
}
