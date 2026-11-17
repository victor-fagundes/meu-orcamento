import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";
import type { Db } from "@/db";
import * as schema from "@/db/schema";
import { seedCatalog } from "@/application/catalog";

/** Conta local de desenvolvimento — criada se o banco estiver vazio. */
export const DEV_USER = {
  email: "demo@local.test",
  password: "demo1234",
  name: "Demo",
} as const;

export async function ensureDevUser(db: Db): Promise<void> {
  if (process.env.NODE_ENV === "production") return;

  const existing = await db.select({ id: schema.user.id }).from(schema.user).limit(1);
  if (existing.length > 0) return;

  const userId = crypto.randomUUID();
  const orcId = crypto.randomUUID();
  const passwordHash = await hashPassword(DEV_USER.password);

  await db.insert(schema.user).values({
    id: userId,
    name: DEV_USER.name,
    email: DEV_USER.email,
    emailVerified: true,
  });
  await db.insert(schema.account).values({
    id: crypto.randomUUID(),
    accountId: userId,
    providerId: "credential",
    userId,
    password: passwordHash,
  });
  await db.insert(schema.orcamentos).values({ id: orcId, userId });
  await seedCatalog(db, orcId);

  console.info(
    `[dev] usuário seed: ${DEV_USER.email} / ${DEV_USER.password}`,
  );
}

/** Garante orçamento+catálogo se o user seed já existia sem itens. */
export async function ensureDevOrcamento(db: Db): Promise<void> {
  if (process.env.NODE_ENV === "production") return;
  const [u] = await db
    .select()
    .from(schema.user)
    .where(eq(schema.user.email, DEV_USER.email))
    .limit(1);
  if (!u) return;
  const [orc] = await db
    .select()
    .from(schema.orcamentos)
    .where(eq(schema.orcamentos.userId, u.id))
    .limit(1);
  if (!orc) {
    const orcId = crypto.randomUUID();
    await db.insert(schema.orcamentos).values({ id: orcId, userId: u.id });
    await seedCatalog(db, orcId);
  }
}
