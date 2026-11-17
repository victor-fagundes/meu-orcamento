# Implementation Plan: Produção na nuvem

**Branch**: `024-producao-nuvem` | **Date**: 2026-11-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/024-producao-nuvem/spec.md`

## Summary

O Meu Orçamento passa a ter um ambiente publicado: app na Vercel (HTTPS, região São Paulo) e Postgres no Neon (São Paulo). O desenvolvimento continua no PGlite em `data/pglite`, sem conta na nuvem, como a decisão D-06. Produção exige `DATABASE_URL`, `BETTER_AUTH_SECRET` e `BETTER_AUTH_URL`; sem isso o servidor falha em vez de usar o segredo fixo ou a conta demo. O schema de hoje vira migração Drizzle aplicada no Neon antes do deploy. Nada de `data/pglite` sobe. Importação fica com teto de 4 MB, alinhado ao limite do hosting. “Esqueci a senha” em produção deixa de citar o terminal e deixa de gravar o link no log. E-mail de reset e domínio próprio não entram nesta entrega.

## Technical Context

**Language/Version**: TypeScript (strict), Next.js 15 App Router, Node no runtime da Vercel (não Edge)

**Primary Dependencies**: Next.js 15, Drizzle ORM, driver `postgres` (já em `package.json`), Better Auth, PGlite só no dev, Vitest

**Storage**: Dev sem `DATABASE_URL`: PGlite em `data/pglite`. Produção: Neon Postgres, string pooled em `DATABASE_URL`. Migração usa a string direta (`DATABASE_URL_UNPOOLED`) a partir da máquina de quem publica. Mesmas tabelas de `src/db/schema.ts`. Sem tabela nova.

**Testing**: Vitest no seletor de banco (modo URL vs PGlite; produção sem URL falha; segredo de dev recusado em produção). Smoke do PM no `quickstart.md` (local demo + celular em produção).

**Target Platform**: Vercel, região `gru1`. Neon AWS `sa-east-1`. Browser no computador e no celular.

**Project Type**: Web application — infra de produção com smoke nas telas que a pessoa já usa (cadastro, Resumo, Ajustes, importação, esqueci a senha)

**Performance Goals**: Conta nova até o Resumo em menos de 2 minutos no celular. Primeira abertura depois do compute suspenso pode levar alguns segundos; as seguintes respondem no ritmo atual do app.

**Constraints**: Domínio puro intacto; centavos inteiros; isolamento por `orcamentoId`; segredos fora do git; PGlite não roda em produção; importação server-side em memória; teto de 4 MB por causa do corpo máximo da Vercel (~4,5 MB); sem copiar dado local; sem PostHog e sem Resend nesta história

**Scale/Scope**: Uso pessoal e convites. Dezenas de contas, não milhares. Um orçamento por conta. Free tier do Neon e Hobby da Vercel.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Domain Purity | PASS | Nenhuma regra de competência, parcela, alerta ou parser muda. A troca de banco fica em `src/db`. O teto de 4 MB fica na borda (`src/lib`), não no domínio. |
| II. Integer Money | PASS | Colunas monetárias continuam inteiras. A migração copia o schema atual. |
| III. Spec-Driven Delivery | PASS | Spec 024 é a ativa. Código só com status `ready`. A 023 (Material Design) não é alterada. |
| IV. Vertical Slice | PASS | Exceção de infra da constituição: segredo, migração e hosting, com smoke nas telas reais (cadastro, persistência, isolamento, Ajustes, importação, reset). |
| V. Simplicity & Isolation | PASS | Um hosting e um banco já escolhidos na arquitetura. Dev segue sem Neon. Sem serviço de e-mail novo. Queries continuam filtradas pela sessão. |

**Post-design re-check**: PASS. Contratos cobrem ambiente, persistência e publicação. Nenhuma violação a justificar.

## Project Structure

### Documentation (this feature)

```text
specs/024-producao-nuvem/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── ambiente.md
│   ├── persistencia.md
│   └── deploy.md
└── tasks.md                 # /speckit-tasks — não criado aqui
```

### Source Code (repository root)

```text
src/db/index.ts                 # escolhe Postgres ou PGlite; produção sem URL falha
src/db/postgres.ts              # cliente postgres.js (max 1, prepare: false)
src/db/pglite.ts                # bootstrap atual, só carregado sem DATABASE_URL
src/db/seed-dev-user.ts         # já não roda com NODE_ENV=production; permanece
src/db/schema.ts                # fonte do schema; sem coluna nova
drizzle.config.ts               # migrate lê DATABASE_URL_UNPOOLED, senão DATABASE_URL
drizzle/                        # SQL gerado (ainda não existe no repo)
src/lib/auth.ts                 # sem fallback de segredo em produção; reset sem log do link
src/lib/parse-pdf.ts            # MAX_PDF_BYTES = 4 MB
src/lib/parse-spreadsheet.ts    # MAX_IMPORT_BYTES = 4 MB
src/app/actions/import-pdf.ts   # mensagem "maior que 4 MB"
src/app/actions/import-planilha.ts
src/app/esqueci-senha/page.tsx  # texto de produção sem “terminal”
src/app/app/ajustes/page.tsx    # esconder a nota Dev em produção
next.config.ts                  # serverActions.bodySizeLimit = 4mb; PGlite segue external
.env.example                    # variáveis de produção comentadas, sem segredo real
docs/DECISAO_DB_LOCAL_CELULAR.md  # tirar “não fazer deploy” quando a história fechar
```

**Structure Decision**: O app Next único permanece. Produção não ganha serviço separado. `getDb()` passa a ter dois caminhos. O caminho PGlite fica em módulo próprio, importado só quando não há `DATABASE_URL`, para a função na Vercel não criar `data/pglite` num disco somente leitura.

## Complexity Tracking

Nenhuma violação. Tabela vazia.
