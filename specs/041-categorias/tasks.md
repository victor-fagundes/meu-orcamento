---

description: "Task list for 041 Categorias"
---

# Tasks: Categorias

**Input**: Design documents from `/specs/041-categorias/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Vitest no domínio e um teste de aplicação com PGlite em memória, pedidos em plan.md e em quickstart.md. Sem Playwright.

**Organization**: US1 o que já existe vira categoria (P1, MVP). US2 criar (P1). US3 renomear (P1). US4 arquivar (P1). US5 item novo abre a categoria (P2). US6 limite 1–100 (P2). US7 exportar (P2).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (outro arquivo, sem depender de tarefa incompleta)
- **[Story]**: US1 … US7
- Cada tarefa cita o arquivo

## Path Conventions

- Domínio: `src/domain/categorias.ts`, `src/domain/itens.ts`, `src/domain/alertas.ts`, `src/domain/export-orcamento.ts`
- Aplicação: `src/application/categorias.ts`, `src/application/itens.ts`, `src/application/catalog.ts`, `src/application/import-planilha.ts`, `src/application/limites.ts`, `src/application/export-orcamento.ts`
- Banco: `src/db/schema.ts`, `src/db/pglite.ts`, `drizzle/`
- API e actions: `src/app/api/v1/categorias/`, `src/app/api/v1/limites/route.ts`, `src/app/api/v1/export/`, `src/app/actions/categorias.ts`, `src/app/actions/limites.ts`, `src/app/actions/export-orcamento.ts`
- Contratos: `specs/041-categorias/contracts/categorias.md`, `specs/041-categorias/contracts/limite-e-exportacao.md`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Travar o gate da constituição antes de qualquer código de produto

- [x] T001 Keep `specs/041-categorias/spec.md` at status `Draft` until the PM sets `ready`. Do not edit `src/` while the status is `Draft` (constitution III). Do not add a page under `src/app/app/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Tabela `categorias` e a regra de nome, usadas por criar, renomear, arquivar e item novo

**⚠️ CRITICAL**: Nenhuma user story começa antes disto

- [x] T002 Add table `categorias` in `src/db/schema.ts`. Columns: `id` text primary key; `orcamento_id` text NOT NULL references `orcamentos` ON DELETE CASCADE; `tipo` text NOT NULL with check `tipo in ('R','F','V','E')`; `nome` text NOT NULL; `arquivada` boolean NOT NULL default false; `created_at` and `updated_at` timestamptz NOT NULL default now(). Partial unique index on `(orcamento_id, tipo, lower(nome))` WHERE `arquivada = false`. Do not add a column to `itens` or `lancamentos`
- [x] T003 Generate the Drizzle migration from `src/db/schema.ts` into `drizzle/` with `npm run db:generate`. The migration creates the table, the tipo check, and the partial unique index. Do not put the backfill SQL in this task
- [x] T004 Add the same CREATE TABLE, tipo check, and partial unique index to `bootstrapSchema` in `src/db/pglite.ts`. `openPglite` does not run `drizzle/`. Leave `itens.arquivado` as integer 0/1
- [x] T005 [P] Add `validarNomeCategoria` and `chaveNome` in `src/domain/categorias.ts`, with cases in `src/domain/categorias.test.ts`. Trim only the edges. Empty or whitespace-only → "Informe o nome da categoria." More than 40 characters after trim → "Use no máximo 40 caracteres." Exactly 40 characters is accepted. If the raw string contains `\n` or `\r`, reject with "Use o nome em uma linha só." before trim (`"Lazer\n"` must fail). `chaveNome` is trim + lowercase + NFD with marks removed (`Ação` and `acao` match; `Lazer` and `lazer` match). Do not call `normalizeItemLabel`. No import from Next, React, or Drizzle

**Checkpoint**: A tabela existe no Neon (migration) e no PGlite. A frase de nome está no domínio

---

## Phase 3: User Story 1 - O que já existe vira categoria (Priority: P1) 🎯 MVP

**Goal**: Cada par de tipo e nome de grupo já usado pelos itens vira uma categoria. Lançamento continua no item. A lista mostra só as ativas, salvo quando pedem as arquivadas.

**Independent Test**: Numa conta que já tem itens em grupos, ler as categorias. Cada par de tipo e nome de grupo tem uma categoria. Grupo com todo item arquivado fica arquivado. Grupo com um item ativo fica ativo. Nenhum lançamento muda de item, valor ou competência.

### Tests for User Story 1

