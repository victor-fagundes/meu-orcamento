---

description: "Task list for 048 Entrada web"
---

# Tasks: Entrada web

**Input**: Design documents from `/specs/048-entrada-web/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Vitest de `src/domain/entrada.ts` e Playwright de `e2e/entrada.spec.ts`, pedidos em plan.md e em quickstart.md. O teste nasce falhando.

**Organization**: US1 marca e larguras (P1, MVP). US2 credencial (P1). US3 criar conta (P1). US4 esqueci a senha (P1). US5 sessão expirada e sair (P2). US6 campo vazio, falha e leitura (P2).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (outro arquivo, sem depender de tarefa incompleta)
- **[Story]**: US1 … US6
- Cada tarefa cita o arquivo

## Path Conventions

- Rotas: `src/app/login/page.tsx`, `src/app/cadastro/page.tsx`, `src/app/esqueci-senha/page.tsx`
- Telas: `src/components/entrada-moldura.tsx`, `entrar-form.tsx`, `criar-conta-form.tsx`, `esqueci-senha-form.tsx`
- Domínio: `src/domain/entrada.ts`, `src/domain/entrada.test.ts`
- Sessão de tela: `src/middleware.ts`, `src/lib/session.ts`, `src/lib/marca-sessao.ts`, `src/components/dialogo-sair.tsx`, `src/components/excluir-tela.tsx`
- Pacote: `packages/design-system/src/base/contratos.ts`, `packages/design-system/src/web/campo.tsx`, `packages/design-system/src/native/campo.tsx`, `packages/design-system/src/core/tokens.ts`, `packages/design-system/src/core/tokens.css`, `packages/design-system/src/web/base.css`
- Contrato: `specs/048-entrada-web/contracts/entrada.md`
- E2E: `e2e/entrada.spec.ts`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Travar o escopo antes de trocar a entrada

- [x] T001 Confirm `specs/048-entrada-web/spec.md` status is `ready` before editing product code. Edit only the files listed in `specs/048-entrada-web/plan.md`. Do not add a table, a column, or a migration. Do not edit `src/lib/auth.ts` or anything under `src/app/api/auth/`. Do not add a new-password page. Do not restyle `src/app/page.tsx`. Do not delete `src/components/auth-shell.tsx` or the `.auth-*` rules in `src/app/globals.css`. Do not import `@material/web` in a new file. Do not add `console.log`, `any`, or a raw hex/`px`/`rem`/`dp` style in `src/app`, `src/components`, or `packages/design-system`. Do not edit Android. Keep routes `/login`, `/cadastro`, and `/esqueci-senha`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: O Campo aceita senha, a moldura existe, e as frases moram no domínio

**⚠️ CRITICAL**: Nenhuma user story começa antes disto

- [x] T002 [P] Extend `CampoProps` in `packages/design-system/src/base/contratos.ts` with optional `tipo` (`texto` | `email` | `senha`, default `texto`), optional `completar` (`nome` | `email` | `senha-atual` | `senha-nova`), and optional `invalido` (default false). Honor them in `packages/design-system/src/web/campo.tsx` and `packages/design-system/src/native/campo.tsx`. Web: `type` is `password` for `senha` and `email` for `email`; `autocomplete` maps those four `completar` values to `name`, `email`, `current-password`, and `new-password`; set `name` to the `id`. `invalido` or a non-empty `erro` sets `aria-invalid`. A non-empty `erro` still renders `.mo-campo__erro`. `invalido` without `erro` renders no error sentence. Native: `senha` hides the value; `email` uses the email keyboard. Callers that omit the new props stay plain text. Do not add a second field component
- [x] T003 [P] Add `entradaLargura: 400` to `grid` in `packages/design-system/src/core/tokens.ts` and `--entrada-largura: 400px` in `packages/design-system/src/core/tokens.css`. In `packages/design-system/src/web/base.css`, add `.mo-entrada` as one column: centered brand, then the form at `width: 100%` and `max-width: var(--entrada-largura)`. At `min-width: 720px`, two columns; the left column shows `.mo-entrada__apoio`; below 720px that element is hidden. The form title uses `--type-title-lg-size`. The wide headline uses `--type-display-md-size`. There is no 44px type token; do not invent one. Add `.mo-campo:has([aria-invalid="true"]) .mo-campo__rotulo { color: var(--md-error); }` and a `prefers-reduced-motion: reduce` rule that sets `.mo-entrada` transition and animation to none. Use existing tokens only
- [x] T004 [P] Add a failing test in `src/domain/entrada.test.ts`. No React import. Cover `mensagemNome`: empty and whitespace return "Informe o nome." Cover `mensagemEmail`: empty returns "Informe o e-mail."; after trimming only the ends, a value without text on both sides of `@` and a dot on the right returns "Informe um e-mail válido."; " victor@email.com " is valid and `emailAparado` returns "victor@email.com". Cover `mensagemSenhaEntrada`: empty returns "Informe a senha."; a 7-character password returns null. Cover `mensagemSenhaNova`: 7 characters returns "Use pelo menos 8 caracteres."; "abc defgh" (8 characters, space in the middle) returns null. The password helpers must not trim. Export the constants the screens will share: "E-mail ou senha incorretos. Confira os dados e tente de novo.", "Já existe uma conta com esse e-mail.", "Não foi possível salvar. Os campos continuam preenchidos.", "Sua sessão expirou. Entre de novo para continuar. Nada do que você digitou foi perdido.", "Enviaremos um link para você criar uma nova senha.", "O link vale por 30 minutos. Se não chegar, você pode pedir outro." `fraseLinkEnviado("victor@email.com")` returns "Enviamos o link para victor@email.com. Confira também o spam."
- [x] T005 Implement `src/domain/entrada.ts` so T004 passes. Pure TypeScript. No Next, React, or Drizzle import. `mensagemNome` trims and treats whitespace as empty. `mensagemEmail` trims only the ends before the empty and shape checks. `emailAparado` returns that trimmed address. `mensagemSenhaEntrada` only checks empty. `mensagemSenhaNova` counts every character, including spaces, and refuses a length below 8
- [x] T006 [P] Add `src/components/entrada-moldura.tsx`. It renders `.mo-entrada` with an `aria-hidden` mark (the wallet from the artboard, fills from `var(--md-brand-yellow)`, `var(--md-text)`, and `var(--md-action)` only), the visible text "Meu Orçamento", the headline "O que ainda cabe neste mês.", the wide-only line "Entre para ver o que ainda cabe no mês." inside `.mo-entrada__apoio`, and a `children` slot. No Principal navigation. No Material import

**Checkpoint**: O Campo mascara senha, a moldura tem a marca, e o Vitest de entrada passa. Nenhuma rota mudou ainda

---

## Phase 3: User Story 1 - Entrar no largo e no estreito (Priority: P1) 🎯 MVP

**Goal**: Entrar mostra a marca e o formulário, em duas colunas a partir de 720 px e em uma abaixo disso.

**Independent Test**: Em 1280 px e em 720 px, ler "Entre para ver o que ainda cabe no mês." na esquerda. Em 719 px e em 390 px, ver uma coluna, sem essa frase, com o título Entrar. A navegação Principal não aparece.

### Tests for User Story 1

- [x] T007 [US1] Add a failing Playwright test in `e2e/entrada.spec.ts`. Anonymous `/login` at 1280 and 720 shows "O que ainda cabe neste mês." and "Entre para ver o que ainda cabe no mês." At 719 and 390 the second sentence is absent, "Meu Orçamento" and the heading "Entrar" are visible, and the form follows the brand. `getByRole("navigation", { name: "Principal" })` has count 0 at both 1280 and 390. Do not assert a successful sign-in. `e2e/casca.spec.ts` and `e2e/ajustes.spec.ts` may stay red until US2. Do not restore Material to make them pass

### Implementation for User Story 1

- [x] T008 [US1] Replace `src/app/login/page.tsx` and add `src/components/entrar-form.tsx`. If `getAuth().api.getSession` returns a session, redirect to `/app/resumo`. Otherwise render `EntradaMoldura` and the form. Title "Entrar". `Campo` ids `email` (`tipo="email"`, `completar="email"`) and `password` (`tipo="senha"`, `completar="senha-atual"`). Links: "Esqueci a senha" to `/esqueci-senha`, "Criar conta" to `/cadastro`. Submit button "Entrar" is a `Botao` `variante="primario"` `largura="total"` and does not submit yet. Do not use `loading` (it replaces the label with "Carregando…"). Do not call `signIn`. Make T007 pass

**Checkpoint**: US1 testável. A entrada anônima tem a marca certa em 1280 px e em 390 px. Entrar ainda não cria sessão

---

## Phase 4: User Story 2 - Credencial certa e credencial errada (Priority: P1)

**Goal**: A senha da conta abre o Resumo. A senha errada mostra uma frase só e conserva os campos.

**Independent Test**: Entrar com `demo@local.test` / `demo1234` e chegar ao Resumo. Repetir com a senha trocada, ler "E-mail ou senha incorretos. Confira os dados e tente de novo.", e ver e-mail e senha ainda preenchidos, sem sessão.

### Tests for User Story 2

- [x] T009 [US2] Extend `e2e/entrada.spec.ts` with a failing test. Wrong password shows "E-mail ou senha incorretos. Confira os dados e tente de novo." and does not show "Use pelo menos 8 caracteres." The email and password values remain. A 7-character password uses that same credential sentence. `demo@local.test` / `demo1234` reaches `/app/resumo`. Opening `/login` again while that session exists returns to `/app/resumo`. `input[name="email"]` and `input[name="password"]` still exist so `e2e/casca.spec.ts` and `e2e/ajustes.spec.ts` can sign in

### Implementation for User Story 2

- [x] T010 [US2] In `src/components/entrar-form.tsx`, submit with `authClient.signIn.email`. Trim only the ends of the email before the call. Send the password unchanged. On success, assign `next` when it starts with `/` and does not start with `//`; otherwise `/app/resumo`. On a rejected credential, including a 7-character password, show only the credential sentence from `src/domain/entrada.ts` in `Banner` `tipo="erro"`, set `invalido` on both fields, and do not pass `erro` to either field. Keep the typed values. Do not show `err.message`. While the call is in flight, set `disabled` on the button and ignore a second press. A transport failure shows "Não foi possível salvar. Os campos continuam preenchidos." Make T009 pass. Do not edit `src/lib/auth.ts`

