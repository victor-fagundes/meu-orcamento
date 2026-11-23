---

description: "Task list for 044 Orçamento web"
---

# Tasks: Orçamento web

**Input**: Design documents from `/specs/044-orcamento-web/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Vitest da lista e do plano, e Playwright do Orçamento, pedidos em plan.md e em quickstart.md. O teste nasce falhando.

**Organization**: US1 tipo do mês (P1, MVP). US2 frase e banner (P1). US3 criar (P1). US4 plano (P1). US5 arquivar (P1). US6 Gerenciar, vazio e erro (P1). US7 teclado e aparência (P1).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (outro arquivo, sem depender de tarefa incompleta)
- **[Story]**: US1, US2, US3, US4, US5, US6, US7
- Cada tarefa cita o arquivo

## Path Conventions

- Página: `src/app/app/orcamento/page.tsx`, `src/app/app/orcamento/loading.tsx`, `src/app/app/orcamento/error.tsx`
- Atalho: `src/app/app/ajustes/categorias/page.tsx`
- Tela: `src/components/orcamento-tela.tsx`, `src/components/orcamento-query.ts`
- Casca: `src/components/casca-abas.ts`, `src/components/casca-app.tsx`
- Conta: `src/domain/orcamento-lista.ts`, `src/domain/plano.ts`
- Pacote: `packages/design-system/src/web/`, `packages/design-system/src/base/contratos.ts`
- Contrato: `specs/044-orcamento-web/contracts/orcamento.md`
- E2E: `e2e/orcamento.spec.ts`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Travar o escopo antes de trocar o miolo do Orçamento

- [x] T001 Confirm `specs/044-orcamento-web/spec.md` status is `ready`. Edit only the files listed in `specs/044-orcamento-web/plan.md`. Do not add a table, a migration, or an HTTP route. Do not change `alertasDoMes` in `src/domain/alertas.ts` or the competência rules. Do not delete `src/components/orcamento-view.tsx`. Do not import `@material/web` in a new file. Do not add `console.log`, `any`, or a raw `px`/`rem`/`dp` style in `src/app` or `src/components`. The 460 px panel stays the existing `.mo-formulario` rule in `packages/design-system/src/web/base.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: O mês da casca conserva a query, a página lê o mês da sessão, e o pacote aceita limite e máscara

**⚠️ CRITICAL**: Nenhuma user story começa antes disto

- [x] T002 [P] Add a failing test in `src/components/casca-abas.test.ts`. `pedeMes` is true for Resumo and for Orçamento, and false for Lançamentos, Ano, and Ajustes. A helper that receives the current search (`tipo=F` and repeated `aberta=Moradia`) and a destination month `2026-12` returns a path whose `mes` is `2026-12` and which still contains `tipo=F` and `aberta=Moradia`
- [x] T003 Make `src/components/casca-abas.test.ts` pass from `src/components/casca-abas.ts` and `src/components/casca-app.tsx`. Set Orçamento `pedeMes` to true. Month buttons replace only `mes` and keep every other query key. Do not draw month arrows inside the Orçamento page
- [x] T004 [P] Add `src/components/orcamento-query.ts` and a failing-then-passing `src/components/orcamento-query.test.ts`. Absent or invalid `tipo` is `F`. Valid values are only `R`, `F`, `V`, and `E`. `aberta` is a repeated key, one category name each. Changing `tipo` builds a href that omits `aberta`. Opening a category appends that name; closing it removes only that name
- [x] T005 In `src/app/app/orcamento/page.tsx`, keep `requireSessionOrcamento`. Absent `mes` uses `competenciaAtual()`; an invalid value falls back to today. Load active items for this `orcamentoId`, the month's realizado per item, limits, and `loadAlertasMes`. Stop rendering `OrcamentoView`. Pass the data into a new client `src/components/orcamento-tela.tsx`. The client may render an empty fragment in this task. Do not set a React `key` from the month
- [x] T006 [P] In `packages/design-system/src/base/contratos.ts`, add optional `limiteAtencao` (default 80) and `ocultado` to `GrupoComMedidorProps` and `LinhaItemProps`. Update `packages/design-system/src/web/modulos/grupo-com-medidor.tsx` and `packages/design-system/src/web/modulos/linha-item.tsx` so `fraseDoEstado` and `estadoConsumo` receive that limit. When `ocultado` is true, the money figures render the visible text "R$ •••••" and do not put the real amount in the accessible name. The meter and the state phrase stay. Do not add a token
- [x] T007 [P] In `packages/design-system/src/web/formulario-container.tsx` and `packages/design-system/src/web/dialogo.tsx`, a click on the backdrop outside the panel calls `onCancelar`. A click inside the panel does not. Escape still calls `onCancelar` through `prenderFoco`

