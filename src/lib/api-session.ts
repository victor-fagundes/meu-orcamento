import { eq } from "drizzle-orm";
import { ensureCatalog } from "@/application/catalog";
import { reconcileTabNameDuplicates } from "@/application/item-unico";
import { runDb, type Db } from "@/db";
import { orcamentos } from "@/db/schema";
import { jsonError } from "@/lib/api-v1";
import { getAuth } from "@/lib/auth";

export type ApiSessionContext = {
  db: Db;
  userId: string;
  orcamento: typeof orcamentos.$inferSelect;
};

/**
 * Session for JSON API handlers. Returns 401 JSON instead of redirecting to /login.
 */
export async function requireApiSession(
  request: Request,
): Promise<ApiSessionContext | Response> {
  try {
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return jsonError(401, "Não autenticado");
    }

    const userId = session.user.id;

    return await runDb(async (db) => {
      let orc = (
        await db.select().from(orcamentos).where(eq(orcamentos.userId, userId)).limit(1)
      )[0];

      if (!orc) {
        const id = crypto.randomUUID();
        await db.insert(orcamentos).values({ id, userId });
        await ensureCatalog(db, id);
        orc = (
          await db.select().from(orcamentos).where(eq(orcamentos.userId, userId)).limit(1)
        )[0];
      } else {
        await ensureCatalog(db, orc.id);
      }

      if (!orc) {
        throw new Error("Orçamento indisponível");
      }
      await reconcileTabNameDuplicates(db, orc.id);
      return { db, userId, orcamento: orc };
    });
  } catch (e) {
    console.error("[api-session]", e);
    return jsonError(500, e instanceof Error ? e.message : "Falha de sessão");
  }
}

export function isApiError(result: ApiSessionContext | Response): result is Response {
  return result instanceof Response;
}
