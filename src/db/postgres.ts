import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import type { Db } from "./types";

const globalForPg = globalThis as unknown as {
  __meuOrcPg?: Db;
};

/** Neon pooled: uma conexão por instância e prepared statements desligados. */
export async function openPostgres(databaseUrl: string): Promise<Db> {
  if (globalForPg.__meuOrcPg) return globalForPg.__meuOrcPg;
  const client = postgres(databaseUrl, {
    max: 1,
    prepare: false,
    ssl: "require",
  });
  const db = drizzle({ client, schema });
  globalForPg.__meuOrcPg = db;
  return db;
}
