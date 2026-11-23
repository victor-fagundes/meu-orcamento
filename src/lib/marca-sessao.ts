export const MARCA_SESSAO = "mo-teve-sessao";

export function limparMarcaSessao() {
  document.cookie = `${MARCA_SESSAO}=; Path=/; Max-Age=0; SameSite=Lax`;
}
