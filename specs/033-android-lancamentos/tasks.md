---

description: "Task list for Android Lançamentos"
---

# Tasks: Lançamentos no Android

**Input**: Design documents from `/specs/033-android-lancamentos/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/lancamentos-android.md, quickstart.md. Mês da casca 030.

**Tests**: O plano não pede teste novo. Criar, corrigir e apagar continuam no domínio do computador.

**Organization**: História 1 é a lista. História 2 é registrar, corrigir e apagar. As duas são P1. Spec `draft`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode correr em paralelo (arquivos diferentes, sem depender de tarefa incompleta)
- **[Story]**: História a que a tarefa pertence

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Uma tela, as rotas que já existem.

- [x] T001 Confirmar que a fatia fica em `android/app/src/main/java/app/meuorcamento/ui/lancamentos/LancamentosScreen.kt` e não cria rota nova

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: A lista usa o mês da casca e não zera no erro.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Buscar `GET /api/v1/lancamentos?competencia=` com a competência da casca em `android/app/src/main/java/app/meuorcamento/ui/lancamentos/LancamentosScreen.kt`. Falha de rede conserva a lista anterior e mostra o aviso

**Checkpoint**: A competência enviada é `YYYY-MM`, não o nome civil.

---

## Phase 3: User Story 1 - Ver os lançamentos do mês (Priority: P1) 🎯 MVP

**Goal**: Cada linha mostra valor, data, item e meio. Mês vazio explica.

**Independent Test**: Três lançamentos do computador aparecem no aparelho com os mesmos centavos.

### Implementation for User Story 1

- [x] T003 [US1] Mostrar em cada linha de `android/app/src/main/java/app/meuorcamento/ui/lancamentos/LancamentosScreen.kt` o valor formatado, a data, o nome do item e o meio. Lista vazia diz que não há lançamentos e oferece registrar

**Checkpoint**: A lista se compara ao computador sem abrir o formulário.

---

## Phase 4: User Story 2 - Registrar, corrigir e apagar (Priority: P1)

**Goal**: Criar, corrigir e apagar com as mesmas regras do computador.

**Independent Test**: Criar R$ 10,00 em Mercado no aparelho e ver o mesmo lançamento no computador.

### Implementation for User Story 2

- [x] T004 [US2] Aceitar reais, como "10,50", em `android/app/src/main/java/app/meuorcamento/ui/lancamentos/LancamentosScreen.kt` e converter na borda para `valorCentavos` inteiro. Texto ilegível, zero e negativo não chamam a API. A data é um seletor, não um campo ISO livre. O JSON continua com `dataISO` e `valorCentavos`
- [x] T005 [US2] Oferecer pagamento `deb`, `pix`, `din` ou o id de um cartão ativo de `GET /api/v1/cartoes` em `android/app/src/main/java/app/meuorcamento/ui/lancamentos/LancamentosScreen.kt`. Itens vêm de `GET /api/v1/itens` e excluem arquivados. Parcelas só quando o computador também parcelaria. No `PATCH` ou `DELETE` de um parcelado, perguntar o mesmo `scope` que o computador pergunta
- [x] T006 [US2] Apagar só depois da confirmação, chamando `DELETE /api/v1/lancamentos/{id}` em `android/app/src/main/java/app/meuorcamento/ui/lancamentos/LancamentosScreen.kt`. Não há desfazer. Criar usa `POST /api/v1/lancamentos`. Corrigir usa `PATCH /api/v1/lancamentos/{id}`

**Checkpoint**: Um valor inválido não cria lançamento.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Conferir a paridade no computador.

- [ ] T007 Seguir o roteiro de `specs/033-android-lancamentos/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational** bloqueia as duas histórias
- **User Story 1** não depende do formulário
- **User Story 2** depende da lista, porque o vazio e a edição nascem nela
- T004, T005 e T006 editam o mesmo arquivo, nesta ordem

### Parallel Opportunities

- Não há segundo arquivo nesta fatia. As tarefas da história 2 são sequenciais

---

## Parallel Example: User Story 2

```text
T004 Valor em reais e data
T005 Meio, item e parcelas
T006 Criar, corrigir e apagar
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 e Phase 2
2. Phase 3
3. Comparar três linhas com o computador antes do formulário

### Incremental Delivery

1. A lista torna o gasto visível
2. O formulário torna o app capaz de lançar

---

## Notes

- Implementar só com a spec em `ready`
- Competência, parcelas e validação ficam nas funções que a API já chama
