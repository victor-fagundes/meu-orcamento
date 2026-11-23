---

description: "Task list for 046 Ano web"
---

# Tasks: Ano web

**Input**: Design documents from `/specs/046-ano-web/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Vitest da grade e da célula, e Playwright do Ano, pedidos em plan.md e em quickstart.md. O teste nasce falhando.

**Organization**: US1 doze meses (P1, MVP). US2 realizado, planejado e sobra (P1). US3 troca de ano e competência (P1). US4 vazio, ocultar e leitura (P2).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (outro arquivo, sem depender de tarefa incompleta)
- **[Story]**: US1, US2, US3, US4
- Cada tarefa cita o arquivo

## Path Conventions

- Página: `src/app/app/ano/page.tsx`, `src/app/app/ano/loading.tsx`, `src/app/app/ano/error.tsx`
- Tela: `src/components/ano-tela.tsx`
- Leitura: `src/application/ano.ts`, `src/app/actions/ano.ts`
- Grade: `src/domain/ano-grade.ts`, `src/domain/ano-grade.test.ts`
- Pacote: `packages/design-system/src/base/contratos.ts`, `packages/design-system/src/modulos/tabela-meses.ts`, `packages/design-system/src/web/modulos/tabela-meses.tsx`, `packages/design-system/src/web/base.css`
- Contrato: `specs/046-ano-web/contracts/ano.md`
- E2E: `e2e/ano.spec.ts`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Travar o escopo antes de trocar o miolo do Ano

- [x] T001 Confirm `specs/046-ano-web/spec.md` status is `ready`. Edit only the files listed in `specs/046-ano-web/plan.md`. Do not add a table, a column, or a migration. Do not change `src/domain/competencia.ts`, `saldoFinalAno` in `src/domain/reconciliacao.ts`, or `parsePlanoFromJson` in `src/domain/plano.ts`. Do not change `pedeMes` in `src/components/casca-abas.ts`. Do not delete `src/components/ano-view.tsx`. Do not import `@material/web` in a new file. Do not add `console.log`, `any`, or a raw hex/`px`/`rem`/`dp` style in `src/app`, `src/components`, or `packages/design-system/src/web/base.css`. Do not edit `packages/design-system/src/modulos/TabelaMeses.native.tsx` or `packages/design-system/src/core/types.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: A célula do pacote corta os centavos sem "R$", e a página deixa de montar o Material antigo

**⚠️ CRITICAL**: Nenhuma user story começa antes disto

- [x] T002 [P] Add a failing test in `packages/design-system/tests/modulos/tabela-meses.test.ts` for `textoCelulaAno`. Quote these results: `0` shows "—"; `650099` shows "6.500"; `50` shows "0"; `-50` shows "−0"; `-4000` shows "−40". The same values with `ocultado` true show "•••••", except `0`, which stays "—". Twelve months of `50` sum to `600`, and `textoCelulaAno(600, false)` is "6". `linhaValida` stays true only for exactly 12 months. Replace the old null-based sample. Do not import React
- [x] T003 [P] Add a failing test in `packages/design-system/tests/web/modulos-2.test.tsx`. `TabelaMeses` with `legenda` "Realizado de 2026", `mesAtivo` 10, and a row of 359000 cents in November shows "3.590" and does not show "R$". The first column header is "Categoria · item". The November header includes the visible text "mês atual". `mesAtivo` null does not render "mês atual". The caption is the legenda. The row key is `id`, so two rows may share a rótulo
- [x] T004 Make T002 and T003 pass from `packages/design-system/src/modulos/tabela-meses.ts`, `packages/design-system/src/base/contratos.ts`, `packages/design-system/src/web/modulos/tabela-meses.tsx`, and `packages/design-system/src/web/base.css`. `valoresPorMes` is twelve integers. `nivel` is `tipo`, `categoria`, `item`, or `sobra`. `textoCelulaAno` is the only formatter. Do not call `formatarBRLInteiro`. A `sobra` row uses the existing destaque. Nivel classes use tokens already in the file for weight and indent. The wrapper keeps `overflow-x: auto`. The minus character in the cell is the negative signal
- [x] T005 In `src/app/app/ano/page.tsx`, keep `requireSessionOrcamento`. Stop rendering `AnoView`. Absent or invalid `ano` (not four digits) uses the civil year of today. Render a new client `src/components/ano-tela.tsx` that receives that year and may show only the year in this task. Do not add a second `id="conteudo"`

