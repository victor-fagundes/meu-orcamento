---

description: "Task list for 023 Material Design"
---

# Tasks: Material Design

**Input**: Design documents from `/specs/023-material-design/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Não há teste novo. O aceite é o quickstart no navegador. `npm test` só precisa continuar verde.

**Organization**: US1 casca (P1, MVP). US2 Resumo (P1). US3 Novo lançamento global (P1). US4 Orçamento (P2). US5 Ano, Ajustes e entrada (P2).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (outro arquivo, sem depender de tarefa incompleta)
- **[Story]**: US1, US2, US3, US4, US5
- Cada tarefa cita o arquivo

## Path Conventions

- Tema e registro: `src/app/material-theme.css`, `src/components/material/register.tsx`, `src/components/material/sheet.tsx`
- Casca: `src/app/layout.tsx`, `src/app/app/layout.tsx`, `src/components/app-nav.tsx`, `src/components/app-chrome.tsx`, `src/app/globals.css`
- Telas: `src/components/resumo-dashboard.tsx`, `src/components/orcamento-view.tsx`, `src/components/lancamentos-view.tsx`, `src/components/ano-view.tsx`
- Formulários: `src/components/novo-lancamento-sheet.tsx`, `src/components/editar-lancamento-sheet.tsx`, `src/components/plano-sheet.tsx`, `src/components/novo-item-sheet.tsx`
- Entrada e ajustes: `src/app/page.tsx`, `src/app/login/page.tsx`, `src/app/cadastro/page.tsx`, `src/app/esqueci-senha/page.tsx`, `src/app/app/ajustes/page.tsx` e os painéis em `src/components/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Instalar o design system oficial e gravar a paleta

