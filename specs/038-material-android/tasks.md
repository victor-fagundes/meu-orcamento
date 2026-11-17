---

description: "Task list for the Android Material appearance"
---

# Tasks: Aparência Material no Android

**Input**: Design documents from `/specs/038-material-android/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/aparencia-android.md, quickstart.md

**Tests**: O plano não pede teste novo. A prova é o roteiro no aparelho.

**Organization**: História 1 é a casca. História 2 é o Resumo. História 3 é a entrada. Histórias 4 e 5 são Orçamento e as telas de apoio. Spec `draft`: estas tarefas não autorizam código antes de `ready`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode correr em paralelo (arquivos diferentes, sem depender de tarefa incompleta)
- **[Story]**: História a que a tarefa pertence

## Path Conventions

- App nativo: `android/app/src/main/java/app/meuorcamento/ui/`
- Sem mudança em `src/` nem em `android/app/build.gradle.kts`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar o recorte. O app Android já existe. Nenhuma dependência nova.

- [x] T001 Confirmar que a fatia fica nos arquivos de `specs/038-material-android/plan.md` e que não se adiciona biblioteca em `android/app/build.gradle.kts`. Não alterar `versionCode` nem `versionName`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Tema e marca que todas as telas usam.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Criar `android/app/src/main/java/app/meuorcamento/ui/theme/Tema.kt` com claro e escuro. "Claro ou escuro, lido do aparelho na pintura. Não há valor salvo em Ajustes." Azul de ação `#0058BE`, contentor `#D7E3FF`, superfície `#F8F9FF` no claro e `#111318` no escuro, erro `#BA1A1A`. Amarelo `#FFE600` só na marca, não como `secondary`. Aviso `#8A7000` no claro e `#D7B07A` no escuro. Estilo do valor em 45 sp, peso regular, entrelinha 52 sp. Marca quadrada com cantos de 10 dp e a letra M. "Amarelo do produto com a inicial M. Não colore barra, chip, pílula nem aviso."
- [x] T003 Aplicar esse tema em `android/app/src/main/java/app/meuorcamento/ui/MainActivity.kt` segundo o tema do aparelho, no lugar do `lightColorScheme` fixo

**Checkpoint**: O app abre no claro ou no escuro do aparelho. As telas ainda têm a composição antiga.

---

## Phase 3: User Story 1 - Reconhecer o app pelo mês e pelo destino (Priority: P1) 🎯 MVP

**Goal**: A barra de cima é o mês, o ano ou "Ajustes". A barra de baixo marca o destino com pílula e nome. Não há um segundo título com o nome do destino.

**Independent Test**: Com sessão ativa, percorrer Resumo, Orçamento e Lançamentos. Em cada um, o título da barra é o mês civil com o ano, e o destino tocado fica com a pílula.

### Implementation for User Story 1

- [x] T004 [US1] Transformar `android/app/src/main/java/app/meuorcamento/ui/CompetenciaPicker.kt` na barra de cima. "Mês civil e ano nas telas de mês." Exemplo visível: "novembro de 2026". Botões com nome "Mês anterior" e "Próximo mês". O valor enviado à API continua `YYYY-MM`. Trocar o mês não navega e não escreve o tipo
- [x] T005 [P] [US1] Em `android/app/src/main/java/app/meuorcamento/ui/navigation/AppNav.kt`, manter os cinco itens nesta ordem: Resumo, Orçamento, Lançamentos, Ano, Ajustes, com ícone e nome sempre visíveis. A pílula do ativo usa o contentor azul, não o amarelo. "Os cinco de hoje. Importar e exportar não mudam o destino marcado."
- [x] T006 [US1] Usar a barra de `android/app/src/main/java/app/meuorcamento/ui/CompetenciaPicker.kt` e remover o título "Resumo", "Orçamento" e "Lançamentos" em `android/app/src/main/java/app/meuorcamento/ui/resumo/ResumoScreen.kt`, `android/app/src/main/java/app/meuorcamento/ui/orcamento/OrcamentoScreen.kt` e `android/app/src/main/java/app/meuorcamento/ui/lancamentos/LancamentosScreen.kt`
- [x] T007 [P] [US1] Em `android/app/src/main/java/app/meuorcamento/ui/ano/AnoScreen.kt`, a barra mostra o ano confirmado, com ano anterior e próximo, sem o título "Ano". "Ano confirmado na tela Ano." A grade dos doze meses só troca depois da resposta; se falhar, o ano anterior confirmado permanece
- [x] T008 [P] [US1] Em `android/app/src/main/java/app/meuorcamento/ui/ajustes/AjustesScreen.kt`, a barra de cima diz "Ajustes" e não há seletor de tema

