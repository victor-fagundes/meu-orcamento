---

description: "Task list for 042 Shell da aplicação"
---

# Tasks: Shell da aplicação

**Input**: Design documents from `/specs/042-shell-web/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Vitest da aba e Playwright da casca, pedidos em plan.md e em quickstart.md.

**Organization**: US1 cinco áreas (P1, MVP). US2 lateral e inferior (P1). US3 Ajustes marcado (P1). US4 título, mês e sem flutuante (P1). US6 nome, foco e movimento (P1). US5 grade (P2).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (outro arquivo, sem depender de tarefa incompleta)
- **[Story]**: US1, US2, US3, US4, US5, US6
- Cada tarefa cita o arquivo

## Path Conventions

- Casca: `src/components/casca-abas.ts`, `src/components/casca-app.tsx`, `src/app/app/layout.tsx`
- Grade: `packages/design-system/src/web/base.css`
- Contrato: `specs/042-shell-web/contracts/casca.md`
- E2E: `e2e/casca.spec.ts`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Travar o escopo antes de trocar a casca logada

- [x] T001 Confirm `specs/042-shell-web/spec.md` status is `ready`. Edit only the files listed in `specs/042-shell-web/plan.md`. Do not edit `src/domain`. Do not delete `src/components/app-chrome.tsx`, `src/components/app-nav.tsx`, `src/app/globals.css`, or `@material/web`. Do not add a route

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: As cinco áreas e a função que escolhe a aba, usadas por todas as histórias

**⚠️ CRITICAL**: Nenhuma user story começa antes disto

- [x] T002 Add a failing test in `src/components/casca-abas.test.ts`. Expect five areas in this order, with these fields: `resumo` / Resumo / `/app/resumo` / `dashboard`; `orcamento` / Orçamento / `/app/orcamento` / `assignment`; `lancamentos` / Lançamentos / `/app/lancamentos` / `list`; `ano` / Ano / `/app/ano` / `calendar_month`; `ajustes` / Ajustes / `/app/ajustes` / `settings`. Every `pedeMes` is `false`. `abaAtiva('/app/resumo')` is `resumo`. `abaAtiva('/app/orcamento?mes=2026-11')` is `orcamento`. `abaAtiva('/app/ajustes')` and `abaAtiva('/app/ajustes/conta')` are `ajustes`. `abaAtiva('/app/foo')` is `''`. No import from Next, React, or Drizzle in the module under test
- [x] T003 Implement `AREAS` and `abaAtiva` in `src/components/casca-abas.ts` so `src/components/casca-abas.test.ts` passes. Ignore the query. A path that starts with `/app/ajustes` returns `ajustes`. Any other path returns the `id` whose `endereco` is a prefix, or `''`. Do not add a sixth area. Do not set `pedeMes` to `true`

**Checkpoint**: A aba de cada endereço está decidida sem renderizar a casca

---

## Phase 3: User Story 1 - A casca das cinco áreas (Priority: P1) 🎯 MVP

**Goal**: Quem entrou vê `ShellApp` com as cinco áreas, nesta ordem, no endereço que já usa. Quem não entrou não vê a casca.

**Independent Test**: Entrar na conta demo e abrir as cinco áreas. Sair da sessão e abrir `/app/resumo`: a navegação "Principal" não aparece.

### Tests for User Story 1

- [x] T004 [US1] Add a failing Playwright test in `e2e/casca.spec.ts`. Sign in at `/login` with `demo@local.test` / `demo1234` (fields E-mail and Senha, button Entrar). Expect the nav named Principal with Resumo, Orçamento, Lançamentos, Ano, Ajustes in that order. Choosing each opens `/app/resumo`, `/app/orcamento`, `/app/lancamentos`, `/app/ano`, `/app/ajustes`, with `aria-current="page"` on only that button. A fresh context opening `/app/resumo` lands on `/login` and does not show that nav

### Implementation for User Story 1

- [x] T005 [US1] Create `src/components/casca-app.tsx` (`'use client'`). Render `ShellApp` from `@meu-orcamento/design-system/web` with `abas` from `AREAS` (`id`, `rotulo`, `icone`), `ativa` from `abaAtiva(usePathname())`, and `onNavegar` calling `router.push` of that area's `endereco`. Pass `cabecalho` as the area `rotulo` for now. Do not import `@material/web`. Do not render `AppNav` or `AppChrome`
- [x] T006 [US1] In `src/app/app/layout.tsx`, keep `requireSessionOrcamento` and `SessionTelemetry`. Render `CascaApp` around `children`. Remove the `AppChrome` render and the item and cartão fetch used only by it. Do not delete `src/components/app-chrome.tsx`

**Checkpoint**: US1 testável. As cinco áreas abrem. A sessão anônima cai em `/login`

---

## Phase 4: User Story 2 - Lateral no largo, inferior no estreito (Priority: P1)

**Goal**: A partir de 720 px só a lateral de 240 px. Abaixo disso só a inferior de 76 px. Uma barra.

**Independent Test**: Em 1280 px e em 720 px a nav mede 240 px de largura. Em 719 px e em 390 px ela mede 76 px de altura e não há lateral. Estreitar com Orçamento aberto não troca a aba.

### Tests for User Story 2

- [x] T007 [US2] Extend `e2e/casca.spec.ts`. At viewports 1280 and 720, the nav box width is 240 and it is not pinned to the bottom. At 719 and 390, the nav box height is 76 and its width is the viewport, not 240. There is one nav named Principal. With Orçamento open, going from 1280 to 390 keeps `aria-current="page"` on Orçamento

### Implementation for User Story 2

- [x] T008 [US2] Keep a single nav in `packages/design-system/src/web/base.css`: below 720 px, `.mo-shell__nav .mo-nav` is fixed to the bottom with `height: var(--bottom-bar-height)` and row direction; inside `@media (min-width: 720px)`, it is sticky with `width: var(--sidebar-width)` and column direction. Do not add a second `<nav>` in `src/components/casca-app.tsx`. Do not add a token in `packages/design-system/src/core/tokens.ts`. The media query stays `min-width: 720px`

**Checkpoint**: US2 testável nas quatro larguras, sem outra história

---

## Phase 5: User Story 3 - Ajustes continua a área atual (Priority: P1)

**Goal**: Qualquer caminho sob `/app/ajustes` marca só Ajustes. Continuam cinco abas.

**Independent Test**: Abrir `/app/ajustes` em 1280 px e em 390 px. Só o botão Ajustes tem `aria-current="page"`. A nav tem cinco botões.

### Tests for User Story 3

- [x] T009 [US3] Extend `e2e/casca.spec.ts`. Signed in, open `/app/ajustes` at 1280 and at 390. The only `aria-current="page"` button is Ajustes. The nav still has exactly five buttons. The unit case `/app/ajustes/conta` stays in `src/components/casca-abas.test.ts`

**Checkpoint**: US3 testável. Não há sexta aba

---

## Phase 6: User Story 4 - Título, mês e lugar de criar (Priority: P1)

**Goal**: O cabeçalho mostra o título. Mês só se `pedeMes` for verdadeiro. Nesta história os cinco permanecem falsos. Não há botão flutuante. "Sair" continua.

**Independent Test**: Nas cinco áreas, em 1280 px e em 390 px, há o título, não há "Mês anterior" nem "Próximo mês", não há botão flutuante. "Sair" abre `/login`.

### Tests for User Story 4

- [x] T010 [US4] Add a failing case in `src/components/casca-abas.test.ts`. For each of the five areas, the header helper returns no month controls. For a copy of Resumo with `pedeMes: true` and mês `2026-11`, it returns rótulo from `labelCompetencia`, anterior `2026-10`, and próximo `2026-12`. Do not set the five `pedeMes` flags to `true`

### Implementation for User Story 4

- [x] T011 [US4] Add the header helper in `src/components/casca-abas.ts`. When `pedeMes` is false, return no `navegacaoMes`. When true, rótulo is `labelCompetencia` and the shift is `shiftCompetencia` from `src/lib/competencia-nav.ts`, writing `?mes=`. Do not edit `src/domain/competencia.ts`. Leave the five flags `false`
- [x] T012 [US4] In `src/components/casca-app.tsx`, render `CabecalhoTela` with the area `titulo` and pass `navegacaoMes` only when the helper returns it. Add `Botao` variante `texto` labeled Sair, outside the five tabs, calling `authClient.signOut()` then `window.location.assign('/login')` as `src/components/sign-out-button.tsx` does, with no dialog. Do not render `NovoLancamentoSheet`, a control named "Novo lançamento", or an element with class `fab`
- [x] T013 [US4] Extend `e2e/casca.spec.ts`. On each of the five areas, at 1280 and 390, the area title is visible, buttons named "Mês anterior" and "Próximo mês" are absent, and no floating create button is visible. Sair ends on `/login`

**Checkpoint**: US4 testável. O mês da casca permanece desligado. Criar flutuante não está

---

## Phase 7: User Story 6 - Ler e usar a casca (Priority: P1)

**Goal**: Cada controle tem nome, o foco chega nas cinco áreas, e a troca não anima.

**Independent Test**: Tab percorre um skip link "Ir para o conteúdo" e as cinco áreas. Com `prefers-reduced-motion`, `--motion-fast` é 0 ms.

### Tests for User Story 6

- [x] T014 [US6] Extend `e2e/casca.spec.ts`. The first tab stop includes the link "Ir para o conteúdo", and keyboard focus can open each of the five area buttons. Under `prefers-reduced-motion: reduce`, the computed `--motion-fast` on the document is `0ms`. Do not assert a route-transition animation

### Implementation for User Story 6

- [x] T015 [US6] In `src/components/casca-app.tsx`, add the skip link "Ir para o conteúdo" pointing at `id="conteudo"` on the shell content. Do not add a CSS transition or view transition for the area change in `src/components/casca-app.tsx` or `packages/design-system/src/web/base.css`. Leave icon SVGs `aria-hidden` inside `packages/design-system/src/web/navegacao-principal.tsx`

**Checkpoint**: US6 testável pelo teclado, no claro e no escuro já aplicados pela página

---

## Phase 8: User Story 5 - O conteúdo cabe na grade (Priority: P2)

**Goal**: No largo, miolo de no máximo 960 px, 12 colunas, margem 40, espaço 24. No estreito, 4 colunas, margem 16, espaço 16. O fim rola acima da barra.

**Independent Test**: Em 1280 px o miolo das colunas não passa de 960 px e a margem lateral é 40 px. Em 390 px a margem é 16 px e o fim do conteúdo fica acima da barra.

### Tests for User Story 5

- [x] T016 [US5] Extend `e2e/casca.spec.ts`. At 1280, the content box's horizontal padding is 40 and the inner column width is at most 960. At 390, the horizontal padding is 16 and the content's padding-bottom is at least 76. A direct child spans the full grid width

### Implementation for User Story 5

- [x] T017 [US5] Update `.mo-shell__conteudo` and `.mo-shell__cabecalho` in `packages/design-system/src/web/base.css` using only existing variables. Below 720 px: `repeat(var(--grid-columns-mobile), minmax(0, 1fr))`, `padding-inline: var(--grid-margin-mobile)`, `column-gap: var(--grid-gutter-mobile)`, `padding-bottom: var(--bottom-bar-height)`. From 720 px: 12 columns via `--grid-columns-desktop`, margin `--grid-margin-desktop`, gap `--grid-gutter-desktop`, padding-bottom 0. The box `max-width` is `calc(var(--content-max-width) + 2 * var(--grid-margin-desktop))` with `box-sizing: border-box` and `margin-inline: auto`, so the columns stay within 960 px. Direct children use `grid-column: 1 / -1`. The header uses the same lateral margin and, from 720 px, the same max-width. Do not add a token. Do not put a raw px length on a new property except the existing `min-width: 720px` media query

**Checkpoint**: US5 testável. O miolo atual continua na largura inteira das colunas

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Fechar o quickstart e o limite do diff

- [x] T018 Run the commands in `specs/042-shell-web/quickstart.md`: `npm test -- src/components/casca-abas.test.ts`, `npx playwright test e2e/casca.spec.ts`, and `npx tsc --noEmit`
- [x] T019 [P] Confirm the diff does not touch `src/domain`, does not delete `src/components/app-chrome.tsx` or `src/app/globals.css`, and adds no `console.log`, `any`, or `@material/web` import in `src/components/casca-app.tsx` or `src/components/casca-abas.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Começa já
- **Foundational (Phase 2)**: Depende de T001. Bloqueia as user stories
- **User stories (Phase 3+)**: Dependem da Phase 2
- **Polish (Phase 9)**: Depende das stories que forem entrar na entrega

