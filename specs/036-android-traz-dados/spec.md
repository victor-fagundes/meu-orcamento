# Feature Specification: Trazer e levar dados no Android

**Feature Branch**: `036-android-traz-dados`

**Created**: 2026-11-17

**Status**: implemented

**Input**: User description: "Importar planilha, importar PDF e exportar no Android seguem as regras do computador."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Importar a planilha com prévia (Priority: P1)

A pessoa escolhe uma planilha a partir de Ajustes, vê a prévia e confirma. O que é gravado segue as mesmas regras do computador: destino do item, meses e duplicados. Cancelar não grava. Depois da confirmação ela entende em que mês os lançamentos caíram.

**Why this priority**: A conta real entra pela planilha. Sem isso o app não recebe o histórico.

**Independent Test**: A mesma planilha aceita no computador, importada no Android, produz os mesmos itens e os mesmos centavos.

**Acceptance Scenarios**:

1. **Given** uma planilha válida, **When** a pessoa pede a prévia, **Then** vê o que será gravado antes de confirmar.
2. **Given** a prévia, **When** a pessoa confirma, **Then** o resultado é o mesmo que o computador gravaria com esse arquivo.
3. **Given** a prévia, **When** a pessoa cancela, **Then** nenhum item nem lançamento novo aparece.
4. **Given** a confirmação de lançamentos, **When** a tela seguinte abre, **Then** ela está no mês em que a importação chegou, pela mesma regra do computador.

---

### User Story 2 - Importar o PDF da fatura (Priority: P2)

A pessoa escolhe um PDF de fatura, vê a prévia do que foi lido e confirma ou cancela. Limites e falhas de leitura são os mesmos do computador.

**Why this priority**: A fatura é o outro caminho de entrada já existente no computador.

**Independent Test**: Um PDF já aceito no computador gera as mesmas linhas no Android. Um arquivo que o computador recusa é recusado aqui, com o motivo.

**Acceptance Scenarios**:

1. **Given** um PDF que o computador lê, **When** a pessoa confirma no Android, **Then** as linhas e os centavos coincidem.
2. **Given** um arquivo que o computador não lê, **When** a pessoa tenta importar, **Then** nada é gravado e a mensagem diz por quê.
3. **Given** a prévia do PDF, **When** a pessoa cancela, **Then** nada é gravado.

---

### User Story 3 - Exportar (Priority: P2)

A pessoa exporta a partir de Ajustes e recebe o mesmo tipo de arquivo que o computador gera para a mesma conta.

**Why this priority**: Sem exportar, a saída dos dados fica presa ao computador.

**Independent Test**: Exportar no Android e no computador, na mesma conta, produz arquivos com os mesmos valores.

**Acceptance Scenarios**:

1. **Given** uma conta com dados, **When** a pessoa exporta, **Then** recebe um arquivo que ela consegue guardar e abrir.
2. **Given** o mesmo conjunto de dados, **When** a pessoa compara com a exportação do computador, **Then** os valores coincidem.
3. **Given** falha no meio da exportação, **When** a tela avisa, **Then** nenhum arquivo parcial é apresentado como completo.

---

### Edge Cases

- Arquivo maior do que o computador aceita: recusa antes de gravar, com o limite dito na mensagem.
- Prévia com linhas para escolher grupo: a pessoa escolhe antes de confirmar. Sem escolha válida, aquela linha não é gravada.
- Sem rede durante a confirmação: nada fica pela metade, e a pessoa pode repetir.
- Conta sem dados na exportação: o arquivo sai vazio de movimento e a tela diz que não havia lançamentos a levar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A pessoa MUST poder pedir a prévia de uma planilha e MUST confirmar ou cancelar antes de gravar.
- **FR-002**: Confirmar a planilha MUST aplicar as mesmas regras de destino, meses e duplicados do computador.
- **FR-003**: Cancelar uma prévia MUST NOT gravar.
- **FR-004**: Depois de importar lançamentos, a pessoa MUST chegar ao mês pela mesma regra do computador.
- **FR-005**: Importar PDF MUST aceitar e recusar os mesmos casos que o computador, com mensagem quando recusar.
- **FR-006**: Exportar MUST entregar o mesmo conteúdo de valores que a exportação do computador para a mesma conta.
- **FR-007**: Arquivo acima do limite ou falha de rede MUST NOT gravar um resultado parcial.
- **FR-008**: O caminho de entrada MUST ser Ajustes, como a spec 035 aponta.

### Key Entities

- **Prévia**: o que será gravado se a pessoa confirmar.
- **Arquivo de saída**: o conjunto de valores da conta no formato que o computador já entrega.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Uma planilha de teste já usada no computador produz os mesmos centavos quando importada no Android.
- **SC-002**: Cancelar a prévia deixa a conta igual, verificada em seguida no computador.
- **SC-003**: Um PDF recusado no computador é recusado no Android sem criar lançamento.
- **SC-004**: A exportação do Android e a do computador, na mesma conta, têm os mesmos valores.

## Assumptions

- As regras de importação e exportação já aceitas no computador não são reescritas. O Android só as executa.
- A casca vem da spec 030. A entrada vem de Ajustes, spec 035.
- O protótipo não desenha estas telas por dentro. O comportamento é o do computador. A apresentação é nativa.
