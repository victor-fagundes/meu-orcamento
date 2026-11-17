---

description: "Task list for the Android Orçamento screen"
---

# Tasks: Orçamento no Android

**Input**: Design documents from `/specs/032-android-orcamento/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/orcamento-android.md, quickstart.md. Casca 030 e totais da 028.

**Tests**: O plano pede que a frase do grupo seja a mesma função do computador. Um caso em `src/domain/resumo-mes.test.ts`.

**Organization**: História 1 é a lista. História 2 é o sheet. História 3 é Arquivar. Spec `draft`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode correr em paralelo (arquivos diferentes, sem depender de tarefa incompleta)
- **[Story]**: História a que a tarefa pertence

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar servidor e tela.

- [x] T001 Confirmar a fatia em `src/domain/resumo-mes.ts`, `src/domain/resumo-mes.test.ts`, `src/app/api/v1/resumo/route.ts` e `android/app/src/main/java/app/meuorcamento/ui/orcamento/OrcamentoScreen.kt`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: A frase nasce no domínio que o computador já usa. Os centavos da 028 não mudam.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 [P] Acrescentar em `src/domain/resumo-mes.test.ts` um caso em que a `frase` de um grupo conhecido é a mesma de `textoConsumoDespesa` ou `textoConsumoReceita`
- [x] T003 Anexar `frase` em cada item de `porTipo` e de `porGrupo` em `src/domain/resumo-mes.ts`, chamando `textoConsumoDespesa`, `textoConsumoReceita` e `estadoConsumo`, e devolver esse campo em `src/app/api/v1/resumo/route.ts`. Não alterar a fórmula dos centavos

**Checkpoint**: `npx vitest run src/domain/resumo-mes.test.ts` fica verde. A tela Android ainda não mudou.

---

## Phase 3: User Story 1 - Ver o que ainda cabe no tipo (Priority: P1) 🎯 MVP

**Goal**: O tipo mostra o que ainda cabe, os grupos com movimento e "Sem movimento neste mês".

**Independent Test**: Em despesas fixas, o valor e os grupos batem com o computador. Um grupo zerado só aparece em "Sem movimento".

### Implementation for User Story 1

- [x] T004 [US1] Mostrar o que ainda cabe do tipo selecionado a partir de `totais.porTipo` em `android/app/src/main/java/app/meuorcamento/ui/orcamento/OrcamentoScreen.kt`. Trocar o mês não altera o tipo guardado na casca
- [x] T005 [US1] Listar grupos com plano ou realizado maior que zero a partir de `totais.porGrupo` em `android/app/src/main/java/app/meuorcamento/ui/orcamento/OrcamentoScreen.kt`. Grupos com os dois zerados ficam sob "Sem movimento neste mês" e continuam abríveis. A frase exibida é a `frase` do servidor. A barra de perto do limite não usa `#ffe600`. Chegou no planejado não é tratado como erro
- [x] T006 [US1] Montar as linhas de item com `itens` filtrados por tipo e grupo em `android/app/src/main/java/app/meuorcamento/ui/orcamento/OrcamentoScreen.kt`. O realizado do item é a soma dos `lancamentos` daquele `itemId` e não substitui o total do grupo

**Checkpoint**: A lista se compara ao computador sem abrir o sheet.

---

## Phase 4: User Story 2 - Ajustar o plano de um item (Priority: P2)

**Goal**: O sheet grava só um valor entendido e cancelar não grava.

**Independent Test**: Abrir Aluguel, mudar o valor, salvar, e ver o grupo atualizado. Cancelar não muda o valor.

### Implementation for User Story 2

- [x] T007 [US2] Abrir em `android/app/src/main/java/app/meuorcamento/ui/orcamento/OrcamentoScreen.kt` um sheet com o nome do item e o valor do mês aberto. O foco entra nesse campo e o texto não fica selecionado. Os doze inteiros vêm de `GET /api/v1/plano`. Salvar envia `PUT /api/v1/plano` com `mesesCentavos`, alterando só o mês aberto. Texto que não vira centavos não envia o PUT. Cancelar, toque fora e voltar não enviam PUT. Nome vazio não chama `POST /api/v1/itens`

**Checkpoint**: Cancelar deixa o plano igual.

---

## Phase 5: User Story 3 - Arquivar dizendo qual item (Priority: P2)

**Goal**: Os dois passos nomeiam o item. Arquivar não apaga lançamentos.

**Independent Test**: "Arquivar Aluguel" e "Confirmar arquivar Aluguel" removem Aluguel da lista ativa. Um lançamento antigo permanece.

### Implementation for User Story 3

- [x] T008 [US3] No item visível em `android/app/src/main/java/app/meuorcamento/ui/orcamento/OrcamentoScreen.kt`, o primeiro texto é "Arquivar {nome}" e o segundo é "Confirmar arquivar {nome}". Confirmar chama `DELETE /api/v1/itens?id=`. Toque fora desarma e não chama DELETE. O item sai da lista ativa e os lançamentos dele permanecem

**Checkpoint**: Só o segundo passo arquiva.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Fechar a frase e o roteiro do aparelho.

- [ ] T009 Rodar `npx vitest run src/domain/resumo-mes.test.ts` e o roteiro de `specs/032-android-orcamento/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational** bloqueia as três histórias
- **User Story 1** não depende do sheet nem de Arquivar
- **User Story 2** e **User Story 3** dependem da lista da história 1, porque o toque nasce na linha do item
- **Polish** depende das histórias entregues

### Parallel Opportunities

- T002 pode ser escrito antes de T003
- T007 e T008 editam a mesma tela e ficam em sequência, T007 primeiro

---

## Parallel Example: User Story 1

```text
T002 Caso da frase em src/domain/resumo-mes.test.ts
# depois
T003 Campo frase em src/domain/resumo-mes.ts e na rota do resumo
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 e Phase 2
2. Phase 3
3. Comparar os grupos com o computador antes do sheet

### Incremental Delivery

1. A lista entrega a consulta
2. O sheet entrega o plano
3. Arquivar entrega a saída do item

---

## Notes

- Implementar só com a spec em `ready`
- O primeiro texto de Arquivar aqui inclui o nome. A spec 037, no computador, deixa o primeiro texto curto de propósito
