---

description: "Task list for 022 um item só no Orçamento"
---

# Tasks: Um item só no Orçamento

**Input**: Design documents from `/specs/022-item-unico/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Vitest no domínio, pedido em plan.md e em quickstart.md. Sem Playwright.

**Organization**: US1 prévia e confirmação no item do catálogo (P1, MVP). US2 correção na abertura, ordem da lista e seletor (P1). US3 nome inédito e nome ambíguo (P2).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (outro arquivo, sem depender de tarefa incompleta)
- **[Story]**: US1, US2, US3
- Cada tarefa cita o arquivo

## Path Conventions

- Domínio: `src/domain/item-unico.ts`, `src/domain/import-planilha.ts`
- Aplicação: `src/application/item-unico.ts`, `src/application/import-planilha.ts`
- UI: `src/app/app/layout.tsx`, `src/components/import-planilha-panel.tsx`, `src/components/orcamento-view.tsx`, `src/components/novo-lancamento-sheet.tsx`, `src/app/app/lancamentos/page.tsx`, `src/app/actions/import-planilha.ts`
- Specs: `specs/022-item-unico/spec.md`, `specs/015-import-planejamento/spec.md`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Liberar a spec para código e apontar a emenda da 015

- [x] T001 Set `specs/022-item-unico/spec.md` status from `draft` to `ready` (constitution III; no product code before this)
- [x] T002 [P] Add a short amend note in `specs/015-import-planejamento/spec.md` that a planning section no longer becomes the item group; `specs/022-item-unico/spec.md` is the active contract

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Um predicado só para “grupo com nome de aba”, usado pela prévia e pela correção

**⚠️ CRITICAL**: Nenhuma user story começa antes disto

- [x] T003 Add `isGrupoNomeDeAba` in `src/domain/item-unico.ts` using `normalizeHeader` from `src/domain/import-planilha.ts`. True only for Receitas, Despesas Fixas, Despesas Variáveis, and Anuais. A catalog item is an active item whose grupo fails this predicate (`data-model.md`)

**Checkpoint**: O predicado existe e as stories podem começar

---

## Phase 3: User Story 1 - Plano cai no item do catálogo (Priority: P1) 🎯 MVP

**Goal**: Nome único atualiza o item do catálogo. Tipo e grupo permanecem os dele. A seção não vira grupo. A prévia mostra esse grupo antes de gravar.

**Independent Test**: Planilha com seção “Despesas Fixas” e linha Aluguel, já existindo F|Moradia|Aluguel sem plano no mês → prévia mostra Moradia; confirmar grava lá e não cria segundo Aluguel. Luz cuja única ocorrência é V|Habitação|Luz continua variável.

### Tests for User Story 1

> Escrever o teste primeiro e vê-lo falhar antes da implementação.

- [x] T004 [US1] Add failing cases in `src/domain/import-planilha.test.ts` for `contracts/plano-alvo.md` examples 1 and 2: section Despesas Fixas + Aluguel resolves to grupo Moradia; section Despesas Fixas + Luz resolves to tipo V and grupo Habitação. Name compare ignores case and accents.

### Implementation for User Story 1

- [x] T005 [US1] Implement `assignPlanoAlvo` in `src/domain/item-unico.ts` for the unique-name path: copy `tipo` and `grupo` from that catalog item (`planoCentavosJson` stays 12 integer cents, index 0 = January). Do not invent a second item.
- [x] T006 [US1] Use `assignPlanoAlvo` inside `importVfPlano` in `src/application/import-planilha.ts` before the tipo+grupo+nome lookup. Scope every read and write by `orcamentoId`. A row that is not yet `catalogo` is rejected and does not create a grupo named Receitas, Despesas Fixas, Despesas Variáveis, or Anuais. Keep the 020 month merge: empty or literal zero does not erase; positive replaces; negative or unreadable sets that month to 0.
- [x] T007 [US1] Return the resolved grupo and tipo from `src/app/actions/import-planilha.ts` and show them per row in `src/components/import-planilha-panel.tsx` before confirm. Cancel must not call the commit action.
- [x] T008 [US1] Run `npx vitest run src/domain/import-planilha.test.ts` and keep the new US1 assertions green

**Checkpoint**: US1 testável sem a correção da conta demo e sem Streaming

---

## Phase 4: User Story 2 - Achar o plano e lançar nele (Priority: P1)

**Goal**: Na primeira abertura de `/app`, o plano do extra vai para o item do catálogo e o extra é arquivado. Grupos com valor sobem. Novo lançamento abre no item que tem plano.

**Independent Test**: Conta com Moradia / Aluguel em zero e outro Aluguel ativo no grupo “Despesas Fixas” → a primeira abertura deixa um Aluguel ativo em Moradia com o plano; o outro está em Ajustes, arquivado; lançamentos dele não mudam de item. Novo lançamento abre no Aluguel de Moradia. Recarregar não copia de novo.

### Tests for User Story 2

- [x] T009 [P] [US2] Add failing cases in `src/domain/item-unico.test.ts`: copy a month only when the catalog month is 0 and an extra month is > 0; if several extras are > 0, copy the greatest integer; a catalog month already > 0 stays; groups with plan or actual > 0 sort before zero groups, each block in pt-BR; item preference is competência month, then any month of the year, then the current first item

### Implementation for User Story 2

- [x] T010 [US2] Implement `mergePlanFromExtras`, `ordenarGrupos` and `preferirItem` in `src/domain/item-unico.ts` with the rules asserted in T009. Amounts are truncated integers. Do not sum two extras.
- [x] T011 [US2] Add `reconcileTabNameDuplicates` in `src/application/item-unico.ts`. Load only the session `orcamentoId`. Archive each extra (`arquivado` becomes 1). Do not change `lancamentos.itemId`. If no active pair exists, write nothing.
- [x] T012 [US2] Call `reconcileTabNameDuplicates` from `src/app/app/layout.tsx` after the session is known and before `children` render
- [x] T013 [US2] Sort grupos in `src/components/orcamento-view.tsx` with `ordenarGrupos`. A zero group stays on the list and “Novo item” stays visible.
- [x] T014 [US2] Pass each active item’s 12-month cent plan from `src/app/app/lancamentos/page.tsx` into `src/components/novo-lancamento-sheet.tsx` and set the initial item with `preferirItem`. Archived items stay out of the selector.
- [x] T015 [US2] Run `npx vitest run src/domain/item-unico.test.ts` and keep the US2 assertions green

**Checkpoint**: A conta demo fica com um Aluguel ativo sem nova importação

---

## Phase 5: User Story 3 - Nome que a planilha não acha (Priority: P2)

**Goal**: Nome inédito nasce em Outros do tipo da seção. Nome igual a mais de um item do catálogo não grava até a pessoa escolher o grupo.

**Independent Test**: Confirmar “Streaming” cria o item em Outros e não cria grupo “Despesas Fixas”. “NET/Claro” não cola em “Internet / TV”. Dois itens do catálogo com o mesmo nome, sem escolha, não gravam.

### Tests for User Story 3

- [x] T016 [US3] Extend `src/domain/item-unico.test.ts` for `contracts/plano-alvo.md` examples 3 and 4: unknown name → alvo `outros` and grupo Outros of the section tipo; “NET/Claro” does not match “Internet / TV”; two catalog items with the same nome → alvo `escolher` and no write without a choice

### Implementation for User Story 3

- [x] T017 [US3] Extend `assignPlanoAlvo` in `src/domain/item-unico.ts` with alvos `outros` and `escolher`. A chosen grupo is accepted only when it is one of the tied catalog grupos for that nome.
- [x] T018 [US3] In `src/application/import-planilha.ts` and `src/app/actions/import-planilha.ts`, create the Outros item only when create-items is on and the alvo is `outros`. Reject `escolher` unless confirm includes a valid `{ n, grupo }`. Recompute the preview on the server before applying that choice.
- [x] T019 [US3] Show Outros in the preview and a group select for `escolher` rows in `src/components/import-planilha-panel.tsx`. Send the choices on confirm.

**Checkpoint**: As três stories funcionam juntas

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Fechar o corte vertical com o smoke do PM

- [x] T020 Run `npx vitest run src/domain/import-planilha.test.ts src/domain/item-unico.test.ts` and fix regressions
- [x] T021 Walk `specs/022-item-unico/quickstart.md` scenarios 1 to 3 on `http://localhost:3000` with `demo@local.test`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: começa agora
- **Foundational (Phase 2)**: depende do Setup e bloqueia as stories
- **User Stories**: dependem da Phase 2. US1 e US2 não dependem uma da outra. US3 estende o alvo criado na US1
- **Polish**: depende das stories que entrarem na entrega

