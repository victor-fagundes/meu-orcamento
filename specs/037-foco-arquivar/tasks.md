---

description: "Task list for computer dialog focus and Arquivar"
---

# Tasks: Foco do diálogo e Arquivar no computador

**Input**: Design documents from `/specs/037-foco-arquivar/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/foco-e-arquivar.md, quickstart.md

**Tests**: O plano pede Vitest para o texto de Arquivar e para o índice do mês.

**Organization**: História 1 é o foco. História 2 é Arquivar. História 3 é a região principal. Spec `draft`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode correr em paralelo (arquivos diferentes, sem depender de tarefa incompleta)
- **[Story]**: História a que a tarefa pertence

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar que a fatia é só do computador.

- [x] T001 Confirmar a fatia nos arquivos listados em `specs/037-foco-arquivar/plan.md`: `src/components/material/sheet.tsx`, `src/components/material/ui.tsx`, os quatro diálogos, `src/components/arquivar-item-button.tsx`, `src/components/orcamento-view.tsx`, `src/components/app-chrome.tsx` e as páginas de Resumo, Orçamento, Lançamentos, Ano e Ajustes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: O texto de Arquivar e o índice do mês são puros e servem à história 2 e ao plano.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [P] Escrever os casos que ainda falham em `src/components/arquivar-rotulo.test.ts`: repouso visível "Arquivar"; armado visível "Arquivar {nome}?"; nomes anunciados "Arquivar {nome}", "Arquivar {nome}?" e "Arquivando {nome}"; o índice de `2026-11` é 10; competência ausente ou fora de 01 a 12 cai em janeiro, índice 0
- [x] T003 Fazer `src/components/arquivar-rotulo.ts` passar em `src/components/arquivar-rotulo.test.ts`

**Checkpoint**: O teste puro fica verde. Os diálogos ainda não movem o foco.

---

## Phase 3: User Story 1 - Entrar no diálogo pelo teclado (Priority: P1) 🎯 MVP

**Goal**: O foco entra no campo certo, sem selecionar o texto, e Escape devolve o foco.

**Independent Test**: No Orçamento de novembro, abrir Aluguel deixa o foco no valor de novembro, sem seleção. Escape volta ao Aluguel.

### Implementation for User Story 1

- [x] T004 [P] [US1] Ao abrir, focar em `src/components/material/sheet.tsx` o único controle marcado como alvo e não selecionar o texto. Sem alvo, o foco fica no próprio diálogo. Guardar o controle anterior antes do movimento e devolvê-lo no Escape, no fundo e em Cancelar. Tab permanece dentro do diálogo
- [x] T005 [P] [US1] Aceitar um sinal opcional de alvo em `src/components/material/ui.tsx`, no campo de texto e no botão preenchido, e repassá-lo ao controle nativo
- [x] T006 [US1] Receber o índice do mês aberto em `src/components/plano-sheet.tsx`, a partir da competência já conhecida em `src/components/orcamento-view.tsx`, e marcar o campo desse mês. Não marcar "Mesmo valor todo mês". Mês fora de 0 a 11 marca janeiro
- [x] T007 [US1] Marcar o nome do item em `src/components/novo-item-sheet.tsx`, o valor em `src/components/novo-lancamento-sheet.tsx` e em `src/components/editar-lancamento-sheet.tsx`, e Fechar em `src/components/alert-banner.tsx`

**Checkpoint**: Os cinco diálogos abrem com o foco no destino certo.

---

## Phase 4: User Story 2 - Arquivar dizendo qual item na confirmação (Priority: P1)

**Goal**: O primeiro texto continua "Arquivar". O segundo mostra o nome. Só um item fica armado.

**Independent Test**: Armar Aluguel mostra "Arquivar Aluguel?". Armar Luz em seguida desarma Aluguel. Confirmar Luz arquiva só Luz.

### Implementation for User Story 2

- [x] T008 [US2] Guardar um único id armado em `src/components/orcamento-view.tsx` e tornar `src/components/arquivar-item-button.tsx` controlado. O texto visível e o nome anunciado vêm de `src/components/arquivar-rotulo.ts`. Enquanto grava, o visível é "…" e o anunciado é "Arquivando {nome}", e outro toque é ignorado. Só o segundo passo chama a ação de arquivar. O item sai da lista ativa e os lançamentos permanecem. Recarregar a tela volta todos ao repouso

**Checkpoint**: Dois itens não ficam armados ao mesmo tempo.

---

## Phase 5: User Story 3 - Achar o conteúdo da tela (Priority: P2)

**Goal**: Resumo, Orçamento, Lançamentos e Ano têm região principal. O salto cai nela.

**Independent Test**: Em cada uma das quatro telas, o salto para o conteúdo cai na região principal.

### Implementation for User Story 3

- [x] T009 [P] [US3] Envolver o conteúdo com uma região principal de destino `conteudo` em `src/app/app/resumo/page.tsx`, `src/app/app/orcamento/page.tsx`, `src/app/app/lancamentos/page.tsx` e `src/app/app/ano/page.tsx`. Dar o mesmo destino à região que já existe em `src/app/app/ajustes/page.tsx`, sem criar uma segunda
- [x] T010 [US3] Colocar como primeiro controle de `src/components/app-chrome.tsx` o salto "Ir para o conteúdo" para `#conteudo`, escondido até receber foco. O chrome não vira região principal

**Checkpoint**: Ajustes conserva a região que já tinha.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: O teste puro e o teclado.

- [x] T011 Rodar `npx vitest run src/components/arquivar-rotulo.test.ts` e o roteiro de `specs/037-foco-arquivar/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational** bloqueia a história 2, porque T008 usa o rótulo
- **User Story 1** não depende de Arquivar nem da região principal
- **User Story 3** não depende das histórias 1 e 2
- **Polish** depende das histórias entregues

### Within Each User Story

- T003 espera T002
- T006 e T007 esperam T004 e T005
- T010 espera T009, porque o destino `conteudo` precisa existir

### Parallel Opportunities

- Depois da Phase 1, T002, T004, T005 e T009 podem correr juntos
- T006 espera o diálogo compartilhado e edita arquivo diferente de T007. Os dois podem correr juntos depois de T005
- T008 espera T003
- T010 espera T009

---

## Parallel Example: User Story 1

```text
T004 Foco do alvo em src/components/material/sheet.tsx
T005 Sinal de alvo em src/components/material/ui.tsx
T009 Região principal nas quatro páginas
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1
2. T004 e T005, depois T006 e T007
3. Abrir o plano de novembro pelo teclado antes de mudar Arquivar

### Incremental Delivery

1. O foco entrega o teclado
2. Arquivar entrega o nome no passo que grava
3. A região principal entrega o salto

---

## Notes

- Implementar só com a spec em `ready`
- No Android, o nome já no primeiro texto visível continua na spec 032
- A revisão visual do mês continua na spec 029
