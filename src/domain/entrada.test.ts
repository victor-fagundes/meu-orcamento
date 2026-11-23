import { describe, expect, it } from "vitest";
import {
  FRASE_CREDENCIAL,
  FRASE_EMAIL_USADO,
  FRASE_FALHA,
  FRASE_LINK_CONVITE,
  FRASE_LINK_PRAZO,
  FRASE_SESSAO,
  emailAparado,
  fraseLinkEnviado,
  mensagemEmail,
  mensagemNome,
  mensagemSenhaEntrada,
  mensagemSenhaNova,
} from "./entrada";

describe("entrada", () => {
  it("pede o nome quando só há espaço", () => {
    expect(mensagemNome("")).toBe("Informe o nome.");
    expect(mensagemNome("   ")).toBe("Informe o nome.");
    expect(mensagemNome("Ana")).toBeNull();
  });

  it("apara o e-mail e recusa o que não é endereço", () => {
    expect(mensagemEmail("")).toBe("Informe o e-mail.");
    expect(mensagemEmail("sem-arroba")).toBe("Informe um e-mail válido.");
    expect(mensagemEmail("a@semponto")).toBe("Informe um e-mail válido.");
    expect(mensagemEmail(" victor@email.com ")).toBeNull();
    expect(emailAparado(" victor@email.com ")).toBe("victor@email.com");
  });

  it("só exige senha na entrada e mede 8 caracteres no cadastro", () => {
    expect(mensagemSenhaEntrada("")).toBe("Informe a senha.");
    expect(mensagemSenhaEntrada("1234567")).toBeNull();
    expect(mensagemSenhaNova("1234567")).toBe("Use pelo menos 8 caracteres.");
    expect(mensagemSenhaNova("abc defgh")).toBeNull();
  });

  it("guarda as frases da entrada", () => {
    expect(FRASE_CREDENCIAL).toBe("E-mail ou senha incorretos. Confira os dados e tente de novo.");
    expect(FRASE_EMAIL_USADO).toBe("Já existe uma conta com esse e-mail.");
    expect(FRASE_FALHA).toBe("Não foi possível salvar. Os campos continuam preenchidos.");
    expect(FRASE_SESSAO).toBe("Sua sessão expirou. Entre de novo para continuar. Nada do que você digitou foi perdido.");
    expect(FRASE_LINK_CONVITE).toBe("Enviaremos um link para você criar uma nova senha.");
    expect(FRASE_LINK_PRAZO).toBe("O link vale por 30 minutos. Se não chegar, você pode pedir outro.");
    expect(fraseLinkEnviado("victor@email.com")).toBe("Enviamos o link para victor@email.com. Confira também o spam.");
  });
});
