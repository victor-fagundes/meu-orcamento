---

description: "Task list for 045 Lançamentos web"
---

# Tasks: Lançamentos web

**Input**: Design documents from `/specs/045-lancamentos-web/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Vitest da lista e da prévia, e Playwright de Lançamentos, pedidos em plan.md e em quickstart.md. O teste nasce falhando.

**Organization**: US1 tabela do mês (P1, MVP). US2 busca e filtros (P1). US3 registro à vista (P1). US4 parcelar no cartão (P1). US5 editar por alcance (P1). US6 excluir e desfazer (P1). US7 vazio, erro e teclado (P1).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (outro arquivo, sem depender de tarefa incompleta)
- **[Story]**: US1, US2, US3, US4, US5, US6, US7
- Cada tarefa cita o arquivo

## Path Conventions

- Página: `src/app/app/lancamentos/page.tsx`, `src/app/app/lancamentos/loading.tsx`, `src/app/app/lancamentos/error.tsx`
- Tela: `src/components/lancamentos-tela.tsx`
- Casca: `src/components/casca-abas.ts`, `src/components/casca-abas.test.ts`
- Conta: `src/domain/lancamentos-lista.ts`, `src/domain/lancamentos.ts`, `src/domain/edit-lancamento.ts`, `src/domain/delete-lancamento.ts`
- Pacote: `packages/design-system/src/web/tabela.tsx`, `packages/design-system/src/web/dialogo.tsx`, `packages/design-system/src/base/contratos.ts`
- Contrato: `specs/045-lancamentos-web/contracts/lancamentos.md`
- E2E: `e2e/lancamentos.spec.ts`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Travar o escopo antes de trocar o miolo de Lançamentos

- [x] T001 Confirm `specs/045-lancamentos-web/spec.md` status is `ready`. Edit only the files listed in `specs/045-lancamentos-web/plan.md`. Do not add a table, a column, or a migration. Do not change `src/domain/competencia.ts`, `splitParcelas` in `src/domain/money.ts`, `planEditLancamento` in `src/domain/edit-lancamento.ts`, or `planDeleteLancamento` in `src/domain/delete-lancamento.ts`. Do not delete `src/components/lancamentos-view.tsx`. Do not import `@material/web` in a new file. Do not add `console.log`, `any`, or a raw `px`/`rem`/`dp` style in `src/app` or `src/components`. The 460 px panel stays the existing rule in `packages/design-system/src/web/formulario-container.tsx`. Do not add `MenuAcoes` on the row

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: O mês da casca conserva a query, a página lê a competência da sessão, e a tabela e o diálogo aceitam o que as histórias vão usar

**⚠️ CRITICAL**: Nenhuma user story começa antes disto

- [x] T002 [P] Add a failing test in `src/components/casca-abas.test.ts`. `pedeMes` is true for Resumo, Orçamento, and Lançamentos, and false for Ano and Ajustes. `caminhoComMes("/app/lancamentos", "q=uber&item=abc&pagamento=cartao", "2026-12")` returns a path whose `mes` is `2026-12` and which still contains `q=uber`, `item=abc`, and `pagamento=cartao`
- [x] T003 Make `src/components/casca-abas.test.ts` pass from `src/components/casca-abas.ts`. Set Lançamentos `pedeMes` to true. Do not draw "Mês anterior" or "Próximo mês" inside `src/components/lancamentos-tela.tsx`. `caminhoComMes` already keeps the other keys
- [x] T004 [P] In `packages/design-system/src/base/contratos.ts`, add optional `children` and `confirmarDesabilitado` to `DialogoProps`. In `packages/design-system/src/web/dialogo.tsx`, render `children` between the description and the buttons, and disable the confirm button when `confirmarDesabilitado` is true. In `packages/design-system/src/native/dialogo.tsx`, accept the same props so the shared type compiles. Backdrop click and Escape still call `onCancelar`. A click inside the dialog does not
- [x] T005 [P] In `packages/design-system/src/base/contratos.ts`, add optional `nomeAcao` to `LinhaTabela`. In `packages/design-system/src/web/tabela.tsx`, when `onSelecionar` is set, the row has `tabIndex={0}`, `id` `lancamento-${linha.id}`, and Enter or Space calls `onSelecionar`. When `nomeAcao` is set, that string is the row's accessible name. Do not add a sixth column. Cells stay strings
- [x] T006 In `src/app/app/lancamentos/page.tsx`, keep `requireSessionOrcamento`. Absent or invalid `mes` uses `competenciaAtual()`. Load `listLancamentosCompetencia` for this `orcamentoId` and competência. Also load every row of a `grupoParcelaId` that appears in that month, including other months, same `orcamentoId` only. Include `diaFechamento` of the card. Load active items and active cards. Stop rendering `LancamentosView`. Pass the data into a new client `src/components/lancamentos-tela.tsx` that may return null in this task. Do not change the SQL order: `dataTransacao` descending, then `createdAt` descending

**Checkpoint**: O mês da conta chega na tela sem o Material antigo. A troca de mês conserva `q`, `item` e `pagamento`

---

## Phase 3: User Story 1 - O mês numa tabela (Priority: P1) 🎯 MVP

**Goal**: A competência do mês em cinco colunas, com parcela, selo da fatura e a máscara do Resumo.

**Independent Test**: Com fechamento no dia 25, a compra de cartão de 26/05/2026 aparece em junho com a data 26/05/2026 e "Fatura 06/2026". O débito do mesmo dia aparece em maio, sem selo. A linha se chama "Editar" e não tem "Excluir".

### Tests for User Story 1

- [x] T007 [P] [US1] Add a failing test in `src/domain/lancamentos-lista.test.ts`. `textoParcela(2, 6)` is "Parcela 2 de 6 · restam 4". `textoParcela(3, 3)` is "Parcela 3 de 3 · restam 0". A vista (`parcelaTotal` null or 1) returns null. `textoFatura("2026-06")` is "Fatura 06/2026". No fatura text when `diaFechamento` is null. No React, Next, or Drizzle import. Integer cents only
- [x] T008 [P] [US1] Add a failing Playwright test in `e2e/lancamentos.spec.ts`. Sign in at `/login` with `demo@local.test` / `demo1234` (fields E-mail and Senha, button Entrar). On `/app/lancamentos` the shell has one control named "Mês anterior" and one named "Próximo mês". The table caption matches "Lançamentos de" plus the month, and the headers are Data, Descrição, Item, Pagamento, and Valor. A row's accessible name starts with "Editar". The table has no control named "Excluir"

### Implementation for User Story 1

- [x] T009 [US1] Implement `textoParcela` and `textoFatura` in `src/domain/lancamentos-lista.ts` so `src/domain/lancamentos-lista.test.ts` passes. Fatura text exists only when the meio is cartão and `diaFechamento` is an integer from 1 to 28
- [x] T010 [US1] In `src/components/lancamentos-tela.tsx`, render `Tabela` with caption "Lançamentos de {mês}" and columns Data, Descrição, Item, Pagamento, Valor. Valor is `tipo: "numero"` and uses `formatarBRL`. Data uses `formatarDataBR`. Descrição appends the parcel text when `textoParcela` is non-null, then the fatura text when present. Pagamento is Débito, Pix, Dinheiro, the card apelido, or "Crédito" when the apelido is missing. Pass `nomeAcao` "Editar {descrição}". Read `localStorage` key `mo-ocultar-valores`: value `"1"` shows "R$ •••••" in Valor and does not put the real amount in the accessible name. There is no hide control on this page. Do not draw month arrows or a floating button

**Checkpoint**: US1 testável. A tabela é a competência do mês, com selo e sem excluir na linha

---

## Phase 4: User Story 2 - Busca e filtros no mês (Priority: P1)

**Goal**: Busca, item e pagamento ficam na query e não saem do mês.

**Independent Test**: "uber99" mostra `Nenhum resultado para "uber99"` e "Limpar busca". Limpar não muda o mês. Item e Crédito juntos mostram só a interseção.

### Tests for User Story 2

- [x] T011 [US2] Extend `src/domain/lancamentos-lista.test.ts` with failing cases for `filtrarLancamentos`. "uber" matches description "Uber" and does not match item "açúcar" for query "acucar". "UBER" matches. An item id and `pagamento` "cartao" together return only that intersection. `pagamento` "cartao" includes every card and excludes débito. Empty query and empty filters return every row, in the input order

### Implementation for User Story 2

- [x] T012 [US2] Implement `filtrarLancamentos` in `src/domain/lancamentos-lista.ts` so the new cases pass. Compare description and item name after trim and lowercasing. Keep accents. Do not search payment or category
- [x] T013 [US2] In `src/components/lancamentos-tela.tsx`, render `CampoBusca` with rótulo "Buscar por descrição" and `rotuloLimpar` "Limpar busca", plus two `Select`s whose empty value is "Todos os itens" and "Todos os pagamentos". Payment options are exactly Débito (`deb`), Pix (`pix`), Dinheiro (`din`), and Crédito (`cartao`). Item options are the items that have a row in the loaded month, `pt-BR` alphabetical, including an archived item that still has a row. Write `q`, `item`, and `pagamento` with `router.replace` so a month change keeps them. "Limpar busca" deletes only `q`. No match with text shows `Nenhum resultado para "{texto}"`, "Confira a descrição ou limpe a busca para ver todos os lançamentos.", and "Limpar busca". No match without text shows "Nenhum lançamento com esses filtros." and leaves both selects on screen

**Checkpoint**: US2 testável. A busca não muda o mês e combina com os filtros

---

## Phase 5: User Story 3 - Registrar à vista (Priority: P1)

**Goal**: O painel grava débito, Pix ou dinheiro no mês da data. Descrição vazia usa o nome do item.

**Independent Test**: R$ 186,40 em 12/11/2026, descrição vazia, item Supermercado, débito, aparece em novembro como Supermercado. "Lançamento salvo." dura 5 segundos e não oferece desfazer.

### Tests for User Story 3

- [x] T014 [P] [US3] Add a failing Playwright case in `e2e/lancamentos.spec.ts`. "Registrar" opens a dialog or panel titled "Registrar lançamento" with Item, Valor, Data, Descrição, and Pagamento. Pix does not show "Parcelar" or a card field. Saving an empty description for an active item stores that item's name. The panel closes, focus returns to "Registrar", and "Lançamento salvo." is visible without "Desfazer". Submitting an empty value shows "Informe um valor maior que zero." and does not add a row

### Implementation for User Story 3

- [x] T015 [US3] In `src/components/lancamentos-tela.tsx`, open `FormularioContainer` titled "Registrar lançamento", save label "Salvar". Item `Select` groups, in order, Receitas, Fixas, Variáveis, Anuais. Each option reads "{nome} · {categoria}". Archived items are absent. Payment options are Débito, Pix, Dinheiro, and Crédito. Débito, Pix, and Dinheiro hide the card select and the Parcelar switch. Call `criarLancamentoAction` with `parcelas: 1` and pagamento `deb`, `pix`, or `din`. Empty or whitespace description is omitted so the action stores the item name. `lerBRL` null, or cents less than or equal to zero, shows "Informe um valor maior que zero." Missing item shows "Selecione o item." Empty date shows "Data inválida." On success, close the panel, focus the control id `registrar`, and show `Snackbar` "Lançamento salvo." for 5 seconds with no undo. On failure, keep the panel and the field values and show "Não foi possível salvar. Os campos continuam preenchidos." Do not show a raw exception message. Cancel, backdrop, back, and Escape call `onCancelar` and return focus to "Registrar". Give the Registrar button id `registrar`

**Checkpoint**: US3 testável. Um lançamento à vista grava e fecha o painel

---

## Phase 6: User Story 4 - Parcelar no cartão (Priority: P1)

**Goal**: No crédito, a prévia mostra os centavos e as competências antes de gravar. As parcelas nascem juntas.

**Independent Test**: Cartão com fechamento 25, R$ 100,00 em 26/05/2026 em 3×, mostra R$ 33,34, R$ 33,33 e R$ 33,33. Junho, julho e agosto têm uma linha cada, todas com a data 26/05/2026.

### Tests for User Story 4

- [x] T016 [US4] Extend `src/domain/lancamentos-lista.test.ts` with failing preview cases. Three unequal cents 3334, 3333, 3333 on competências 2026-06, 2026-07, 2026-08 produce the heading "Prévia: 3 parcelas" and the lines "Jun/2026 · R$ 33,34", "Jul/2026 · R$ 33,33", "Ago/2026 · R$ 33,33". Three equal 100000 cents produce "Prévia: 3 parcelas de R$ 1.000,00". A card with `diaFechamento` null adds the warning "Sem dia de fechamento, a competência é o mês da compra." and no "Fatura" line. Do not edit `src/domain/lancamentos.ts`

### Implementation for User Story 4

- [x] T017 [US4] Implement the preview lines in `src/domain/lancamentos-lista.ts` from a successful `buildLancamentoDraft`, so T016 passes
- [x] T018 [US4] In `src/components/lancamentos-tela.tsx`, show the card `Select` and `Switch` "Parcelar" only when payment is Crédito. Cards listed for a new lançamento are active only. No active card shows "Nenhum cartão ativo." and save shows "Selecione o cartão." Switch off sends `parcelas: 1` and hides the count. Switching on sets the count to 2. The count field accepts integers 1 through 60; otherwise show "Parcelas devem ser entre 1 e 60." and do not call the action. Render the preview before save. Pass `diaFechamentoCartao` only inside the draft call in the client; the action already loads the card. Quantity 1 stores no parcel text. Do not change `src/domain/competencia.ts`

**Checkpoint**: US4 testável. A prévia e a gravação usam o draft que já existe

---

## Phase 7: User Story 5 - Editar e o alcance da correção (Priority: P1)

**Goal**: À vista grava direto. Grupo pergunta "Só esta parcela" ou "Esta e as próximas" antes de gravar. Salvar fecha o painel.

**Independent Test**: Na 3ª de 6, R$ 40,00 em "Só esta parcela" deixa as outras cinco iguais. Uma data que tira a linha do mês manda o foco para "Registrar".

### Tests for User Story 5

- [x] T019 [P] [US5] Add a failing Playwright case in `e2e/lancamentos.spec.ts`. Open a row, change only the description, save, and see "Lançamento salvo." The panel is gone and the row's accessible name still starts with "Editar". Open a parcel row: "Corrigir parcelamento" offers "Só esta parcela" and "Esta e as próximas", and does not offer "Todas do parcelamento". Confirm stays disabled until one option is chosen. Cancel leaves the description unchanged

### Implementation for User Story 5

- [x] T020 [US5] In `src/components/lancamentos-tela.tsx`, selecting a row opens `FormularioContainer` "Editar lançamento" with that parcel's cents, not the original purchase total. Do not render the parcel count. "Excluir lançamento" is present but does nothing until US6. The item select includes active items plus this row's item when that item is archived. The card select includes active cards plus this row's card when that card is inactive. A vista calls `editarLancamentoAction` with `scope: "one"`. A group opens `Dialogo` title "Corrigir parcelamento", description "{descrição} · parcela {N} de {T}. Escolha o alcance da correção.", radios "Só esta parcela" (`one`) and "Esta e as próximas" (`future`), none checked, `confirmarDesabilitado` until a choice. There is no `all` scope. Confirm calls the action with that scope. Cancel returns to the panel without calling it. On success, close the panel, show "Lançamento salvo." for 5 seconds without undo, focus `#lancamento-${id}` when that row is still in the open month, otherwise focus `#registrar`. On failure, keep the panel and show "Não foi possível salvar. Os campos continuam preenchidos." Do not edit `src/domain/edit-lancamento.ts`