> Escrever o teste primeiro e vê-lo falhar antes da implementação.

- [x] T006 [US1] Add a failing PGlite in-memory test in `src/application/categorias.test.ts`. Seed two orçamentos. In the first: itens Moradia (F, ativo) and Lazer (V, ativo), plus one grupo whose every item has `arquivado = 1`, plus a lançamento on the Moradia item. Also seed `Lazer` and `lazer` in the same tipo. Call `preencherCategoriasExistentes`. Expect one category per tipo + lower(nome), archived only when every item of that grupo and tipo has `arquivado <> 0`, and the lançamento still on the same `item_id`. The second orçamento's list does not include the first's categories

### Implementation for User Story 1

- [x] T007 [US1] Implement `preencherCategoriasExistentes` in `src/application/categorias.ts` and the same rules as SQL in the migration from T003 and after CREATE TABLE in `src/db/pglite.ts`. One category per `(orcamento_id, tipo, lower(grupo))`. `arquivada` is true only when no item of that grupo and tipo has `arquivado = 0`. If two spellings differ only by case, keep the nome of a grupo that still has an active item; otherwise the first by `pt-BR`, and update those itens to that `grupo` before insert. Skip a pair that already has an active category with the same `lower(nome)`. Do not merge accent-only pairs. Do not update `lancamentos`
- [x] T008 [US1] Implement `listarCategorias` in `src/application/categorias.ts`. Filter by the session `orcamentoId`. `incluirArquivadas` false returns only `arquivada = false`. Order tipo R, F, V, E, then nome with `pt-BR`. Each row: `id`, `tipo`, `nome`, `arquivada`
- [x] T009 [US1] Add `GET /api/v1/categorias` in `src/app/api/v1/categorias/route.ts` per `specs/041-categorias/contracts/categorias.md`. Missing `incluirArquivadas` means `0`. Any other value than `0` or `1` returns 400. 401 "Não autenticado" when there is no session. Add `listarCategoriasAction` in `src/app/actions/categorias.ts` with the same filter. No new page

- [x] T010 [US1] Run `npx vitest run src/application/categorias.test.ts` and keep the US1 assertions green

**Checkpoint**: US1 testável sem criar, renomear ou arquivar pela API

---

## Phase 4: User Story 2 - Criar uma categoria (Priority: P1)

**Goal**: A pessoa cria uma categoria com tipo e nome. O nome guardado não tem espaços nas pontas. Duplicata ativa no mesmo tipo é recusada com a frase da spec.

**Independent Test**: Criar "  Lazer  " em Despesas variáveis grava "Lazer". Criar "lazer" de novo no mesmo tipo recusa, sem segunda linha. Criar "Lazer" em outro tipo grava.

### Tests for User Story 2

- [x] T011 [US2] Extend `src/domain/categorias.test.ts` with failing uniqueness cases: active same tipo and same `chaveNome` is rejected with "Escolha outro nome. Já existe uma categoria com esse nome neste tipo."; the same nome in another tipo is allowed; an archived category with that chave does not block a new active one

### Implementation for User Story 2

- [x] T012 [US2] Implement `criarCategoria` in `src/application/categorias.ts`. Input `tipo` and `nome`. `tipo` outside R, F, V, E → "Tipo inválido." Run `validarNomeCategoria`. Inside `db.transaction`, reload active categories of that tipo and orcamento; reject a matching `chaveNome`. Insert `id` via `crypto.randomUUID()`, `arquivada` false. Return `{ id, tipo, nome, arquivada: false }`
- [x] T013 [US2] Add `POST /api/v1/categorias` in `src/app/api/v1/categorias/route.ts`. 201 with the body from T012. Invalid JSON → 400 "JSON inválido". Name and tipo errors → 400 with the domain phrase. Scope by session `orcamentoId`. Do not use zod
- [x] T014 [US2] Add `criarCategoriaAction` in `src/app/actions/categorias.ts`. On success call `revalidatePath` for `/app/orcamento` and `/app/ajustes`
- [x] T015 [US2] Extend `src/application/categorias.test.ts`: after the first orçamento creates Lazer in V, the second orçamento's `listarCategorias` does not contain that id
- [x] T016 [US2] Run `npx vitest run src/domain/categorias.test.ts src/application/categorias.test.ts` and keep US1 and US2 green

**Checkpoint**: Criar funciona numa conta vazia, sem a tela de Orçamento

---

## Phase 5: User Story 3 - Renomear sem perder o histórico (Priority: P1)

