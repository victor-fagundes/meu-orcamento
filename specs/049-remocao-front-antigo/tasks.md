---

description: "Task list for 049 Remoção do front antigo"
---

# Tasks: Remoção do front antigo

**Input**: Design documents from `/specs/049-remocao-front-antigo/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Não há suíte nova. A prova reusa o Playwright de 042–048 e os comandos de `specs/049-remocao-front-antigo/quickstart.md`. Esses testes já passam. Não escreva um teste para falhar de propósito.

**Organization**: US1 seis áreas continuam (P1, MVP). US2 biblioteca antiga sai (P1). US3 aparelho permanece (P2).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (outro arquivo, sem depender de tarefa incompleta)
- **[Story]**: US1, US2, US3
- Cada tarefa cita o arquivo

## Path Conventions

- Layout e raiz: `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`
- Rotas que permanecem: `src/app/app/resumo/page.tsx`, `src/app/app/orcamento/page.tsx`, `src/app/app/lancamentos/page.tsx`, `src/app/app/ano/page.tsx`, `src/app/app/ajustes/page.tsx`, `src/app/login/page.tsx`, `src/app/cadastro/page.tsx`, `src/app/esqueci-senha/page.tsx`
- O que sai: `src/components/material/`, `src/types/material-web.d.ts`, `src/app/material-theme.css`, e os componentes listados em T006
- Config: `next.config.ts`, `package.json`, `package-lock.json`
- Contrato: `specs/049-remocao-front-antigo/contracts/front-web.md`
- Aparelho: `android/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Travar o escopo antes de apagar o front antigo

- [x] T001 Confirm `specs/049-remocao-front-antigo/spec.md` status is `ready` before editing product code. Edit only the files listed in `specs/049-remocao-front-antigo/plan.md`. Do not add a table, a column, or a migration. Do not edit `src/domain`, `src/lib/auth.ts`, or anything under `src/app/api/`. Do not restyle the six areas. Do not edit `android/`, `postcss.config.mjs`, or the Tailwind packages. Do not add `console.log`, `any`, or a raw hex/`px`/`rem`/`dp` style in `src/app` or `src/components`. Keep routes `/app/resumo`, `/app/orcamento`, `/app/lancamentos`, `/app/ano`, `/app/ajustes`, `/login`, `/cadastro`, and `/esqueci-senha`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: O estilo global deixa o tema antigo sem mudar a margem nem o fundo das telas novas

**⚠️ CRITICAL**: Nenhuma user story começa antes disto

- [x] T002 Replace `src/app/globals.css` with only this reset, and delete every other rule in that file, including `@import "./material-theme.css"` and `@import "tailwindcss"`: `* { box-sizing: border-box; }` and `body { margin: 0; background: var(--md-surface); color: var(--md-text); font-family: var(--font-family); -webkit-font-smoothing: antialiased; }`. Do not add a hex color or a `px`/`rem`/`dp` length. Do not delete `src/app/material-theme.css` in this task. Leave `src/app/layout.tsx` importing `./globals.css`

**Checkpoint**: O tema antigo não pinta mais o `body`. A biblioteca ainda está instalada. As rotas não mudaram

---

## Phase 3: User Story 1 - As seis áreas continuam no computador (Priority: P1) 🎯 MVP

**Goal**: Resumo, Orçamento, Lançamentos, Ano, Ajustes e Entrada seguem nos mesmos endereços, com a casca e a entrada já verificadas.

**Independent Test**: Entrar com `demo@local.test` / `demo1234`, abrir as cinco áreas e ver o mesmo disponível do mês. Sem sessão, `/login` não mostra a navegação Principal.

### Implementation for User Story 1

- [x] T003 [US1] Leave these files unchanged: `src/app/app/resumo/page.tsx` (`ResumoTela`), `src/app/app/orcamento/page.tsx` (`OrcamentoTela`), `src/app/app/lancamentos/page.tsx` (`LancamentosTela`), `src/app/app/ano/page.tsx` (`AnoTela`), `src/app/app/ajustes/page.tsx`, `src/app/app/ajustes/conta/page.tsx`, `src/app/app/ajustes/categorias/page.tsx`, `src/app/app/ajustes/cartoes/page.tsx`, `src/app/app/ajustes/limites/page.tsx`, `src/app/app/ajustes/exportar/page.tsx`, `src/app/app/ajustes/exemplo/page.tsx`, `src/app/app/ajustes/excluir/page.tsx`, `src/app/login/page.tsx` (`EntrarForm`), `src/app/cadastro/page.tsx` (`CriarContaForm`), and `src/app/esqueci-senha/page.tsx` (`EsqueciSenhaForm`). Confirm none of them import `@/components/material` or `@material/web`. Do not change `src/components/casca-app.tsx` or any `*-tela.tsx`
- [x] T004 [US1] Run `npx playwright test e2e/casca.spec.ts e2e/resumo.spec.ts e2e/orcamento.spec.ts e2e/lancamentos.spec.ts e2e/ano.spec.ts e2e/ajustes.spec.ts e2e/entrada.spec.ts`. They must pass. If a failure is caused by the `body` reset, fix only `src/app/globals.css`. Do not change the route files from T003 to make a test pass