**Checkpoint**: US5 testável. A correção não alcança as parcelas anteriores

---

## Phase 8: User Story 6 - Excluir e desfazer (Priority: P1)

**Goal**: Confirmar exclui, fecha o painel e oferece desfazer por 10 segundos sem duplicar.

**Independent Test**: Excluir as parcelas do alcance e desfazer dentro de 10 segundos devolve as mesmas linhas, sem segunda cópia e sem reabrir o painel.

### Tests for User Story 6

- [x] T021 [P] [US6] Add a failing Playwright case in `e2e/lancamentos.spec.ts`. From the edit panel, "Excluir lançamento" asks for confirmation. After confirm, the panel is closed, focus is on "Registrar", and "Desfazer" is visible. Activating "Desfazer" brings the same description back and does not reopen the panel. The table still has no per-row "Excluir"

### Implementation for User Story 6

- [x] T022 [US6] In `src/components/lancamentos-tela.tsx`, "Excluir lançamento" opens `Dialogo`. A vista copy is "Excluir lançamento?", "1 lançamento sai da lista.", and "Você pode desfazer por 10 segundos.", confirm label "Excluir lançamento", `tipoConfirmar` "destrutivo". A group title is "Excluir parcela?" with radios "Só esta parcela", "Esta e as próximas", and "Todas do parcelamento", none checked, confirm disabled until a choice. The count line is "1 lançamento sai da lista." or "N lançamentos saem da lista." from `planDeleteLancamento` using the sibling rows loaded in T006, including other months. Confirm calls `excluirLancamentoAction`. On success, close the panel, focus `#registrar`, and show `Snackbar` "Lançamento excluído." or "N lançamentos excluídos." with "Desfazer" for 10 seconds. Keep `removed` in component state only. Desfazer calls `desfazerExclusaoAction` and does not reopen the panel. At 10 seconds drop that state. A second delete replaces it. Do not show "Lançamento salvo." while undo is visible. On delete failure, keep the panel, focus "Excluir lançamento", and show "Não foi possível excluir. O lançamento continua na lista." On undo failure, show "Não foi possível desfazer. A exclusão continua." and keep "Desfazer" until the 10 seconds end. Cancel, backdrop, and Escape do not delete. Do not edit `src/domain/delete-lancamento.ts`

