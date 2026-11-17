import { assertProductionConfig } from "@/lib/production-env";
import { openPostgres } from "./postgres";
import type { Db } from "./types";

const globalForDb = globalThis as unknown as {
  __meuOrcDb?: Db;
  __meuOrcReady?: Promise<Db>;
};

async function createDb(): Promise<Db> {
  assertProductionConfig();
  const url = process.env.DATABASE_URL?.trim();
  if (url) return openPostgres(url);
  const { openPglite } = await import("./pglite");
  return openPglite();
}

export async function getDb(): Promise<Db> {
  if (globalForDb.__meuOrcDb) return globalForDb.__meuOrcDb;
  if (!globalForDb.__meuOrcReady) {
    globalForDb.__meuOrcReady = createDb()
      .then((db) => {
        globalForDb.__meuOrcDb = db;
        return db;
      })
      .catch((err) => {
        globalForDb.__meuOrcReady = undefined;
        throw err;
      });
  }
  return globalForDb.__meuOrcReady;
}

export async function runDb<T>(fn: (db: Db) => Promise<T>): Promise<T> {
  const db = await getDb();
  return fn(db);
}

export type { Db };
