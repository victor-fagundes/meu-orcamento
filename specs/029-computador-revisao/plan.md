# Implementation Plan: Revisão pontual do computador

**Branch**: `029-computador-revisao` | **Date**: 2026-11-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/029-computador-revisao/spec.md`

## Summary

O Resumo do computador passa a mostrar ainda pode gastar, total orçado e total gasto antes da média diária e dos filtros. Filtrar pagamento ou categoria não troca esse valor por um traço. Os atalhos de tipo ganham nome. No Orçamento, o destaque é o que ainda cabe, grupos zerados ficam em "Sem movimento neste mês", o mês conserva o tipo, e a barra de perto do limite não usa o amarelo da marca.

Números, gráficos, navegação de cima, Lançamentos, Ano e Ajustes ficam como estão. Spec `draft`: este plano não autoriza código antes de `ready`.

## Technical Context

**Language/Version**: TypeScript no app web existente (Next.js App Router)

**Primary Dependencies**: React nos componentes de Resumo e Orçamento. Sem biblioteca nova.

**Storage**: N/A

**Testing**: Vitest para o texto do filtro e para o endereço do mês com tipo. O restante é o roteiro de `quickstart.md` no navegador.

**Target Platform**: Computador, navegador

**Project Type**: Web app

**Performance Goals**: A troca é de ordem e de texto na tela já carregada. Sem pedido novo.

**Constraints**: Não recalcular o mês. Não renomear "Ainda pode gastar". Não pintar a marca nem a série de realizado. Não incluir o GAP-007 (spec 037).

**Scale/Scope**: Duas telas, Resumo e Orçamento.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. Domain purity**: Passa. O saldo do mês continua o que a tela já calcula com a lista inteira. O filtro só produz a frase.
- **II. Integer money**: Passa. Nenhum float novo. A frase formata centavos que já existem.
- **III. Spec-driven**: Passa com ressalva. Spec `draft`. Implementar só depois de `ready`.
- **IV. Vertical slice**: Passa. A entrega é a tela. Não há API nova.
- **V. Simplicity**: Passa. Reordenar blocos, um parâmetro `tipo` nos links do mês, um grupo colapsado, uma cor de barra.

**Revisão pós-design**: Passa. Os artefatos não criam domínio nem endpoint.

## Project Structure

### Documentation (this feature)

```text
specs/029-computador-revisao/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── revisao-computador.md
└── tasks.md
```

### Source Code (repository root)

```text
src/components/resumo-dashboard.tsx
src/components/resumo-filtro.ts
src/components/resumo-filtro.test.ts
src/components/orcamento-view.tsx
src/app/globals.css
```

**Structure Decision**: Só os dois componentes e a folha de estilo do computador. A página de Orçamento já lê `tipo` na query. Android não entra.

## Complexity Tracking

Nenhuma violação. Tabela não se aplica.