**Checkpoint**: US6 testável. Desfazer restaura os mesmos registros e não reabre o painel

---

## Phase 9: User Story 7 - Vazio, espera, erro, teclado e aparência (Priority: P1)

**Goal**: O mês sem lançamento tem o cartão com o nome do mês. Carregar não mostra R$ 0,00. A falha oferece "Tentar de novo".

**Independent Test**: Um mês sem lançamento e sem busca mostra "Nenhum lançamento em {mês}" e "Registrar lançamento". A falha de carregamento mostra "Não foi possível carregar o mês." Em 1280 px o painel mede 460 px. Não há botão flutuante.

### Tests for User Story 7

- [x] T023 [P] [US7] Add a failing Playwright case in `e2e/lancamentos.spec.ts`. Navigate to a month with no rows and no `q`: the text is "Nenhum lançamento em" plus that month name, plus "Registrar lançamento", and "Buscar por descrição" is absent. "Registrar lançamento" opens the same "Registrar lançamento" panel. The document has no floating create button. After the flow, save a screenshot under `tests/visual/out/`. Run the spec in light and dark. Do not add a pixel-diff assertion

### Implementation for User Story 7

- [x] T024 [US7] In `src/components/lancamentos-tela.tsx`, when the month has no rows and `q` is empty, render `CartaoVazio` with title "Nenhum lançamento em {mês}", phrase "Registre cada gasto ou receita para acompanhar o que já foi usado no mês.", and action "Registrar lançamento". Hide search and filters. Both that action and "Registrar" open the same panel. When `q` is set and the month has no rows, keep the search empty state from US2
- [x] T025 [P] [US7] Add `src/app/app/lancamentos/loading.tsx` rendering `Skeleton` only, with no "R$" and no `CartaoVazio`. Add `src/app/app/lancamentos/error.tsx` rendering `EstadoErro` with "Não foi possível carregar o mês." and "Tentar de novo", and no table of amounts