**Goal**: O nome novo atualiza a categoria e os itens daquele tipo cujo grupo era o nome antigo. Lançamento fica no item. O mesmo nome é no-op.

**Independent Test**: Renomear Moradia para Casa. Os itens F que eram Moradia passam a Casa. Um lançamento de Aluguel continua no mesmo item. Itens de outro tipo chamados Moradia não mudam.

### Tests for User Story 3

- [x] T017 [US3] Add failing cases in `src/application/categorias.test.ts`: rename to the same nome is a no-op and not an error; rename to a chave already active in that tipo returns "Escolha outro nome. Já existe uma categoria com esse nome neste tipo." and does not write; itens of another tipo keep their grupo; the lançamento keeps `item_id`, `valor_centavos`, and `competencia`; `limites_alerta.cats_json` key moves from the old nome to the new nome; an id from the other orçamento returns not-found and does not write

### Implementation for User Story 3

- [x] T018 [US3] Implement `renomearCategoria` in `src/application/categorias.ts` inside `db.transaction`. Load by `id` and session `orcamentoId`. Missing → `{ code: "nao_encontrado", error: "Categoria não encontrada." }`. Same nome after `validarNomeCategoria` → return the row and write nothing, including when the stored nome is longer than 40 characters. On a new unique nome, update `categorias.nome` and `itens.grupo` where `orcamento_id`, `tipo`, and `grupo` equal the old nome. Do not touch other tipos or `lancamentos`. If `limites_alerta.cats_json` has the old nome, move that key to the new nome in the same transaction
- [x] T019 [US3] Add `PATCH /api/v1/categorias/[id]` in `src/app/api/v1/categorias/[id]/route.ts` and `renomearCategoriaAction` in `src/app/actions/categorias.ts`. 200 on success and on the no-op. 400 with the domain phrase. 404 "Categoria não encontrada." Never 403. Success revalidates `/app/orcamento` and `/app/ajustes`

**Checkpoint**: Renomear testável sem arquivar e sem tela nova

---

## Phase 6: User Story 4 - Arquivar a categoria e os itens (Priority: P1)

**Goal**: Arquivar a categoria arquiva todos os itens daquele grupo e tipo. Lançamentos permanecem. Não há desarquivar nem reordenar.

**Independent Test**: Arquivar Lazer tira Lazer e os itens dela da lista ativa. Um lançamento antigo desses itens continua gravado. A lista com arquivadas mostra Lazer arquivada.

### Tests for User Story 4

- [x] T020 [US4] Add failing cases in `src/application/categorias.test.ts`: archive sets `categorias.arquivada` true and `itens.arquivado = 1` for every item of that grupo and tipo; lançamentos stay; `listarCategorias` without archived hides it and with archived shows it; there is no unarchive function; an id from the other orçamento returns "Categoria não encontrada." and changes nothing

### Implementation for User Story 4

- [x] T021 [US4] Implement `arquivarCategoria` in `src/application/categorias.ts` inside `db.transaction`. Same not-found rule as rename. Set `arquivada` true and `itens.arquivado = 1` for that orcamento, tipo, and grupo. Do not delete `lancamentos`. Do not remove `cats_json` keys. Do not add an unarchive or reorder function
- [x] T022 [US4] Add `POST /api/v1/categorias/[id]/arquivar` in `src/app/api/v1/categorias/[id]/arquivar/route.ts` and `arquivarCategoriaAction` in `src/app/actions/categorias.ts`. 200 `{ id, arquivada: true }`. 404 "Categoria não encontrada." Success revalidates `/app/orcamento` and `/app/ajustes`. Run `npx vitest run src/application/categorias.test.ts` and keep US1–US4 green

**Checkpoint**: As quatro histórias P1 fecham sem tela nova

---

## Phase 7: User Story 5 - Item novo abre a categoria que falta (Priority: P2)

**Goal**: Criar um item cujo grupo ainda não é categoria ativa daquele tipo cria a categoria na mesma transação. Grupo que já é categoria ativa não duplica.

**Independent Test**: Criar um item no grupo Streaming em V, sem categoria Streaming ativa, grava o item e a categoria ativa juntos. Um segundo item em Streaming não cria outra categoria. Streaming só arquivada faz nascer uma ativa nova.

### Tests for User Story 5