**Checkpoint**: O mês da conta chega na tela sem o Material antigo. A troca de mês conserva `tipo` e `aberta`

---

## Phase 3: User Story 1 - Um tipo do mês (Priority: P1) 🎯 MVP

**Goal**: Quatro opções, uma marcada, o total do tipo e as categorias fechadas no início, com várias podendo ficar abertas.

**Independent Test**: Com Fixas realizado de R$ 1.960,99 e planejado de R$ 2.080,50, o total mostra R$ 1.960 e "de R$ 2.080 planejados". As categorias começam fechadas. Trocar o mês mantém o tipo e as categorias abertas.

### Tests for User Story 1

- [x] T008 [P] [US1] Add a failing test in `src/domain/orcamento-lista.test.ts`. Input is active items of one type with integer cents. A category whose month plan or realizado is greater than zero sorts before a category at zero. Inside each block, order is `pt-BR` alphabetical. Category realizado and plan are the sums of its items. The type total of realizado 196099 and plan 208050 formats with cents cut as R$ 1.960 and the line "de R$ 2.080 planejados". No React, Next, or Drizzle import
- [x] T009 [P] [US1] Add a failing Playwright test in `e2e/orcamento.spec.ts`. Sign in at `/login` with `demo@local.test` / `demo1234` (fields E-mail and Senha, button Entrar). On `/app/orcamento` the chips are Receitas, Fixas, Variáveis, and Anuais, with Fixas pressed. Category headers are collapsed. The page does not contain controls named "Mês anterior" or "Próximo mês"

### Implementation for User Story 1

- [x] T010 [US1] Implement the grouping, the two-block `pt-BR` sort, and the truncated type total in `src/domain/orcamento-lista.ts` so `src/domain/orcamento-lista.test.ts` passes. Use integer cents only
- [x] T011 [US1] In `src/components/orcamento-tela.tsx`, render `Chips` for the four types and the type total from `src/domain/orcamento-lista.ts`. Each category is `GrupoComMedidor`, closed unless its name is in `aberta`. The header still shows the meter and the phrase while closed. Opening one category does not close another; closing one closes only that one. Changing type navigates without `aberta`. Read `localStorage` key `mo-ocultar-valores`: value `"1"` passes `ocultado`. There is no hide control on this page. Hidden total text is "R$ •••••" and "de R$ ••••• planejados". Do not draw month arrows

**Checkpoint**: US1 testável. Um tipo, o total e as categorias fechadas

---

## Phase 4: User Story 2 - A frase do consumo e o banner (Priority: P1)

**Goal**: A frase do consumo em cada categoria e item, e o banner do alerta que o mês já calcula.

**Independent Test**: R$ 80,00 de R$ 100,00 com limite 80 mostram "Perto do limite · 80%". R$ 500,00 de R$ 200,00 mostram "Estourou em R$ 300,00" com o medidor cheio. Um estouro e uma atenção mostram o erro e "E mais 1 alerta."

### Tests for User Story 2

- [x] T012 [P] [US2] Extend `src/domain/orcamento-lista.test.ts` with failing cases. Limit 80 and 7900 of 10000 cents is "Dentro do planejado". 8000 of 10000 is "Perto do limite · 80%". 8790 of 10000 is "Perto do limite · 87%". Equal amounts above zero are "No limite do planejado". 50000 of 20000 is "Estourou em R$ 300,00". A category limit of 50 at 50% is "Perto do limite · 50%"; at 49% it is "Dentro do planejado". Plan zero is "Sem valor planejado" with no percent. `textoDemaisAlertas(0)` is null, `textoDemaisAlertas(1)` is "E mais 1 alerta.", and `textoDemaisAlertas(2)` is "E mais 2 alertas." Reuse `fraseDoEstado`; do not edit `alertasDoMes`

### Implementation for User Story 2

