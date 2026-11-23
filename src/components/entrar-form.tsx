"use client";

import { useState } from "react";
import { Banner, Botao, Campo } from "@meu-orcamento/design-system";
import {
  FRASE_CREDENCIAL,
  FRASE_FALHA,
  FRASE_SESSAO,
  emailAparado,
  mensagemEmail,
  mensagemSenhaEntrada,
  respostaIncompleta,
} from "@/domain/entrada";
import { authClient } from "@/lib/auth-client";
import { EntradaMoldura } from "@/components/entrada-moldura";

function destino(next: string | null): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return "/app/resumo";
}

export function EntrarForm({ sessaoExpirada, next }: { sessaoExpirada: boolean; next: string | null }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroEmail, setErroEmail] = useState<string | undefined>();
  const [erroSenha, setErroSenha] = useState<string | undefined>();
  const [invalido, setInvalido] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [pendente, setPendente] = useState(false);

  async function entrar() {
    if (pendente) return;
    setBanner(null);
    setInvalido(false);
    const msgEmail = mensagemEmail(email);
    const msgSenha = mensagemSenhaEntrada(senha);
    setErroEmail(msgEmail ?? undefined);
    setErroSenha(msgSenha ?? undefined);
    if (msgEmail || msgSenha) return;

    setPendente(true);
    try {
      const { error } = await authClient.signIn.email({
        email: emailAparado(email),
        password: senha,
      });
      if (error) {
        setPendente(false);
        if (respostaIncompleta(error.status)) {
          setBanner(FRASE_FALHA);
          return;
        }
        setInvalido(true);
        setBanner(FRASE_CREDENCIAL);
        return;
      }
      window.location.assign(destino(next));
    } catch {
      setPendente(false);
      setBanner(FRASE_FALHA);
    }
  }

  return (
    <EntradaMoldura>
      {sessaoExpirada ? <Banner tipo="atencao">{FRASE_SESSAO}</Banner> : null}
      {banner ? <Banner tipo="erro">{banner}</Banner> : null}
      <h1>Entrar</h1>
      <Campo
        id="email"
        rotulo="E-mail"
        tipo="email"
        completar="email"
        valor={email}
        onMudar={setEmail}
        erro={erroEmail}
        invalido={invalido}
      />
      <Campo
        id="password"
        rotulo="Senha"
        tipo="senha"
        completar="senha-atual"
        valor={senha}
        onMudar={setSenha}
        erro={erroSenha}
        invalido={invalido}
      />
      <a className="mo-entrada__link mo-entrada__esqueci" href="/esqueci-senha">
        Esqueci a senha
      </a>
      <Botao variante="primario" largura="total" onPress={() => void entrar()} disabled={pendente}>
        Entrar
      </Botao>
      <a className="mo-entrada__link mo-entrada__centro" href="/cadastro">
        Criar conta
      </a>
    </EntradaMoldura>
  );
}
