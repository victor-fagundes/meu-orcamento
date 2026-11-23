# Implementation Plan: Ano web

**Branch**: `046-ano-web` | **Date**: 2026-11-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/046-ano-web/spec.md`

## Summary

A página `/app/ano` deixa de montar `AnoView`. Passa a mostrar os doze meses em Realizado ou Planejado, com tipo, categoria e item visíveis, e a linha "Sobra no ano (receitas − despesas)". A grade, a sobra, o vazio e o mês atual saem de uma função pura. A célula corta os centavos na tabela do pacote, sem repetir "R$". A troca de ano chama uma action e só substitui a grade depois da resposta. A casca continua sem setas de mês.

## Technical Context

**Language/Version**: TypeScript estrito, Next.js 15 App Router

**Primary Dependencies**: `@meu-orcamento/design-system` (`TabelaMeses`, `Chips`, `Banner`, `Skeleton`, `EstadoErro`, `Botao`), `requireSessionOrcamento`, `parsePlanoFromJson`, `saldoFinalAno`

**Storage**: Nenhuma tabela nova. O plano continua o JSON de doze inteiros no item. O ano confirmado fica na query `ano`. Realizado e Planejado viajam juntos na leitura. Ocultar valores lê a chave `mo-ocultar-valores` que o Resumo já grava. O modo fica no estado da tela.

**Testing**: Vitest de `ano-grade.test.ts` e de `textoCelulaAno`. O teste de `saldoFinalAno` em `reconciliacao.test.ts` permanece. Playwright em `e2e/ano.spec.ts` com a conta demo, no claro e no escuro. Captura em `tests/visual/out/`, sem pixel-diff. Smoke no `quickstart.md`.

**Target Platform**: App web local. A janela estreita é este site. O Android não entra.

**Project Type**: Aplicação web existente. Esta história troca o miolo do Ano. A casca da história 042 permanece com `pedeMes` falso nesta área.

**Performance Goals**: Uma leitura do orçamento e dos lançamentos daquele ano. Sem meta nova de tempo. Sem animação nova. Com `prefers-reduced-motion`, a troca de ano e de modo não transita.

**Constraints**: Domínio sem Next, React ou Drizzle. Centavos inteiros até a célula. Estilo novo em `src/app`, `src/components` e no CSS do pacote não usa hexadecimal nem `px`/`rem`/`dp` solto. Sem `console.log`, sem `any`. A página nova não importa `@material/web`. `AnoView` permanece no repositório até a história 049. `competencia.ts` não muda. Não há plano por ano civil.

**Scale/Scope**: Um orçamento e um ano civil. Sem edição de célula, sem alerta, sem "Total despesas", sem copiar o ano anterior, sem botão flutuante.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Domain Purity | PASS | A grade, a visibilidade, a ordem, a sobra e o vazio saem de `gradeDoAno`. A página não recalcula competência. `competencia.ts` permanece a única conta da fatura. |
| II. Integer Money | PASS | Mês, total e sobra somam centavos. `textoCelulaAno` só corta na hora de mostrar. Zero centavo vira "—". A máscara é texto, não outro número. |
| III. Spec-Driven Delivery | PASS | A spec 046 está `ready`. Não há marcador de clarificação. |
| IV. Vertical Slice | PASS | A entrega é a página usável: grade, modo, sobra, troca de ano, vazio, ocultar, carregando e erro. |
| V. Simplicity & Isolation | PASS | Sem tabela nova, sem rota HTTP nova, sem segunda chave de ocultar. A leitura e a action filtram por `orcamentoId`. |

**Post-design re-check**: PASS. `data-model.md` não cria tabela. `contracts/ano.md` cobre a grade, os dois modos, a sobra, a competência gravada, o vazio e a troca que só confirma depois da resposta. O pacote só muda `TabelaMeses`, que hoje não tem outro chamador na app.

## Project Structure

### Documentation (this feature)

```text
specs/046-ano-web/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ano.md
├── checklists/requirements.md
└── tasks.md                 # /speckit-tasks — não criado aqui
```

### Source Code (repository root)

```text
src/app/app/ano/page.tsx
src/app/app/ano/loading.tsx
src/app/app/ano/error.tsx
src/app/actions/ano.ts
src/application/ano.ts
src/components/ano-tela.tsx
src/components/ano-view.tsx
src/domain/ano-grade.ts
src/domain/ano-grade.test.ts
packages/design-system/src/base/contratos.ts
packages/design-system/src/modulos/tabela-meses.ts
packages/design-system/src/web/modulos/tabela-meses.tsx
packages/design-system/src/web/base.css
packages/design-system/tests/modulos/tabela-meses.test.ts
packages/design-system/tests/web/modulos-2.test.tsx
e2e/ano.spec.ts
```

**Structure Decision**: A rota já é `src/app/app/ano/page.tsx`. O servidor lê o ano da query e monta as duas grades. O cliente guarda o modo, a chave de ocultar e a grade confirmada. A troca de ano usa `carregarAnoAction` e `history.replaceState`, para a casca não suspender o miolo. `AnoView` sai da página e fica no repositório até a história 049. A casca continua com o título "Ano" e sem setas de mês.

## Complexity Tracking

Nenhuma violação. A história entrega a tela inteira em cima do plano e da competência que já estão gravados. `TabelaMeses` muda o texto da célula porque o artboard não repete "R$" e o teste atual espera "R$ 3.590".