**Checkpoint**: US7 testável. Vazio, espera e falha não fingem um mês zerado

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: O roteiro do quickstart fecha a história sem alargar o escopo

- [x] T026 Run the commands in `specs/045-lancamentos-web/quickstart.md`: the Vitest files named there, `npx playwright test e2e/lancamentos.spec.ts`, and `npx tsc --noEmit`. Fix only failures inside the files this plan lists. Do not mark the spec `verified`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: começa imediato
- **Foundational (Phase 2)**: depende do Setup e bloqueia todas as histórias
- **User Stories (Phase 3+)**: dependem da Phase 2. US2 em diante editam `src/components/lancamentos-tela.tsx` depois da US1
- **Polish (Phase 10)**: depende das histórias desejadas

### User Story Dependencies

- **User Story 1 (P1)**: começa depois da Phase 2. Não depende de outra história
- **User Story 2 (P1)**: depois da US1, porque a busca filtra a tabela já montada
- **User Story 3 (P1)**: depois da US1, porque "Registrar" fica no topo dessa tela
- **User Story 4 (P1)**: depois da US3, porque o crédito entra no mesmo painel
- **User Story 5 (P1)**: depois da US1, porque editar abre a partir da linha. O painel de campos é o da US3
- **User Story 6 (P1)**: depois da US5, porque "Excluir lançamento" fica no fim do painel de edição
- **User Story 7 (P1)**: depois da US3, porque o cartão vazio abre o mesmo painel de registro

