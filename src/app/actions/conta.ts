"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { runDb } from "@/db";
import { user } from "@/db/schema";
import { getAuth } from "@/lib/auth";

/**
 * Exclui a conta. FK CASCADE remove sessão, orçamento, itens, lançamentos, etc.
 * Confirmação de frase fica na UI (digite EXCLUIR).
 */
export async function excluirContaAction(confirmPhrase: string): Promise<
  { ok: true } | { ok: false; error: string }
> {
  if (confirmPhrase.trim().toUpperCase() !== "EXCLUIR") {
    return { ok: false, error: "Digite EXCLUIR para confirmar." };
  }

  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return { ok: false, error: "Sessão inválida." };

    const userId = session.user.id;

    await runDb(async (db) => {
      await db.delete(user).where(eq(user.id, userId));
    });

    try {
      await auth.api.signOut({ headers: await headers() });
    } catch {
      /* sessão já inválida */
    }

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Falha ao excluir conta" };
  }
}