**Checkpoint**: US2 testável. A conta demo entra. A senha errada não aponta o campo. A casca volta a entrar por `/login`

---

## Phase 5: User Story 3 - Criar conta (Priority: P1)

**Goal**: Senha com menos de 8 caracteres não grava. Com 8, a conta nasce e o Resumo abre.

**Independent Test**: Cadastrar com 7 caracteres e ver "Use pelo menos 8 caracteres." no campo senha, sem conta nova. Cadastrar o e-mail da demo e ver "Já existe uma conta com esse e-mail."

### Tests for User Story 3

- [x] T011 [US3] Extend `e2e/entrada.spec.ts` with a failing test. `/cadastro` at 390 shows one column, the heading "Criar conta", and no "Entre para ver o que ainda cabe no mês." Submit name, email, and a 7-character password: the password field shows "Use pelo menos 8 caracteres." and the URL stays on `/cadastro`. Submit the demo email with a new 8-character password: the page shows "Já existe uma conta com esse e-mail." and the three values remain. Do not delete `demo@local.test`

### Implementation for User Story 3

- [x] T012 [US3] Replace `src/app/cadastro/page.tsx` and add `src/components/criar-conta-form.tsx`. A valid session redirects to `/app/resumo`. `EntradaMoldura`, title "Criar conta", fields Nome (`id="name"`, `completar="nome"`), E-mail (`id="email"`), Senha (`id="password"`, `tipo="senha"`, `completar="senha-nova"`), `Botao` "Cadastrar", and link "Já tenho conta" to `/login`. Before `authClient.signUp.email`, call `mensagemNome`, `mensagemEmail`, and `mensagemSenhaNova`. A short password shows "Use pelo menos 8 caracteres." on the password field and does not call the client. Empty password on this form is the same 8-character sentence, not "Informe a senha." Send the trimmed email and the untrimmed password. Success assigns `/app/resumo`. An already-used email shows "Já existe uma conta com esse e-mail." and keeps all three values. A second press while the first call is in flight does not fire another sign-up. Do not show `err.message`. Make T011 pass