**Checkpoint**: 650099 centavos viram "6.500". A página do Ano não usa mais `AnoView`

---

## Phase 3: User Story 1 - Os doze meses (Priority: P1) 🎯 MVP

**Goal**: O ano corrente em realizado, com tipo, categoria e item, e o mês de hoje marcado.

**Independent Test**: Com Salário de R$ 6.500,99 só em novembro, a célula e o Total mostram "6.500" e os outros meses "—". No ano de hoje, novembro inclui "mês atual". Em outro ano, nenhuma coluna inclui.

### Tests for User Story 1

- [x] T006 [P] [US1] Add a failing test in `src/domain/ano-grade.test.ts` for `gradeDoAno`. No React, Next, or Drizzle import. Integer cents only. Do not import `src/domain/competencia.ts`. Types appear in this order and with these names: Receitas, Despesas fixas, Despesas variáveis, Anuais. Categories and items sort with `localeCompare` and `pt-BR`. An active item with twelve zeros still appears. An archived item with no lançamento in the year is absent from realizado. An archived item whose plan is all zeros is absent from planejado. A category with no visible item is absent. A type with no visible category is absent. Ids are `tipo:R`, `cat:{tipo}:{grupo}`, and `item:{id}`. Salário with 650099 in November and zero elsewhere stores 650099 at index 10. `hoje` "2026-11-23" and ano "2026" set the current month index to 10. Ano "2027" sets it to null. A lançamento whose item is not in the orçamento creates no row
- [x] T007 [P] [US1] Add a failing Playwright test in `e2e/ano.spec.ts`. Sign in at `/login` with `demo@local.test` / `demo1234`, the same way as `e2e/resumo.spec.ts`. On `/app/ano` the shell heading is "Ano" and there is no control named "Mês anterior". The content heading is "Ano · realizado". There is one control named "Ano anterior" and one named "Próximo ano". The page shows "Valores em R$. Nível: tipo › grupo › item. Lançamentos ficam em Lançamentos." The table caption matches "Realizado de" plus the year. Headers include "Categoria · item", "Jan", "Dez", and "Total"

### Implementation for User Story 1

- [x] T008 [US1] Implement `gradeDoAno` in `src/domain/ano-grade.ts` so `src/domain/ano-grade.test.ts` passes. Item realizado is the sum of `valorCentavos` for that item and competência `{ano}-{mês}`. Item planejado is that month of `parsePlanoFromJson`, the same JSON in every civil year. A category sums its visible items. A type sums its visible categories. Cell values are twelve integers. Zero stays zero here. Do not format reais in this file
- [x] T009 [US1] Add `lerAno` in `src/application/ano.ts`. Load items and lançamentos only for the session `orcamentoId`. Lançamentos are only those whose `competencia` starts with `{ano}-`. Call `gradeDoAno`. Do not recalculate fatura
- [x] T010 [US1] In `src/app/app/ano/page.tsx`, pass the result of `lerAno` into `src/components/ano-tela.tsx`. Render an h2 "Ano · realizado", `Botao` controls with `acessibilidade` "Ano anterior" and "Próximo ano" (children may be the chevrons; the press may no-op in this task), the year as text between them, the hint sentence from T007, and `TabelaMeses` with `legenda` "Realizado de {ano}", the realizado rows, and `mesAtivo` from the grade. A cell is not a button. Do not draw a floating button or a date range

**Checkpoint**: US1 testável. Os doze meses do realizado aparecem, com o mês de hoje só no ano corrente

---

## Phase 4: User Story 2 - Realizado, planejado e a sobra (Priority: P1)

**Goal**: O chip troca a grade inteira. A última linha é a sobra, receitas menos despesas.

**Independent Test**: Receitas R$ 5.000,00 e despesas R$ 2.400,00 mostram "2.600" no Total de "Sobra no ano (receitas − despesas)". Planejado troca todas as células e o plano de novembro continua igual em 2026 e em 2027.

### Tests for User Story 2

- [x] T011 [P] [US2] Extend `src/domain/ano-grade.test.ts`. Receitas 500000 and despesas 240000 make the sobra total 260000. A month with receita 100000 and despesa 160000 stores -60000 on the sobra row. The sobra rótulo is "Sobra no ano (receitas − despesas)" and the id is `sobra`. There is no row named "Total despesas". Calling `gradeDoAno` for 2026 and for 2027 with the same plan returns the same twelve planejado cents for that item. A category line equals the sum of its items. A type line equals the sum of its categories
- [x] T012 [P] [US2] Extend `e2e/ano.spec.ts`. Activating Planejado changes the content heading to "Ano · planejado" and the caption to "Planejado de" plus the same year. The year text between the arrows does not change. The last row is "Sobra no ano (receitas − despesas)". The page does not show "Saldo final" or "Total despesas"