### User Story Dependencies

- **US1 (P1)**: Depois da Phase 2. Não depende das outras. MVP
- **US2 (P1)**: Depois da US1, porque o E2E mede a nav que `ShellApp` monta. O CSS em `base.css` não espera a US5
- **US3 (P1)**: Depois da Phase 2 para a regra de prefixo. O E2E espera a casca da US1
- **US4 (P1)**: Depois da US1, porque troca o cabeçalho em `src/components/casca-app.tsx`
- **US6 (P1)**: Depois da US4, no mesmo `casca-app.tsx`
- **US5 (P2)**: Depois da US2, porque as duas editam `packages/design-system/src/web/base.css`

### Within Each User Story

- O teste da story falha antes da implementação, quando a story tem os dois
- A função pura antes do componente
- O componente antes do layout
- A story fecha antes da próxima que mexe no mesmo arquivo

### Parallel Opportunities

- T002 e o restante do repo: o teste novo não depende de outra story
- Depois da Phase 2, a US5 não começa em paralelo com a US2: as duas escrevem `base.css`
- US3 pode ser lida em paralelo com a US2 só no teste de unidade já coberto por T003; o E2E de T009 espera T006
- T019 em paralelo com T018 (leitura do diff, sem esperar o resultado para começar)

---

## Parallel Example: User Story 1

