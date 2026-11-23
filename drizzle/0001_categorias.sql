CREATE TABLE "categorias" (
	"id" text PRIMARY KEY NOT NULL,
	"orcamento_id" text NOT NULL,
	"tipo" text NOT NULL,
	"nome" text NOT NULL,
	"arquivada" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "categorias_tipo_check" CHECK ("categorias"."tipo" in ('R', 'F', 'V', 'E'))
);
--> statement-breakpoint
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_orcamento_id_orcamentos_id_fk" FOREIGN KEY ("orcamento_id") REFERENCES "public"."orcamentos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "categorias_nome_ativo" ON "categorias" USING btree ("orcamento_id","tipo",lower("nome")) WHERE "categorias"."arquivada" = false;
--> statement-breakpoint
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
--> statement-breakpoint
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