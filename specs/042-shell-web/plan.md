# Implementation Plan: Shell da aplicação

**Branch**: `rebuild-web` | **Date**: 2026-11-22 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/042-shell-web/spec.md`

## Summary

Quem entrou na conta passa a ver `ShellApp` no lugar da barra de cima atual: cinco áreas na ordem já em uso, lateral a partir de 720 px, inferior abaixo, e Ajustes marcado em qualquer caminho sob `/app/ajustes`. O cabeçalho usa `CabecalhoTela`. Nesta história nenhuma das cinco áreas pede mês, porque o miolo ainda desenha o mês e as histórias 043–046 é que passam a pedir. O botão flutuante e o “Novo lançamento” da casca saem. “Sair” permanece, com o mesmo gesto de hoje, até a história 047. A grade do conteúdo usa os tokens que a história 040 já gravou. Sem tabela nova e sem regra nova de dinheiro.

## Technical Context

**Language/Version**: TypeScript estrito, Next.js 15 App Router

**Primary Dependencies**: `@meu-orcamento/design-system` (`ShellApp`, `NavegacaoPrincipal`, `CabecalhoTela`, `Botao`), Better Auth via `requireSessionOrcamento`, `next/navigation`

**Storage**: N/A. A casca não grava. A sessão e o redirect para `/login` permanecem.

**Testing**: Vitest da função pura que escolhe a aba. Teste já existente de `ShellApp` no pacote. Playwright em `e2e/casca.spec.ts` nas larguras 1280, 720, 719 e 390, com a conta demo local. Smoke no `quickstart.md`.

**Target Platform**: App web local. Janela estreita continua sendo este site, não o Android.

**Project Type**: Aplicação web existente. Esta história troca a casca logada. Não troca o miolo das cinco áreas.

**Performance Goals**: Trocar de área é uma navegação. Sem animação nova. Com `prefers-reduced-motion`, os tokens de movimento já vão a 0 ms.

**Constraints**: Domínio sem Next, React ou Drizzle. A casca não entra em `src/domain`. Sem valor monetário. Estilo novo em `src/app` e `src/components` não usa hexadecimal nem `px`/`rem`/`dp` solto (regra já no ESLint). Medida nova não entra em `tokens.ts`. Sem `console.log`, sem `any`. Não importar `@material/web` no arquivo novo da casca. `globals.css`, `AppChrome` e `AppNav` ficam no repositório até a história 049.

**Scale/Scope**: Cinco áreas, uma sessão, um orçamento. Sem sexta aba. Sem FAB no web.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Domain Purity | PASS | A aba ativa é função de caminho, na casca. O mês, quando uma tela futura pedir, usa `shiftCompetencia` que já existe. Nenhuma regra de competência, parcela ou saldo muda. |
| II. Integer Money | PASS | A casca não lê nem grava centavos. |
| III. Spec-Driven Delivery | PASS | A spec 042 está `ready`. |
| IV. Vertical Slice | PASS com exceção | A entrega é a casca usável em volta das cinco rotas que já existem. O miolo e os botões de criar ficam nas histórias 043–048, como a spec manda. A exceção está em Complexity Tracking. |
| V. Simplicity & Isolation | PASS | Reusa `ShellApp` e os tokens da 040. Não cria segunda navegação nem tabela. Quem não entrou continua no redirect já existente. |

**Post-design re-check**: PASS. `data-model.md` não cria tabela. `contracts/casca.md` cobre aba, largura, mês, flutuante e grade. A exceção da fatia vertical não cresceu: nenhuma página de Resumo, Orçamento, Lançamentos, Ano ou Ajustes é redesenhada.

## Project Structure

### Documentation (this feature)

```text
specs/042-shell-web/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── casca.md
├── checklists/requirements.md
└── tasks.md                 # /speckit-tasks — não criado aqui
```

### Source Code (repository root)

```text
src/app/app/layout.tsx                 # sessão + casca; deixa de montar AppChrome
src/components/casca-app.tsx           # cliente: ShellApp, cabeçalho, Sair, skip link
src/components/casca-abas.ts           # tabela das cinco áreas e abaAtiva
src/components/casca-abas.test.ts
packages/design-system/src/web/base.css # grade do conteúdo com os tokens já gerados
e2e/casca.spec.ts
```

**Structure Decision**: O App Router já separa o layout logado em `src/app/app/layout.tsx`. A casca visual fica no pacote, entregue pela história 040. Esta história só escolhe a aba, aponta o endereço e aplica a grade que o CSS do pacote ainda não desenha. `AppChrome` deixa de ser usado aqui e não é apagado.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| IV. Fatia sem o miolo das telas | A spec 042 entrega a casca. Resumo, Orçamento, Lançamentos, Ano, Ajustes e os botões de criar são as histórias 043–048. Desenhar essas telas aqui duplicaria o rebuild. | Incluir o miolo nesta entrega. A spec marca isso como fora, e o rebuild já separou as histórias. |
