/**
 * Isolamento por usuário (MO-102).
 * Implementação completa após Better Auth (T4/T5).
 */

export class NotFoundError extends Error {
  readonly status = 404;
  constructor(message = "Não encontrado") {
    super(message);
    this.name = "NotFoundError";
  }
}

export type SessionUser = {
  id: string;
};

/**
 * Garante que o orçamento pertence ao usuário da sessão.
 * Recurso alheio → NotFoundError (404), nunca 403.
 */
export async function requireOrcamento(
  sessionUser: SessionUser | null | undefined,
  loadByUserId: (userId: string) => Promise<{ id: string; userId: string } | null>,
): Promise<{ id: string; userId: string }> {
  if (!sessionUser?.id) {
    throw new NotFoundError();
  }
  const orcamento = await loadByUserId(sessionUser.id);
  if (!orcamento || orcamento.userId !== sessionUser.id) {
    throw new NotFoundError();
  }
  return orcamento;
}
