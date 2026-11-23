# Implementation Plan: Orçamento web

**Branch**: `044-orcamento-web` | **Date**: 2026-11-23 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/044-orcamento-web/spec.md`

## Summary

A página `/app/orcamento` deixa de usar `OrcamentoView`. Passa a listar um tipo por vez, com categorias fechadas no início, a frase de `fraseDoEstado` e o banner que `alertasDoMes` já calcula. Criar categoria e item, gravar o plano do mês e arquivar o item acontecem nesta tela. Renomear e arquivar categoria continuam fora dela. O mês sobe para o cabeçalho da casca e a troca de mês conserva o tipo e as categorias abertas.

## Technical Context

**Language/Version**: TypeScript estrito, Next.js 15 App Router

**Primary Dependencies**: `@meu-orcamento/design-system` (`Chips`, `GrupoComMedidor`, `LinhaItem`, `Banner`, `CartaoVazio`, `Skeleton`, `EstadoErro`, `FormularioContainer`, `CampoMoeda`, `Switch`, `Dialogo`), `alertasDoMes`, `bannerFromAlertas`, `criarCategoriaAction`, `criarItemAction`, `arquivarItemAction`, `salvarPlanoAction`, `fraseDoEstado`

**Storage**: Nenhuma tabela nova. Mês, tipo e categorias abertas ficam na query. Ocultar valores lê a chave `mo-ocultar-valores` que o Resumo já grava. O plano continua nos doze inteiros do item.

**Testing**: Vitest da ordenação, do valor do plano, da cópia para os meses seguintes e da frase "E mais N alertas." Playwright em `e2e/orcamento.spec.ts` com a conta demo, no claro e no escuro. Captura em `tests/visual/out/`, sem pixel-diff. Smoke no `quickstart.md`.

**Target Platform**: App web local. A janela estreita é este site. O Android não entra.

**Project Type**: Aplicação web existente. Esta história troca o miolo de Orçamento. A casca da história 042 passa a pedir mês também nesta área.

**Performance Goals**: Abrir o mês é a leitura que a página já faz. Sem meta nova de tempo. Sem animação nova. Com `prefers-reduced-motion`, painel e diálogo não transitam.

**Constraints**: Domínio sem Next, React ou Drizzle. Centavos inteiros. Estilo novo em `src/app` e `src/components` não usa hexadecimal nem `px`/`rem`/`dp` solto. O painel de 460 px já está no CSS do pacote. Sem `console.log`, sem `any`. A página nova não importa `@material/web`. `OrcamentoView` permanece no repositório até a história 049. Esta tela não oferece controle de ocultar, nem renomear ou arquivar categoria.

**Scale/Scope**: Um orçamento, um mês, um tipo na lista. Quatro opções. Sem intervalo de datas. Sem botão flutuante.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Domain Purity | PASS | Ordenação, leitura do valor e a cópia para os meses seguintes saem de função pura em `src/domain`. A página chama `alertasDoMes` e `fraseDoEstado`. Não cria outro limite nem outra competência. |
| II. Integer Money | PASS | O plano guarda centavos. `lerValorDoPlano` rejeita vazio, negativo e terceira casa sem passar por float. `formatarBRL` na linha e `formatarBRLInteiro` no total do tipo, só na borda. |
| III. Spec-Driven Delivery | PASS | A spec 044 está `ready`, com as cinco respostas da sessão de 2026-11-22. |
| IV. Vertical Slice | PASS | A entrega é a página usável: leitura, criar, plano, arquivar e o atalho Gerenciar. O miolo de renomear e arquivar categoria continua na história 047. |
| V. Simplicity & Isolation | PASS | Sem tabela, sem rota HTTP nova, sem segunda chave de ocultar. A query continua filtrada por `orcamentoId`. |

**Post-design re-check**: PASS. `data-model.md` não cria tabela. `contracts/orcamento.md` cobre o tipo, a frase, o banner, a ocultação, o plano, o arquivar e o atalho. O pacote só ganha limite por categoria, máscara e toque fora nos componentes que a tela já usa.

## Project Structure

### Documentation (this feature)

```text
specs/044-orcamento-web/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── orcamento.md
├── checklists/requirements.md
└── tasks.md                 # /speckit-tasks — não criado aqui
```

### Source Code (repository root)

```text
src/app/app/orcamento/page.tsx
src/app/app/orcamento/loading.tsx
src/app/app/orcamento/error.tsx
src/app/app/ajustes/categorias/page.tsx
src/components/orcamento-tela.tsx
src/components/orcamento-query.ts
src/components/casca-abas.ts
src/components/casca-app.tsx
src/domain/orcamento-lista.ts
src/domain/orcamento-lista.test.ts
src/domain/plano.ts
src/domain/plano.test.ts
packages/design-system/src/web/modulos/grupo-com-medidor.tsx
packages/design-system/src/web/modulos/linha-item.tsx
packages/design-system/src/web/formulario-container.tsx
packages/design-system/src/web/dialogo.tsx
e2e/orcamento.spec.ts
```

**Structure Decision**: A rota já é `src/app/app/orcamento/page.tsx`. O servidor continua dono da leitura do mês. O cliente guarda o painel, o diálogo e a chave de ocultar, e escreve tipo e categorias abertas na query. `OrcamentoView` sai da página e fica no repositório até a história 049. Gerenciar abre `/app/ajustes/categorias` só com a lista do tipo; o menu completo de Ajustes é a história 047.

## Complexity Tracking

Nenhuma violação. A história entrega a tela inteira em cima do plano, do alerta e das actions que já existem.