```bash
# Sequência da US1; os três arquivos se encadeiam:
Task: "T004 e2e/casca.spec.ts — cinco áreas e anônimo em /login"
Task: "T005 src/components/casca-app.tsx — ShellApp"
Task: "T006 src/app/app/layout.tsx — CascaApp no lugar de AppChrome"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1: spec `ready` e escopo travado
2. Phase 2: cinco áreas e `abaAtiva`
3. Phase 3: US1
4. Parar e rodar o Playwright da US1
5. Quem entrou troca de área. Quem não entrou não vê a casca

### Incremental Delivery

1. Setup + Foundational
2. US1 → cinco áreas (MVP)
3. US2 → lateral e inferior
4. US3 → Ajustes marcado
5. US4 → título, sem mês, sem flutuante, Sair
6. US6 → skip link, teclado, menos movimento
7. US5 → grade
8. Phase 9

### Parallel Team Strategy

1. Phase 1 e Phase 2 juntos
2. Em seguida uma pessoa segue US1 → US2 → US4 → US6 → US5, porque compartilham `casca-app.tsx`, `e2e/casca.spec.ts` e `base.css`
3. A checagem de prefixo da US3 já está na Phase 2; o E2E entra depois da US1
4. Phase 9 quando as stories da entrega estiverem verdes

---

## Notes

- [P] = outro arquivo, sem depender de tarefa incompleta
- [USn] liga a tarefa à história da spec
- US6 fica antes da US5 porque é P1
- O teste novo falha antes do código que o faz passar
- `pedeMes` permanece `false` nas cinco áreas. O helper cobre o caso verdadeiro sem ligar o mês na tela
- Dois `h1` (cabeçalho e título que a página ainda desenha) ficam até a história daquela tela
- Dinheiro e `src/domain` não entram nesta história