- [x] T013 [US2] Pass each category's `limiteDaCategoria` into `GrupoComMedidor` and `LinhaItem` as `limiteAtencao` from `src/components/orcamento-tela.tsx`. Above the chips, render `Banner` from `bannerFromAlertas`: `erro` for level `er`, `atencao` otherwise, the existing `msg`, plus `textoDemaisAlertas` from `src/domain/orcamento-lista.ts`. Render no banner when the list is empty. Changing type does not change the alert list. When values are hidden, the phrase and the banner keep their text

**Checkpoint**: US2 testável. A frase e o banner usam a conta que já existe

---

## Phase 5: User Story 3 - Criar categoria e item no tipo (Priority: P1)

**Goal**: "Nova categoria" e "Novo item" no topo. O item abre a categoria. A categoria sozinha entra fechada.

**Independent Test**: Em Variáveis, criar Streaming e o item Netflix. Netflix fica visível e outra categoria já aberta continua aberta. Cancelar não grava.

### Tests for User Story 3

- [x] T014 [P] [US3] Add a failing Playwright case in `e2e/orcamento.spec.ts`. From Variáveis, "Nova categoria" and "Novo item" are in the document and are not `position: fixed`. Creating a category named "  Streaming  " shows "Streaming" collapsed. Creating item "  Netflix  " in Streaming shows Netflix, and a category that was already open stays open. Cancel on the category form leaves the new name unsaved. The Orçamento page has no control whose name is "Renomear" or "Arquivar categoria"

### Implementation for User Story 3

- [x] T015 [US3] In `src/components/orcamento-tela.tsx`, open `FormularioContainer` for "Nova categoria" (name only, tipo is the marked type) via `criarCategoriaAction`, and for "Novo item" (name and category suggestions of the active categories of that type) via `criarItemAction` without `planoMensalBRL`, so the twelve months stay zero. A new category name on the item uses the existing same-save path. After the item saves, add that category name to `aberta` and keep the names already there. A category created alone stays closed. Show the action error text unchanged: "Informe o nome da categoria.", "Use no máximo 40 caracteres.", "Use o nome em uma linha só.", "Escolha outro nome. Já existe uma categoria com esse nome neste tipo.", "Informe o nome do item.", "Categoria ou nome muito longo." On save failure show "Não foi possível salvar. Os campos continuam preenchidos." Cancel, backdrop, and back call `onCancelar` and return focus to the opener

**Checkpoint**: US3 testável. Dá para criar categoria e item no tipo marcado

---

## Phase 6: User Story 4 - Gravar o plano do mês (Priority: P1)

**Goal**: O painel grava o mês aberto. Salvar fecha. Copiar e aplicar deixam o painel aberto.

**Independent Test**: Em novembro, R$ 400,00 com o interruptor desligado muda só novembro e fecha o painel. Com o interruptor ligado, dezembro também fica em R$ 400,00. "Copiar ano anterior" não muda valor e deixa o painel aberto.

### Tests for User Story 4

- [x] T016 [P] [US4] Add failing cases in `src/domain/plano.test.ts`. `lerValorDoPlano("")` fails with "Informe o valor do plano." A negative amount fails with "Informe um valor maior ou igual a zero." Three decimal places fail with "Use no máximo duas casas decimais." "0" and "0,00" return 0 cents. `aplicarValorAoMes` on November index 10 writes only index 10. `aplicarValorAoMesESeguintes` with 40000 cents at index 10 writes indexes 10 and 11 and leaves 0 through 9. December index 11 writes only 11. `copiarMesAnterior` at index 0 returns the same twelve values. `copiarAnoAnterior` returns `available: false` and the same twelve values. No float

### Implementation for User Story 4

- [x] T017 [US4] Implement `lerValorDoPlano`, `aplicarValorAoMes`, and `aplicarValorAoMesESeguintes` in `src/domain/plano.ts` so `src/domain/plano.test.ts` passes. Parse cents without float. Keep `copiarMesAnterior`, `aplicarATodos`, and `copiarAnoAnterior`
- [x] T018 [US4] In `src/components/orcamento-tela.tsx`, open `FormularioContainer` titled with the item name. `CampoMoeda` shows the open month's saved cents, including when the list is hidden. `Switch` "Aplicar também aos próximos meses" starts off. The month index comes from the open competência, not from `new Date()`. "Salvar plano" calls `salvarPlanoAction` with the twelve month strings, closes the panel, and returns focus to the item. "Copiar mês anterior" saves through the same action and leaves the panel open; in January it shows "Janeiro não tem mês anterior neste ano." and does not call the action. "Aplicar a todos os meses" saves all twelve and leaves the panel open. "Copiar ano anterior" shows "Não há plano do ano anterior para copiar." and does not call the action. Invalid input or a failed save leaves the panel open. Failure text is "Não foi possível salvar. Os campos continuam preenchidos."

