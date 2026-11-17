/** Segredo que o código aceita só fora de produção. */
export const DEV_AUTH_SECRET = "dev-only-change-me-meu-orcamento-32chars";

export type EnvLike = {
  NODE_ENV?: string;
  DATABASE_URL?: string;
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
};

/** Mensagem objetiva, ou null quando o ambiente pode subir. */
export function productionConfigError(env: EnvLike): string | null {
  if (env.NODE_ENV !== "production") return null;

  if (!env.DATABASE_URL?.trim()) return "DATABASE_URL ausente em produção.";

  const secret = env.BETTER_AUTH_SECRET?.trim() ?? "";
  if (secret.length < 32 || secret === DEV_AUTH_SECRET) {
    return "BETTER_AUTH_SECRET inválido em produção.";
  }

  const url = env.BETTER_AUTH_URL?.trim() ?? "";
  if (!url.startsWith("https://")) return "BETTER_AUTH_URL precisa ser HTTPS em produção.";

  return null;
}

export function assertProductionConfig(env: EnvLike = process.env): void {
  const error = productionConfigError(env);
  if (error) throw new Error(error);
}
