export const FRASE_CREDENCIAL = "E-mail ou senha incorretos. Confira os dados e tente de novo.";
export const FRASE_EMAIL_USADO = "Já existe uma conta com esse e-mail.";
export const FRASE_FALHA = "Não foi possível salvar. Os campos continuam preenchidos.";
export const FRASE_SESSAO = "Sua sessão expirou. Entre de novo para continuar. Nada do que você digitou foi perdido.";
export const FRASE_LINK_CONVITE = "Enviaremos um link para você criar uma nova senha.";
export const FRASE_LINK_PRAZO = "O link vale por 30 minutos. Se não chegar, você pode pedir outro.";

export function fraseLinkEnviado(email: string): string {
  return `Enviamos o link para ${email}. Confira também o spam.`;
}

export function emailAparado(valor: string): string {
  return valor.trim();
}

export function mensagemNome(valor: string): string | null {
  if (valor.trim() === "") return "Informe o nome.";
  return null;
}

export function mensagemEmail(valor: string): string | null {
  const email = emailAparado(valor);
  if (email === "") return "Informe o e-mail.";
  const partes = email.split("@");
  const dominio = partes[1] ?? "";
  const temPonto = dominio.includes(".") && !dominio.startsWith(".") && !dominio.endsWith(".") && !dominio.includes("..");
  if (partes.length !== 2 || partes[0] === "" || !temPonto || /\s/.test(email)) {
    return "Informe um e-mail válido.";
  }
  return null;
}

export function mensagemSenhaEntrada(valor: string): string | null {
  if (valor === "") return "Informe a senha.";
  return null;
}

export function mensagemSenhaNova(valor: string): string | null {
  if (valor.length < 8) return "Use pelo menos 8 caracteres.";
  return null;
}

export function emailJaUsado(codigo: string | undefined, mensagem: string | undefined): boolean {
  const texto = `${codigo ?? ""} ${mensagem ?? ""}`.toLowerCase();
  return texto.includes("user_already_exists") || texto.includes("already exists");
}

export function respostaIncompleta(status: number | undefined): boolean {
  return status === undefined || status === 0 || status >= 500;
}