**Checkpoint**: US4 testável. O plano do mês grava em centavos e o foco volta ao item

---

## Phase 7: User Story 5 - Arquivar o item pelo nome (Priority: P1)

**Goal**: Arquivar pede o nome do item e só então tira o item da lista.

**Independent Test**: "Arquivar Mercado?" mostra a frase de consequência. Cancelar mantém o item. Confirmar tira o item dos novos lançamentos e o lançamento antigo continua.

### Tests for User Story 5

- [x] T019 [P] [US5] Add a failing Playwright case in `e2e/orcamento.spec.ts`. Activating Arquivar on an item opens a dialog whose title is "Arquivar {nome}?" and whose description is "Ele sai do Orçamento e de novos lançamentos. Os lançamentos antigos continuam." Escape or Cancelar leaves the item in the list and returns focus to that Arquivar control

### Implementation for User Story 5

- [x] T020 [US5] In `src/components/orcamento-tela.tsx`, give each item a separate Arquivar control that does not open the plan. Confirm with `Dialogo`: title "Arquivar {nome}?", description "Ele sai do Orçamento e de novos lançamentos. Os lançamentos antigos continuam.", confirm label "Arquivar", destructive. Confirm calls `arquivarItemAction`. Cancel, backdrop, back, and Escape do not archive. Do not add desarquivar, reorder, rename category, or archive category on this page

**Checkpoint**: US5 testável. Arquivar pede o nome e conserva o lançamento

---

## Phase 8: User Story 6 - Gerenciar, vazio, carregando e erro (Priority: P1)

**Goal**: Gerenciar abre o tipo em Ajustes. O tipo sem item mostra o cartão. Carregar e falhar não mostram um zero falso.

**Independent Test**: Gerenciar em Fixas abre `/app/ajustes/categorias?tipo=F`. Um tipo sem item mostra "Nenhum item neste tipo". A falha mostra "Não foi possível carregar o mês."

### Tests for User Story 6

- [x] T021 [P] [US6] Add a failing Playwright case in `e2e/orcamento.spec.ts`. From Fixas, Gerenciar navigates to `/app/ajustes/categorias?tipo=F` and the page names Fixas. It does not need rename or archive controls

### Implementation for User Story 6

- [x] T022 [P] [US6] Add `src/app/app/orcamento/loading.tsx` rendering `Skeleton` and no currency text. Add `src/app/app/orcamento/error.tsx` rendering `EstadoErro` with "Não foi possível carregar o mês." and "Tentar de novo"
- [x] T023 [US6] In `src/components/orcamento-tela.tsx`, when the marked type has no active item, render `CartaoVazio` with title "Nenhum item neste tipo", phrase "Crie um item para planejar o mês.", and action "Novo item". Keep "Nova categoria" and "Novo item" at the top. Gerenciar links to `/app/ajustes/categorias?tipo=` plus the marked type. Add `src/app/app/ajustes/categorias/page.tsx`: session required, list only active categories of that `tipo` (`R`, `F`, `V`, or `E`; invalid falls back to `F`), read-only. Do not add rename or archive category here

**Checkpoint**: US6 testável. O atalho chega no tipo e o vazio não mente com R$ 0,00

---

## Phase 9: User Story 7 - Teclado, foco e aparência (Priority: P1)

**Goal**: Nome e foco visível, sem intervalo de datas e sem botão flutuante.

**Independent Test**: Pelo teclado a pessoa alcança o tipo, Gerenciar, criar, o item, o plano e arquivar. Em 390 px e em 1280 px não há intervalo de datas nem botão flutuante.

### Tests for User Story 7

