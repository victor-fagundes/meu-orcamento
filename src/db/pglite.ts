import { mkdirSync } from "node:fs";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { preencherCategoriasExistentes } from "@/application/categorias";
import { ensureDevOrcamento, ensureDevUser } from "./seed-dev-user";
import * as schema from "./schema";
import type { Db } from "./types";

const globalForPglite = globalThis as unknown as {
  __meuOrcPglite?: PGlite;
  __meuOrcPgliteDb?: Db;
  __meuOrcPgliteQueue?: Promise<unknown>;
};

function pgliteDataDir(): string {
  const dir = path.join(process.cwd(), "data", "pglite");
  mkdirSync(dir, { recursive: true });
  return dir;
}

async function bootstrapSchema(client: PGlite) {
  await client.exec(`
    CREATE TABLE IF NOT EXISTS "user" (
      id text PRIMARY KEY,
      name text NOT NULL,
      email text NOT NULL UNIQUE,
      email_verified boolean NOT NULL DEFAULT false,
      image text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS session (
      id text PRIMARY KEY,
      expires_at timestamptz NOT NULL,
      token text NOT NULL UNIQUE,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      ip_address text,
      user_agent text,
      user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS account (
      id text PRIMARY KEY,
      account_id text NOT NULL,
      provider_id text NOT NULL,
      user_id text NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      access_token text,
      refresh_token text,
      id_token text,
      access_token_expires_at timestamptz,
      refresh_token_expires_at timestamptz,
      scope text,
      password text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS verification (
      id text PRIMARY KEY,
      identifier text NOT NULL,
      value text NOT NULL,
      expires_at timestamptz NOT NULL,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS orcamentos (
      id text PRIMARY KEY,
      user_id text NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS itens (
      id text PRIMARY KEY,
      orcamento_id text NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
      tipo text NOT NULL,
      grupo text NOT NULL,
      nome text NOT NULL,
      plano_centavos_json text NOT NULL DEFAULT '[0,0,0,0,0,0,0,0,0,0,0,0]',
      arquivado integer NOT NULL DEFAULT 0,
      divida integer NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS cartoes (
      id text PRIMARY KEY,
      orcamento_id text NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
      apelido text NOT NULL,
      dia_fechamento integer,
      dia_vencimento integer,
      instituicao text,
      ultimos4 text,
      ativo integer NOT NULL DEFAULT 1,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS lancamentos (
      id text PRIMARY KEY,
      orcamento_id text NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
      item_id text NOT NULL REFERENCES itens(id) ON DELETE RESTRICT,
      cartao_id text REFERENCES cartoes(id) ON DELETE SET NULL,
      descricao text NOT NULL,
      valor_centavos integer NOT NULL,
      data_transacao text NOT NULL,
      competencia text NOT NULL,
      meio text NOT NULL,
      parcela_n integer,
      parcela_total integer,
      grupo_parcela_id text,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS limites_alerta (
      orcamento_id text PRIMARY KEY REFERENCES orcamentos(id) ON DELETE CASCADE,
      global_pct integer NOT NULL DEFAULT 80,
      cats_json text NOT NULL DEFAULT '{}',
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS categorias (
      id text PRIMARY KEY,
      orcamento_id text NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
      tipo text NOT NULL,
      nome text NOT NULL,
      arquivada boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT categorias_tipo_check CHECK (tipo in ('R', 'F', 'V', 'E'))
    );
    CREATE UNIQUE INDEX IF NOT EXISTS categorias_nome_ativo
      ON categorias (orcamento_id, tipo, lower(nome))
      WHERE arquivada = false;
  `);
  await client.exec(`
    WITH canonical AS (
      SELECT DISTINCT ON (orcamento_id, tipo, lower(grupo))
        orcamento_id,
        tipo,
        lower(grupo) AS chave,
        grupo AS nome
      FROM itens
      ORDER BY orcamento_id, tipo, lower(grupo),
        CASE WHEN arquivado = 0 THEN 0 ELSE 1 END,
        grupo
    )
    UPDATE itens AS i
    SET grupo = c.nome, updated_at = now()
    FROM canonical AS c
    WHERE i.orcamento_id = c.orcamento_id
      AND i.tipo = c.tipo
      AND lower(i.grupo) = c.chave
      AND i.grupo <> c.nome;

    INSERT INTO categorias (id, orcamento_id, tipo, nome, arquivada, created_at, updated_at)
    SELECT gen_random_uuid()::text, g.orcamento_id, g.tipo, g.grupo, NOT g.tem_ativo, now(), now()
    FROM (
      SELECT orcamento_id, tipo, grupo, bool_or(arquivado = 0) AS tem_ativo
      FROM itens
      GROUP BY orcamento_id, tipo, grupo
    ) AS g
    WHERE NOT EXISTS (
      SELECT 1 FROM categorias c
      WHERE c.orcamento_id = g.orcamento_id
        AND c.tipo = g.tipo
        AND lower(c.nome) = lower(g.grupo)
        AND c.arquivada = (NOT g.tem_ativo)
    );
  `);
  try {
    await client.exec(`ALTER TABLE itens ADD COLUMN IF NOT EXISTS divida integer NOT NULL DEFAULT 0;`);
  } catch {
    /* ignore */
  }
}

/** Serializa o client PGlite. Evita "ArrayBuffer is not detachable" no Next. */
function serializeClient(client: PGlite): PGlite {
  const handler: ProxyHandler<PGlite> = {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof value !== "function") return value;
      if (prop === "then") return undefined;
      return (...args: unknown[]) => {
        const prev = globalForPglite.__meuOrcPgliteQueue ?? Promise.resolve();
        const run = prev.catch(() => undefined).then(() =>
          (value as (...a: unknown[]) => unknown).apply(target, args),
        );
        globalForPglite.__meuOrcPgliteQueue = Promise.resolve(run).then(
          () => undefined,
          () => undefined,
        );
        return run;
      };
    },
  };
  return new Proxy(client, handler);
}

/** Banco local de desenvolvimento. Não chamar em produção. */
export async function openPglite(): Promise<Db> {
  if (globalForPglite.__meuOrcPgliteDb) return globalForPglite.__meuOrcPgliteDb;
  const raw = await PGlite.create(pgliteDataDir());
  const client = serializeClient(raw);
  globalForPglite.__meuOrcPglite = client;
  await bootstrapSchema(client);
  const db = drizzle({ client, schema }) as unknown as Db;
  await preencherCategoriasExistentes(db);
  await ensureDevUser(db);
  await ensureDevOrcamento(db);
  globalForPglite.__meuOrcPgliteDb = db;
  return db;
}