### Implementation for User Story 2

- [x] T013 [US2] Add the sobra row in `src/domain/ano-grade.ts` so T011 passes. Each month is Receitas minus Despesas fixas, Despesas variáveis, and Anuais. The row total is the sum of those twelve cents. The sobra row is present even when it is the only row
- [x] T014 [US2] In `src/components/ano-tela.tsx`, add `Chips` with `rotuloGrupo` "Modo do ano" and options Realizado and Planejado. Realizado starts selected. Changing the chip swaps every cell, the h2, and the legenda, and does not change the year or fetch again. Both grades are already in the payload. When the year is not empty, show `Banner` `tipo` "info" with the exact text: Sobra no ano = receitas − despesas. Não é o mesmo que "Disponível neste mês", que compara o planejado com o gasto do mês. Pass the sobra row with `nivel` `sobra`. Do not render an alert phrase

**Checkpoint**: US2 testável. Realizado e planejado não se misturam, e a sobra é receitas menos despesas

---

## Phase 5: User Story 3 - Trocar o ano e cair no mês certo (Priority: P1)

**Goal**: O ano só troca depois da resposta. A célula usa a competência já gravada.

**Independent Test**: Compra de cartão gravada em 2026-06 entra em junho e não em maio. A de 2027-01 não entra em dezembro de 2026. R$ 100,00 em 3× soma 10000 centavos. Se a troca falha, 2026 continua na tela.

### Tests for User Story 3

- [x] T015 [US3] Extend `src/domain/ano-grade.test.ts` with competências already stored, not recomputed. A lançamento `2026-06` lands in June (index 5) and not in May. A lançamento `2026-05` lands in May. A lançamento `2027-01` is absent from ano 2026 and present in January of ano 2027. Three lançamentos of 3334, 3333, and 3333 in June, July, and August sum to 10000. The plan month does not move when those competências exist

### Implementation for User Story 3

- [x] T016 [P] [US3] Add `src/app/app/ano/loading.tsx` with `Skeleton` only. Do not render a currency string or "Nenhum planejamento nem lançamento". Add `src/app/app/ano/error.tsx` with `EstadoErro` mensagem "Não foi possível carregar o ano." and "Tentar de novo" calling `reset`. This boundary is for the first load, when no confirmed grade exists yet
- [x] T017 [P] [US3] Add `carregarAnoAction` in `src/app/actions/ano.ts`. It calls `lerAno` for the session `orcamentoId` and returns `{ ok: true, grade }` or `{ ok: false }`. Do not throw. Do not return a raw database message. A missing session or an `ano` that is not four digits returns `{ ok: false }` and no grade
- [x] T018 [US3] In `src/components/ano-tela.tsx`, "Ano anterior" and "Próximo ano" call `carregarAnoAction`. Until it returns, the confirmed year, the h2, and the numbers stay. Ignore a second click while the call is in flight. On failure, keep that grade and show `EstadoErro` with "Não foi possível carregar o ano." and "Tentar de novo", which repeats the requested year. On success, replace the grade and then `history.replaceState` to `/app/ano?ano={ano}`. Do not use `router.push` for this control

**Checkpoint**: US3 testável. A competência gravada define o mês, e a falha não apaga o ano confirmado

---

## Phase 6: User Story 4 - Ano sem movimento, valores ocultos e leitura (Priority: P2)

**Goal**: O ano sem plano e sem lançamento avisa e mantém a grade. A máscara é a do Resumo.

**Independent Test**: 2027 sem plano e sem lançamento mostra "Ano · 2027" e "Nenhum planejamento nem lançamento em 2027." Com a chave do Resumo, "6.500" vira "•••••" e "—" continua "—".

### Tests for User Story 4

- [x] T019 [P] [US4] Extend `src/domain/ano-grade.test.ts`. `vazio` is true only when every plan month of every item is zero and the year has no lançamento. A nonzero plan and no lançamento is not vazio. No plan and one lançamento is not vazio. An account with only archived items, all plans zero, and no lançamento is vazio, and the sobra row is still returned
- [x] T020 [P] [US4] Extend `e2e/ano.spec.ts`. At 390 px the person can reach the header "Dez" and the header "Total". At 390 px and at 1280 px there is no floating button. The table cells are not buttons

