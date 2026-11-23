"use client";

import { useState } from "react";
import { Banner, Botao, Campo } from "@meu-orcamento/design-system";
import {
  FRASE_EMAIL_USADO,
  FRASE_FALHA,
  emailAparado,
  emailJaUsado,
  mensagemEmail,
  mensagemNome,
  mensagemSenhaNova,
  respostaIncompleta,
} from "@/domain/entrada";
import { authClient } from "@/lib/auth-client";
import { EntradaMoldura } from "@/components/entrada-moldura";

export function CriarContaForm() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erroNome, setErroNome] = useState<string | undefined>();
  const [erroEmail, setErroEmail] = useState<string | undefined>();
  const [erroSenha, setErroSenha] = useState<string | undefined>();
  const [banner, setBanner] = useState<string | null>(null);
  const [pendente, setPendente] = useState(false);

  async function cadastrar() {
    if (pendente) return;
    setBanner(null);
    const msgNome = mensagemNome(nome);
    const msgEmail = mensagemEmail(email);
    const msgSenha = mensagemSenhaNova(senha);
    setErroNome(msgNome ?? undefined);
    setErroEmail(msgEmail ?? undefined);
    setErroSenha(msgSenha ?? undefined);
    if (msgNome || msgEmail || msgSenha) return;

    setPendente(true);
    try {
      const { error } = await authClient.signUp.email({
        name: nome.trim(),
        email: emailAparado(email),
        password: senha,
      });
      if (error) {
        setPendente(false);
        if (emailJaUsado(error.code, error.message)) {
          setBanner(FRASE_EMAIL_USADO);
          return;
        }
        if (respostaIncompleta(error.status)) {
          setBanner(FRASE_FALHA);
          return;
        }
        setBanner(FRASE_FALHA);
        return;
      }
      window.location.assign("/app/resumo");
    } catch {
      setPendente(false);
      setBanner(FRASE_FALHA);
    }
  }

  return (
    <EntradaMoldura>
      {banner ? <Banner tipo="erro">{banner}</Banner> : null}
      <h1>Criar conta</h1>
      <Campo id="name" rotulo="Nome" completar="nome" valor={nome} onMudar={setNome} erro={erroNome} />
      <Campo
        id="email"
        rotulo="E-mail"
        tipo="email"
        completar="email"
        valor={email}
        onMudar={setEmail}
        erro={erroEmail}
      />
      <Campo
        id="password"
        rotulo="Senha"
        tipo="senha"
        completar="senha-nova"
        valor={senha}
        onMudar={setSenha}
        erro={erroSenha}
      />
      <Botao variante="primario" largura="total" onPress={() => void cadastrar()} disabled={pendente}>
        Cadastrar
      </Botao>
      <a className="mo-entrada__link mo-entrada__centro" href="/login">
        Já tenho conta
      </a>
    </EntradaMoldura>
  );
}
