import { PGlite } from "@electric-sql/pglite";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { afterEach, describe, expect, it } from "vitest";
import type { Db } from "@/db";
import * as schema from "@/db/schema";
import { limitesAlerta } from "@/db/schema";
import { salvarLimiteGlobal } from "./limites";

const clients: PGlite[] = [];

afterEach(async () => {
  await Promise.all(clients.splice(0).map((client) => client.close()));
});

async function banco(): Promise<Db> {
  const client = new PGlite();
  clients.push(client);
  await client.exec(`
    CREATE TABLE "user" (
      id text PRIMARY KEY,
      name text NOT NULL,
      email text NOT NULL UNIQUE,
      email_verified boolean NOT NULL DEFAULT false,
      image text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE orcamentos (
      id text PRIMARY KEY,
      user_id text NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE limites_alerta (
      orcamento_id text PRIMARY KEY REFERENCES orcamentos(id) ON DELETE CASCADE,
      global_pct integer NOT NULL DEFAULT 80,
      cats_json text NOT NULL DEFAULT '{}',
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `);
  return drizzle({ client, schema }) as unknown as Db;
}

describe("salvarLimiteGlobal", () => {
  it("atualiza o global e conserva cats_json", async () => {
    const db = await banco();
    await db.insert(schema.user).values({
      id: "user-a",
      name: "A",
      email: "a@test.local",
      emailVerified: true,
    });
    await db.insert(schema.orcamentos).values({ id: "a", userId: "user-a" });
    await db.insert(limitesAlerta).values({
      orcamentoId: "a",
      globalPct: 80,
      catsJson: '{"Habitação":70}',
    });
    const salvo = await salvarLimiteGlobal(db, "a", 100);
    expect(salvo).toEqual({ ok: true, globalPct: 100 });
    const [row] = await db.select().from(limitesAlerta).where(eq(limitesAlerta.orcamentoId, "a"));
    expect(row?.globalPct).toBe(100);
    expect(row?.catsJson).toBe('{"Habitação":70}');
  });
});
