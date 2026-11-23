# Implementation Plan: Categorias

**Branch**: `rebuild-web` | **Date**: 2026-11-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/041-categorias/spec.md`

## Summary

A categoria passa a ser uma linha por orçamento e tipo, com criar, listar, renomear e arquivar. O nome que o item já guarda em `itens.grupo` continua sendo a ligação. Na entrega, cada par distinto de tipo e grupo vira uma categoria; o lançamento segue no item. Renomear e arquivar atualizam a categoria e os itens daquele tipo no mesmo passo. Um item novo cujo grupo ainda não é categoria ativa cria a categoria junto. O limite de alerta deixa de ser apertado para 1–100 e passa a ser recusado, sem gravar. Exportar sem movimento, ou com falha no meio, devolve a frase e nenhum arquivo. As telas de Orçamento e Ajustes ficam nas histórias 044 e 047.

## Technical Context

**Language/Version**: TypeScript estrito, Next.js 15 App Router

**Primary Dependencies**: Drizzle ORM, Zod já está no projeto e não entra nestas rotas (o domínio devolve a frase), Better Auth via `requireApiSession` / `requireSessionOrcamento`, Vitest

**Storage**: PostgreSQL (Neon) e PGlite local. Tabela nova `categorias`. `itens.grupo` permanece texto. `lancamentos.item_id` não muda.

**Testing**: Vitest no domínio (`src/domain/categorias.test.ts`, `src/domain/alertas.test.ts`) e um teste de aplicação com PGlite em memória para duas contas. Smoke no `quickstart.md`.

**Target Platform**: App web local e a API v1 já usada pelo cliente.

**Project Type**: Aplicação web existente. Esta história entrega domínio, persistência, casos de uso, API e server actions. Sem tela nova.

**Performance Goals**: Uma conta tem dezenas de categorias. Listar, renomear e arquivar leem e gravam esse conjunto numa única ida ao banco, dentro de uma transação quando há mais de uma escrita.

**Constraints**: Domínio sem Next, React ou Drizzle. Centavos inteiros. Toda leitura e escrita filtra `orcamentoId` da sessão. Conta alheia responde como inexistente, nunca como proibida. Sem `console.log`, sem `any`. `src/domain/competencia.ts`, `src/domain/reconciliacao.ts` e a forma do arquivo da história 017 permanecem.

**Scale/Scope**: Um orçamento por usuário. Quatro tipos: R, F, V, E. Nome de categoria nova: 1 a 40 caracteres numa linha. Sem reordenar e sem desarquivar.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Domain Purity | PASS | Nome, chave sem acento, limite inteiro e “há movimento” ficam em `src/domain`. Aplicação só grava. |
| II. Integer Money | PASS | Categoria não tem valor. Plano e lançamento continuam em centavos. O limite é percentual inteiro, não dinheiro. |
| III. Spec-Driven Delivery | PASS | A spec 041 está `Draft`. Este plano não autoriza código. A implementação espera status `ready`. |
| IV. Vertical Slice | PASS com exceção | Sem tela nova. A exceção está em Complexity Tracking: 044 e 047 desenham Orçamento e Ajustes. As frases de exportar e de limite aparecem nos painéis que já existem. |
| V. Simplicity & Isolation | PASS | Uma tabela. `grupo` continua texto. Sem coluna de ordenação. Escopo sempre pelo orçamento da sessão. |

**Post-design re-check**: PASS. `data-model.md` e `contracts/` cobrem categoria, item, limite e exportação. A exceção da fatia vertical continua justificada e não cresceu: nenhuma página nova entrou no desenho.

## Project Structure

### Documentation (this feature)

```text
specs/041-categorias/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── categorias.md
│   └── limite-e-exportacao.md
├── checklists/requirements.md
└── tasks.md                 # /speckit-tasks — não criado aqui
```

### Source Code (repository root)

```text
src/domain/categorias.ts
src/domain/categorias.test.ts
src/domain/alertas.ts              # validar limite; deixa de apertar
src/domain/alertas.test.ts
src/domain/export-orcamento.ts     # haMovimentoParaExportar
src/domain/itens.ts                # grupo do item passa pela regra do nome da categoria
src/db/schema.ts
src/db/pglite.ts                   # CREATE TABLE + backfill no bootstrap local
drizzle/                           # migration gerada
src/application/categorias.ts
src/application/categorias.test.ts # duas contas no PGlite em memória
src/application/itens.ts           # createItem garante a categoria na mesma transação
src/application/catalog.ts         # semente também cria as categorias dos grupos
src/application/import-planilha.ts # insert de item chama o mesmo garantir
src/application/limites.ts
src/application/export-orcamento.ts
src/app/actions/categorias.ts
src/app/actions/limites.ts
src/app/actions/export-orcamento.ts
src/app/api/v1/categorias/route.ts
src/app/api/v1/categorias/[id]/route.ts
src/app/api/v1/categorias/[id]/arquivar/route.ts
src/app/api/v1/limites/route.ts
src/app/api/v1/export/csv/route.ts
src/app/api/v1/export/json/route.ts
```

**Structure Decision**: O app Next já separa domínio, aplicação e rota. A categoria segue o mesmo corte de item e cartão. O PGlite local não roda a pasta `drizzle/`; o bootstrap em `src/db/pglite.ts` recebe o mesmo SQL. Nenhuma página em `src/app/app/` muda de layout.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| IV. Fatia vertical sem tela nova | A spec 041 entrega a capacidade e as frases. As telas que criam, renomeiam e arquivam categoria são a 044 e a 047. Desenhar essas telas aqui duplicaria essas histórias. | Incluir Orçamento e Ajustes nesta entrega. A spec marca isso como fora, e o rebuild já separou as histórias. |
