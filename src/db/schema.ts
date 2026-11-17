import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Schema PostgreSQL — mesmo em PGlite (teste) e Neon (produção).
 * Tabelas `user` / `session` / `account` / `verification` = Better Auth.
 */

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const orcamentos = pgTable("orcamentos", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Itens — Sprint 2; plano em centavos (integer). */
export const itens = pgTable("itens", {
  id: text("id").primaryKey(),
  orcamentoId: text("orcamento_id")
    .notNull()
    .references(() => orcamentos.id, { onDelete: "cascade" }),
  tipo: text("tipo").notNull(),
  grupo: text("grupo").notNull(),
  nome: text("nome").notNull(),
  /** JSON array de 12 inteiros (centavos) — PGlite/PG */
  planoCentavosJson: text("plano_centavos_json").notNull().default("[0,0,0,0,0,0,0,0,0,0,0,0]"),
  arquivado: integer("arquivado").notNull().default(0),
  divida: integer("divida").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Cartões — MO-301 */
export const cartoes = pgTable("cartoes", {
  id: text("id").primaryKey(),
  orcamentoId: text("orcamento_id")
    .notNull()
    .references(() => orcamentos.id, { onDelete: "cascade" }),
  apelido: text("apelido").notNull(),
  /** 1–28; null/omitido = sem fechamento (aviso + competência = mês da compra) */
  diaFechamento: integer("dia_fechamento"),
  diaVencimento: integer("dia_vencimento"),
  instituicao: text("instituicao"),
  ultimos4: text("ultimos4"),
  ativo: integer("ativo").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Limites de alerta — MO-701 */
export const limitesAlerta = pgTable("limites_alerta", {
  orcamentoId: text("orcamento_id")
    .primaryKey()
    .references(() => orcamentos.id, { onDelete: "cascade" }),
  globalPct: integer("global_pct").notNull().default(80),
  /** JSON Record<grupo, pct> */
  catsJson: text("cats_json").notNull().default("{}"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** Lançamentos — MO-303 */
export const lancamentos = pgTable("lancamentos", {
  id: text("id").primaryKey(),
  orcamentoId: text("orcamento_id")
    .notNull()
    .references(() => orcamentos.id, { onDelete: "cascade" }),
  itemId: text("item_id")
    .notNull()
    .references(() => itens.id, { onDelete: "restrict" }),
  cartaoId: text("cartao_id").references(() => cartoes.id, { onDelete: "set null" }),
  descricao: text("descricao").notNull(),
  valorCentavos: integer("valor_centavos").notNull(),
  dataTransacao: text("data_transacao").notNull(),
  competencia: text("competencia").notNull(),
  meio: text("meio").notNull(),
  parcelaN: integer("parcela_n"),
  parcelaTotal: integer("parcela_total"),
  grupoParcelaId: text("grupo_parcela_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