**Checkpoint**: US3 testável. Senha de 7 caracteres não cria conta. O e-mail da demo não cria outra

---

## Phase 6: User Story 4 - Esqueci a senha (Priority: P1)

**Goal**: A confirmação é a mesma com ou sem conta naquele e-mail.

**Independent Test**: Enviar `nao-existe@example.com` e ler "Enviamos o link para nao-existe@example.com. Confira também o spam." A página não diz que a conta não existe.

### Tests for User Story 4

- [x] T013 [US4] Extend `e2e/entrada.spec.ts` with a failing test. `/esqueci-senha` shows "Esqueci a senha" and "Enviaremos um link para você criar uma nova senha." Submit `nao-existe@example.com`. The page shows "Enviamos o link para nao-existe@example.com. Confira também o spam.", "Verifique seu e-mail", and "O link vale por 30 minutos. Se não chegar, você pode pedir outro." It does not say the account is missing or that it exists. "Reenviar link" stays on that confirmation

### Implementation for User Story 4

- [x] T014 [US4] Replace `src/app/esqueci-senha/page.tsx` and add `src/components/esqueci-senha-form.tsx`. Do not redirect when a session exists, and do not call `signOut`. Title "Esqueci a senha", the sentence "Enviaremos um link para você criar uma nova senha.", E-mail, `Botao` "Enviar link", and link "Voltar para entrar" to `/login`. Validate with `mensagemEmail` before `authClient.requestPasswordReset`. Success and an unknown-email response show the same confirmation: `Banner` `tipo="atencao"` with `fraseLinkEnviado` of the trimmed address, heading "Verifique seu e-mail", "O link vale por 30 minutos. Se não chegar, você pode pedir outro.", "Voltar para entrar", and `Botao` `variante="texto"` "Reenviar link". Reenviar repeats the request and stays on that confirmation. A transport failure shows "Não foi possível salvar. Os campos continuam preenchidos." and does not add a sentence about whether the account exists. Do not add a route or a new-password screen. Do not edit `src/lib/auth.ts`. Make T013 pass