- [x] T023 [US5] Add failing cases in `src/domain/itens.test.ts` and `src/application/categorias.test.ts`. Empty grupo → "Informe o nome da categoria." Grupo "  Lazer  " stored as "Lazer". Grupo with a line break is rejected and no item is inserted. Creating an item with a new grupo inserts the active category in the same transaction; a second item does not insert another; a grupo that matches only an archived category inserts a new active category and leaves the archived one archived. A failed nome writes neither row

### Implementation for User Story 5

- [x] T024 [US5] Change `validateCreateItem` in `src/domain/itens.ts` so `grupo` goes through `validarNomeCategoria` from `src/domain/categorias.ts`. Item `nome` still uses `normalizeItemLabel` and the existing 80-character cap. Update the empty-grupo expectation in `src/domain/itens.test.ts`
- [x] T025 [US5] In `createItem` in `src/application/itens.ts`, call `garantirCategoriaAtiva` inside `db.transaction` before the item insert. The helper lives in `src/application/categorias.ts`: if an active category of that tipo and `chaveNome` exists, return it; otherwise insert one with the validated nome. If the transaction fails, neither row remains. `POST /api/v1/itens` keeps its path and returns 400 with the category phrase when the grupo is invalid
- [x] T026 [US5] Call `garantirCategoriaAtiva` from `seedCatalog` in `src/application/catalog.ts` and from both `db.insert(itens)` sites in `src/application/import-planilha.ts`. Do not change `assignPlanoAlvo` or `src/domain/import-planilha.ts`. PDF import does not create a new grupo; leave it

**Checkpoint**: Conta nova semeada já nasce com categoria para cada grupo do catálogo

---

## Phase 8: User Story 6 - Limite de alerta só de 1 a 100 (Priority: P2)

**Goal**: Inteiro de 1 a 100 grava. 0, 101, fração ou texto não grava e o valor salvo permanece.

**Independent Test**: Com o limite em 80, gravar 0, 101 ou 80.5 deixa 80. Gravar 1 e gravar 100 substitui o valor.

### Tests for User Story 6

- [x] T027 [US6] Add failing cases in `src/domain/alertas.test.ts`: `validarLimitePct` accepts integers 1 and 100; rejects 0, 101, 80.5, and a non-numeric value. `validateGlobalPct` must no longer clamp into 1–100

### Implementation for User Story 6

- [x] T028 [US6] Implement `validarLimitePct` in `src/domain/alertas.ts` and use it in `saveLimites` in `src/application/limites.ts`. Global and every sent category value must pass. On failure return an error and do not UPDATE or INSERT `limites_alerta`. `getLimites` reads the stored integer and does not write. Remove the clamp from `validateGlobalPct`
- [x] T029 [US6] Propagate that error from `salvarLimitesAction` in `src/app/actions/limites.ts` and from `PUT` in `src/app/api/v1/limites/route.ts` as 400. Do not change `src/components/limites-panel.tsx` layout; it already shows `res.error`. Do not edit `src/domain/reconciliacao.ts`. Run `npx vitest run src/domain/alertas.test.ts src/domain/reconciliacao.test.ts`

**Checkpoint**: O limite recusado não muda o 80 já salvo

---

## Phase 9: User Story 7 - Exportar só quando há movimento e o arquivo fecha (Priority: P2)

**Goal**: Sem lançamento e sem plano diferente de zero, a pessoa recebe a frase e nenhum arquivo. Falha no meio não entrega arquivo parcial. Com movimento, o arquivo continua o da história 017.

**Independent Test**: Conta sem lançamento e sem plano diferente de zero → "Não havia movimento para exportar." e zero arquivos. Conta com um lançamento → CSV e JSON completos, em centavos inteiros, só dessa conta.

### Tests for User Story 7

- [x] T030 [US7] Add `haMovimentoParaExportar` tests in `src/domain/export-orcamento.test.ts`. False when there is no lançamento and every month of every item is integer 0. True when any lançamento exists. True when any month integer is not 0, even with an empty lançamento list

### Implementation for User Story 7

- [x] T031 [US7] Implement `haMovimentoParaExportar` in `src/domain/export-orcamento.ts` (integer compare only). In `src/application/export-orcamento.ts`, return no file content when it is false. When `buildExportCsv` or `buildExportJson` throws, surface "Arquivo incompleto não é compartilhado." Do not change the builders' output shape
- [x] T032 [US7] In `src/app/actions/export-orcamento.ts`, return `{ ok: false, error: "Não havia movimento para exportar." }` when there is no movement, and the incomplete phrase when building throws. Call `track("export_iniciado")` only on success. In `src/app/api/v1/export/csv/route.ts` and `src/app/api/v1/export/json/route.ts`, those two cases return 400 `{ "error": "<phrase>" }` and no file body. With movement, keep today's 200 attachment. Run `npx vitest run src/domain/export-orcamento.test.ts`

