---

description: "Task list for the computer review of Resumo and Orçamento"
---

# Tasks: Revisão pontual do computador

**Input**: Design documents from `/specs/029-computador-revisao/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/revisao-computador.md, quickstart.md

**Tests**: O plano pede Vitest para a frase do filtro e para o endereço do mês. Não há outro teste novo.

**Organization**: As duas histórias são P1. A história 1 é o Resumo. A história 2 é o Orçamento. A spec continua `draft`: estas tarefas não autorizam código antes de `ready`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode correr em paralelo (arquivos diferentes, sem depender de tarefa incompleta)
- **[Story]**: História a que a tarefa pertence
- Cada tarefa cita o arquivo exato

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar o recorte. O app já existe. Não há dependência nova.

- [x] T001 Confirmar que a fatia fica só em `src/components/resumo-dashboard.tsx`, `src/components/orcamento-view.tsx`, `src/components/resumo-filtro.ts`, `src/components/resumo-filtro.test.ts` e `src/app/globals.css`, como em `specs/029-computador-revisao/plan.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: A frase do filtro e o endereço do mês servem às duas histórias. Nenhuma delas começa antes disto.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [P] Escrever os casos que ainda falham em `src/components/resumo-filtro.test.ts`: com pagamento filtrado o saldo do mês permanece e a frase cita o gasto do recorte; o filtro de categoria faz o mesmo; o endereço do mês carrega `mes` e `tipo`
- [x] T003 Fazer `textoFiltroResumo` e `hrefOrcamentoMes` em `src/components/resumo-filtro.ts` passarem em `src/components/resumo-filtro.test.ts`. O saldo do mês é o orçado de despesas menos o gasto de despesas da lista inteira. O gasto do recorte é a soma filtrada. Com filtro, a frase cita os dois. O tipo é `R`, `F`, `V` ou `E`

**Checkpoint**: O teste puro fica verde. As telas ainda não mudaram.

---

## Phase 3: User Story 1 - Ler o mês sem perder o número (Priority: P1) 🎯 MVP

**Goal**: Os três números vêm antes da média e dos filtros. Filtrar não apaga o quanto ainda pode gastar. Cada atalho nomeia o tipo.

**Independent Test**: No Resumo de um mês com despesas, a ordem coloca os três números primeiro. Com PIX selecionado, o valor do mês continua visível e a frase diz quanto foi no PIX.

### Implementation for User Story 1

- [x] T004 [P] [US1] Renderizar os três cartões de número antes de `.resumo-ritmo` e de `.resumo-filters` em `src/components/resumo-dashboard.tsx`. A ordem depois da navegação do mês é: números, ritmo, filtros, tipos, gráficos
- [x] T005 [US1] Manter "Ainda pode gastar" e "Total orçado" no mês inteiro quando houver filtro de pagamento ou de categoria em `src/components/resumo-dashboard.tsx`, com a frase de `textoFiltroResumo` em `src/components/resumo-filtro.ts`. Mês sem despesa mostra zero. Mês estourado mostra valor negativo e diz que passou do orçado
- [x] T006 [US1] Trocar o texto dos quatro atalhos para "Ver receitas", "Ver despesas fixas", "Ver despesas variáveis" e "Ver anuais" em `src/components/resumo-dashboard.tsx`

**Checkpoint**: A história 1 se verifica no Resumo sem abrir o Orçamento além do clique no atalho.

---

## Phase 4: User Story 2 - Ver o que ainda cabe no Orçamento (Priority: P1)

**Goal**: O cartão do tipo destaca o que ainda cabe. Grupos zerados ficam em "Sem movimento neste mês". O mês conserva o tipo. A barra de perto do limite não usa o amarelo da marca.

**Independent Test**: Em despesas fixas, o cartão mostra o que ainda cabe. Um grupo zerado só aparece em "Sem movimento". Avançar o mês mantém o tipo.

### Implementation for User Story 2

- [x] T007 [P] [US2] Destacar o que ainda cabe no cartão do tipo em `src/components/orcamento-view.tsx`. Ainda cabe é o plano do tipo menos o realizado do tipo. Gasto e planejado ficam na mesma linha, em segundo plano
- [x] T008 [US2] Colocar grupos com plano 0 e realizado 0 sob o controle "Sem movimento neste mês" em `src/components/orcamento-view.tsx`, e mantê-los abríveis. Grupo com qualquer centavo positivo permanece na lista principal
- [x] T009 [US2] Incluir o tipo selecionado nos links de mês anterior e próximo em `src/components/orcamento-view.tsx`, usando `hrefOrcamentoMes` de `src/components/resumo-filtro.ts`. Os valores de tipo são `R`, `F`, `V` e `E`
- [x] T010 [P] [US2] Tirar o amarelo da marca `#ffe600` da regra escura `.track i.warn` em `src/app/globals.css`. A regra clara permanece `#8a7000`. `.brand-mark` e a série de realizado dos gráficos continuam em `#ffe600`

**Checkpoint**: A história 2 se verifica no Orçamento. O Resumo da história 1 continua válido.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Fechar a fatia sem mexer no que a spec manda conservar.

- [x] T011 Rodar `npx vitest run src/components/resumo-filtro.test.ts` e o roteiro de `specs/029-computador-revisao/quickstart.md`
- [x] T012 Confirmar que Lançamentos, Ano, Ajustes, a navegação de cima e os gráficos não mudaram em `src/components/lancamentos-view.tsx`, `src/components/ano-view.tsx`, `src/app/app/ajustes/page.tsx` e `src/components/app-chrome.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: começa imediata
- **Foundational (Phase 2)**: depende da Phase 1 e bloqueia as duas histórias
- **User Story 1 (Phase 3)**: depende da Phase 2. Não depende da história 2
- **User Story 2 (Phase 4)**: depende da Phase 2. Não depende da história 1, exceto T009, que usa `hrefOrcamentoMes` criado em T003
- **Polish (Phase 5)**: depende das histórias que forem entregues

### User Story Dependencies

- **User Story 1 (P1)**: depois da Phase 2
- **User Story 2 (P1)**: depois da Phase 2. T007, T008 e T010 não leem o Resumo

### Within Each User Story

- T003 só depois de T002
- T005 e T006 editam o mesmo arquivo que T004, nesta ordem
- T008 e T009 editam o mesmo arquivo que T007, nesta ordem

### Parallel Opportunities

- T002 é o único teste e pode ser escrito sozinho
- Depois da Phase 2, T004, T007 e T010 podem correr juntos
- T005 espera T004. T008 espera T007. T009 espera T003 e T008

---

## Parallel Example: User Story 1

```text
# Depois de T003, em paralelo com o Orçamento e com a cor:
T004 Reordenar os três números em src/components/resumo-dashboard.tsx
T007 Destacar o que ainda cabe em src/components/orcamento-view.tsx
T010 Ajustar .track i.warn no tema escuro em src/app/globals.css
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 e Phase 2
2. Completar Phase 3
3. Parar e validar o Resumo pelo teste independente da história 1
4. Só então seguir para o Orçamento

### Incremental Delivery

1. Setup e fundação deixam o teste puro verde, com as telas iguais
2. A história 1 entrega o Resumo legível
3. A história 2 entrega o Orçamento sem mudar o Resumo
4. A Phase 5 confere o que não devia mudar

---

## Notes

- Implementar só quando a spec passar de `draft` para `ready`
- GAP-007 fica na spec 037 e não entra nestas tarefas
- Marcar a caixa ao concluir a tarefa