**Checkpoint**: US1 testável. As seis áreas abrem como antes. A biblioteca antiga ainda está no repositório

---

## Phase 4: User Story 2 - A biblioteca antiga sai do computador (Priority: P1)

**Goal**: O web não instala nem carrega `@material/web`. A vitrine `/` deixa de existir.

**Independent Test**: `/` sem sessão abre `/login` e não mostra "Comece a planejar o mês em minutos." `package.json` não lista `@material/web`. Nenhuma tela importa essa biblioteca.

### Implementation for User Story 2

- [x] T005 [US2] Replace `src/app/page.tsx` with a server redirect. Use `getAuth` from `src/lib/auth.ts` the same way as `src/app/login/page.tsx`. With a session, `redirect("/app/resumo")`. Without a session, `redirect("/login")`. Quote from `specs/049-remocao-front-antigo/data-model.md`: there is no new table, column, or migration; disponível, gasto, and sobra gain no new formula. The sentence "Comece a planejar o mês em minutos." must not render. Do not import `@/components/material/ui` or `@/components/brand-logo.tsx`
- [x] T006 [US2] Delete these files together, in one change, only after T005: `src/components/material/register.tsx`, `src/components/material/ui.tsx`, `src/components/material/sheet.tsx`, `src/components/material/icon.tsx`, `src/types/material-web.d.ts`, `src/app/material-theme.css`, `src/components/app-chrome.tsx`, `src/components/app-nav.tsx`, `src/components/auth-shell.tsx`, `src/components/brand-logo.tsx`, `src/components/sign-out-button.tsx`, `src/components/resumo-dashboard.tsx`, `src/components/resumo-donut.ts`, `src/components/resumo-donut.test.ts`, `src/components/orcamento-view.tsx`, `src/components/alert-banner.tsx`, `src/components/plano-sheet.tsx`, `src/components/novo-item-sheet.tsx`, `src/components/lancamentos-view.tsx`, `src/components/novo-lancamento-sheet.tsx`, `src/components/editar-lancamento-sheet.tsx`, `src/components/ano-view.tsx`, `src/components/ajustes-cards.tsx`, `src/components/cartoes-panel.tsx`, `src/components/limites-panel.tsx`, `src/components/export-panel.tsx`, `src/components/carregar-exemplo-button.tsx`, `src/components/excluir-conta-panel.tsx`, `src/components/import-planilha-panel.tsx`, `src/components/import-pdf-panel.tsx`, and `src/components/competencia-simulador.tsx`. Do not delete `src/components/*-tela.tsx`, `src/application/`, or `src/app/api/`
- [x] T007 [P] [US2] In `src/app/layout.tsx`, remove the `MaterialRegistry` import from `@/components/material/register` and render `ThemeProvider` directly around `children`. Remove the `antialiased` class from `body`. Keep `localFont` Manrope, `scriptTema`, `tokens.css`, `web.css`, and `./globals.css`
- [x] T008 [P] [US2] In `next.config.ts`, set `transpilePackages` to `["@meu-orcamento/design-system"]` only. Remove `@material/web` and `lit`. Leave `serverExternalPackages` and `outputFileTracingIncludes` as they are
- [x] T009 [US2] From the repository root, run `npm uninstall @material/web` so both `package.json` and `package-lock.json` drop that package. Do not uninstall `tailwindcss` or `@tailwindcss/postcss`. Do not edit `postcss.config.mjs`

**Checkpoint**: US1 e US2 testáveis. As seis áreas continuam. A biblioteca antiga não está em `package.json`

---

## Phase 5: User Story 3 - O aparelho permanece como está (Priority: P2)

**Goal**: O app do celular não muda nesta história.

**Independent Test**: Nenhum arquivo em `android/` entra no diff. O tema do aparelho continua o que a história 057 ainda vai retirar.

### Implementation for User Story 3

