# Feature Specification: Ano no Android

**Feature Branch**: `034-android-ano`

**Created**: 2026-11-17

**Status**: implemented

**Input**: User description: "O Ano no Android mostra o mesmo ano do computador, na casca do app."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ler o ano (Priority: P1)

A pessoa abre Ano e vê o ano corrente, com planejado e realizado ao longo dos meses. Os valores batem com o computador para a mesma conta e o mesmo ano.

**Why this priority**: O ano é o único lugar em que a pessoa compara os doze meses.

**Independent Test**: Um item com plano em março e gasto em março mostra os mesmos centavos no Android e no computador.

**Acceptance Scenarios**:

1. **Given** a conta com movimento no ano, **When** a pessoa abre Ano, **Then** vê planejado e realizado desse ano.
2. **Given** o mesmo item no computador e no Android, **When** a pessoa compara um mês, **Then** os centavos de planejado e de realizado são iguais.
3. **Given** o ano sem movimento, **When** Ano abre, **Then** a tela diz que não há valores nesse ano.

---

### User Story 2 - Mudar o ano (Priority: P2)

A pessoa vai ao ano anterior e ao seguinte. Cada ano mostra só os seus valores.

**Why this priority**: Sem trocar o ano, o histórico fica preso no ano corrente.

**Independent Test**: Sair de 2026 para 2025 troca os valores e não mistura meses dos dois anos.

**Acceptance Scenarios**:

1. **Given** o ano de 2026, **When** a pessoa abre 2025, **Then** os valores passam a ser os de 2025.
2. **Given** a troca de ano, **When** a pessoa volta a 2026, **Then** os valores de 2026 retornam.

---

### Edge Cases

- Ano futuro sem dados: a tela fica vazia com a frase de ano sem valores, sem erro.
- Sem rede: aviso recuperável, sem tabela local antiga apresentada como atual.
- Nome longo de item: o nome continua legível, e o valor não é cortado no lugar do nome.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Ano MUST mostrar planejado e realizado do ano aberto.
- **FR-002**: Os centavos de cada item e mês MUST igualar o computador para a mesma conta e o mesmo ano.
- **FR-003**: A pessoa MUST poder ir ao ano anterior e ao seguinte.
- **FR-004**: Ano sem valores MUST dizer isso, em vez de mostrar uma grade em branco sem frase.
- **FR-005**: Falha de carga MUST ser recuperável e MUST NOT mostrar outro ano como se fosse o pedido.

### Key Entities

- **Ano**: doze meses de planejado e realizado da conta.
- **Célula**: o valor de um item em um mês, planejado ou realizado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em uma amostra de pelo menos dez células com valor, Android e computador coincidem.
- **SC-002**: Trocar de ano e voltar restaura os mesmos valores.
- **SC-003**: A pessoa identifica o ano aberto em menos de cinco segundos.

## Assumptions

- A casca vem da spec 030. Ano não usa o seletor de mês. Usa o ano.
- A regra do que entra em cada mês é a do computador. Esta spec não cria outra competência.
- O protótipo não desenha o miolo do Ano. O comportamento é o do computador. A apresentação é nativa, de borda a borda, sem cartões copiados do site.
