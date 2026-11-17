# Contract: Persistência

O mesmo schema serve os dois ambientes. O driver muda. Os valores monetários continuam inteiros.

## Seleção

```text
produção e sem DATABASE_URL        → erro, não abre PGlite
DATABASE_URL definida              → Neon via postgres.js (pooled, prepare: false, max: 1)
sem DATABASE_URL, fora de produção → PGlite em data/pglite + seed demo se vazio
```

O módulo do PGlite só é carregado no terceiro caso. Produção não chama `mkdir` em `data/pglite`.

## Migração

1. A fonte do SQL de produção é `src/db/schema.ts`, gerada para `drizzle/`.
2. `npm run db:migrate` roda contra `DATABASE_URL_UNPOOLED` (conexão direta). Não roda no boot da Vercel.
3. Uma publicação que depende de schema novo só acontece depois dessa migração ter concluído.
4. O primeiro Neon migrado não recebe linhas de `data/pglite`.
5. Cadastro continua o único insert inicial: usuário, conta, um orçamento, catálogo. Repetir o deploy não duplica o orçamento (`user_id` único).

## Isolamento

Toda query de orçamento, item, cartão, lançamento e limite segue filtrada pelo `orcamentoId` da sessão, como hoje. Id de outro usuário responde como inexistente.

## Tamanho de arquivo

| Entrada | Teto | Acima do teto |
|---|---|---|
| Planilha | 4 MB | `{ ok: false, error: "Arquivo maior que 4 MB." }`, nada gravado |
| PDF | 4 MB | `{ ok: false, error: "PDF maior que 4 MB." }`, nada gravado |

`serverActions.bodySizeLimit` fica em `4mb`, abaixo do corte do hosting. Até o teto, prévia e confirmação seguem as specs de importação já verificadas. Arquivo continua só em memória.

## O que não é contrato desta história

- Unificar o `CREATE TABLE` do PGlite com os arquivos `drizzle/`.
- Apagar conta com carência de 30 dias.
- Copiar lançamentos do computador de dev para o Neon.
