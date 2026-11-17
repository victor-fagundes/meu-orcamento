# Feature Specification: Resumo no Android

**Feature Branch**: `031-android-resumo`

**Created**: 2026-11-17

**Status**: implemented

**Input**: User description: "O Resumo do Android segue o protótipo: o que ainda pode gastar abre a tela."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver o que ainda pode gastar (Priority: P1)

A pessoa abre o Resumo e o primeiro conteúdo é quanto ainda pode gastar naquele mês. Abaixo, uma frase diz a parte já gasta e, no mês corrente, quantos dias restam. Uma barra acompanha a frase. A barra não é o único sinal.

**Why this priority**: É a pergunta que a pessoa abre o app para responder.

**Independent Test**: No mês corrente, com despesas lançadas, o valor que ainda pode gastar é a primeira informação, e a frase cita os dias que restam.

**Acceptance Scenarios**:

1. **Given** um mês com orçado maior que o gasto, **When** a pessoa abre o Resumo, **Then** vê "Ainda pode gastar" e o valor antes das linhas de tipo.
2. **Given** o mês corrente, **When** o Resumo abre, **Then** a frase diz a parcela já gasta e quantos dias restam.
3. **Given** o gasto maior que o orçado, **When** o Resumo abre, **Then** o título diz que passou do orçado e o valor é negativo.

---

### User Story 2 - Ir ao tipo (Priority: P2)

Quatro linhas mostram receitas, despesas fixas, despesas variáveis e anuais, cada uma com realizado e planejado. Tocar a linha abre o Orçamento naquele tipo.

**Why this priority**: O protótipo troca o "Ver detalhes" repetido por uma linha que já é o destino.

**Independent Test**: Tocar "Despesas fixas" abre o Orçamento com fixas selecionadas.

**Acceptance Scenarios**:

1. **Given** o Resumo, **When** a pessoa lê as quatro linhas, **Then** cada uma tem o nome do tipo, o realizado e o planejado.
2. **Given** a linha de variáveis, **When** a pessoa toca, **Then** o Orçamento abre em variáveis.

---

### Edge Cases

- Mês sem lançamentos e sem plano de despesa: ainda pode gastar é zero e as quatro linhas existem, mesmo zeradas.
- Os totais do mês não chegam: a tela diz que não carregou e não mostra uma soma inventada.
- Receita não altera o quanto ainda pode gastar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O Resumo MUST abrir com o quanto ainda pode gastar no mês.
- **FR-002**: A frase MUST dizer a parte já gasta. No mês corrente, MUST dizer quantos dias restam.
- **FR-003**: Uma indicação visual de progresso MUST existir junto da frase e MUST NOT ser o único meio de entender o estado.
- **FR-004**: O Resumo MUST listar os quatro tipos com realizado e planejado.
- **FR-005**: Tocar um tipo MUST abrir o Orçamento com esse tipo selecionado.
- **FR-006**: Os centavos MUST ser os da spec 028 para a mesma conta e o mesmo mês.
- **FR-007**: Se os totais não estiverem disponíveis, a tela MUST avisar e MUST NOT calcular outro total.

### Key Entities

- **Ainda pode gastar**: orçado de despesas menos gasto de despesas no mês. Pode ser negativo.
- **Linha de tipo**: realizado e planejado de um tipo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em um teste com a mesma conta e o mesmo mês, o valor que ainda pode gastar no Android é igual ao do computador.
- **SC-002**: As quatro linhas de tipo batem com o computador em realizado e planejado.
- **SC-003**: Tocar uma linha leva ao Orçamento daquele tipo em um único toque.
- **SC-004**: Com totais indisponíveis, nenhum valor de despesa é exibido como se fosse verdadeiro.

## Assumptions

- A casca (mês na barra, navegação embaixo) vem da spec 030.
- Não há filtro de pagamento nem de categoria nesta tela.
- Referência visual: proposta de 17 nov 2026, Resumo no modo Android.
