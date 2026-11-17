import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { eq } from "drizzle-orm";
import { getDb, runDb } from "@/db";
import * as schema from "@/db/schema";
import { assertProductionConfig, DEV_AUTH_SECRET } from "@/lib/production-env";

function createAuth(db: Awaited<ReturnType<typeof getDb>>) {
  assertProductionConfig();
  const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
  const secret = process.env.BETTER_AUTH_SECRET ?? DEV_AUTH_SECRET;
  return betterAuth({
    appName: "Meu Orçamento",
    baseURL,
    secret,
    trustedOrigins: [baseURL],
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
      sendResetPassword: async ({ user, url }) => {
        if (process.env.NODE_ENV === "production") return;
        console.info("[auth] reset password", user.email, url);
      },
    },
    user: {
      deleteUser: {
        enabled: true,
        // MVP local: exclusão imediata (PGlite). Soft-delete 30 dias entra com Neon.
      },
    },
    databaseHooks: {
      user: {
        create: {
          after: async (created) => {
            const { seedCatalog } = await import("@/application/catalog");
            await runDb(async (database) => {
              const existing = (
                await database
                  .select()
                  .from(schema.orcamentos)
                  .where(eq(schema.orcamentos.userId, created.id))
                  .limit(1)
              )[0];
              if (!existing) {
                const orcId = crypto.randomUUID();
                await database.insert(schema.orcamentos).values({
                  id: orcId,
                  userId: created.id,
                });
                await seedCatalog(database, orcId);
              }
            });
          },
        },
      },
    },
    plugins: [nextCookies()],
  });
}

type AuthInstance = ReturnType<typeof createAuth>;

const globalAuth = globalThis as unknown as {
  __meuOrcAuth?: AuthInstance;
  __meuOrcAuthReady?: Promise<AuthInstance>;
};

/** Better Auth singleton — aguarda PGlite pronto. */
export async function getAuth(): Promise<AuthInstance> {
  if (globalAuth.__meuOrcAuth) return globalAuth.__meuOrcAuth;
  if (!globalAuth.__meuOrcAuthReady) {
    globalAuth.__meuOrcAuthReady = (async () => {
      const db = await getDb();
      const instance = createAuth(db);
      globalAuth.__meuOrcAuth = instance;
      return instance;
    })();
  }
  return globalAuth.__meuOrcAuthReady;
}
