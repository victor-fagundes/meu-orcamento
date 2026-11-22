# Spec: 040 — DS integrado ao Next

**Status:** `ready`  
**Release:** rebuild-web  
**Sprint:** —  
**Depende de:** —  
**PRD:** 7  
**Branch:** `rebuild-web`

A pasta `specs/040-replicar-front-prototipo` continua Cancelled (17 nov 2026). Não é esta história.

## Context

O front web atual usa Roboto, `material-theme.css`, `globals.css` e `@material/web`. O design system em `packages/design-system` (v0.2) já tem tokens, formatadores, ícones, componentes web e módulos. Esta spec liga esse pacote ao App Router e completa as peças que as telas 042–048 vão usar.

A fonte visual está em `docs/design/`: `COMPONENTES.md`, `MODULOS.md`, `MICROCOPY.md`, `GRID.md`, `TEMA-ESCURO.md`, `IMPLEMENTACAO.md`, `TOKENS.md` e `ICONES.md`. Onde `COMPONENTES.md` ainda cita Material Symbols outlined, vale `ICONES.md`: Material Icons filled. A paleta escura de `TEMA-ESCURO.md` é a de `darkColors` em `tokens.ts`.

`GRID.md` fixa o desktop a partir de 720, a barra lateral de 240, o conteúdo de no máximo 960, 12 colunas, margem 40 e espaço 24. A barra inferior de 76 está no mesmo arquivo, como medida de layout, fora da escala de espaço. `tokens.ts` já tem 720, 240, 40 e 24. Faltam 76 e 960 no objeto `grid`.

`IMPLEMENTACAO.md` esboça `src/components/base` e `src/server`. Este repositório não usa esse esboço: componente fica no pacote, domínio em `src/domain`, aplicação em `src/application`.

`npm test` na raiz só inclui `src/**/*.test.ts`. Os testes do DS rodam no pacote (`packages/design-system`).

## Goals

1. O App Router carrega Manrope, os tokens e o tema sem flash, com a chave `mo-tema`.
2. Os componentes que faltam existem no DS, com contrato, versão web, export e teste.
3. Diálogo e painel prendem o foco e devolvem o foco ao fechar.
4. O catálogo de ícones cobre os nomes desta spec.
5. A checagem visual gera capturas para o PM e não aprova a própria baseline.

## Non-goals

- Trocar as telas Resumo, Orçamento, Lançamentos, Ano, Ajustes e Entrada (042–048).
- Apagar `@material/web`, `material-theme.css` ou `globals.css` (049).
- Camada nativa nova, Expo ou a pasta `android/` (050–057).
- Inventar medida que não esteja em `docs/design/GRID.md`, `docs/design/TOKENS.md` ou em `tokens.ts`.

## Domain rules

Não muda regra de dinheiro, competência ou alerta. Medidas novas entram só em `tokens.ts`, e o CSS sai de `npm run gen:css`.

| Medida | Onde | Valor |
|---|---|---|
| Barra inferior | `grid` | 76 |
| Largura máxima do conteúdo | `grid` | 960 |
| Já existentes | `grid` | desktop a partir de 720, barra lateral 240, 12 colunas, margem 40, espaço 24 |

| Componente novo | Contrato mínimo |
|---|---|
| `ShellApp` | Cabeçalho, barra lateral ≥ 720 px (240) e barra inferior &lt; 720 px, via `NavegacaoPrincipal`. Ajustes continua ativa nas subtelas. |
| `Tabela` | Colunas tipadas, `caption` obrigatória, cabeçalho com `scope`, seleção opcional de linha, número à direita, dígitos tabulares. |
| `CampoBusca` | `input type="search"`, limpar com nome acessível, `aria-controls`. |
| `CampoData` | `input type="date"`, rótulo visível, exibição DD/MM/AAAA, erro abaixo do campo. |
| `Switch` | `role="switch"`, `aria-checked`. |
| `MenuAcoes` | Botão ⋯. Ação destrutiva só dentro do menu, com confirmação. |
| `BotaoIcone` | Só ícone. `aria-label` obrigatório pelo tipo. |
| `Avatar` | Iniciais em círculo `--md-selected`. `aria-hidden` quando o nome está ao lado. |

