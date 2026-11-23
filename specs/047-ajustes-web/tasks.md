---

description: "Task list for 047 Ajustes web"
---

# Tasks: Ajustes web

**Input**: Design documents from `/specs/047-ajustes-web/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Vitest de cartão, iniciais, frase EXCLUIR e limite global, e Playwright de Ajustes, pedidos em plan.md e em quickstart.md. O teste nasce falhando.

**Organization**: US1 menu, conta, tema e saída (P1, MVP). US2 categorias (P1). US3 arquivados (P1). US4 cartões (P1). US5 limite global (P1). US6 exportar (P1). US7 exemplo (P1). US8 excluir conta (P1). US9 falha, teclado e leitura (P2).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (outro arquivo, sem depender de tarefa incompleta)
- **[Story]**: US1 … US9
- Cada tarefa cita o arquivo

## Path Conventions

- Rotas: `src/app/app/ajustes/`
- Telas: `src/components/ajustes-moldura.tsx`, `conta-tela.tsx`, `categorias-tela.tsx`, `cartoes-tela.tsx`, `limites-tela.tsx`, `exportar-tela.tsx`, `exemplo-tela.tsx`, `excluir-tela.tsx`
- Domínio: `src/domain/cartoes.ts`, `src/domain/iniciais.ts`, `src/domain/exclusao-conta.ts`
- Aplicação: `src/application/cartoes.ts`, `src/application/limites.ts`
- Pacote: `packages/design-system/src/base/contratos.ts`, `packages/design-system/src/web/formulario-container.tsx`, `packages/design-system/src/web/base.css`
- Contrato: `specs/047-ajustes-web/contracts/ajustes.md`
- E2E: `e2e/ajustes.spec.ts`, `e2e/casca.spec.ts`, `e2e/orcamento.spec.ts`, `e2e/resumo.spec.ts`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Travar o escopo antes de trocar o miolo de Ajustes

- [x] T001 Confirm `specs/047-ajustes-web/spec.md` status is `ready` before editing product code. Edit only the files listed in `specs/047-ajustes-web/plan.md`. Do not add a table, a column, or a migration. Do not change `src/domain/competencia.ts`, `TIPOS_LABEL` in `src/domain/catalog.ts`, `limiteDaCategoria` in `src/domain/alertas.ts`, `EXAMPLE_PLANS_BRL`, `buildExportCsv`, or `buildExportJson`. Do not change `POST` in `src/app/api/v1/cartoes/route.ts`. Do not delete `src/components/ajustes-cards.tsx`, `src/components/cartoes-panel.tsx`, `src/components/limites-panel.tsx`, `src/components/excluir-conta-panel.tsx`, `src/components/carregar-exemplo-button.tsx`, `src/components/export-panel.tsx`, the import panels, or `src/components/competencia-simulador.tsx`. Do not import them from the new pages. Do not import `@material/web` in a new file. Do not add `console.log`, `any`, or a raw hex/`px`/`rem`/`dp` style in `src/app`, `src/components`, or `packages/design-system`. Do not edit Android. New pages must not add a second `id="conteudo"`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: A moldura, o carregamento e a folha estreita existem antes de qualquer página

**⚠️ CRITICAL**: Nenhuma user story começa antes disto

- [x] T002 [P] Add optional `folhaNaEstreita` (default `false`) to `FormularioContainerProps` in `packages/design-system/src/base/contratos.ts` and honor it in `packages/design-system/src/web/formulario-container.tsx`. When the prop is true and the viewport is below 720px, add class `mo-formulario--folha` so `packages/design-system/src/web/base.css` anchors the form to the bottom of the viewport using existing tokens. At 720px and above the form stays the current 460px right-hand panel. Callers that omit the prop, including Orçamento and Lançamentos, must look unchanged. Do not add a new component
- [x] T003 [P] Wrap the body children in `src/app/layout.tsx` with `ThemeProvider` exported from `@meu-orcamento/design-system` (`packages/design-system/src/web/tema.tsx`). Keep the existing inline `mo-tema` script. Do not add a second storage key. Absent or unknown values stay `system`
- [x] T004 [P] Add `src/app/app/ajustes/loading.tsx` with `Skeleton` and no empty-state copy, no "Nenhum cartão ativo.", and no zero shown as if data had arrived. Add `src/app/app/ajustes/error.tsx` with `EstadoErro`, the text "Não foi possível carregar.", and the button "Tentar de novo". Add `src/app/app/ajustes/layout.tsx` rendering `src/components/ajustes-moldura.tsx` around `children`, with no `id="conteudo"`. The moldura shows a menu slot and the page together at 720px and above. Below 720px it shows only the page, and a text `Botao` "Voltar" reveals only the menu without changing the URL. Choosing an entry hides the menu again. Replace `src/app/app/ajustes/page.tsx` with a redirect to `/app/ajustes/categorias` that preserves the query. Add `src/app/app/ajustes/categorias/page.tsx` that renders the heading "Categorias e itens" and nothing else. Do not mount the old accordion. `e2e/orcamento.spec.ts` and `e2e/resumo.spec.ts` stay red until US2 and US7. Do not restore the accordion to make them pass

**Checkpoint**: `/app/ajustes` abre Categorias e itens. Abaixo de 720 px, Voltar mostra o menu. O formulário compartilhado não muda de lugar

---

## Phase 3: User Story 1 - Menu, conta, tema e saída (Priority: P1) 🎯 MVP

**Goal**: Dois grupos, Conta com tema, e um único Sair com diálogo.

**Independent Test**: Abrir Ajustes e ler os dois grupos, sem Importar e sem Simulador. Em Conta, escolher Escuro e recarregar: a página continua escura. Cancelar o diálogo de sair e continuar na conta.

### Tests for User Story 1

- [x] T005 [P] [US1] Add a failing test in `src/domain/iniciais.test.ts` for `iniciaisDaConta`. No React import. "Victor Fagundes" is "VF". A single name uses its first letter, uppercased. Empty or whitespace is ""
- [x] T006 [P] [US1] Add a failing Playwright test in `e2e/ajustes.spec.ts`. Sign in at `/login` with `demo@local.test` / `demo1234`, the same way as `e2e/resumo.spec.ts`. `/app/ajustes` shows "Categorias e itens". The menu lists, in order, Categorias e itens, Conta, Cartões, Limites de alerta, Itens arquivados, then Exportar, Dados de exemplo. "Excluir conta" is outside those groups. There is no "Importar planilha", "Importar fatura", or "Simulador de competência". The shell nav marks only "Ajustes". The shell has no button named "Sair". At 1280px the menu link "Conta" and the categorias heading are both visible. At 390px, open Conta, then "Voltar" shows the menu again and hides the conta heading. Do not confirm sign-out and do not delete the demo account

### Implementation for User Story 1

- [x] T007 [P] [US1] Implement `iniciaisDaConta` in `src/domain/iniciais.ts` so `src/domain/iniciais.test.ts` passes. First letter of the first word and first letter of the last word, uppercased. One word uses its first letter
- [x] T008 [P] [US1] Remove the header `Botao` "Sair" from `src/components/casca-app.tsx`. In `e2e/casca.spec.ts`, delete the click on "Sair" and the wait for `/login` from the test "título sem mês, sem flutuante, e Sair". Keep the assertions that month controls are absent on Ano and Ajustes and that no floating button exists
- [x] T009 [US1] Fill the menu in `src/components/ajustes-moldura.tsx` with `LinhaAjuste`. Icons already in `packages/design-system/src/core/icons-paths.ts`: `category`, `person`, `credit_card`, `notifications`, `archive`, `upload`, `science`, `delete`, `logout`. Group headings "Dia a dia" and "Dados e arquivos". Excluir conta uses `destrutivo` and links to `/app/ajustes/excluir`. Sair da conta is a button, not a route. Itens arquivados links to `/app/ajustes/categorias?aba=arquivados`. Add `src/app/app/ajustes/conta/page.tsx` and `src/components/conta-tela.tsx`. Show `Avatar` with `iniciaisDaConta`, the session name, the email, a link "Esqueci a senha" to `/esqueci-senha` that does not call `signOut`, the sentences "Dados da sua conta neste aparelho." and "Esta conta está ativa neste navegador.", and `Chips` "Claro", "Escuro", "Sistema" bound to `useTema` (`light`, `dark`, `system`). One chip is selected. Choosing a chip applies it immediately and persists `mo-tema`. `system` follows the device and must not write `light` or `dark`. The same `Dialogo` from the menu and from Conta uses title "Sair da conta", description "A sessão desta conta será encerrada neste navegador.", "Cancelar", and "Sair". Cancel keeps the session and returns focus to the opener. Confirm calls `authClient.signOut` and assigns `/login`. A danger-zone link opens `/app/ajustes/excluir`. Make T006 pass

**Checkpoint**: US1 testável. O menu, o tema e o Sair confirmado funcionam. A casca não encerra a sessão sozinha

---

## Phase 4: User Story 2 - Criar, renomear e arquivar categoria (Priority: P1)

**Goal**: Categorias ativas por tipo, com criar, renomear e arquivar.

**Independent Test**: Criar "  Lazer  " em Despesas variáveis, ver "Lazer" com "0 itens", tentar "lazer" de novo e ver a recusa. Arquivar Lazer, ler "Categoria arquivada." e encontrar os itens dela em Itens arquivados, com os lançamentos ainda na lista.

### Implementation for User Story 2

- [x] T010 [US2] Replace the stub in `src/app/app/ajustes/categorias/page.tsx` with data for `src/components/categorias-tela.tsx`. List only active categories. Type order and labels: Receitas, Despesas fixas, Despesas variáveis, Anuais. Within a type, `localeCompare` with `pt-BR`. Count active items (`arquivado === 0`) with the same type and the same name. The line shows "1 item" for one and "{n} itens" for every other count, including "0 itens". An archived category is absent. `?tipo=R|F|V|E` marks that type and does not hide the others. Do not call `tipoDaQuery`. Visible sentence: "Renomear atualiza o nome em todos os itens da categoria. Arquivar tira a categoria do Orçamento; os lançamentos antigos continuam." "+ Nova categoria" opens `FormularioContainer` with `folhaNaEstreita`. Fields are `Select` Tipo (one group, four options) and `Campo` Nome. Creating a category creates no item. Rename and Arquivar live in `MenuAcoes` with `destrutivo` false. Archive uses this screen's `Dialogo`, not the menu's built-in dialog: title "Arquivar {nome}?", description "Os itens saem do Orçamento. Os lançamentos antigos continuam.", confirm "Arquivar". Call the existing `criarCategoriaAction`, `renomearCategoriaAction`, and `arquivarCategoriaAction`. Do not reimplement name validation. A refused name does not save and leaves the form open, showing the existing 041 message. An accepted name, including a rename to the current name, closes the form and moves focus to the row `categoria:{id}` on the next frame. Rename shows the type in a disabled `Select` and does not change it. A new name updates that category and the items of that type that used the old name. Another type and existing lançamentos stay. `revalidatePath("/app/ajustes", "layout")`. On an unexpected failure show "Não foi possível salvar. Os campos continuam preenchidos." and do not return `e.message`. In `e2e/orcamento.spec.ts`, expect the heading "Despesas fixas" at `/app/ajustes/categorias?tipo=F`, and expect the other three type names on the same page. Closed menus still expose no button named "Renomear"

**Checkpoint**: US2 testável. Lazer nasce sem item, "lazer" é recusado, e arquivar tira a categoria do Orçamento

---

## Phase 5: User Story 3 - Itens arquivados, só leitura (Priority: P1)

**Goal**: A mesma lista no menu e na aba, sem ação de trazer de volta.

**Independent Test**: Arquivar um item com lançamento e outro sem. Os dois aparecem na lista, o primeiro com "Histórico mantido" e o segundo com "Nenhum lançamento", sem ação de trazer de volta.

### Implementation for User Story 3

- [x] T011 [US3] In `src/components/categorias-tela.tsx` and `src/app/app/ajustes/categorias/page.tsx`, add the tab Itens arquivados. `/app/ajustes/categorias?aba=arquivados` and the tab render the same list. The menu row "Itens arquivados" is current on that query. Sentence: "Somente leitura. Arquivados não entram em novos lançamentos nem na lista ativa do Orçamento." Columns: Item, Tipo · grupo, Lançamentos. Tipo uses Receitas, Despesas fixas, Despesas variáveis, Anuais. Sort item names with `localeCompare` and `pt-BR`. If the item has any lançamento, the third column is "Histórico mantido". If it has none, "Nenhum lançamento". Empty list: "Nenhum item arquivado." plus the read-only sentence. There is no rename, archive, unarchive, delete, or reorder. Load lançamento existence only for the session `orcamentoId`. Another account's item is absent

**Checkpoint**: US3 testável. A lista é só leitura e a coluna distingue histórico de nenhum lançamento

---

## Phase 6: User Story 4 - Cartões (Priority: P1)

**Goal**: Apelido, fechamento, vencimento de 1 a 31, editar e desativar.

**Independent Test**: Adicionar Nubank com fechamento 2 e vencimento 9, ver "Fecha dia 2 · vence dia 9". Desativar, cancelar e ver o cartão ativo; confirmar e ver o cartão em Inativos, com o lançamento antigo no mesmo mês.

### Tests for User Story 4

- [x] T012 [P] [US4] Extend `src/domain/cartoes.test.ts` with failing cases. Fechamento 28 is accepted. Fechamento 29 and 0 are refused with "Dia de fechamento deve ser entre 1 e 28." Vencimento 31 is accepted. Vencimento 32 and 0 are refused with "Dia de vencimento deve ser entre 1 e 31." Empty fechamento and empty vencimento are null. Apelido "  Nubank  " is stored "Nubank". Apelido longer than 60 is "Apelido muito longo." Add `textoLinhaCartao`: both days → "Fecha dia 2 · vence dia 9"; only fechamento 2 → "Fecha dia 2"; no fechamento → "Sem dia de fechamento, a competência é o mês da compra."; no fechamento and vencimento 9 → that warning plus " · vence dia 9". Do not invent a missing day

### Implementation for User Story 4

- [x] T013 [US4] Make T012 pass from `src/domain/cartoes.ts`. Split the day caps: fechamento 1–28, vencimento 1–31. Keep apelido trim, collapsed inner spaces, and max 60. Do not change `src/app/api/v1/cartoes/route.ts`
- [x] T014 [US4] Add `atualizarCartao` in `src/application/cartoes.ts` and `atualizarCartaoAction` in `src/app/actions/cartoes.ts`. Validate with `validateCreateCartao`. Update apelido, diaFechamento, diaVencimento, instituicao, and ultimos4 on the card of that `orcamentoId` only. Do not change `ativo`. Do not update lançamentos. A missing card is not found. `revalidatePath("/app/ajustes", "layout")`. Unexpected failures return "Não foi possível salvar. Os campos continuam preenchidos." and not `e.message`. Keep `inativarCartao`
- [x] T015 [US4] Add `src/app/app/ajustes/cartoes/page.tsx` and `src/components/cartoes-tela.tsx`. Page sentence: "Use o dia de fechamento para definir em qual fatura cada compra entra." An active card shows apelido, `textoLinhaCartao`, Editar, and Desativar. An inactive card is under Inativos with "não aparece em novos lançamentos" and has no edit, delete, or reactivate. Empty active list: "Nenhum cartão ativo." Adicionar cartão stays available. The form is `FormularioContainer` with `folhaNaEstreita` and `Campo` `teclado="numerico"` for the days and the last four. Empty apelido: "Informe o apelido do cartão." Incomplete last four: "Últimos 4 dígitos: informe exatamente 4 números." Instituição is optional. A refused value does not save and leaves the form open. Success closes the form and focuses `cartao:{id}`. With a fechamento, show "Compra no dia do fechamento entra na fatura do mês seguinte. Alguns bancos tratam esse dia de outro jeito." and "Vale para compras novas. As que já estão lançadas permanecem no mês em que foram gravadas." Without a fechamento, show "Sem dia de fechamento, a competência é o mês da compra." Deactivate uses `Dialogo`: "Desativar {apelido}?" and "O cartão sai dos pagamentos novos. Lançamentos antigos permanecem." Cancel leaves it active. Confirm calls `inativarCartaoAction`. Extend `e2e/ajustes.spec.ts`: open the card form, enter vencimento 32, and assert the refusal text with the form still open and no new card

**Checkpoint**: US4 testável. Vencimento 31 grava, 32 não grava, e desativar não apaga o lançamento

---

## Phase 7: User Story 5 - Limite global (Priority: P1)

**Goal**: Um inteiro de 1 a 100, sem lista por categoria.

**Independent Test**: Com o limite em 80, tentar salvar 150 e ver a mensagem, com o alerta do mês ainda em 80. Salvar 100 e ver a frase passar a "Preventivo em 100% do planejado."

### Tests for User Story 5

- [x] T016 [P] [US5] Add a failing test in `src/application/limites.test.ts` using the PGlite harness style of `src/application/categorias.test.ts`. Seed `limites_alerta` with `global_pct` 80 and `cats_json` `{"Habitação":70}`. Saving the global value 100 updates `global_pct` to 100 and leaves `cats_json` exactly `{"Habitação":70}`. Do not call the old `saveLimites` path that replaces cats

### Implementation for User Story 5

- [x] T017 [US5] Add `salvarLimiteGlobal` in `src/application/limites.ts` so T016 passes. It writes only `globalPct` for that `orcamentoId` after `validarLimitePct`. It does not read or write `catsJson`. Add `salvarLimiteGlobalAction` in `src/app/actions/limites.ts` that accepts only the global integer. Do not pass `cats: {}` into `saveLimites`. `revalidatePath` for `/app/ajustes`, `/app/resumo`, and `/app/orcamento`. Unexpected failures return "Não foi possível salvar. Os campos continuam preenchidos." and not `e.message`. Leave `ERRO_LIMITE_PCT` and `limiteDaCategoria` unchanged
- [x] T018 [US5] Add `src/app/app/ajustes/limites/page.tsx` and `src/components/limites-tela.tsx`. Show "Preventivo em {n}% do planejado. O valor é um inteiro de 1 a 100.", `Campo` "Limite global (%)" with `teclado="numerico"`, the support "Os alertas valem para todos os itens com plano definido.", and the button "Salvar limites". Do not list per-category limits. An integer from 1 to 100 inclusive saves and shows "Limites salvos." Zero, 101, 150, a fraction, text, or empty does not call the action, keeps the typed value, and shows "Fora de 1 a 100. O valor salvo foi mantido." Reopening the page shows the saved integer again

**Checkpoint**: US5 testável. 150 não substitui 80, e o JSON por categoria continua no banco

---

## Phase 8: User Story 6 - Exportar (Priority: P1)

**Goal**: CSV e JSON da própria conta, com uma frase de recusa por vez.

**Independent Test**: Exportar uma conta sem movimento e ver a frase, sem arquivo. Exportar uma conta com um lançamento de R$ 10,50 e receber o arquivo completo, só dessa conta, com os 50 centavos.

### Implementation for User Story 6

- [x] T019 [US6] Add `src/app/app/ajustes/exportar/page.tsx` and `src/components/exportar-tela.tsx`. Show "O arquivo é gerado no seu navegador e você escolhe onde salvar." CSV support: "Orçamento e lançamentos, para abrir no Excel ou no Planilhas Google." Button "Exportar CSV". JSON support: "Cópia completa para backup ou análise." Button "Exportar JSON". Call the existing export actions. When there is no lançamento and every plan month is zero, show `MSG_SEM_MOVIMENTO` ("Não havia movimento para exportar.") and download nothing. When generation does not finish, show `MSG_ARQUIVO_INCOMPLETO` ("Arquivo incompleto não é compartilhado.") and download no partial file. Never show both sentences at once. Do not add "Tente de novo." With movement, download the file the export already builds, for this account only, cents preserved. Do not build a second exporter

**Checkpoint**: US6 testável. Sem movimento não há arquivo. Com movimento, os centavos continuam os da exportação atual

---

## Phase 9: User Story 7 - Dados de exemplo (Priority: P1)

**Goal**: Dois toques. O primeiro não grava.

**Independent Test**: No catálogo padrão, tocar uma vez e ver o plano de Salário intacto. Confirmar e ver "Exemplo aplicado: 12 itens tiveram o plano preenchido. Nenhum lançamento foi criado." e Salário em R$ 6.500,00 nos doze meses, sem lançamento novo.

### Implementation for User Story 7

- [x] T020 [US7] Add `src/app/app/ajustes/exemplo/page.tsx` and `src/components/exemplo-tela.tsx`. Intro: "Preenche o planejamento de alguns itens com valores ilustrativos. Não cria lançamentos e só roda se você confirmar." The first press of "Carregar exemplo" does not call `carregarExemploAction`. It shows "Confirmar exemplo?" and "Toque de novo para confirmar. Seus planos atuais serão substituídos nos itens do exemplo." and the button becomes "Confirmar exemplo". The second press calls the existing action. Success shows "Exemplo aplicado: {n} itens tiveram o plano preenchido. Nenhum lançamento foi criado." Failure shows "Não foi possível aplicar o exemplo." and does not change plans. Do not return `e.message`. Leaving the page unmounts the armed state. Do not change `applyExamplePlans`. In `e2e/resumo.spec.ts`, seed from `/app/ajustes/exemplo` with "Carregar exemplo" then "Confirmar exemplo", and expect text matching "Exemplo aplicado:" instead of "itens atualizados"

**Checkpoint**: US7 testável. O primeiro toque não grava. O Resumo volta a semear a conta demo

---

## Phase 10: User Story 8 - Excluir a conta (Priority: P1)

**Goal**: Dois passos. Só EXCLUIR em maiúsculas apaga, na hora.

**Independent Test**: No segundo passo, digitar "excluir" e ver o botão inativo e a frase de erro, com a conta intacta. Digitar EXCLUIR numa conta de teste, confirmar e ver a sessão encerrada, sem prazo de espera.

### Tests for User Story 8

- [x] T021 [P] [US8] Add a failing test in `src/domain/exclusao-conta.test.ts` for `confirmarFraseExclusao`. "EXCLUIR" and " EXCLUIR " confirm. "" , "excluir", "Excluir", and "EXCLUIR agora" do not. Empty is a distinct result from a different phrase, so the screen can hide the error when the field is empty

### Implementation for User Story 8

- [x] T022 [US8] Implement `confirmarFraseExclusao` in `src/domain/exclusao-conta.ts` so T021 passes. Trim only the ends. The match is case-sensitive. Change `excluirContaAction` in `src/app/actions/conta.ts` to use that function and delete the `toUpperCase` check. A refused phrase deletes nothing. Success still deletes the user immediately, with no 30-day wait, and signs the session out. Unexpected failures return "Não foi possível excluir a conta." and not `e.message`. The session remains on failure
- [x] T023 [US8] Add `src/app/app/ajustes/excluir/page.tsx` and `src/components/excluir-tela.tsx`. Step 1 shows "Excluir a conta remove o orçamento, lançamentos, cartões e limites. Não há como desfazer." and a button to step 2. Step 2 shows "Digite a frase para liberar a exclusão definitiva." and `Campo` "Digite EXCLUIR para confirmar". Cancel returns to step 1, clears the field, and deletes nothing. "Excluir definitivamente" is enabled only when the phrase confirms. An empty field leaves it disabled and shows no error. Any other phrase leaves it disabled and shows "Frase diferente não apaga. Digite EXCLUIR para confirmar." Confirm on success assigns `/login`. Do not add a Playwright test that deletes `demo@local.test`

**Checkpoint**: US8 testável. "excluir" não apaga. EXCLUIR apaga na hora e encerra a sessão

---

## Phase 11: User Story 9 - Falha, teclado e leitura (Priority: P2)

**Goal**: Sem vazio falso, com foco visível e frases de falha estáveis.

**Independent Test**: Abrir o diálogo de sair pelo teclado, ver o foco dentro dele, cancelar e ver o foco voltar a Sair da conta. Provocar a falha de carregar e ver "Não foi possível carregar." sem uma lista vazia falsa.

### Implementation for User Story 9

- [x] T024 [US9] Extend `e2e/ajustes.spec.ts`: from the keyboard, open "Sair da conta", assert focus is inside the dialog, cancel, and assert focus returns to "Sair da conta". In `src/components/conta-tela.tsx`, `src/components/categorias-tela.tsx`, `src/components/cartoes-tela.tsx`, and `src/components/excluir-tela.tsx`, closing a form or dialog without saving returns focus to the opener. A successful category or card save focuses the saved row, not the opener. Audit `src/app/actions/categorias.ts`, `src/app/actions/cartoes.ts`, `src/app/actions/limites.ts`, `src/app/actions/catalog.ts`, and `src/app/actions/conta.ts` so a thrown error shown to the person is one of "Não foi possível salvar. Os campos continuam preenchidos.", "Não foi possível aplicar o exemplo.", or "Não foi possível excluir a conta.", never `e.message`. Do not add a new animation. The reduced-motion rule already in `packages/design-system/src/web/base.css` covers the panel, the dialog, and the theme change

**Checkpoint**: US9 testável. O foco entra no diálogo e volta a quem abriu. A falha não mostra a mensagem crua

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: A suite inteira fecha sem ressuscitar o sanfona

- [x] T025 [P] Confirm the new files under `src/app/app/ajustes/` and `src/components/*-tela.tsx` do not import `@material/web`, `ajustes-cards`, `cartoes-panel`, `limites-panel`, `excluir-conta-panel`, `carregar-exemplo-button`, `export-panel`, the import panels, or `competencia-simulador`. Those files remain on disk
- [x] T026 Run the checks in `specs/047-ajustes-web/quickstart.md`: `npm test -- src/domain/cartoes.test.ts src/domain/iniciais.test.ts src/domain/exclusao-conta.test.ts src/application/limites.test.ts`, `npx playwright test e2e/ajustes.spec.ts e2e/casca.spec.ts e2e/orcamento.spec.ts e2e/resumo.spec.ts`, and `npx tsc --noEmit`. Do not delete the demo account during the run

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: começa imediata
- **Foundational (Phase 2)**: depende de T001 e bloqueia todas as histórias
- **User stories**: dependem da Phase 2
- **Polish**: depende das histórias que forem entrar na entrega

### User Story Dependencies

- **US1 (P1)**: depois da Phase 2. Não depende das outras histórias. MVP
- **US2 (P1)**: depois da Phase 2. Substitui o miolo de `categorias/page.tsx`. Não depende de Conta
- **US3 (P1)**: depois de US2, porque edita `src/components/categorias-tela.tsx`
- **US4 (P1)**: depois da Phase 2. Arquivos próprios. O menu de US1 só precisa existir para o clique; a rota pode ser aberta direto
- **US5 (P1)**: depois da Phase 2. Independente de US4
- **US6 (P1)**: depois da Phase 2. Não cria exportador novo
- **US7 (P1)**: depois da Phase 2. `e2e/resumo.spec.ts` só volta a ficar verde aqui
- **US8 (P1)**: depois da Phase 2. A action antiga aceita `excluir` até T022
- **US9 (P2)**: depois de US1 e das telas que gravam (US2, US4, US5, US7, US8), porque revisa o foco e as frases dessas telas

### Within Each User Story

- O teste falha antes da implementação
- A regra pura vem antes da action
- A action vem antes da tela
- A história fecha antes da próxima que edita o mesmo arquivo

### Parallel Opportunities

- T002, T003 e T004 em paralelo
- T005 e T006 em paralelo; T007 e T008 em paralelo depois deles
- Depois da Phase 2, US1, US2, US4, US5, US6, US7 e US8 podem seguir em arquivos diferentes
- US3 espera US2
- US9 espera as telas que revisa

---

## Parallel Example: User Story 1

```bash
# Testes da US1 juntos, depois da Phase 2:
# src/domain/iniciais.test.ts
# e2e/ajustes.spec.ts (menu, Conta, cancelar Sair)

# Implementação em paralelo, sem compartilhar arquivo:
# src/domain/iniciais.ts
# src/components/casca-app.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1
2. Completar Phase 2
3. Completar Phase 3 (US1)
4. **PARAR E VALIDAR**: os dois grupos, sem Importar e sem Simulador; Escuro continua depois de recarregar; cancelar Sair mantém a sessão; a casca não tem Sair
5. Seguir para categorias

### Incremental Delivery

1. Setup + Foundational
2. US1 menu, tema e Sair
3. US2 categorias e US3 arquivados, nessa ordem
4. US4 cartões, US5 limite, US6 exportar, US7 exemplo e US8 exclusão
5. US9 foco e frases de falha
6. Quickstart

### Parallel Team Strategy

1. Uma pessoa fecha Setup e Foundational
2. Em seguida, pessoas diferentes podem pegar US1, US2, US4, US5, US6, US7 e US8
3. US3 entra quando `categorias-tela.tsx` existir
4. US9 é a última, porque atravessa as telas

---

## Notes

- [P] = outro arquivo, sem depender de tarefa incompleta
- O status da spec precisa estar `ready` antes de T002
- Não apagar a conta demo no Playwright
- `e2e/orcamento.spec.ts` fica vermelho de T004 até T010
- `e2e/resumo.spec.ts` fica vermelho de T004 até T020
- Parar em qualquer checkpoint e testar a história sozinha
