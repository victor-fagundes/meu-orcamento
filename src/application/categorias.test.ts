import { PGlite } from "@electric-sql/pglite";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { afterEach, describe, expect, it } from "vitest";
import { createItem } from "@/application/itens";
import type { Db } from "@/db";
import * as schema from "@/db/schema";
import { itens, lancamentos, limitesAlerta } from "@/db/schema";
import { ERRO_CATEGORIA_NAO_ENCONTRADA, ERRO_NOME_CATEGORIA_DUPLICADO } from "@/domain/categorias";
import {
  arquivarCategoria,
  criarCategoria,
  listarCategorias,
  preencherCategoriasExistentes,
  renomearCategoria,
} from "./categorias";

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
    CREATE TABLE itens (
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
    CREATE TABLE lancamentos (
      id text PRIMARY KEY,
      orcamento_id text NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
      item_id text NOT NULL REFERENCES itens(id) ON DELETE RESTRICT,
      cartao_id text,
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
    CREATE TABLE limites_alerta (
      orcamento_id text PRIMARY KEY REFERENCES orcamentos(id) ON DELETE CASCADE,
      global_pct integer NOT NULL DEFAULT 80,
      cats_json text NOT NULL DEFAULT '{}',
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE categorias (
      id text PRIMARY KEY,
      orcamento_id text NOT NULL REFERENCES orcamentos(id) ON DELETE CASCADE,
      tipo text NOT NULL,
      nome text NOT NULL,
      arquivada boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      CONSTRAINT categorias_tipo_check CHECK (tipo in ('R', 'F', 'V', 'E'))
    );
    CREATE UNIQUE INDEX categorias_nome_ativo
      ON categorias (orcamento_id, tipo, lower(nome))
      WHERE arquivada = false;
  `);
  return drizzle({ client, schema }) as unknown as Db;
}

async function conta(db: Db, id: string) {
  await db.insert(schema.user).values({
    id: `user-${id}`,
    name: id,
    email: `${id}@test.local`,
    emailVerified: true,
  });
  await db.insert(schema.orcamentos).values({ id, userId: `user-${id}` });
}

describe("categorias", () => {
  it("preenche a partir dos grupos e isola a outra conta", async () => {
    const db = await banco();
    await conta(db, "a");
    await conta(db, "b");
    const moradia = "item-moradia";
    await db.insert(itens).values([
      {
        id: moradia,
        orcamentoId: "a",
        tipo: "F",
        grupo: "Moradia",
        nome: "Aluguel",
        planoCentavosJson: "[0,0,0,0,0,0,0,0,0,0,0,0]",
        arquivado: 0,
        divida: 0,
      },
      {
        id: "item-lazer",
        orcamentoId: "a",
        tipo: "V",
        grupo: "Lazer",
        nome: "Cinema",
        planoCentavosJson: "[0,0,0,0,0,0,0,0,0,0,0,0]",
        arquivado: 0,
        divida: 0,
      },
      {
        id: "item-lazer-2",
        orcamentoId: "a",
        tipo: "V",
        grupo: "lazer",
        nome: "Show",
        planoCentavosJson: "[0,0,0,0,0,0,0,0,0,0,0,0]",
        arquivado: 0,
        divida: 0,
      },
      {
        id: "item-velho",
        orcamentoId: "a",
        tipo: "F",
        grupo: "Velho",
        nome: "Antigo",
        planoCentavosJson: "[0,0,0,0,0,0,0,0,0,0,0,0]",
        arquivado: 1,
        divida: 0,
      },
      {
        id: "item-b",
        orcamentoId: "b",
        tipo: "F",
        grupo: "Moradia",
        nome: "Aluguel",
        planoCentavosJson: "[0,0,0,0,0,0,0,0,0,0,0,0]",
        arquivado: 0,
        divida: 0,
      },
    ]);
    await db.insert(lancamentos).values({
      id: "lanc-1",
      orcamentoId: "a",
      itemId: moradia,
      descricao: "Aluguel",
      valorCentavos: 180000,
      dataTransacao: "2026-11-02",
      competencia: "2026-11",
      meio: "pix",
    });

    await preencherCategoriasExistentes(db);

    const deA = await listarCategorias(db, "a", { incluirArquivadas: true });
    const deB = await listarCategorias(db, "b", { incluirArquivadas: true });
    const idsA = new Set(deA.map((cat) => cat.id));
    expect(deB.every((cat) => !idsA.has(cat.id))).toBe(true);
    expect(deA.filter((cat) => cat.tipo === "V").map((cat) => cat.nome.toLowerCase())).toEqual([
      "lazer",
    ]);
    expect(deA.find((cat) => cat.nome === "Velho")?.arquivada).toBe(true);
    expect(deA.find((cat) => cat.nome === "Moradia")?.arquivada).toBe(false);

    const grupos = await db.select().from(itens).where(eq(itens.orcamentoId, "a"));
    const lazer = grupos.filter((row) => row.tipo === "V");
    expect(new Set(lazer.map((row) => row.grupo)).size).toBe(1);

    const [lanc] = await db.select().from(lancamentos).where(eq(lancamentos.id, "lanc-1"));
    expect(lanc?.itemId).toBe(moradia);
    expect(lanc?.valorCentavos).toBe(180000);
    expect(lanc?.competencia).toBe("2026-11");
  });

  it("criar não aparece na outra conta e duplicata no tipo é recusada", async () => {
    const db = await banco();
    await conta(db, "a");
    await conta(db, "b");
    const criada = await criarCategoria(db, "a", { tipo: "V", nome: "  Lazer  " });
    expect(criada.ok).toBe(true);
    if (!criada.ok) return;
    expect(criada.nome).toBe("Lazer");
    const deNovo = await criarCategoria(db, "a", { tipo: "V", nome: "lazer" });
    expect(deNovo).toEqual({ ok: false, code: "validacao", error: ERRO_NOME_CATEGORIA_DUPLICADO });
    const outroTipo = await criarCategoria(db, "a", { tipo: "F", nome: "Lazer" });
    expect(outroTipo.ok).toBe(true);
    const deB = await listarCategorias(db, "b");
    expect(deB.some((cat) => cat.id === criada.id)).toBe(false);
  });

  it("renomear leva os itens do tipo, o limite e não mexe no lançamento", async () => {
    const db = await banco();
    await conta(db, "a");
    await conta(db, "b");
    const criada = await criarCategoria(db, "a", { tipo: "F", nome: "Moradia" });
    if (!criada.ok) throw new Error(criada.error);
    await db.insert(itens).values([
      {
        id: "aluguel",
        orcamentoId: "a",
        tipo: "F",
        grupo: "Moradia",
        nome: "Aluguel",
        planoCentavosJson: "[0,0,0,0,0,0,0,0,0,0,0,0]",
        arquivado: 0,
        divida: 0,
      },
      {
        id: "outra",
        orcamentoId: "a",
        tipo: "V",
        grupo: "Moradia",
        nome: "Outra",
        planoCentavosJson: "[0,0,0,0,0,0,0,0,0,0,0,0]",
        arquivado: 0,
        divida: 0,
      },
    ]);
    await db.insert(lancamentos).values({
      id: "lanc-aluguel",
      orcamentoId: "a",
      itemId: "aluguel",
      descricao: "Aluguel",
      valorCentavos: 100,
      dataTransacao: "2026-11-02",
      competencia: "2026-11",
      meio: "pix",
    });
    await db.insert(limitesAlerta).values({
      orcamentoId: "a",
      globalPct: 80,
      catsJson: JSON.stringify({ Moradia: 70 }),
    });

    const igual = await renomearCategoria(db, "a", criada.id, "Moradia");
    expect(igual.ok).toBe(true);
    if (igual.ok) expect(igual.nome).toBe("Moradia");

    const casa = await renomearCategoria(db, "a", criada.id, "Casa");
    expect(casa.ok).toBe(true);
    const rows = await db.select().from(itens);
    expect(rows.find((row) => row.id === "aluguel")?.grupo).toBe("Casa");
    expect(rows.find((row) => row.id === "outra")?.grupo).toBe("Moradia");
    const [lanc] = await db.select().from(lancamentos);
    expect(lanc?.itemId).toBe("aluguel");
    expect(lanc?.valorCentavos).toBe(100);
    expect(lanc?.competencia).toBe("2026-11");
    const [limite] = await db.select().from(limitesAlerta);
    expect(JSON.parse(limite?.catsJson ?? "{}")).toEqual({ Casa: 70 });

    const alheia = await renomearCategoria(db, "b", criada.id, "Outra");
    expect(alheia).toEqual({
      ok: false,
      code: "nao_encontrado",
      error: ERRO_CATEGORIA_NAO_ENCONTRADA,
    });
    const [ainda] = await db.select().from(itens).where(eq(itens.id, "aluguel"));
    expect(ainda?.grupo).toBe("Casa");
  });

  it("arquivar tira da lista ativa e mantém o lançamento", async () => {
    const db = await banco();
    await conta(db, "a");
    await conta(db, "b");
    const criada = await criarCategoria(db, "a", { tipo: "V", nome: "Lazer" });
    if (!criada.ok) throw new Error(criada.error);
    await db.insert(itens).values({
      id: "cinema",
      orcamentoId: "a",
      tipo: "V",
      grupo: "Lazer",
      nome: "Cinema",
      planoCentavosJson: "[0,0,0,0,0,0,0,0,0,0,0,0]",
      arquivado: 0,
      divida: 0,
    });
    await db.insert(lancamentos).values({
      id: "lanc-cinema",
      orcamentoId: "a",
      itemId: "cinema",
      descricao: "Cinema",
      valorCentavos: 4000,
      dataTransacao: "2026-11-03",
      competencia: "2026-11",
      meio: "pix",
    });

    const arquivada = await arquivarCategoria(db, "a", criada.id);
    expect(arquivada).toEqual({ ok: true, id: criada.id, arquivada: true });
    const ativas = await listarCategorias(db, "a");
    expect(ativas.some((cat) => cat.id === criada.id)).toBe(false);
    const todas = await listarCategorias(db, "a", { incluirArquivadas: true });
    expect(todas.find((cat) => cat.id === criada.id)?.arquivada).toBe(true);
    const [item] = await db.select().from(itens);
    expect(item?.arquivado).toBe(1);
    const [lanc] = await db.select().from(lancamentos);
    expect(lanc?.itemId).toBe("cinema");
    expect(lanc?.valorCentavos).toBe(4000);

    const alheia = await arquivarCategoria(db, "b", criada.id);
    expect(alheia.ok).toBe(false);
  });

  it("item novo cria a categoria que falta e não duplica a ativa", async () => {
    const db = await banco();
    await conta(db, "a");
    const primeiro = await createItem(db, "a", { tipo: "V", grupo: "Streaming", nome: "Netflix" });
    expect(primeiro.ok).toBe(true);
    const categorias = await listarCategorias(db, "a");
    expect(categorias.map((cat) => cat.nome)).toEqual(["Streaming"]);

    const segundo = await createItem(db, "a", { tipo: "V", grupo: "Streaming", nome: "Spotify" });
    expect(segundo.ok).toBe(true);
    expect(await listarCategorias(db, "a")).toHaveLength(1);

    const arquivada = categorias[0];
    if (!arquivada) throw new Error("categoria");
    await arquivarCategoria(db, "a", arquivada.id);
    const terceiro = await createItem(db, "a", { tipo: "V", grupo: "Streaming", nome: "Max" });
    expect(terceiro.ok).toBe(true);
    const depois = await listarCategorias(db, "a", { incluirArquivadas: true });
    expect(depois.filter((cat) => cat.nome === "Streaming" && !cat.arquivada)).toHaveLength(1);
    expect(depois.filter((cat) => cat.nome === "Streaming" && cat.arquivada)).toHaveLength(1);

    const ruim = await createItem(db, "a", { tipo: "V", grupo: "Lazer\n", nome: "Cinema" });
    expect(ruim.ok).toBe(false);
    const itensAgora = await db.select().from(itens);
    expect(itensAgora.some((row) => row.nome === "Cinema")).toBe(false);
  });
});
