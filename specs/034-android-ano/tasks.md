---

description: "Task list for the Android year screen"
---

# Tasks: Ano no Android

**Input**: Design documents from `/specs/034-android-ano/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ano-android.md, quickstart.md

**Tests**: O plano não pede teste novo. A prova é a amostra de células contra o computador.

**Organization**: História 1 é ler o ano. História 2 é trocar o ano. Spec `draft`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode correr em paralelo (arquivos diferentes, sem depender de tarefa incompleta)
- **[Story]**: História a que a tarefa pertence

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Uma tela, uma rota que já existe.

- [x] T001 Confirmar que a fatia fica em `android/app/src/main/java/app/meuorcamento/ui/ano/AnoScreen.kt` e não usa o seletor de mês da casca

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: A grade é a resposta do servidor.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Ler `GET /api/v1/ano?ano=` em `android/app/src/main/java/app/meuorcamento/ui/ano/AnoScreen.kt` e não somar lançamentos de novo. O ano mostrado é o último que a resposta confirmou

**Checkpoint**: Um pedido em andamento não troca o título para o ano novo.

---

## Phase 3: User Story 1 - Ler o ano (Priority: P1) 🎯 MVP

**Goal**: Planejado e realizado do ano, de borda a borda, com o valor legível.

**Independent Test**: Um item com plano e gasto em março mostra os mesmos centavos no aparelho e no computador.

### Implementation for User Story 1

- [x] T003 [US1] Mostrar em `android/app/src/main/java/app/meuorcamento/ui/ano/AnoScreen.kt` uma lista de itens na largura da janela, com os doze meses em rolagem horizontal. O nome longo quebra ou rola. O valor do mês não é cortado
- [x] T004 [US1] Quando nenhum inteiro de planejado nem de realizado é positivo, mostrar em `android/app/src/main/java/app/meuorcamento/ui/ano/AnoScreen.kt` a frase de ano sem valores, em vez de uma grade em branco

**Checkpoint**: Dez células com valor coincidem com o computador.

---

## Phase 4: User Story 2 - Mudar o ano (Priority: P2)

**Goal**: Ano anterior e seguinte mostram só os seus valores.

**Independent Test**: Sair de 2026 para 2025 troca os valores. Voltar restaura 2026.

### Implementation for User Story 2

- [x] T005 [US2] Trocar o parâmetro `ano` em `android/app/src/main/java/app/meuorcamento/ui/ano/AnoScreen.kt` e substituir a grade só depois da resposta. Falha de rede conserva a grade do ano já confirmado e avisa. Não desenha o ano pedido com zeros

**Checkpoint**: Trocar e voltar restaura os mesmos valores.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Conferir a amostra do quickstart.

- [ ] T006 Seguir o roteiro de `specs/034-android-ano/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational** bloqueia as histórias
- **User Story 1** não depende da troca de ano
- **User Story 2** edita a mesma tela e vem depois de T004
- **Polish** depende das histórias entregues

### Parallel Opportunities

- T003 e T004 são o mesmo arquivo e ficam em sequência
- Não há segundo arquivo para paralelizar

---

## Parallel Example: User Story 1

```text
T003 Lista dos doze meses
T004 Frase de ano vazio
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 e Phase 2
2. Phase 3
3. Comparar dez células antes de habilitar outro ano

### Incremental Delivery

1. O ano corrente entrega a comparação
2. A troca de ano entrega o histórico

---

## Notes

- Implementar só com a spec em `ready`
- Não copiar os cartões do site