- [x] T010 [P] [US3] Do not edit anything under `android/`. Confirm `git diff -- android/` is empty for this story. Do not delete Material 3 from the phone app. That removal stays in story 057

**Checkpoint**: As três histórias fecham. O computador perdeu a biblioteca antiga e o aparelho não foi alterado

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Conferir a spec inteira sem suíte nova

- [x] T011 [P] Run the command block in `specs/049-remocao-front-antigo/quickstart.md`: `npm test`, `npx tsc --noEmit`, `npm run build`, `npm run lint`, and `npx playwright test e2e/casca.spec.ts e2e/resumo.spec.ts e2e/orcamento.spec.ts e2e/lancamentos.spec.ts e2e/ano.spec.ts e2e/ajustes.spec.ts e2e/entrada.spec.ts`. All must pass. `e2e/resumo.spec.ts` still expects zero `.alert-banner`
- [x] T012 [P] Run both searches from `specs/049-remocao-front-antigo/quickstart.md`. `git grep -n "md-" -- ":!android" ":!specs" ":!docs"` may match only `packages/design-system`. `git grep -n "material" -- ":!android" ":!package-lock.json"` must not match an `@material/web` import or old-library CSS under `src/`. A mention in a spec or doc may remain. Confirm `src/components/material`, `src/types/material-web.d.ts`, and `src/app/material-theme.css` are gone
- [x] T013 Follow sections 1 and 2 of `specs/049-remocao-front-antigo/quickstart.md` on `http://localhost:3000` with `demo@local.test` / `demo1234`. The five areas stay inside the shell. `/` without a session opens `/login` and does not show "Comece a planejar o mês em minutos." `/` with a session opens `/app/resumo`. Confirm the diff adds no `console.log`, no `any`, and no new TODO

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Começa imediatamente
- **Foundational (Phase 2)**: Depende do Setup e bloqueia as user stories
- **User Stories (Phase 3+)**: Dependem do Foundational. US1 antes de US2, porque US2 apaga arquivos e US1 prova as rotas antes disso. US3 não depende de US1 nem de US2
- **Polish (Phase 6)**: Depende de US1, US2 e US3

### User Story Dependencies

- **User Story 1 (P1)**: Depois do Foundational. Não depende de US2 nem de US3
- **User Story 2 (P1)**: Depois da US1. T005 antes de T006. T007 e T008 depois de T006 e em paralelo entre si. T009 depois de T007 e T008
- **User Story 3 (P2)**: Depois do Foundational. Pode correr em paralelo com US1 e US2 porque só protege `android/`

### Within Each User Story

- Não há teste novo para escrever antes do código
- US1 não edita rota. US2 só apaga e redireciona depois que as rotas já passaram
- US2 completa antes do polish

### Parallel Opportunities

- T007 e T008 podem correr juntos, depois de T006
- T010 pode correr junto com US1 ou US2
- T011 e T012 podem correr juntos no polish
- T013 espera o app no ar e vem depois de T011

---

## Parallel Example: User Story 2

```bash
# Depois que T006 apagou o grupo antigo:
Task: "Remove MaterialRegistry from src/app/layout.tsx"
Task: "Drop @material/web and lit from transpilePackages in next.config.ts"

# Em qualquer momento depois do Foundational, sem mexer no web:
Task: "Confirm git diff -- android/ is empty"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1: Setup
2. Completar Phase 2: Foundational
3. Completar Phase 3: User Story 1
4. **PARAR E VALIDAR**: o Playwright das sete suítes passa com o reset novo em `src/app/globals.css`
5. A biblioteca antiga ainda pode estar no disco neste ponto

### Incremental Delivery

1. Setup + Foundational deixam o `body` no token, sem o tema antigo
2. US1 prova as seis áreas e fecha o MVP
3. US2 tira a vitrine, os componentes antigos e `@material/web`
4. US3 confirma que `android/` não entrou no diff
5. O polish roda o `quickstart.md`

### Parallel Team Strategy

1. Uma pessoa faz Setup e Foundational
2. Em seguida:
   - Pessoa A: User Story 1
   - Pessoa B: User Story 3, só vigiando `android/`
3. User Story 2 começa quando a US1 passou, porque ela apaga o que a US1 acabou de preservar nas rotas

---

## Notes

- [P] = outro arquivo, sem depender de tarefa incompleta
- US1 não tem implementação de tela. A história é as rotas atuais sobreviverem ao reset
- US2 apaga em bloco. Apagar `src/components/material/ui.tsx` antes de T005 quebra `src/app/page.tsx`
- Não marcar `verified` na spec. Isso é do PM