**Checkpoint**: O painel atual só baixa quando `res.ok`

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Fechar o quickstart e confirmar o que esta história não mexe

- [x] T033 Run the quickstart commands from `specs/041-categorias/quickstart.md`: `npm test -- src/domain/categorias.test.ts src/domain/alertas.test.ts src/domain/reconciliacao.test.ts src/application/categorias.test.ts src/domain/export-orcamento.test.ts` and `npx tsc --noEmit`
- [x] T034 [P] Confirm the diff does not touch `src/domain/competencia.ts` or `src/domain/reconciliacao.ts`, adds no page under `src/app/app/`, and adds no `console.log` or `any` in the files listed in `specs/041-categorias/plan.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Começa já. T001 bloqueia edição de `src/` enquanto a spec estiver `Draft`
- **Foundational (Phase 2)**: Depende de T001. Bloqueia as user stories
- **User stories (Phase 3+)**: Dependem da Phase 2
- **Polish (Phase 10)**: Depende das stories que forem entrar na entrega

### User Story Dependencies

- **US1 (P1)**: Depois da Phase 2. Não depende das outras stories. MVP
- **US2 (P1)**: Depois da Phase 2. Testável numa conta sem backfill. Edita `src/application/categorias.ts` depois da US1
- **US3 (P1)**: Depois da US2 no mesmo arquivo de aplicação. O teste cria a própria categoria; não precisa da tela
- **US4 (P1)**: Depois da US3 no mesmo arquivo. Sem rota de desarquivar
- **US5 (P2)**: Depois da US2, porque usa `garantirCategoriaAtiva` em `src/application/categorias.ts`. Não muda a regra de importação da história 022
- **US6 (P2)**: Depois da Phase 2. Não lê `categorias`. Pode correr em paralelo com a US1 (`src/domain/alertas.ts`, `src/application/limites.ts`)
- **US7 (P2)**: Depois da Phase 2. Não lê `categorias`. Pode correr em paralelo com a US1 e com a US6

### Within Each User Story

- O teste da story falha antes da implementação
- Domínio antes da aplicação
- Aplicação antes da rota e da action
- A story fecha antes da próxima que mexe no mesmo arquivo

### Parallel Opportunities

- T002 e T005 (schema e domínio do nome, arquivos diferentes)
- Depois da Phase 2: US6 e US7 em paralelo com a US1
- US2, US3, US4 e US5 seguem em série: todas escrevem `src/application/categorias.ts`
- T034 em paralelo com T033 (checagem de diff, sem depender do resultado do teste para começar a leitura)

---

## Parallel Example: User Story 1

```bash
# Depois da Phase 2, três frentes em arquivos diferentes:
Task: "T006–T010 US1 backfill e GET em src/application/categorias.ts e src/app/api/v1/categorias/route.ts"
Task: "T027–T029 US6 limite em src/domain/alertas.ts e src/application/limites.ts"
Task: "T030–T032 US7 exportação em src/domain/export-orcamento.ts e src/app/api/v1/export/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: spec `ready`
2. Phase 2: tabela e regra de nome
3. Phase 3: US1
4. Parar e rodar o teste da US1
5. A lista da conta que já tem grupos já mostra as categorias

### Incremental Delivery

1. Setup + Foundational
2. US1 → categorias do que já existe (MVP)
3. US2 → criar
4. US3 → renomear
5. US4 → arquivar (fim do P1)
6. US5 → item novo e semente
7. US6 → limite
8. US7 → exportação
9. Phase 10

### Parallel Team Strategy

1. Phase 1 e Phase 2 juntos
2. Em seguida:
   - Uma pessoa: US1 → US2 → US3 → US4 → US5
   - Outra: US6
   - Outra: US7
3. Phase 10 quando as stories da entrega estiverem verdes

---

## Notes

- [P] = outro arquivo, sem depender de tarefa incompleta
- [USn] liga a tarefa à história da spec
- Cada história P1 é testável sem as telas 044 e 047
- O teste novo falha antes do código que o faz passar
- Dinheiro permanece em centavos inteiros. Esta história não soma valor na categoria
- Conta alheia é 404 "Categoria não encontrada." Nunca 403