Ícones a acrescentar em `icons-paths.ts` e na tabela de `docs/design/ICONES.md` (Material Icons filled, 24): `edit`, `add`, `search`, `close`, `filter_list`, `logout`, `more_vert`, `expand_more`, `expand_less`, `arrow_upward`, `arrow_downward`. `delete` já existe.

## Acceptance criteria

- [ ] AC-1 Todo arquivo em `packages/design-system/src/web/` que usa estado, efeito, evento ou `window` começa com `'use client'`. O pacote funciona no App Router.
- [ ] AC-2 `src/app/layout.tsx` carrega Manrope com `next/font/local` a partir de `packages/design-system/fonts/Manrope-VariableFont_wght.ttf`. Se esse caminho não resolver, a fonte é copiada para `public/fonts/` e o `next/font` aponta para lá. Roboto (`next/font/google`) sai. `--font-family` usa a variável do `next/font`. Não há `@font-face` com caminho relativo.
- [ ] AC-3 O `<head>` tem um script que lê `localStorage` (`mo-tema`) e a preferência do sistema e define `data-theme` no `<html>` antes da primeira pintura. O `<html>` tem `suppressHydrationWarning`.
- [ ] AC-4 `ThemeProvider` lê e grava `mo-tema` e expõe `light`, `dark` e `system`.
- [ ] AC-5 `tokens.css` gerado por `npm run gen:css` no pacote é importado uma vez no layout. `material-theme.css` e `globals.css` continuam até a spec 049.
- [ ] AC-6 `grid` em `tokens.ts` passa a ter a altura 76 da barra inferior e a largura máxima 960. O CSS gerado reflete os dois. Nenhuma outra medida é criada.
- [ ] AC-7 `ShellApp`, `Tabela`, `CampoBusca`, `CampoData`, `Switch`, `MenuAcoes`, `BotaoIcone` e `Avatar` têm contrato em `src/base/contratos.ts`, versão web, export em `src/web.ts` e teste.
- [ ] AC-8 `Dialogo` e `FormularioContainer` prendem Tab e Shift+Tab dentro do painel e, ao fechar, devolvem o foco ao elemento que abriu. Os dois comportamentos têm teste em jsdom.
- [ ] AC-9 Cada nome novo de ícone existe em `IconName`, tem caminho e aparece em `docs/design/ICONES.md`. Um teste falha se algum nome do tipo não tiver caminho.
- [ ] AC-10 `Switch` expõe `aria-checked` e alterna. `MenuAcoes` abre, fecha com Esc e não coloca ação destrutiva fora do menu. `CampoData` liga o erro ao campo. `Tabela` exige `caption` e marca a linha selecionada.
- [ ] AC-11 O teste visual grava cada componente novo em light e dark, a 390 px e a 1280 px, em `tests/visual/out/`. Sem baseline aprovada pelo PM, o teste não falha. `tests/visual/__snapshots__` não é criada por este trabalho.
- [ ] AC-12 Na ordem: `npm test` na raiz, `npm test` em `packages/design-system`, `npx tsc --noEmit`. Só depois `npm run build`. Os quatro terminam sem erro.
- [ ] AC-13 Nenhum `console.log`, `any` ou TODO novo.

## Test plan

Unit e componente: suíte já existente do DS (contraste, formatadores, sincronia do CSS) mais os testes de AC-8, AC-9 e AC-10.  
Visual: Playwright grava em `tests/visual/out/` e não compara baseline.  
App: `npm test`, `npx tsc --noEmit`, depois `npm run build`.

## Open questions

Nenhuma. A baseline visual fica com o PM.
