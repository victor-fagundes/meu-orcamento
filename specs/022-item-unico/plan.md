# Implementation Plan: Um item só no Orçamento

**Branch**: `022-item-unico` | **Date**: 2026-11-16 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/022-item-unico/spec.md`

## Summary

O plano importado deixa de nascer num grupo com o nome da aba. A prévia e a confirmação resolvem o nome contra os itens deste orçamento: nome único atualiza o item do catálogo (tipo e grupo dele, inclusive quando a seção diz outra coisa); nome inédito cai em Outros daquele tipo; nome ambíguo não confirma até a pessoa escolher o grupo. Na primeira abertura do orçamento, um item ativo cujo grupo repete o nome da aba e cujo nome já existe no catálogo tem o plano copiado (mês a mês, só onde o catálogo está em zero) e é arquivado. A lista do Orçamento mostra grupos com valor antes dos zerados. Novo lançamento abre no item de mesmo nome que tem plano.

## Technical Context

**Language/Version**: TypeScript (strict), Next.js 15 App Router

**Primary Dependencies**: `src/domain/import-planilha.ts`, `src/domain/catalog.ts`, `src/application/import-planilha.ts`, `src/components/import-planilha-panel.tsx`, `src/components/orcamento-view.tsx`, `src/components/novo-lancamento-sheet.tsx`, Vitest, Drizzle/PGlite

**Storage**: Tabela `itens` existente (`planoCentavosJson` com 12 inteiros, `arquivado`). Sem tabela nova e sem coluna de “já corrigi”.

**Testing**: Vitest no domínio (alvo da prévia, merge da duplicata, ordem dos grupos, item preferido). Smoke do PM no `quickstart.md`.

**Target Platform**: App web local (usuário demo)

**Project Type**: Web application — domínio + aplicação + UI na mesma entrega

**Performance Goals**: A correção lê os itens de um orçamento (dezenas, não milhares) uma vez por abertura de `/app`. A prévia de planejamento continua limitada ao que a 020 já aceita.

**Constraints**: Domínio puro; centavos inteiros; isolamento por `orcamentoId`; não reabre competência da 020; GAP-006 e GAP-007 fora; artefatos só no repo

**Scale/Scope**: Um orçamento por usuário. Catálogo padrão mais itens criados pela planilha. Quatro nomes de aba proibidos como grupo: Receitas, Despesas Fixas, Despesas Variáveis, Anuais.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Domain Purity | PASS | Resolver nome, copiar meses e ordenar grupos ficam em `src/domain`. Aplicação só grava. |
| II. Integer Money | PASS | Plano continua em centavos. A cópia compara inteiros. Sem float. |
| III. Spec-Driven Delivery | PASS | Spec 022 é a ativa. Código só depois de `tasks.md` e status `ready`. |
| IV. Vertical Slice | PASS | Prévia, confirmação, correção na abertura, ordem na tela e seletor saem juntos. |
| V. Simplicity & Isolation | PASS | Sem tabela nova. Correção idempotente a cada abertura, filtrada pela sessão. |

**Post-design re-check**: PASS. Contratos descrevem prévia, confirmação, correção e ordem da lista. Nenhuma violação a justificar.

## Project Structure

### Documentation (this feature)

```text
specs/022-item-unico/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── plano-alvo.md
│   └── lista-e-seletor.md
├── checklists/requirements.md
└── tasks.md                 # /speckit-tasks — não criado aqui
```

### Source Code (repository root)

```text
src/domain/import-planilha.ts       # alvo do nome: catálogo, Outros ou escolha
src/domain/import-planilha.test.ts
src/domain/item-unico.ts            # cópia de meses, ordem de grupos, item preferido
src/domain/item-unico.test.ts
src/application/import-planilha.ts  # confirm usa o alvo; rejeita linha ambígua
src/application/item-unico.ts       # correção na abertura, escopo do orçamento
src/app/app/layout.tsx              # chama a correção antes de renderizar /app
src/components/import-planilha-panel.tsx
src/components/orcamento-view.tsx
src/components/novo-lancamento-sheet.tsx
src/app/app/lancamentos/page.tsx    # manda o plano do mês para o seletor
specs/015-import-planejamento/spec.md  # nota curta de emenda
```

**Structure Decision**: Um app Next já existente. A regra nova entra no domínio de importação e num módulo pequeno `item-unico`. A UI só mostra o grupo resolvido, reordena a lista e escolhe o item inicial.

## Complexity Tracking

Nenhuma violação da constituição.