**Checkpoint**: Mês, ano e Ajustes estão na barra. O miolo das listas ainda é o de hoje.

---

## Phase 4: User Story 2 - Ler quanto ainda pode gastar (Priority: P1)

**Goal**: No Resumo, o valor é o maior texto, seguido da frase, da barra e das quatro linhas.

**Independent Test**: No mês corrente, com plano e gasto, o valor que ainda pode gastar é o maior texto, e tocar "Despesas fixas" abre o Orçamento em fixas.

### Implementation for User Story 2

- [x] T009 [US2] Recompor `android/app/src/main/java/app/meuorcamento/ui/resumo/ResumoScreen.kt` nesta ordem: "Ainda pode gastar" ou "Passou do orçado", valor no estilo de 45 sp, frase, barra de 4 dp, quatro linhas (Receitas, Despesas fixas, Despesas variáveis, Anuais). "Centavos já calculados, só na formatação em reais. Negativo usa cor de erro." "Nome, valor à direita, detalhe secundário. O valor permanece na mesma faixa se o nome for longo." A barra não é amarela. Toque na linha abre o Orçamento no tipo, no mesmo mês. Mês sem plano e sem gasto mostra zero legível, sem porcentagem inventada, e as quatro linhas continuam. Não alterar o cálculo das specs 028 e 031

**Checkpoint**: O Resumo bate com o protótipo. Orçamento e entrada ainda podem estar na composição antiga.

---

## Phase 5: User Story 3 - Entrar com a cara do app (Priority: P1)

**Goal**: A entrada mostra a marca, um botão preenchido e a troca de modo como texto.

**Independent Test**: Abrir o app sem sessão, ver a marca e "Entrar", tocar "Criar conta" e voltar com "Já tenho conta".

### Implementation for User Story 3

- [x] T010 [P] [US3] Recompor `android/app/src/main/java/app/meuorcamento/ui/auth/LoginScreen.kt` alinhado à esquerda, a partir do topo. Marca de `android/app/src/main/java/app/meuorcamento/ui/theme/Tema.kt`, "Meu Orçamento", E-mail e Senha. "E-mail, senha e, no cadastro, nome. Um botão preenchido. A ação de troca de modo é texto." O botão preenchido diz "Entrar" ou "Cadastrar". O texto diz "Criar conta" ou "Já tenho conta". Falha conserva o que foi digitado. Sem rede mostra aviso recuperável. `demo@local.test` na versão publicada não abre sessão. Não trazer "Esqueci a senha" para esta tela

**Checkpoint**: A entrada está pronta sem depender do miolo do Resumo.

---

## Phase 6: User Story 4 - Acompanhar o Orçamento no mesmo desenho (Priority: P2)

**Goal**: Chips, "Ainda cabe" em display, linhas com barra e painel com canto de 28 dp.

**Independent Test**: Abrir Despesas fixas, ler um grupo dentro do plano e um em 100%, abrir o plano de um item e cancelar sem gravar.

### Implementation for User Story 4

- [x] T011 [US4] Recompor `android/app/src/main/java/app/meuorcamento/ui/orcamento/OrcamentoScreen.kt` com chips Receitas, Fixas, Variáveis e Anuais, o ativo no contentor. "Ainda cabe em {tipo}" no estilo de 45 sp. Linha de grupo com frase e barra. "Azul dentro do plano. Aviso a partir de 80%, inclusive 100%. Erro só acima de 100%. Altura de 4 dp." Manter `corBarra`. Grupos zerados só depois de "Sem movimento neste mês", e continuam abríveis. "O valor permanece na mesma faixa se o nome for longo."
- [x] T012 [US4] No `ModalBottomSheet` de `android/app/src/main/java/app/meuorcamento/ui/orcamento/OrcamentoScreen.kt`, canto superior de 28 dp, foco no mês aberto, e Cancelar, toque fora e voltar sem gravar. Não mudar o que o salvar envia

**Checkpoint**: Orçamento e plano batem com o protótipo. Arquivar continua no mesmo passo de hoje.

---

## Phase 7: User Story 5 - Lançamentos, Ano e Ajustes na mesma língua (Priority: P2)