**Checkpoint**: US4 testável. O e-mail desconhecido recebe a mesma confirmação do e-mail cadastrado

---

## Phase 7: User Story 5 - Sessão expirada e sair (Priority: P2)

**Goal**: Sessão vencida abre o aviso. Sair confirmado abre Entrar sem esse aviso.

**Independent Test**: Abrir `/login?sessao=expirada` e ler o aviso, com a senha vazia. Abrir `/login` sem a query e não ver o aviso. Cancelar Sair da conta e continuar na demo.

### Tests for User Story 5

- [x] T015 [US5] Extend `e2e/entrada.spec.ts` with a failing test. Anonymous `/login` has no "Sua sessão expirou". Anonymous `/login?sessao=expirada` shows "Sua sessão expirou. Entre de novo para continuar. Nada do que você digitou foi perdido." and the password field is empty. Sign in as the demo, open Sair da conta, cancel, and remain on the account. Do not confirm Sair on the demo account

### Implementation for User Story 5

- [x] T016 [US5] Add `src/lib/marca-sessao.ts` for the cookie `mo-teve-sessao=1` (no secret, not the session). In `src/middleware.ts`, when a session cookie is present on `/app`, set that marker on the response. When the session cookie is absent and the marker is present, redirect to `/login?sessao=expirada`, keep `next` when there is one, and clear the marker. When both are absent, keep today's redirect to `/login?next=` with no expired query. In `src/lib/session.ts`, `requireSessionOrcamento` redirects to `/login?sessao=expirada` when `getSession` returns nothing. Pass the flag into `src/components/entrar-form.tsx`: `Banner` `tipo="atencao"` only when the query is present. Do not restore an unsaved form. In `src/components/dialogo-sair.tsx` and `src/components/excluir-tela.tsx`, clear `mo-teve-sessao` and then assign `/login` with no query. Do not change the dialog copy. Cancel still keeps the session. Make T015 pass

**Checkpoint**: US5 testável. O aviso só aparece com a sessão vencida. Cancelar Sair não encerra a demo

---

## Phase 8: User Story 6 - Campo vazio, falha e leitura (Priority: P2)

**Goal**: Campo vazio não envia. O teclado percorre a entrada. A falha não mostra a mensagem crua.

**Independent Test**: Enviar Entrar vazio e ler "Informe o e-mail." e "Informe a senha.", sem sessão. Enviar um e-mail sem `@` e ler "Informe um e-mail válido."

### Tests for User Story 6

- [x] T017 [US6] Extend `e2e/entrada.spec.ts` with a failing test. Submit empty Entrar: "Informe o e-mail." and "Informe a senha." appear, and the URL stays on `/login`. Submit "sem-arroba" as the email: "Informe um e-mail válido." From the keyboard, the email field, the password field, "Esqueci a senha", "Entrar", and "Criar conta" are reachable, and the focused control has a visible focus style. Capture the last screen to `tests/visual/out/`

### Implementation for User Story 6

- [x] T018 [US6] In `src/components/entrar-form.tsx`, `src/components/criar-conta-form.tsx`, and `src/components/esqueci-senha-form.tsx`, run the domain helpers before any auth call. Empty email: "Informe o e-mail." Empty password on Entrar: "Informe a senha." Invalid email: "Informe um e-mail válido." Empty name on cadastro: "Informe o nome." Show each sentence on its own field and do not send. A thrown or transport error still shows only "Não foi possível salvar. Os campos continuam preenchidos." Search these three forms for `err.message` and remove it. Do not add an animation. Light and dark come from the tokens already switched by `ThemeProvider`. Make T017 pass

