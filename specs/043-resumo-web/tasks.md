---

description: "Task list for 043 Resumo web"
---

# Tasks: Resumo web

**Input**: Design documents from `/specs/043-resumo-web/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Vitest da leitura e Playwright do Resumo, pedidos em plan.md e em quickstart.md. O teste nasce falhando.

**Organization**: US1 disponível (P1, MVP). US2 quatro cartões (P1). US3 filtros (P1). US4 ocultar (P1). US5 semanas (P1). US6 sininho (P1). US7 vazio, carregando e erro (P1). US8 ler e usar (P1).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (outro arquivo, sem depender de tarefa incompleta)
- **[Story]**: US1, US2, US3, US4, US5, US6, US7, US8
- Cada tarefa cita o arquivo

## Path Conventions

- Página: `src/app/app/resumo/page.tsx`, `src/app/app/resumo/loading.tsx`, `src/app/app/resumo/error.tsx`
- Tela: `src/components/resumo-tela.tsx`, `src/components/resumo-filtro.ts`
- Conta: `src/domain/resumo-semana.ts`, `src/domain/resumo-mes.ts` (não mudar a fórmula)
- Pacote: `packages/design-system/src/web/`, `packages/design-system/src/base/contratos.ts`
- Contrato: `specs/043-resumo-web/contracts/resumo.md`
- E2E: `e2e/resumo.spec.ts`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Travar o escopo antes de trocar o miolo do Resumo

- [x] T001 Confirm `specs/043-resumo-web/spec.md` status is `ready`. Edit only the files listed in `specs/043-resumo-web/plan.md`. Do not add a table, a migration, or a route. Do not change `totaisDoMes` in `src/domain/resumo-mes.ts` or `/api/v1/resumo`. Do not delete `src/components/resumo-dashboard.tsx`, `src/components/resumo-donut.ts`, or `src/components/alert-banner.tsx`. Do not import `@material/web` in a new file. Do not add `console.log`, `any`, or a raw `px`/`rem`/`dp` style in `src/app` or `src/components`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: A página lê o mês da sessão e o painel de foco existe para o gráfico e para o sininho

**⚠️ CRITICAL**: Nenhuma user story começa antes disto

- [x] T002 [P] Create `packages/design-system/src/web/painel.tsx` and export `Painel` from `packages/design-system/src/web.ts`. Props: `aberto`, `titulo`, `onFechar`, `children`. When `aberto` is false, render nothing. When open, `role="dialog"`, `aria-modal="true"`, title as the accessible name, close control named "Fechar", and `prenderFoco` from `packages/design-system/src/web/foco.ts` so Tab stays inside and Escape or Fechar calls `onFechar` and returns focus to the opener. Do not add a confirm/save pair. Do not export it from the native barrel
- [x] T003 [P] In `src/app/app/resumo/page.tsx`, keep `requireSessionOrcamento` and `?mes=`: absent uses `competenciaAtual()`; an invalid value falls back to today. Load active items, active cartões (id and apelido), lançamentos of that competência for this `orcamentoId` including `dataTransacao` and `descricao`, and `loadAlertasMes`. Stop rendering `AlertBanner` and `ResumoDashboard`. Pass that data plus `hoje` as `AAAA-MM-DD` from the same `Date` as `competenciaAtual` into a new client `src/components/resumo-tela.tsx`. The client may render an empty fragment in this task

**Checkpoint**: O mês da conta chega na tela sem banner e sem a rosca. O painel prende o foco

---

## Phase 3: User Story 1 - Disponível neste mês (Priority: P1) 🎯 MVP

**Goal**: Um bloco com o rótulo "Disponível neste mês", o saldo que `totaisDoMes` já calcula, a frase e o medidor.

**Independent Test**: Com despesas planejadas de R$ 3.000,00 e gasto de R$ 2.400,00, o bloco mostra R$ 600,00. No dia 17 de um mês de 30 dias que é hoje, a frase é "Usou 80% do planejado · Faltam 13 dias".

### Tests for User Story 1

- [x] T004 [P] [US1] Add a failing test in `src/domain/resumo-semana.test.ts` for the support line. Inputs are integer cents and `hoje` as `AAAA-MM-DD`. Planned expenses 300000 and spent 240000 on 2026-11-17 for competência `2026-11` return percentual 80 and "Usou 80% do planejado · Faltam 13 dias". The same 80% for competência `2026-10` returns "Usou 80% do planejado" and does not include "Faltam". Planned expenses 0 returns percentual `null` and no percent in the phrase. Spent 105000 of 100000 returns percentual 105 with no decimal. A payment other than Todas returns no percentual; on the current month the days phrase remains. 87.9% of the ratio truncates to 87. No React, Next, or Drizzle import. Do not reimplement `totaisDoMes`; a separate expectation keeps `aindaPodeGastarCentavos` at 60000 for 300000 and 240000
- [x] T005 [P] [US1] Add a failing Playwright test in `e2e/resumo.spec.ts`. Sign in at `/login` with `demo@local.test` / `demo1234` (fields E-mail and Senha, button Entrar). On `/app/resumo` there is one region labelled "Disponível neste mês". There is no second balance block

### Implementation for User Story 1

- [x] T006 [P] [US1] Implement the support line in `src/domain/resumo-semana.ts` so `src/domain/resumo-semana.test.ts` passes. Percentual is `Math.floor((gasto * 100) / planejado)` when planejado of expenses is greater than zero and payment is Todas; otherwise `null`. Build the phrase from that integer. N is the last calendar day of the month minus the day of `hoje`, and the days clause exists only when the competência is the civil month of `hoje`. No float division for the percent
- [x] T007 [P] [US1] In `packages/design-system/src/base/contratos.ts`, allow `BlocoSaldoProps.valorCentavos` and `percentualUsado` to be `number | null`. Update `packages/design-system/src/web/modulos/bloco-saldo.tsx` and `packages/design-system/src/native/modulos/bloco-saldo.tsx`. `null` valor while visible renders "—". `ocultado` still renders "R$ •••••" from `textoDoSaldo`. `null` percentual does not mount `Medidor`; a non-empty `fraseApoio` still shows. In `packages/design-system/src/web/base.css`, `.mo-bloco-saldo__valor` stays on `--type-display-md-size` and, inside the existing `@media (min-width: 720px)`, uses `--type-display-lg-size` and `--type-display-lg-line`. Do not add a token
- [x] T008 [US1] In `src/components/resumo-tela.tsx`, render one `BlocoSaldo` with rotulo "Disponível neste mês", `aindaPodeGastarCentavos` from `totaisDoMes`, and the phrase from `src/domain/resumo-semana.ts`. Pass the server `hoje`. Do not draw month arrows on this page

**Checkpoint**: US1 testável. O bloco mostra o saldo já calculado e a frase do mês

---

## Phase 4: User Story 2 - Quatro cartões do mês (Priority: P1)

**Goal**: Receitas, Fixas, Variáveis e Anuais, com realizado sem centavos, "de R$ x planejados", e o toque abrindo o Orçamento daquele tipo.

**Independent Test**: Realizado de R$ 8.200,99 e planejado de R$ 1.200,50 em Fixas aparecem como R$ 8.200 e "de R$ 1.200 planejados". Ativar Fixas abre o Orçamento do mês com `tipo=F`.

### Tests for User Story 2

- [x] T009 [P] [US2] Add a failing test in `src/components/resumo-filtro.test.ts`. A view of types `R`, `F`, `V`, `E` becomes four cards in this order: Receitas, Fixas, Variáveis, Anuais. Fixas with realizadoCentavos 820099 and planejadoCentavos 120050 keeps those integers (the component truncates). Activating Fixas for mês `2026-11` targets `/app/orcamento?mes=2026-11&tipo=F`. Keep the existing `hrefOrcamentoMes` and `textoFiltroResumo` tests green
- [x] T010 [P] [US2] Extend `e2e/resumo.spec.ts`. The page shows buttons or articles named Receitas, Fixas, Variáveis, Anuais in that order. Activating Fixas lands on `/app/orcamento` with `mes` unchanged and `tipo=F`

### Implementation for User Story 2

- [x] T011 [P] [US2] In `packages/design-system/src/base/contratos.ts`, add optional `onAbrir?: (rotulo: string) => void` to `GradeTotaisProps` and allow `ItemTotal.planejadoCentavos` to be `number | null`. Update `packages/design-system/src/web/modulos/grade-totais.tsx` and `packages/design-system/src/native/modulos/grade-totais.tsx`. With `onAbrir`, each card is a button; without it, the card is not a control. `null` planejado renders the support line as "—" and not "de R$ — planejados". Realizado still uses `formatarBRLInteiro` (truncates, does not round). In `packages/design-system/src/web/base.css`, keep two columns. Inside `@media (min-width: 720px)`, cap `.mo-grade-totais` at six content columns: `calc((var(--content-max-width) - 11 * var(--grid-gutter-desktop)) / 12 * 6 + 5 * var(--grid-gutter-desktop))`. No new token
- [x] T012 [US2] In `src/components/resumo-filtro.ts` and `src/components/resumo-tela.tsx`, build the four cards from `totaisDoMes` in the order Receitas, Fixas, Variáveis, Anuais and navigate with `hrefOrcamentoMes`. Do not open Lançamentos from the card

**Checkpoint**: US2 testável. Os quatro cartões leem o mês e Fixas abre o Orçamento

---

## Phase 5: User Story 3 - Filtros sem mexer no mês (Priority: P1)

**Goal**: Tipo, pagamento e categoria na query. Limpar devolve os três a Todas e mantém o mês. Pagamento tira o planejado. Categoria recorta os números. Tipo só recorta o gráfico.

**Independent Test**: Escolher um pagamento mostra "—" no disponível e no planejado. Limpar volta a Todas no mesmo mês.

### Tests for User Story 3

- [x] T013 [US3] Extend `src/components/resumo-filtro.test.ts`. Absent or unknown `tipo`, `pagamento`, and `categoria` mean Todas. Accepted `pagamento` values are `deb`, `pix`, `din`, and `cartao:<id>` of an active cartão. Accepted `tipo` values are `R`, `F`, `V`, `E`. Accepted `categoria` is an active item grupo. A non-Todas payment sets disponível and every planejado to `null` and keeps realizado for that meio only. A categoria restricts items and lançamentos before `totaisDoMes` and does not change the alert list. A `tipo` does not change disponível or the four cards. Clearing drops `tipo`, `pagamento`, and `categoria` and keeps `mes`. The function does not write
- [x] T014 [P] [US3] Extend `e2e/resumo.spec.ts`. Choose a payment other than Todas and expect the balance and every planned line to show "—". Activate "Limpar filtros" and expect tipo, pagamento, and categoria back at Todas with the same mês

### Implementation for User Story 3

- [x] T015 [US3] Implement that parse and recorte in `src/components/resumo-filtro.ts`. In `src/components/resumo-tela.tsx`, render `Chips` for tipo (Todas, Receitas, Fixas, Variáveis, Anuais) and for pagamento (Todas, Débito, PIX, Dinheiro, plus each active cartão by apelido), and `Select` for categoria. Each control shows the current value. "Limpar filtros" navigates to the same path with only `mes` when the month is in the query. Wire the null disponível and null planejado into `BlocoSaldo` and `GradeTotais`. Do not apply `tipo` to those two

**Checkpoint**: US3 testável. O filtro não grava e não troca o mês

---

## Phase 6: User Story 4 - Ocultar os valores (Priority: P1)

**Goal**: Ocultar troca o disponível e os cartões por "R$ •••••" e a escolha fica neste navegador.

**Independent Test**: Ocultar, recarregar e continuar oculto. Mostrar devolve os números. O gráfico entra na máscara quando a US5 existir.

### Tests for User Story 4

- [x] T016 [US4] Extend `e2e/resumo.spec.ts`. Activating "Ocultar valores" renames the control to "Mostrar valores", sets `aria-pressed="true"`, and the balance and the four cards show "R$ •••••". Reload keeps them hidden. "Mostrar valores" restores the amounts. The percent phrase and the days phrase stay readable

### Implementation for User Story 4

- [x] T017 [US4] In `src/components/resumo-tela.tsx`, read and write `localStorage` key `mo-ocultar-valores`. Value `"1"` hides; any other reading shows. Pass `ocultado` to `BlocoSaldo`. Add optional `ocultado` to `GradeTotaisProps` in `packages/design-system/src/base/contratos.ts` and honor it in `packages/design-system/src/web/modulos/grade-totais.tsx` and `packages/design-system/src/native/modulos/grade-totais.tsx`: both realizado and planejado render "R$ •••••". Do not create a second key. Do not mask the support phrase or the alerts

**Checkpoint**: US4 testável. A preferência sobrevive ao recarregar

---

## Phase 7: User Story 5 - Gasto por semana (Priority: P1)

**Goal**: Gráfico de semanas fixas, média diária em todo mês, e "Ver detalhes" com os lançamentos da semana.

**Independent Test**: Um mês de 31 dias tem cinco semanas. Um de 28 tem quatro. No dia 10, R$ 100,00 de gasto mostram média de R$ 10,00. Noutro mês de 30 dias, R$ 30,00 mostram R$ 1,00.

### Tests for User Story 5

- [x] T018 [P] [US5] Extend `src/domain/resumo-semana.test.ts`. A 31-day month returns five weeks named "Semana 1" through "Semana 5" (days 1–7, 8–14, 15–21, 22–28, 29–end). A 28-day month returns four and no fifth. A competência lançamento dated before the month joins Semana 1; one dated after joins the last existing week. Only expense types `F`, `V`, and `E` sum. `tipo` Receitas yields zeros. On `hoje` day 10, expense spend of 10000 cents returns average 1000 cents. Another 30-day month with 3000 cents returns 100 cents. Rounding is nearest cent by integer division, not `Math.round` of a float
- [x] T019 [P] [US5] Extend `e2e/resumo.spec.ts`. The chart shows "Semana 1" and a daily average. "Ver detalhes da semana 1" opens a dialog and closing it returns focus to that control

### Implementation for User Story 5

- [x] T020 [US5] Implement week buckets and `mediaDiariaCentavos` in `src/domain/resumo-semana.ts` so the new tests pass. Current month divides by the day of `hoje`. Any other month divides by the number of days in that month. Positive nearest cent is `Math.trunc((gasto + Math.floor(divisor / 2)) / divisor)`
- [x] T021 [US5] Create `packages/design-system/src/web/modulos/grafico-semanas.tsx`, export it from `packages/design-system/src/web.ts`, and render it from `src/components/resumo-tela.tsx`. Each week has its name, the amount as text, a bar, and a control "Ver detalhes da semana N". The average is text. No bar transition. Open `Painel` from T002. In `packages/design-system/src/base/contratos.ts`, make `LinhaLancamentoProps.onAbrir` optional and add `ocultado?: boolean`. Update `packages/design-system/src/web/modulos/linha-lancamento.tsx` and `packages/design-system/src/native/modulos/linha-lancamento.tsx`: without `onAbrir` the row is not a button; `ocultado` shows "R$ •••••". An empty week says "Nenhum lançamento nesta semana." Apply `tipo`, `pagamento`, and `categoria` only to this chart, the detail, and the average. When the hide preference is on, mask the chart amounts and the detail amounts

**Checkpoint**: US5 testável. As semanas e a média batem com a data injetada

---

## Phase 8: User Story 6 - Alertas do mês (Priority: P1)

**Goal**: O sininho lista os alertas que o mês já calcula. Não há banner.

**Independent Test**: Dois alertas mostram quantidade 2 e cada um abre o Orçamento do mesmo mês. Zero alertas não mostra quantidade e o painel diz "Nenhum alerta neste mês."

### Tests for User Story 6

- [x] T022 [US6] Extend `e2e/resumo.spec.ts`. The Resumo has no banner. The bell either shows a count and a list, or no count and the text "Nenhum alerta neste mês." A listed alert navigates to `/app/orcamento` with the same `mes` and without forcing `tipo`

### Implementation for User Story 6

- [x] T023 [US6] In `src/components/resumo-tela.tsx`, add the bell from the `alertas` already loaded by `loadAlertasMes`. Do not filter them by tipo, pagamento, or categoria. Do not invent a level or a message. Count is the list length; zero renders no count. The `Painel` from T002 lists them in the order received. Each item links to `/app/orcamento?mes=<competência>`. Empty copy is "Nenhum alerta neste mês." Do not mount `AlertBanner`

**Checkpoint**: US6 testável. O sininho é a lista do mês

---

## Phase 9: User Story 7 - Vazio, carregando e erro (Priority: P1)

**Goal**: Mês sem receita planejada e sem lançamento mostra o cartão "Definir receitas". Carregar não mostra R$ 0,00. Falhar mostra a frase de erro.

**Independent Test**: Planejado de Receitas zero e zero lançamentos, mesmo com despesa planejada, é vazio. Um lançamento no mês não é vazio.

### Tests for User Story 7

- [x] T024 [US7] Extend `src/domain/resumo-semana.test.ts`. `mesVazio` is true when planned Receitas cents are 0 and the lançamento count is 0, even if expense plans are non-zero. It is false when any lançamento exists. The predicate ignores filters

### Implementation for User Story 7

- [x] T025 [US7] Implement `mesVazio` in `src/domain/resumo-semana.ts`. In `src/components/resumo-tela.tsx`, when it is true render only `CartaoVazio` with titulo "Nenhuma receita neste mês", frase "Defina as receitas para acompanhar o disponível.", and action "Definir receitas" to `hrefOrcamentoMes(mes, "R")`. Do not render the balance, the four cards, or the chart. A filter over a month that has movement must not take this branch. Add `src/app/app/resumo/loading.tsx` with `Skeleton` and no currency text. Add `src/app/app/resumo/error.tsx` with `EstadoErro` mensagem "Não foi possível carregar o mês." and the default action "Tentar de novo"

**Checkpoint**: US7 testável. O zero falso não aparece no carregamento

---

## Phase 10: User Story 8 - Ler e usar o Resumo (Priority: P1)

**Goal**: O mês fica no cabeçalho, o teclado alcança os controles, e não há intervalo de datas nem botão flutuante.

**Independent Test**: O cabeçalho do Resumo tem "Mês anterior" e "Próximo mês". A página não os repete. Em 390 px e em 1280 px não há seletor de intervalo nem flutuante.

### Tests for User Story 8

- [x] T026 [P] [US8] Update `src/components/casca-abas.test.ts` so only Resumo has `pedeMes: true`. The other four stay `false`. Keep the five areas, the order, and `abaAtiva` expectations
- [x] T027 [P] [US8] Extend `e2e/resumo.spec.ts`. The header shows "Mês anterior" and "Próximo mês" and the page body does not. Tab reaches the four cards, the filters, "Limpar filtros", the hide control, the bell, and "Ver detalhes". There is no start/end date pair and no floating create button at 390 px or 1280 px

### Implementation for User Story 8

- [x] T028 [US8] In `src/components/casca-abas.ts`, set `pedeMes: true` only on the Resumo entry. Do not turn it on for Orçamento, Lançamentos, Ano, or Ajustes. Do not add month buttons inside `src/components/resumo-tela.tsx`

**Checkpoint**: US8 testável. Trocar o mês troca os números e a página não duplica as setas

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Fechar o contrato da tela inteira

- [x] T029 [P] Confirm the new files under `src/app/app/resumo/`, `src/components/resumo-tela.tsx`, and `src/domain/resumo-semana.ts` have no `@material/web` import, no `console.log`, no `any`, and no raw length unit in a style. The 720 px media query stays in `packages/design-system/src/web/base.css`, where it already exists
- [x] T030 Run the checks in `specs/043-resumo-web/quickstart.md`: `npm test -- src/domain/resumo-semana.test.ts src/components/casca-abas.test.ts`, `npx playwright test e2e/resumo.spec.ts`, and `npx tsc --noEmit`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: começa imediato
- **Foundational (Phase 2)**: depende do Setup e bloqueia as histórias
- **User Stories (Phase 3+)**: dependem do Foundational. A ordem abaixo é a da spec
- **Polish (Phase 11)**: depende das histórias que forem entrar na entrega

### User Story Dependencies

- **US1 (P1)**: depois do Foundational. Não depende de outra história. É o MVP
- **US2 (P1)**: depois do Foundational. Usa a página da US1 para os quatro números aparecerem juntos
- **US3 (P1)**: depois da US1 e da US2, porque o traço do pagamento aparece no bloco e nos cartões
- **US4 (P1)**: depois da US1 e da US2. A máscara do gráfico fecha na US5
- **US5 (P1)**: depois do Foundational (o `Painel` é o T002). O recorte de tipo, pagamento e categoria usa o filtro da US3
- **US6 (P1)**: depois do T002. Não depende do gráfico
- **US7 (P1)**: depois da US1, porque o vazio substitui o bloco
- **US8 (P1)**: depois do Foundational. O teste de teclado dos cartões, filtros, sininho e detalhe fica completo com US2, US3, US5 e US6

### Within Each User Story

- O teste falha antes da implementação
- A função pura fica antes da tela que a chama
- O contrato do pacote fica antes do uso na página

### Parallel Opportunities

- T002 e T003
- T004 e T005
- T006 e T007, depois que os testes da US1 existirem
- T009 e T010
- T018 e T019
- T026 e T027
- US6 pode andar junto com US5 depois do T002

---

## Parallel Example: User Story 1

```bash
# Testes da US1 juntos:
# T004 src/domain/resumo-semana.test.ts
# T005 e2e/resumo.spec.ts