**Goal**: As três telas usam a mesma lista, com o valor à direita e um só botão preenchido quando há ação principal.

**Independent Test**: Abrir um mês com lançamentos, o ano com valores e Ajustes com um cartão ativo. Os números e as ações são os de hoje.

### Implementation for User Story 5

- [x] T013 [P] [US5] Em `android/app/src/main/java/app/meuorcamento/ui/lancamentos/LancamentosScreen.kt`, cada linha mostra descrição, detalhe (data, item, meio) e o valor à direita. "O valor permanece na mesma faixa se o nome for longo." Mês vazio explica e oferece registrar com um único botão preenchido. Não criar botão flutuante
- [x] T014 [P] [US5] Em `android/app/src/main/java/app/meuorcamento/ui/ano/AnoScreen.kt`, os doze meses seguem a mesma lista, com o valor visível. Trocar o ano só substitui a grade depois da resposta
- [x] T015 [P] [US5] Em `android/app/src/main/java/app/meuorcamento/ui/ajustes/AjustesScreen.kt`, e-mail, sair com confirmação, cartões ativos, limite e, no fim, linhas para importar planilha, importar fatura e exportar. "Esqueci a senha" permanece aqui. Não surge exclusão de conta

**Checkpoint**: Sair do Resumo não volta ao visual genérico.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Títulos das tarefas de dados e o roteiro de aceitação.

- [x] T016 [P] A barra de `android/app/src/main/java/app/meuorcamento/ui/importacao/PlanilhaImportScreen.kt` mostra "Importar planilha". "Nome da tarefa em importar e exportar." Ajustes segue selecionado
- [x] T017 [P] A barra de `android/app/src/main/java/app/meuorcamento/ui/importacao/PdfImportScreen.kt` mostra "Importar fatura". Ajustes segue selecionado
- [x] T018 [P] A barra de `android/app/src/main/java/app/meuorcamento/ui/exportacao/ExportScreen.kt` mostra "Exportar". Ajustes segue selecionado
- [x] T019 Gerar o APK de produção em `android/app/build/outputs/apk/prod/debug/` sem editar `versionCode` nem `versionName` em `android/app/build.gradle.kts`
- [ ] T020 Seguir o roteiro de `specs/038-material-android/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: começa imediato
- **Foundational (Phase 2)**: depende do Setup e bloqueia todas as histórias
- **Histórias (Phase 3+)**: dependem do Foundational
- **Polish (Phase 8)**: depende das histórias desejadas

### User Story Dependencies

- **User Story 1 (P1)**: começa depois do Foundational. Não depende das outras
- **User Story 2 (P1)**: depois de T006, porque o Resumo já não tem o título antigo. Testável sem a entrada e sem o miolo do Orçamento
- **User Story 3 (P1)**: depois do Foundational. Não depende das histórias 1, 2, 4 ou 5
- **User Story 4 (P2)**: depois de T006, para não recolocar o título "Orçamento"
- **User Story 5 (P2)**: depois de T006, T007 e T008, para não recolocar os títulos antigos

### Within Each User Story

- T004 antes de T006
- T011 antes de T012, no mesmo arquivo
- Sem tarefas de teste automatizado

### Parallel Opportunities

- T005, T007 e T008 correm em paralelo com T004
- T010 corre em paralelo com a história 2
- T013, T014 e T015 correm em paralelo
- T016, T017 e T018 correm em paralelo

---

## Parallel Example: User Story 1

```bash
# Depois de T002 e T003:
Task: "T004 Barra do mês em CompetenciaPicker.kt"
Task: "T005 Pílula em AppNav.kt"
Task: "T007 Ano confirmado em AnoScreen.kt"
Task: "T008 Título Ajustes em AjustesScreen.kt"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 e Phase 2
2. Completar Phase 3
3. Parar e validar a casca: mês na barra, pílula, claro e escuro
4. A demo que responde ao desenho do protótipo inclui também as histórias 2 e 3, as duas P1

### Incremental Delivery

1. Setup + Foundational
2. História 1, a casca
3. História 2, o Resumo, e história 3, a entrada
4. História 4, o Orçamento
5. História 5, Lançamentos, Ano e Ajustes
6. Phase 8, o APK e o roteiro

---

## Notes

- [P] marca arquivo diferente, sem depender de tarefa incompleta
- Não alterar `src/domain`, a API, o computador nem `versionCode`
- O amarelo não pinta barra, chip, pílula nem aviso
- Cada história se testa pelo critério independente antes de seguir