- [x] T001 Add `@material/web` to `package.json` and install it
- [x] T002 [P] Set `transpilePackages` to `["@material/web", "lit"]` in `next.config.ts`
- [x] T003 [P] Write light and dark `--md-sys-color-*` roles in `src/app/material-theme.css`: action color in the `#0057B8` family, yellow `#FFE600` only for brand, preventive alert and the Realizado series, surfaces not navy
- [x] T004 Load Material Symbols with `next/font` and import the client registry from `src/components/material/register.tsx` in `src/app/layout.tsx` (server components must not import `@material/web`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Tokens no documento e o wrapper de formulário que todas as histórias usam

**⚠️ CRITICAL**: Nenhuma história começa antes desta fase

- [x] T005 Import `src/app/material-theme.css` from `src/app/globals.css` and point page background and text at those tokens, including `prefers-color-scheme` with no theme switch in Ajustes
- [x] T006 Create `src/components/material/sheet.tsx`: `md-dialog` at ≥720px, bottom sheet with handle below 720px, Escape, outside click and focus return without persisting

**Checkpoint**: Pacote, tema e sheet prontos. As histórias podem começar.

---

## Phase 3: User Story 1 - Reconhecer o app e mudar de seção (Priority: P1) 🎯 MVP

**Goal**: Casca Material nas cinco seções, no largo e no estreito, no claro e no escuro

**Independent Test**: Entrar em janela larga e estreita, nos dois temas, e percorrer Resumo, Orçamento, Lançamentos, Ano e Ajustes. A seção ativa é a da URL.

### Implementation for User Story 1

- [x] T007 [US1] Restyle the five `Link`s in `src/components/app-nav.tsx`: wide tabs with a blue indicator, narrow bar with icon plus name and an active pill, breakpoint 720px, no initial-letter pill
- [x] T008 [US1] Add `src/components/app-chrome.tsx` with a filled “Novo lançamento” button on wide and a floating button with that label on narrow, mounted from `src/app/app/layout.tsx` (opening the form is US3)
- [x] T009 [US1] Remove the navy top bar (`--tb` background) from `src/app/globals.css` so the bar uses the theme surface and the yellow mark stays only on the brand in `src/components/brand-logo.tsx`

**Checkpoint**: US1 visível sozinha. O botão ainda pode não abrir o formulário.

---

## Phase 4: User Story 2 - Ler o mês no Resumo (Priority: P1)

**Goal**: “Ainda pode gastar” em destaque, com filtros, alerta e gráficos da spec 012

**Independent Test**: Abrir o Resumo de um mês com plano e gasto e conferir os mesmos números de hoje, com a hierarquia nova.

### Implementation for User Story 2

- [x] T010 [P] [US2] In `src/components/resumo-dashboard.tsx`, make “Ainda pode gastar” the primary block, keep total orçado and total gasto smaller, show “—” for those two when payment is not Todas, cap the donut at four categories plus “Outros”, legend with percent, bars with planejado in blue and realizado in yellow labeled Receitas, Fixas, Variáveis and Anuais, and point “Ver detalhes” at `/app/orcamento` for that type and month
- [x] T011 [P] [US2] In `src/components/alert-banner.tsx`, paint a preventive alert (from 80% of planned) yellow and an overrun in the error color

**Checkpoint**: US1 e US2 funcionam juntos. O cálculo do Resumo não muda.

---

## Phase 5: User Story 3 - Lançar sem mudar a regra (Priority: P1)

**Goal**: Novo lançamento em qualquer seção, com os mesmos campos e a mesma action

**Independent Test**: Salvar pela casca e ver o mesmo valor e a mesma competência na lista. Escape não grava.

### Implementation for User Story 3

- [x] T012 [US3] In `src/app/app/layout.tsx`, load `listItensAtivosParaLancamento` and `listCartoesAtivos` for the session and pass them to `src/components/app-chrome.tsx`
- [x] T013 [US3] Open `src/components/novo-lancamento-sheet.tsx` inside `src/components/material/sheet.tsx` from the chrome button; suggested month is a valid `mes` query or the current month; initial same-name item still follows spec 022; confirm still calls `criarLancamentoAction`
- [x] T014 [P] [US3] Replace buttons and fields in `src/components/novo-lancamento-sheet.tsx` and `src/components/editar-lancamento-sheet.tsx` with `@material/web` controls, keeping the same labels, options and values
- [x] T015 [US3] In `src/components/lancamentos-view.tsx`, drop the local “Novo” button, and restyle search, row, edit, delete and undo with the same controls

**Checkpoint**: Lançar pelo Resumo grava igual a lançar pela lista.

---

## Phase 6: User Story 4 - Acompanhar o Orçamento (Priority: P2)

**Goal**: Chips, barra de consumo e grupos no visual novo, com os mesmos reais

**Independent Test**: Abrir Despesas fixas, expandir um grupo entre 80% e 100% e outro acima de 100%.

### Implementation for User Story 4

- [x] T016 [P] [US4] In `src/components/orcamento-view.tsx`, use filter chips Receitas, Fixas, Variáveis and Anuais, official progress capped at 100% visual (yellow from 80% through 100%, error above 100%), and keep expand, plan and new-item actions
- [x] T017 [P] [US4] Move `src/components/plano-sheet.tsx` and `src/components/novo-item-sheet.tsx` onto `src/components/material/sheet.tsx` with official fields and the same inputs as today

**Checkpoint**: Orçamento lê os mesmos centavos. Os dois sheets locais abrem no formato largo ou estreito.

---

## Phase 7: User Story 5 - Ano, Ajustes e entrada (Priority: P2)

**Goal**: O resto das telas no mesmo visual, sem mudar o que cada ação grava

**Independent Test**: Ano continua tabela. Cancelar uma prévia de importação não grava. Login com senha errada não entra.

### Implementation for User Story 5

- [x] T018 [P] [US5] In `src/components/ano-view.tsx`, use chips Planejado and Realizado and keep the month-column table with horizontal scroll below 720px
- [x] T019 [P] [US5] Restyle fields and the primary button in `src/app/page.tsx`, `src/app/login/page.tsx`, `src/app/cadastro/page.tsx` and `src/app/esqueci-senha/page.tsx`; keep the brand panel on wide login
- [x] T020 [US5] Restyle controls in `src/app/app/ajustes/page.tsx`, `src/components/cartoes-panel.tsx`, `src/components/limites-panel.tsx`, `src/components/import-planilha-panel.tsx`, `src/components/import-pdf-panel.tsx`, `src/components/export-panel.tsx`, `src/components/carregar-exemplo-button.tsx` and `src/components/excluir-conta-panel.tsx` without changing each flow; EXCLUIR still required to delete the account

**Checkpoint**: As cinco histórias estão na pele nova. Importar, exportar e excluir seguem as regras atuais.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Tirar o visual antigo e cumprir o quickstart

- [x] T021 Remove unused `auth-btn` and `sheet-field` rules from `src/app/globals.css` after no component still references those classes
- [x] T022 Run `npm test` and keep the existing domain suite green
- [x] T023 Walk `specs/023-material-design/quickstart.md` in the browser at wide, narrow, light and dark

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: começa agora. T002 e T003 em paralelo depois que T001 existir no `package.json`. T004 depende de T001.
- **Foundational (Phase 2)**: depende do Setup. Trava as histórias.
- **User stories (Phase 3+)**: dependem da Phase 2. US2 pode seguir em paralelo com US1. US3 depende do botão da US1 (T008) e do sheet (T006). US4 depende do sheet (T006). US5 depende dos tokens (T005).
- **Polish**: depois das histórias desejadas. Para fechar a spec, depois das cinco.

### User Story Dependencies

- **US1 (P1)**: depois da Phase 2. Não depende de outra história.
- **US2 (P1)**: depois da Phase 2. Não depende da US1 para o número, só para a casca ficar coerente.
- **US3 (P1)**: depois de T006 e T008. Não muda a action.
- **US4 (P2)**: depois de T006. Independente da US2 e da US3.
- **US5 (P2)**: depois de T005. Independente das outras histórias.

### Parallel Opportunities

- T002 e T003 em paralelo.
- T010 e T011 em paralelo.
- T016 e T017 em paralelo.
- T018 e T019 em paralelo; T020 em seguida porque vários painéis compartilham o mesmo tipo de controle.
- Um único implementador segue P1 → P2. Não há segundo dev previsto.

---

## Parallel Example: User Story 2

```bash
Task: "T010 Resumo em src/components/resumo-dashboard.tsx"
Task: "T011 Alerta em src/components/alert-banner.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 e Phase 2
2. Phase 3 (US1)
3. Parar e olhar a casca no largo, no estreito, no claro e no escuro
4. Seguir para US2 e US3 antes de chamar a história de pronta

### Incremental Delivery

1. Setup + foundation
2. US1 casca
3. US2 Resumo
4. US3 lançamento global
5. US4 Orçamento
6. US5 Ano, Ajustes e entrada
7. Polish e quickstart

Cada história deixa a anterior utilizável. Nenhuma mexe em `src/domain`.

---

## Phase 9: Correction — Bugbot 2026-11-16

- [x] T024 Pass `type="submit"` through Material buttons and add a native submit control so Enter submits login, cadastro and esqueci-senha (`src/components/material/ui.tsx`)
- [x] T025 Collapse the Resumo donut at five categories (`collapseDonutGroups` in `src/components/resumo-donut.ts`, AC-602.1 / FR-006)
- [x] T026 Restore sheet focus only when `open` changes, not when `onClose` identity changes (`src/components/material/sheet.tsx`, FR-010)
- [x] T027 Clear Novo lançamento draft when the sheet closes (`src/components/novo-lancamento-sheet.tsx`)

---

## Phase 10: Correction — design, a11y and Material audit 2026-11-16

- [x] T028 Choose wide dialog before paint, lock body scroll on the narrow sheet, trap Tab, and move focus into the form (`src/components/material/sheet.tsx`, FR-009, FR-010)
- [x] T029 Keep Orçamento tipo in sync with `?tipo=` so Ver detalhes opens the right chip (`src/components/orcamento-view.tsx`, FR-007)
- [x] T030 Put the desktop Novo lançamento icon in `slot="icon"` and stop duplicating the filter-chip label (`src/components/app-chrome.tsx`, `src/components/material/ui.tsx`, `src/components/material/icon.tsx`)
- [x] T031 Drive charts, Realizado and alert colors from Material roles, including dark mode (`src/app/material-theme.css`, `src/components/resumo-dashboard.tsx`, `src/app/globals.css`)
- [x] T032 Paint Material button labels with the role color, and make the home actions real links (`src/app/material-theme.css`, `src/components/material/ui.tsx`, `src/app/page.tsx`)

---

## Notes

- Sem tarefa de teste novo. Sem tarefa de domínio.
- GAP-003 e o anúncio de Arquivar ficam de fora.
- O protótipo `prototype/Meu_Orcamento_material.html` é a referência visual, não a massa de dados.
