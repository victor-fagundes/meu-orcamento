import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { runDb } from "@/db";
import { orcamentos } from "@/db/schema";
import { ensureCatalog } from "@/application/catalog";
import { reconcileTabNameDuplicates } from "@/application/item-unico";
import { getAuth } from "@/lib/auth";

export async function requireSessionOrcamento() {
  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login?sessao=expirada");

  return runDb(async (db) => {
    let orc = (
      await db.select().from(orcamentos).where(eq(orcamentos.userId, session.user.id)).limit(1)
    )[0];

    if (!orc) {
      const id = crypto.randomUUID();
      await db.insert(orcamentos).values({ id, userId: session.user.id });
      await ensureCatalog(db, id);
      orc = (
        await db.select().from(orcamentos).where(eq(orcamentos.userId, session.user.id)).limit(1)
      )[0];
    } else {
      await ensureCatalog(db, orc.id);
    }

    if (!orc) throw new Error("Orçamento indisponível");
    await reconcileTabNameDuplicates(db, orc.id);
    return { db, session, orcamento: orc };
  });
}