### User Story Dependencies

- **US1 (P1)**: depois da Phase 2. Sem US2 e sem US3
- **US2 (P1)**: depois da Phase 2. Sem US1. A conta demo corrige mesmo se ninguém reimportar
- **US3 (P2)**: depois da US1, porque reusa `assignPlanoAlvo` e o confirm

### Within Each User Story

- O teste falha antes da implementação
- Domínio antes da aplicação
- Aplicação antes da tela
- Vitest da story antes do checkpoint

### Parallel Opportunities

- T001 e T002 em arquivos diferentes
- T004 e T009 em arquivos de teste diferentes, depois da Phase 2
- US1 e US2 podem andar juntas depois de T003
- T013 e T014 só depois de T010, e em arquivos diferentes entre si

---

## Parallel Example: User Story 1 e User Story 2

```text
# Depois de T003, os testes das duas P1 podem ser escritos juntos:
T004 src/domain/import-planilha.test.ts
T009 src/domain/item-unico.test.ts

# Implementação em paralelo, arquivos diferentes:
US1: src/domain/item-unico.ts (assignPlanoAlvo) + src/application/import-planilha.ts
US2: espera T010 no mesmo item-unico.ts, então US2 implementação começa depois do assign da US1
     ou a mesma pessoa faz T005 e T010 em sequência
```

US1 e US2 compartilham `src/domain/item-unico.ts`. Não editar esse arquivo ao mesmo tempo. Testes e UI de cada story seguem em paralelo.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 e Phase 2
2. Phase 3 (US1)
3. Parar e validar: Aluguel da seção cai em Moradia e Luz não muda de tipo
4. A conta demo ainda mostra o grupo “Despesas Fixas” até a US2

### Incremental Delivery

1. US1 entrega a próxima importação certa
2. US2 corrige a conta que já está duplicada, reordena a lista e acerta o Novo lançamento
3. US3 cobre Streaming e o nome ambíguo
4. T020 e T021 fecham a entrega

### Parallel Team Strategy

1. Juntos: T001–T003
2. Uma pessoa escreve T004 e segue a US1; outra escreve T009
3. Quem mexe em `src/domain/item-unico.ts` faz T005 e depois T010, sem edição concorrente

---

## Notes

- [P] = outro arquivo, sem depender de tarefa incompleta
- Não criar tabela nem coluna nova
- Centavos inteiros; mês 0 do catálogo recebe o maior extra positivo; mês já positivo não muda
- `arquivado` 1 tira o item da lista ativa e do seletor; o lançamento continua no `itemId` antigo
- GAP-006 e GAP-007 não entram nestas tarefas