### Implementation for User Story 4

- [x] T021 [US4] In `src/components/ano-tela.tsx`, when `vazio` is true the h2 is "Ano · {ano}" and the banner is "Nenhum planejamento nem lançamento em {ano}." The chips stay, the legenda stays "{Modo} de {ano}", and the table stays, with "—" from zero cents. Do not show both banners. Do not add a control that copies the previous year. The nav button "Ano anterior" stays. On mount, read `localStorage` key `mo-ocultar-valores`. `"1"` passes `ocultado` to `TabelaMeses`. Do not add a hide control. Do not add a transition. Cells stay out of the tab order. The year buttons and the chips remain keyboard controls

**Checkpoint**: US4 testável. O vazio não esconde a grade, e a máscara não cria outro número

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Fechar o quickstart sem alargar a história

- [x] T022 [P] In `e2e/ano.spec.ts`, capture the Ano screen in light and in dark to `tests/visual/out/ano-claro.png` and `tests/visual/out/ano-escuro.png`. Do not add a pixel-diff assertion
- [x] T023 Run the commands in `specs/046-ano-web/quickstart.md`. `src/domain/reconciliacao.test.ts` stays green. `src/components/casca-abas.test.ts` still expects `pedeMes` false for Ano. `src/components/ano-view.tsx` still exists. If a command fails, fix only files listed in `specs/046-ano-web/plan.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: começa imediato
- **Foundational (Phase 2)**: depende do Setup e bloqueia todas as histórias
- **User Stories (Phase 3+)**: dependem da Phase 2. US2 em diante editam `src/components/ano-tela.tsx` e `src/domain/ano-grade.ts` depois da história anterior
- **Polish (Phase 7)**: depende das histórias desejadas

### User Story Dependencies

- **User Story 1 (P1)**: começa depois da Phase 2. Não depende de outra história
- **User Story 2 (P1)**: depois da US1, porque o chip troca a grade que a US1 montou
- **User Story 3 (P1)**: depois da US1, porque a action devolve a mesma grade. O aviso da US2 pode já estar na tela
- **User Story 4 (P2)**: depois da US2, porque o título vazio substitui "Ano · realizado" e o banner da sobra

### Within Each User Story

- O teste nasce falhando, antes da implementação
- A função pura fica antes da tela que a chama
- A história fecha antes da próxima

### Parallel Opportunities

- T002 e T003 são arquivos diferentes e podem seguir juntas depois de T001
- T006 e T007 podem seguir juntas
- T011 e T012 podem seguir juntas
- T016 e T017 podem seguir juntas depois de T015
- T019 e T020 podem seguir juntas
- T022 pode ser escrito junto com a revisão do quickstart, e T023 espera T022

---

## Parallel Example: User Story 1

```bash
# Testes da US1 juntos, depois da Phase 2:
# src/domain/ano-grade.test.ts
# e2e/ano.spec.ts (título, setas do ano, colunas)

# Fundação em paralelo, depois de T001:
# packages/design-system/tests/modulos/tabela-meses.test.ts
# packages/design-system/tests/web/modulos-2.test.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1
2. Completar Phase 2
3. Completar Phase 3 (US1)
4. **PARAR E VALIDAR**: "6.500" em novembro, "—" nos outros meses, "mês atual" só no ano de hoje, sem "R$" na célula
5. Seguir para o chip e a sobra

### Incremental Delivery

1. Setup + Foundational
2. US1 doze meses em realizado
3. US2 chip e sobra
4. US3 troca de ano e competência gravada
5. US4 vazio, máscara e leitura
6. Quickstart

### Parallel Team Strategy

1. Uma pessoa fecha Setup e Foundational
2. A grade e a tela são dois arquivos que as histórias seguintes editam em ordem
3. O teste de `src/domain/ano-grade.ts` e o esqueleto do Playwright podem ser escritos ao mesmo tempo, antes de ligar a tela

---

## Notes

- [P] marca outro arquivo, sem depender de tarefa incompleta
- A tela do Ano é `src/components/ano-tela.tsx`. Tarefas dessa tela não são paralelas entre si
- Cada história fecha com um checkpoint
- O teste falha antes da implementação correspondente
- `AnoView` fica no repositório até a história 049
- `src/domain/competencia.ts` não muda
- O plano é um JSON de doze inteiros. Trocar o ano não troca o planejado
