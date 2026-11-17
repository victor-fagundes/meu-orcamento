---

description: "Task list for Android Ajustes"
---

# Tasks: Ajustes no Android

**Input**: Design documents from `/specs/035-android-ajustes/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ajustes-android.md, quickstart.md

**Tests**: O plano não pede arquivo de teste novo. A prova é o roteiro cruzado com o computador.

**Organization**: História 1 é a conta. História 2 é cartão e limite. As duas são P1. Spec `draft`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode correr em paralelo (arquivos diferentes, sem depender de tarefa incompleta)
- **[Story]**: História a que a tarefa pertence

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Trazer as entradas de importar e exportar para dentro da tela.

- [x] T001 Confirmar a fatia em `android/app/src/main/java/app/meuorcamento/ui/ajustes/AjustesScreen.kt` e `android/app/src/main/java/app/meuorcamento/ui/navigation/AppNav.kt`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: A spec 036 entra por aqui, mas o fluxo dela não é desta lista.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Mover os três botões de importar planilha, importar PDF e exportar do bloco acima da tela em `android/app/src/main/java/app/meuorcamento/ui/navigation/AppNav.kt` para três linhas no fim de `android/app/src/main/java/app/meuorcamento/ui/ajustes/AjustesScreen.kt`. As linhas só navegam

**Checkpoint**: Ajustes abre as rotas que já existem. O fluxo de prévia fica na spec 036.

---

## Phase 3: User Story 1 - Ver a conta e sair (Priority: P1) 🎯 MVP

**Goal**: A pessoa reconhece a conta e sai sem deixar o orçamento na tela.

**Independent Test**: Sair e reabrir pede entrada e não lista itens da sessão anterior.

### Implementation for User Story 1

- [x] T003 [US1] Mostrar o e-mail de `GET /api/v1/conta` em `android/app/src/main/java/app/meuorcamento/ui/ajustes/AjustesScreen.kt`. Sair pede confirmação e usa o fluxo de sessão que o app já tem. Depois de sair, o orçamento não permanece na tela. Não acrescentar exclusão de conta

**Checkpoint**: Reabrir o app pede entrada.

---

## Phase 4: User Story 2 - Cartões e alertas (Priority: P1)

**Goal**: Criar e desativar cartão, e gravar o limite, com o mesmo efeito do computador.

**Independent Test**: Criar um cartão no aparelho e vê-lo no computador. Mudar o limite e ver o mesmo percentual no computador.

### Implementation for User Story 2

- [x] T004 [US2] Listar cartões ativos de `GET /api/v1/cartoes` em `android/app/src/main/java/app/meuorcamento/ui/ajustes/AjustesScreen.kt`. Criar chama `POST /api/v1/cartoes` só com apelido não vazio. Desativar pede confirmação e usa a inativação já exposta. Lançamentos antigos permanecem. Sem cartão ativo, lançamento novo não oferece cartão. Débito, PIX e dinheiro continuam
- [x] T005 [US2] Mostrar e gravar o limite com `GET` e `PUT /api/v1/limites` em `android/app/src/main/java/app/meuorcamento/ui/ajustes/AjustesScreen.kt`. O PUT só sai se o percentual inteiro está entre 1 e 100, inclusive. Fora disso, a mensagem diz o intervalo e o valor anterior permanece

**Checkpoint**: Apelido vazio e limite inválido não alteram o que já estava gravado.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Conferir conta, cartão e limite no computador.

- [ ] T006 Seguir o roteiro de `specs/035-android-ajustes/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational** bloqueia as histórias porque mexe no `AppNav.kt` e na tela
- **User Story 1** não depende de cartão nem de limite
- **User Story 2** pode seguir a Phase 2 sem esperar a história 1
- T005 edita o mesmo arquivo que T004 e vem depois

### Parallel Opportunities

- T003 pode correr depois da Phase 2 no mesmo arquivo, antes ou depois de T004, mas não ao mesmo tempo que T004
- T004 e T005 são sequenciais

---

## Parallel Example: User Story 2

```text
T004 Cartões em AjustesScreen.kt
T005 Limite de 1 a 100 no mesmo arquivo, em seguida
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 e Phase 2
2. Phase 3
3. Sair e reabrir antes de mexer em cartão

### Incremental Delivery

1. Conta e saída entregam a sessão
2. Cartão e limite entregam o que o lançamento e o alerta usam
3. As três linhas só apontam para a spec 036

---

## Notes

- Implementar só com a spec em `ready`
- Redefinir senha continua o endereço que a conta já devolve
