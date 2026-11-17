# Implementation Plan: Material Design

**Branch**: `023-material-design` | **Date**: 2026-11-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/023-material-design/spec.md`

## Summary

Trocar a casca e os controles do app para o Material Design 3 oficial na web (`@material/web`), com a paleta azul do produto e o amarelo `#FFE600` só na marca, no alerta preventivo e na série Realizado. Gráficos, tabela do ano e grade das páginas continuam em CSS, usando os mesmos tokens. Novo lançamento passa a abrir em qualquer seção de `/app`, com os mesmos campos e a mesma action de hoje. Nenhuma regra de domínio, centavo, competência ou importação muda.

## Technical Context

**Language/Version**: TypeScript (strict), Next.js 15 App Router, React 19

**Primary Dependencies**: `@material/web` (componentes oficiais), fonte Material Symbols via `next/font`, Roboto já carregado em `src/app/layout.tsx`. Tailwind 4 permanece só para grade e utilitários que já existem.

**Storage**: N/A. Nenhuma tabela, coluna ou payload novo.

**Testing**: Vitest do domínio deve continuar verde sem teste novo de domínio. Aceite desta história é o `quickstart.md` no navegador (largo, estreito, claro, escuro).

**Target Platform**: Web, computador e celular, tema do aparelho (`prefers-color-scheme`)

**Project Type**: Web application — só UI e o encanamento para o sheet global

**Performance Goals**: A primeira pintura de `/app` não espera rede externa de ícone. Fontes vêm do bundle do Next. Componentes Material registram no cliente, sem travar o servidor.

**Constraints**: Domínio puro; centavos inteiros; isolamento por `orcamentoId`; sem seletor de tema; sem MCP; GAP-003 e o anúncio de Arquivar ficam fora; artefatos só no repo

**Scale/Scope**: Telas já existentes: casca, Resumo, Orçamento, Lançamentos, Ano, Ajustes, login, cadastro, esqueci a senha, home e os sheets de lançamento, plano e item. Quebra visual no mesmo ponto de hoje: 720px.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Domain Purity | PASS | Nenhum arquivo em `src/domain` muda. O sheet global continua chamando `criarLancamentoAction` e as funções que o sheet já usa. |
| II. Integer Money | PASS | Campos de valor seguem o parse atual na borda. Nada vira float. |
| III. Spec-Driven Delivery | PASS | Spec 023 está `ready`. Código só depois de `tasks.md`. |
| IV. Vertical Slice | PASS | Não há API nova. A entrega é a interface usável. O layout só repete leituras que a página de lançamentos já faz. |
| V. Simplicity & Isolation | PASS | Sem biblioteca paralela (MUI). Sem tema manual. Listas do sheet continuam filtradas pela sessão. |

**Post-design re-check**: PASS. Contratos cobrem casca, controles e o sheet global. Nenhuma violação a justificar.

## Project Structure

### Documentation (this feature)

```text
specs/023-material-design/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── casca.md
│   ├── controles.md
│   └── sheet-global.md
├── checklists/requirements.md
└── tasks.md                 # /speckit-tasks — não criado aqui
```

### Source Code (repository root)

```text
src/app/material-theme.css          # tokens claro/escuro, committed
src/components/material/register.tsx # importa @material/web só no cliente
src/components/material/sheet.tsx    # diálogo largo / folha estreita, Escape e foco
src/components/app-nav.tsx           # links com ícone e pílula; continua Next Link
src/components/app-chrome.tsx        # botão Novo lançamento + sheet, em toda /app
src/app/layout.tsx                   # fonte de ícones + provider
src/app/globals.css                  # tira o visual antigo dos controles migrados
src/app/app/layout.tsx               # carrega itens e cartões ativos para o chrome
src/components/resumo-dashboard.tsx
src/components/orcamento-view.tsx
src/components/lancamentos-view.tsx
src/components/ano-view.tsx
src/components/*-sheet.tsx
src/components/*-panel.tsx           # ajustes, import, export, cartões, limites
src/app/login/page.tsx
src/app/cadastro/page.tsx
src/app/esqueci-senha/page.tsx
src/app/page.tsx
next.config.ts                       # transpilePackages: @material/web, lit
```

**Structure Decision**: Um app Next só. O design system entra como pacote npm e um punhado de componentes em `src/components/material`. As telas existentes trocam botão, campo, chip e barra. O domínio não ganha pasta nova.

## Complexity Tracking

Nenhuma violação da constituição.