- [x] T024 [P] [US7] Extend `e2e/orcamento.spec.ts` so Tab reaches the type chips, Gerenciar, Nova categoria, and Novo item, and each has an accessible name. The page has no control for a free date range and no floating create button. Run the same path in the dark color scheme. Do not add a CSS transition for the plan panel or the dialog

### Implementation for User Story 7

- [x] T025 [US7] In `src/components/orcamento-tela.tsx`, give every control a visible label and a visible focus style from the existing package classes. Return focus to the opener when the plan panel or the archive dialog closes. Do not add a floating button or a date-range control. Do not add an animation; `prefers-reduced-motion` therefore has nothing new to disable

**Checkpoint**: US7 testável. O teclado percorre a tela no claro e no escuro

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: A validação do quickstart fecha a história

- [x] T026 Run the commands in `specs/044-orcamento-web/quickstart.md`: `npm test -- src/domain/plano.test.ts src/domain/orcamento-lista.test.ts src/components/casca-abas.test.ts src/components/orcamento-query.test.ts`, `npx playwright test e2e/orcamento.spec.ts`, and `npx tsc --noEmit`. Fix failures in the files this plan lists. The capture goes to `tests/visual/out/` and is not a blocking pixel-diff

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: começa imediato
- **Foundational (Phase 2)**: depende do Setup e bloqueia todas as histórias
- **User Stories (Phase 3+)**: dependem da Phase 2. US2 em diante editam `src/components/orcamento-tela.tsx` depois da US1
- **Polish (Phase 10)**: depende das histórias desejadas

### User Story Dependencies

- **User Story 1 (P1)**: começa depois da Phase 2. Não depende de outra história
- **User Story 2 (P1)**: depois da US1, porque a frase entra na lista já montada
- **User Story 3 (P1)**: depois da US1, porque os botões ficam acima dessa lista
- **User Story 4 (P1)**: depois da US1, porque o plano abre a partir do item
- **User Story 5 (P1)**: depois da US1, porque Arquivar fica na linha do item
- **User Story 6 (P1)**: depois da US1. O cartão vazio substitui a lista do tipo
- **User Story 7 (P1)**: depois de US3, US4 e US5, porque o teclado percorre criar, plano e arquivar

### Within Each User Story

- O teste nasce falhando, antes da implementação
- A função pura fica antes da tela que a chama
- A história fecha antes da próxima

### Parallel Opportunities

- T002, T004, T006 e T007 são arquivos diferentes e podem seguir juntas depois de T001
- T008 e T009 podem seguir juntas
- T012, T016 e T014 podem ser escritos em paralelo: o domínio da frase, o domínio do plano e o E2E de criar não compartilham arquivo
- T022 pode seguir junto com o E2E de Gerenciar enquanto a página de categorias espera a tela

---

## Parallel Example: User Story 1

```bash
# Testes da US1 juntos:
# src/domain/orcamento-lista.test.ts
# e2e/orcamento.spec.ts (chips e categorias fechadas)

# Fundação em paralelo, depois de T001:
# src/components/casca-abas.test.ts
# src/components/orcamento-query.ts
# packages/design-system/src/web/modulos/grupo-com-medidor.tsx
# packages/design-system/src/web/dialogo.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1
2. Completar Phase 2
3. Completar Phase 3 (US1)
4. **PARAR E VALIDAR**: um tipo, o total sem centavos, categorias fechadas, mês conservando `tipo` e `aberta`
5. Seguir para a frase e o banner

### Incremental Delivery

1. Setup + Foundational
2. US1 lista do tipo
3. US2 frase e banner
4. US3 criar
5. US4 plano
6. US5 arquivar
7. US6 Gerenciar, vazio e erro
8. US7 teclado
9. Quickstart

### Parallel Team Strategy

1. Uma pessoa fecha Setup e Foundational
2. Em seguida a tela é um arquivo só: US2 a US7 entram em ordem nesse arquivo
3. Os testes de `src/domain/plano.ts` e de `src/domain/orcamento-lista.ts` podem ser escritos ao mesmo tempo, antes de ligar a tela

---

## Notes

- [P] marca outro arquivo, sem depender de tarefa incompleta
- A tela do Orçamento é `src/components/orcamento-tela.tsx`. Tarefas dessa tela não são paralelas entre si
- Cada história fecha com um checkpoint
- O teste falha antes da implementação correspondente
- `OrcamentoView` fica no repositório até a história 049
