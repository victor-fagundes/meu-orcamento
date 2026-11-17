---

description: "Task list for the Android shell"
---

# Tasks: Casca nativa do Android

**Input**: Design documents from `/specs/030-android-casca/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/casca-android.md, quickstart.md

**Tests**: O plano não pede teste novo. A prova é o roteiro no aparelho.

**Organization**: História 1 é a barra. História 2 é o mês. Spec `draft`: estas tarefas não autorizam código antes de `ready`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode correr em paralelo (arquivos diferentes, sem depender de tarefa incompleta)
- **[Story]**: História a que a tarefa pertence

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar o recorte. O app Android já existe.

- [x] T001 Confirmar que a fatia fica em `android/app/src/main/java/app/meuorcamento/ui/navigation/AppNav.kt`, `android/app/src/main/java/app/meuorcamento/ui/CompetenciaPicker.kt` e `android/app/src/main/java/app/meuorcamento/ui/OfflineBanner.kt`, como em `specs/030-android-casca/plan.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Um mês e um tipo para as telas que a casca já abre.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Guardar em `android/app/src/main/java/app/meuorcamento/ui/navigation/AppNav.kt` a competência `YYYY-MM` e o tipo com omissão `F`. Trocar a competência não chama navegação e não escreve o tipo. Não há arquivo de orçamento no aparelho

**Checkpoint**: O estado existe. As telas ainda mostram o que já mostravam.

---

## Phase 3: User Story 1 - Andar pelo app (Priority: P1) 🎯 MVP

**Goal**: Cinco destinos na base, com ícone e texto, e o conteúdo na largura da janela.

**Independent Test**: Com sessão ativa, tocar os cinco destinos e voltar ao Resumo. A barra permanece visível.

### Implementation for User Story 1

- [x] T003 [US1] Manter em `android/app/src/main/java/app/meuorcamento/ui/navigation/AppNav.kt` os cinco itens nesta ordem: Resumo, Orçamento, Lançamentos, Ano, Ajustes. Cada um tem ícone e texto. O selecionado usa o indicador além da cor. Importar planilha, importar PDF e exportar deixam Ajustes selecionado
- [x] T004 [US1] Não aplicar largura máxima nem coluna central em `android/app/src/main/java/app/meuorcamento/ui/navigation/AppNav.kt`. O preenchimento interno das listas pode permanecer

**Checkpoint**: Os cinco destinos funcionam sem o nome novo do mês.

---

## Phase 4: User Story 2 - Mudar o mês sem sair do destino (Priority: P2)

**Goal**: O mês aparece pelo nome civil. Trocar o mês não muda o destino nem o tipo.

**Independent Test**: No Orçamento, em variáveis, avançar o mês continua em Orçamento e em variáveis.

### Implementation for User Story 2

- [x] T005 [P] [US2] Mostrar em `android/app/src/main/java/app/meuorcamento/ui/CompetenciaPicker.kt` o nome civil em pt-BR mais o ano, por exemplo "novembro de 2026". O valor enviado à API continua `YYYY-MM`. Os botões continuam com "Mês anterior" e "Próximo mês". O deslocamento só ajusta o rótulo
- [x] T006 [US2] Passar a competência compartilhada de `android/app/src/main/java/app/meuorcamento/ui/navigation/AppNav.kt` para Resumo, Orçamento e Lançamentos. Ano guarda o próprio ano. Falha de rede mostra `android/app/src/main/java/app/meuorcamento/ui/OfflineBanner.kt` e conserva a última lista ou os últimos totais, sem substituir por zeros. Sessão 401 volta ao entrar

**Checkpoint**: Três trocas de mês conservam destino e tipo.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validar a casca sem desenhar o miolo das specs 031 a 036.

- [ ] T007 Seguir o roteiro de `specs/030-android-casca/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup**: imediata
- **Foundational**: depende do Setup e bloqueia as histórias
- **User Story 1**: depende da Phase 2. Não depende da história 2
- **User Story 2**: depende da Phase 2. T006 também depende de T005
- **Polish**: depende das histórias entregues

### Parallel Opportunities

- T005 pode correr junto de T003, porque os arquivos são diferentes, depois da Phase 2
- T004 edita o mesmo arquivo que T003 e vem depois
- T006 espera T002 e T005

---

## Parallel Example: User Story 2

```text
T003 Barra dos cinco destinos em AppNav.kt
T005 Nome civil do mês em CompetenciaPicker.kt
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 e Phase 2
2. Phase 3
3. Validar a barra antes de trocar o rótulo do mês

### Incremental Delivery

1. A barra entrega a casca usável
2. O mês compartilhado entrega a história 2
3. O miolo de cada tela fica para as specs seguintes

---

## Notes

- Implementar só com a spec em `ready`
- Login não entra nesta lista
