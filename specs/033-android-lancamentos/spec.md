# Feature Specification: Lançamentos no Android

**Feature Branch**: `033-android-lancamentos`

**Created**: 2026-11-17

**Status**: implemented

**Input**: User description: "Lançamentos no Android fazem o mesmo que no computador, na casca do app."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver os lançamentos do mês (Priority: P1)

A pessoa abre Lançamentos e vê os lançamentos da competência da barra de cima. Cada linha mostra valor, data, item e meio de pagamento. Mês vazio convida a registrar um lançamento.

**Why this priority**: Sem a lista, o gasto do Resumo não tem origem visível no app.

**Independent Test**: Um mês com três lançamentos no computador mostra os mesmos três no Android, com os mesmos centavos.

**Acceptance Scenarios**:

1. **Given** lançamentos na competência aberta, **When** a pessoa abre Lançamentos, **Then** vê cada um com valor, data, item e meio.
2. **Given** um mês sem lançamentos, **When** a lista abre, **Then** a tela diz que não há lançamentos e oferece registrar.
3. **Given** a lista de novembro, **When** a pessoa vai a dezembro, **Then** a lista passa a ser a de dezembro.

---

### User Story 2 - Registrar, corrigir e apagar (Priority: P1)

A pessoa registra um lançamento com item, valor, data e pagamento. Parcelas seguem a mesma regra do computador. Ela corrige um lançamento existente e apaga outro. O Resumo e o Orçamento do mesmo mês passam a refletir a mudança.

**Why this priority**: O app não está usável se o gasto só pode ser lançado no computador.

**Independent Test**: Criar R$ 10,00 em Mercado no Android e ver o mesmo lançamento e o mesmo total no computador.

**Acceptance Scenarios**:

1. **Given** o formulário de novo lançamento, **When** a pessoa salva item, valor, data e pagamento válidos, **Then** o lançamento aparece na lista e no computador, na competência correta.
2. **Given** um lançamento existente, **When** a pessoa altera o valor e salva, **Then** o valor novo aparece na lista e nos totais do mês.
3. **Given** um lançamento, **When** a pessoa apaga e confirma, **Then** ele sai da lista e o total do mês diminui o valor dele.
4. **Given** um valor que não é um número de dinheiro, **When** a pessoa tenta salvar, **Then** nada é gravado e a mensagem diz que o valor não foi entendido.

---

### Edge Cases

- Valor zero ou negativo: não grava, e a mensagem diz que o valor precisa ser maior que zero.
- Item arquivado: não aparece para um lançamento novo.
- Sem rede no meio do salvamento: nada fica pela metade, e a pessoa pode tentar de novo.
- Parcelas: o conjunto de competências é o mesmo que o computador criaria para a mesma data, cartão e número de parcelas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Lançamentos MUST listar a competência aberta, com valor, data, item e meio.
- **FR-002**: A pessoa MUST poder criar, corrigir e apagar um lançamento, com confirmação antes de apagar.
- **FR-003**: Competência, cartão e parcelas MUST seguir as mesmas regras do computador.
- **FR-004**: Valores MUST ser centavos inteiros maiores que zero.
- **FR-005**: Depois de criar, corrigir ou apagar, os totais do mês MUST mudar de acordo.
- **FR-006**: Falha de rede ou valor inválido MUST NOT gravar parte do lançamento.
- **FR-007**: Mês vazio MUST explicar que não há lançamentos e MUST oferecer registrar.

### Key Entities

- **Lançamento**: item, valor em centavos, data, competência, meio e, se houver, cartão e parcelas.
- **Item ativo**: item que ainda pode receber lançamento novo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um lançamento criado no Android aparece no computador em até um minuto, com os mesmos centavos e a mesma competência.
- **SC-002**: Apagar um lançamento reduz o total gasto do mês exatamente no valor dele.
- **SC-003**: Uma tentativa com valor inválido não cria lançamento.
- **SC-004**: A pessoa registra um lançamento simples em menos de dois minutos a partir da lista.

## Assumptions

- A casca vem da spec 030.
- Desfazer a exclusão, se existir no computador, também existe aqui. Se o computador não desfaz, o Android também não inventa desfazer.
- Referência de comportamento: Lançamentos do computador. O protótipo não desenha esta lista por dentro. A casca visual é a do modo Android.