### Within Each User Story

- O teste nasce falhando, antes da implementação
- A função pura fica antes da tela que a chama
- A história fecha antes da próxima

### Parallel Opportunities

- T002, T004 e T005 são arquivos diferentes e podem seguir juntas depois de T001
- T007 e T008 podem seguir juntas
- T014 pode ser escrito junto com T016: o E2E à vista e o teste da prévia não compartilham arquivo, desde que T011 já tenha terminado no arquivo de domínio
- T019 e T021 editam o mesmo `e2e/lancamentos.spec.ts`, então seguem em ordem
- T025 pode seguir junto com T024: `loading.tsx` e `error.tsx` não são a tela

---

## Parallel Example: User Story 1

```bash
# Testes da US1 juntos, depois da Phase 2:
# src/domain/lancamentos-lista.test.ts
# e2e/lancamentos.spec.ts (tabela e nome Editar)

# Fundação em paralelo, depois de T001:
# src/components/casca-abas.test.ts
# packages/design-system/src/web/dialogo.tsx
# packages/design-system/src/web/tabela.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1
2. Completar Phase 2
3. Completar Phase 3 (US1)
4. **PARAR E VALIDAR**: a tabela da competência, o selo "Fatura 06/2026", a linha "Editar" e o mês só na casca
5. Seguir para a busca

### Incremental Delivery

1. Setup + Foundational
2. US1 tabela do mês
3. US2 busca e filtros
4. US3 registro à vista
5. US4 parcelar no cartão
6. US5 editar por alcance
7. US6 excluir e desfazer
8. US7 vazio, espera e erro
9. Quickstart

### Parallel Team Strategy

1. Uma pessoa fecha Setup e Foundational
2. Em seguida a tela é um arquivo só: US2 a US7 entram em ordem nesse arquivo
3. O teste de `src/domain/lancamentos-lista.ts` e o esqueleto do Playwright podem ser escritos ao mesmo tempo, antes de ligar a tela

---

## Notes

- [P] marca outro arquivo, sem depender de tarefa incompleta
- A tela de Lançamentos é `src/components/lancamentos-tela.tsx`. Tarefas dessa tela não são paralelas entre si
- Cada história fecha com um checkpoint
- O teste falha antes da implementação correspondente
- `LancamentosView` fica no repositório até a história 049
- `src/domain/competencia.ts` não muda