**Checkpoint**: US6 testável. Entrar vazio não chama a sessão. O foco percorre o formulário

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: A suite fecha sem mexer no mecanismo de auth

- [x] T019 [P] Confirm `src/app/login/page.tsx`, `src/app/cadastro/page.tsx`, `src/app/esqueci-senha/page.tsx`, `src/components/entrada-moldura.tsx`, `src/components/entrar-form.tsx`, `src/components/criar-conta-form.tsx`, and `src/components/esqueci-senha-form.tsx` do not import `@material/web` or `AuthShell`. Confirm `src/lib/auth.ts` and `src/app/api/auth/**` have no diff from this story
- [x] T020 Run the checks in `specs/048-entrada-web/quickstart.md`: `npm test -- src/domain/entrada.test.ts`, `npx playwright test e2e/entrada.spec.ts e2e/casca.spec.ts e2e/ajustes.spec.ts`, and `npx tsc --noEmit`. Do not delete the demo account during the run

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: começa imediata
- **Foundational (Phase 2)**: depende de T001 e bloqueia todas as histórias
- **User stories**: dependem da Phase 2
- **Polish**: depende das histórias que forem entrar na entrega

### User Story Dependencies

- **US1 (P1)**: depois da Phase 2. Não depende das outras histórias. MVP de layout. Ainda não entra na conta
- **US2 (P1)**: depois de US1, porque preenche `src/components/entrar-form.tsx`. É o primeiro incremento que abre o Resumo
- **US3 (P1)**: depois da Phase 2. Arquivos próprios. Pode seguir junto com US1
- **US4 (P1)**: depois da Phase 2. Arquivos próprios. Pode seguir junto com US1 e US3
- **US5 (P2)**: depois de US2, porque o aviso entra em `entrar-form.tsx` e o teste entra com a demo
- **US6 (P2)**: depois de US2, US3 e US4, porque revisa os três formulários

### Within Each User Story

- O teste falha antes da implementação
- A regra pura de T005 fica pronta antes das telas
- A história que edita `entrar-form.tsx` espera a anterior nesse arquivo
- `e2e/entrada.spec.ts` é estendido na ordem US1 → US2 → US3 → US4 → US5 → US6

### Parallel Opportunities

- T002, T003, T004 e T006 em paralelo
- T005 depois de T004, em paralelo com T002, T003 e T006
- Depois da Phase 2, US1, US3 e US4 podem seguir em arquivos diferentes
- US3 e US4 não dividem componente. Os testes delas não são paralelos: os dois escrevem `e2e/entrada.spec.ts`
- US2 espera US1. US5 espera US2. US6 espera US2, US3 e US4

---

## Parallel Example: User Story 1

```bash
# Depois da Phase 2, o teste de layout e, em outro arquivo, o cadastro e o esqueci:
# e2e/entrada.spec.ts (só o caso anônimo de largura — US1)
# src/components/criar-conta-form.tsx (US3)
# src/components/esqueci-senha-form.tsx (US4)

# A credencial espera o formulário de Entrar:
# src/components/entrar-form.tsx (US2, depois de US1)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1
2. Completar Phase 2
3. Completar Phase 3 (US1)
4. **PARAR E VALIDAR**: em 1280 px, duas colunas e a frase da esquerda; em 390 px, uma coluna, sem essa frase, com o título Entrar; sem navegação Principal
5. Seguir para a credencial. Sem US2 a pessoa ainda não entra

### Incremental Delivery

1. Setup + Campo, token, moldura e domínio
2. US1 marca e larguras
3. US2 credencial, que destrava `e2e/casca.spec.ts` e `e2e/ajustes.spec.ts`
4. US3 criar conta e US4 esqueci a senha
5. US5 sessão vencida e Sair
6. US6 campo vazio, teclado e frase de falha
7. Quickstart

### Parallel Team Strategy

1. Uma pessoa fecha Setup e Foundational
2. Em seguida, pessoas diferentes podem pegar US1, US3 e US4
3. US2 entra quando `entrar-form.tsx` existir
4. US5 entra depois da credencial
5. US6 é a última, porque atravessa os três formulários

---

## Notes

- [P] = outro arquivo, sem depender de tarefa incompleta
- O status da spec precisa estar `ready` antes de T002
- Não apagar a conta demo no Playwright
- Não confirmar Sair na conta demo
- `e2e/casca.spec.ts` e `e2e/ajustes.spec.ts` ficam vermelhos de T008 até T010
- Parar em qualquer checkpoint e testar a história sozinha