# Implementação em arquivos diferentes, depois dos testes:
# T006 src/domain/resumo-semana.ts
# T007 packages/design-system/src/web/modulos/bloco-saldo.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 e Phase 2
2. Phase 3 (US1)
3. Parar e validar o bloco "Disponível neste mês"
4. Seguir as histórias na ordem da spec

### Incremental Delivery

1. Setup + Foundational
2. US1 bloco do disponível
3. US2 quatro cartões e o salto ao Orçamento
4. US3 filtros
5. US4 ocultar
6. US5 gráfico
7. US6 sininho
8. US7 vazio, carregando e erro
9. US8 mês no cabeçalho, teclado e ausência de flutuante
10. Polish com o quickstart

### Parallel Team Strategy

1. Todo mundo fecha Setup e Foundational
2. Uma pessoa fica na US1 e na US2 (a página)
3. Outra pode abrir a US6 assim que o T002 existir
4. A US5 espera o filtro da US3 para o recorte do gráfico

---

## Notes

- [P] é outro arquivo, sem tarefa incompleta no caminho
- O saldo não ganha fórmula nova. Pagamento diferente de Todas mostra "—", não um segundo saldo
- A chave de ocultar é uma só: `mo-ocultar-valores`
- Commit por tarefa ou por história
- Vale parar em qualquer checkpoint e testar a história sozinha
