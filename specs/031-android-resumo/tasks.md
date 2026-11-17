---

description: "Task list for the Android Resumo screen"
---

# Tasks: Resumo no Android

**Input**: Design documents from `/specs/031-android-resumo/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/resumo-android.md, quickstart.md. A casca 030 precisa estar presente.

**Tests**: Os centavos continuam provados por `src/domain/resumo-mes.test.ts`. Não há teste novo.

**Organization**: História 1 é o número. História 2 são as quatro linhas. Spec `draft`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode correr em paralelo (arquivos diferentes, sem depender de tarefa incompleta)
- **[Story]**: História a que a tarefa pertence

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar que a tela só lê `totais`.

- [x] T001 Confirmar que a fatia fica em `android/app/src/main/java/app/meuorcamento/ui/resumo/ResumoScreen.kt` e no tipo compartilhado de `android/app/src/main/java/app/meuorcamento/ui/navigation/AppNav.kt`, sem alterar `src/domain/resumo-mes.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: A leitura do mês vem da casca e a resposta sem totais não vira soma local.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Ler `GET /api/v1/resumo?competencia=` com a competência da casca em `android/app/src/main/java/app/meuorcamento/ui/resumo/ResumoScreen.kt`. Se `totais` vier nulo, mostrar o erro e nenhum valor de despesa

**Checkpoint**: A tela não soma `itens` nem `lancamentos`.

---

## Phase 3: User Story 1 - Ver o que ainda pode gastar (Priority: P1) 🎯 MVP

**Goal**: O primeiro conteúdo é quanto ainda pode gastar, com frase e dias no mês corrente.

**Independent Test**: No mês corrente, com despesas, o valor é a primeira informação e a frase cita os dias que restam.

### Implementation for User Story 1

- [x] T003 [US1] Abrir `android/app/src/main/java/app/meuorcamento/ui/resumo/ResumoScreen.kt` com "Ainda pode gastar" e `totais.aindaPodeGastarCentavos`. Se o valor for negativo, o título diz que passou do orçado
- [x] T004 [US1] Mostrar a parcela gasta em `android/app/src/main/java/app/meuorcamento/ui/resumo/ResumoScreen.kt` só quando o orçado de despesas é maior que zero. No mês corrente, a frase acrescenta os dias civis que restam, incluindo hoje. Fora do mês corrente, a frase não cita dias
- [x] T005 [US1] Acompanhar a frase com uma barra na cor primária em `android/app/src/main/java/app/meuorcamento/ui/resumo/ResumoScreen.kt`. A barra não usa o amarelo da marca. A frase permanece mesmo sem a barra

**Checkpoint**: O valor bate com o computador no mesmo mês e na mesma conta.

---

## Phase 4: User Story 2 - Ir ao tipo (Priority: P2)

**Goal**: Quatro linhas levam ao Orçamento daquele tipo.

**Independent Test**: Tocar "Despesas fixas" abre o Orçamento com fixas selecionadas.

### Implementation for User Story 2

- [x] T006 [US2] Listar `totais.porTipo` na ordem recebida em `android/app/src/main/java/app/meuorcamento/ui/resumo/ResumoScreen.kt`, cada linha com nome, realizado e planejado
- [x] T007 [US2] Ao toque, gravar o tipo (`R`, `F`, `V` ou `E`) na casca em `android/app/src/main/java/app/meuorcamento/ui/navigation/AppNav.kt` e abrir Orçamento a partir de `android/app/src/main/java/app/meuorcamento/ui/resumo/ResumoScreen.kt`

**Checkpoint**: Um toque chega ao tipo. Não há filtro de pagamento nem de categoria.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Conferir os centavos que a 028 já trava.

- [ ] T008 Rodar `npx vitest run src/domain/resumo-mes.test.ts` e o roteiro de `specs/031-android-resumo/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup** e **Foundational** bloqueiam as histórias
- **User Story 1** não depende da história 2
- **User Story 2** edita a mesma tela e vem depois de T005
- **Polish** depende das histórias entregues

### Parallel Opportunities

- T006 e T007 são o mesmo fluxo e ficam em sequência
- Não há par de arquivos independentes dentro da história 1

---

## Parallel Example: User Story 1

```text
# Sequência obrigatória no mesmo arquivo:
T003 Valor que ainda pode gastar
T004 Frase e dias
T005 Barra
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 e Phase 2
2. Phase 3
3. Comparar o valor com o computador antes de ligar o toque

### Incremental Delivery

1. O número entrega a pergunta principal
2. As quatro linhas entregam a passagem ao Orçamento

---

## Notes

- Implementar só com a spec em `ready` e com a casca 030 presente
- Receita não altera o quanto ainda pode gastar. Essa regra já está no servidor
