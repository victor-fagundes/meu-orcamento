# Implementation Plan: Entrada web

**Branch**: `048-entrada-web` | **Date**: 2026-11-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/048-entrada-web/spec.md`

## Summary

`/login`, `/cadastro` e `/esqueci-senha` deixam o Material e passam a usar a marca e os formulários do DS. No largo são duas colunas. No estreito, uma. Credencial errada mostra uma frase só. Senha com menos de 8 caracteres só barra o cadastro. O link enviado mostra a mesma confirmação com ou sem conta. Sessão vencida abre um aviso. Sair confirmado volta para Entrar sem esse aviso. O mecanismo em `src/lib/auth.ts` não muda.

## Technical Context

**Language/Version**: TypeScript estrito, Next.js 15 App Router

**Primary Dependencies**: `@meu-orcamento/design-system` (`Campo`, `Botao`, `Banner`, `ThemeProvider`), `authClient` em `src/lib/auth-client.ts`, `getAuth` só para ler a sessão nas páginas de entrada e em `requireSessionOrcamento`

**Storage**: Nenhuma tabela nova. Conta, sessão e pedido de link continuam como estão. A marca `mo-teve-sessao` é um cookie deste navegador, sem segredo, e não autoriza `/app`.

**Testing**: Vitest em `src/domain/entrada.test.ts`. Playwright em `e2e/entrada.spec.ts`, mais a permanência de `e2e/casca.spec.ts` e `e2e/ajustes.spec.ts`. Smoke no `quickstart.md`. Captura em `tests/visual/out/`, sem pixel-diff bloqueante.

**Target Platform**: App web local. A janela estreita é este site, no mesmo corte de 720 px da casca. O Android não entra.

**Project Type**: Aplicação web existente. Esta história troca a apresentação das três rotas de entrada. A casca da história 042 e o diálogo de Sair da história 047 permanecem.

**Performance Goals**: Sem meta nova de tempo. A pessoa cria a conta e chega ao Resumo em menos de 2 minutos, como na spec. Com `prefers-reduced-motion`, o aviso não anima.

**Constraints**: Domínio sem Next, React ou Drizzle. Sem dinheiro nesta história. Estilo novo não usa hexadecimal nem `px`/`rem`/`dp` solto. Sem `console.log`, sem `any`. As três páginas não importam `@material/web`. `src/lib/auth.ts` e `src/app/api/auth/**` não mudam. A home `/` e o `AuthShell` ficam até a história 049. A branch de trabalho é `rebuild-web`.

**Scale/Scope**: Uma conta por e-mail. Sem login social, sem tela de nova senha, sem bearer para o app nativo, sem restaurar formulário não salvo.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Domain Purity | PASS | E-mail, nome e senha nova saem de `src/domain/entrada.ts`. A tela não reimplementa a regra. Não há cálculo de orçamento aqui. |
| II. Integer Money | PASS | Esta história não lê nem grava valor em dinheiro. |
| III. Spec-Driven Delivery | PASS | A spec 048 está `ready` e sem marcador de clarificação. O código pode começar por essa spec. |
| IV. Vertical Slice | PASS | A entrega são as três telas usáveis, com o aviso de sessão vencida e a volta depois de Sair. Não fica contrato sem tela. |
| V. Simplicity & Isolation | PASS | Sem tabela nova e sem mudança no mecanismo de auth. A marca de sessão não dá acesso. Cada entrada só abre a própria conta. |

**Post-design re-check**: PASS. `data-model.md` não cria tabela. `contracts/entrada.md` cobre Entrar, Criar conta, Esqueci a senha, a marca de sessão vencida e o Sair. O `Campo` só ganha props opcionais. Orçamento, Lançamentos e Ajustes não mudam de campo.

## Project Structure

### Documentation (this feature)

```text
specs/048-entrada-web/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── entrada.md
├── checklists/requirements.md
└── tasks.md                 # /speckit-tasks — não criado aqui
```

### Source Code (repository root)

```text
src/app/login/page.tsx
src/app/cadastro/page.tsx
src/app/esqueci-senha/page.tsx
src/app/app/layout.tsx
src/components/entrada-moldura.tsx
src/components/entrar-form.tsx
src/components/criar-conta-form.tsx
src/components/esqueci-senha-form.tsx
src/components/dialogo-sair.tsx
src/components/excluir-tela.tsx
src/domain/entrada.ts
src/domain/entrada.test.ts
src/lib/session.ts
src/lib/marca-sessao.ts
src/middleware.ts
packages/design-system/src/base/contratos.ts
packages/design-system/src/core/tokens.ts
packages/design-system/src/core/tokens.css
packages/design-system/src/web/campo.tsx
packages/design-system/src/web/base.css
packages/design-system/src/native/campo.tsx
e2e/entrada.spec.ts
```

**Structure Decision**: As rotas continuam `/login`, `/cadastro` e `/esqueci-senha`, fora da casca. Cada página de servidor lê a sessão quando precisa redirecionar e monta o formulário cliente dentro de `EntradaMoldura`. A confirmação do link é estado de `/esqueci-senha`, não outra rota. O layout de `.mo-entrada` fica no CSS do DS, ao lado de `.mo-ajustes`. `dialogo-sair.tsx` e `excluir-tela.tsx` só passam a apagar a marca antes de abrir `/login`.

## Complexity Tracking

Nenhuma violação. As props novas do `Campo` são opcionais. Sem elas a senha apareceria em texto e a credencial errada escreveria a frase dentro dos dois campos.
