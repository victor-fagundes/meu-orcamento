---

description: "Task list for Android import and export"
---

# Tasks: Trazer e levar dados no Android

**Input**: Design documents from `/specs/036-android-traz-dados/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/traz-dados-android.md, quickstart.md. A entrada está na spec 035.

**Tests**: O destino do mês já tem teste em `src/domain/navegacao-mes.test.ts`. Esta lista não pede parser novo.

**Organization**: História 1 é a planilha. História 2 é o PDF. História 3 é exportar. Spec `draft`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode correr em paralelo (arquivos diferentes, sem depender de tarefa incompleta)
- **[Story]**: História a que a tarefa pertence

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Três telas e a resposta de confirmação.

- [x] T001 Confirmar a fatia em `android/app/src/main/java/app/meuorcamento/ui/importacao/PlanilhaImportScreen.kt`, `android/app/src/main/java/app/meuorcamento/ui/importacao/PdfImportScreen.kt`, `android/app/src/main/java/app/meuorcamento/ui/exportacao/ExportScreen.kt` e `src/app/api/v1/import/planilha/confirm/route.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: O mês de chegada é calculado uma vez, no servidor.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Incluir `abrirCompetencia` na resposta de lançamentos em `src/app/api/v1/import/planilha/confirm/route.ts`, com o resultado de `competenciaDestinoImport` em `src/domain/navegacao-mes.ts`. O mês corrente entra se foi gravado. Senão, entra a competência mais recente. Planejamento, com competências vazias, não devolve mês de destino. Não reimplementar essa escolha em Kotlin

**Checkpoint**: `npx vitest run src/domain/navegacao-mes.test.ts` continua verde.

---

## Phase 3: User Story 1 - Importar a planilha com prévia (Priority: P1) 🎯 MVP

**Goal**: A pessoa vê o que será gravado e só então confirma. Cancelar não grava.

**Independent Test**: A mesma planilha aceita no computador produz os mesmos centavos no aparelho. Cancelar deixa a conta igual.

### Implementation for User Story 1

- [x] T003 [US1] Em `android/app/src/main/java/app/meuorcamento/ui/importacao/PlanilhaImportScreen.kt`, chamar `POST /api/v1/import/planilha/parse` e depois `POST /api/v1/import/planilha/preview`, e mostrar as linhas. Linha que pede grupo não entra no confirm sem escolha. Confirmar envia `escolhas` para `POST /api/v1/import/planilha/confirm`. Cancelar apaga a prévia local e não chama confirm
- [x] T004 [US1] Quando a resposta trouxer `abrirCompetencia`, gravar esse mês na casca e abrir Lançamentos a partir de `android/app/src/main/java/app/meuorcamento/ui/importacao/PlanilhaImportScreen.kt`. Importação de planejamento não muda o mês

**Checkpoint**: Cancelar a prévia deixa a conta igual no computador.

---

## Phase 4: User Story 2 - Importar o PDF da fatura (Priority: P2)

**Goal**: Prévia, confirmar ou cancelar, com as mesmas recusas do computador.

**Independent Test**: Um PDF aceito no computador gera as mesmas linhas. Um PDF recusado não cria lançamento.

### Implementation for User Story 2

- [x] T005 [P] [US2] Mostrar a prévia de `POST /api/v1/import/pdf/parse` em `android/app/src/main/java/app/meuorcamento/ui/importacao/PdfImportScreen.kt`. Confirmar chama `POST /api/v1/import/pdf/confirm` com o cartão. Recusa do servidor não cria lançamento e mostra a mensagem da rota. Cancelar não confirma

**Checkpoint**: Cancelar o PDF não grava.

---

## Phase 5: User Story 3 - Exportar (Priority: P2)

**Goal**: O arquivo tem os mesmos valores da exportação do computador.

**Independent Test**: Exportar nas duas pontas, na mesma conta, e comparar os valores.

### Implementation for User Story 3

- [x] T006 [P] [US3] Partilhar `GET /api/v1/export/csv` e `GET /api/v1/export/json` em `android/app/src/main/java/app/meuorcamento/ui/exportacao/ExportScreen.kt`. Falha no meio não oferece o corpo como arquivo completo. Conta sem lançamentos avisa que não havia movimento

**Checkpoint**: Uma falha não entrega arquivo completo.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: O destino do mês e o roteiro no aparelho.

- [ ] T007 Rodar `npx vitest run src/domain/navegacao-mes.test.ts` e o roteiro de `specs/036-android-traz-dados/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Foundational** bloqueia a história 1, porque T004 lê `abrirCompetencia`
- **User Story 2** e **User Story 3** não dependem da planilha e podem seguir a Phase 1
- **Polish** depende das histórias entregues

### Parallel Opportunities

- T005 e T006 são arquivos diferentes e podem correr juntos depois da Phase 1
- T003 e T004 são o mesmo arquivo, nesta ordem, e esperam T002

---

## Parallel Example: User Story 2

```text
T005 Prévia do PDF em PdfImportScreen.kt
T006 Exportação em ExportScreen.kt
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 e Phase 2
2. Phase 3
3. Cancelar uma prévia e conferir a conta no computador antes de PDF e exportação

### Incremental Delivery

1. A planilha entrega a entrada principal
2. O PDF entrega a fatura
3. A exportação entrega a saída

---

## Notes

- Implementar só com a spec em `ready`
- O aparelho não lê a planilha nem o PDF por conta própria
- Arquivo acima do limite que a rota recusa não grava
