# Feature Specification: Revisão pontual do computador

**Feature Branch**: `029-computador-revisao`

**Created**: 2026-11-17

**Status**: implemented

**Input**: User description: "Manter o design do computador e revisar só o que o protótipo muda."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ler o mês sem perder o número (Priority: P1)

A pessoa abre o Resumo no computador e vê, primeiro, quanto ainda pode gastar, o total orçado e o total gasto. A média diária, os dias que restam e os filtros vêm depois desses números. Escolher um pagamento não apaga o quanto ainda pode gastar.

**Why this priority**: O número principal do produto estava atrás de filtro e de ritmo, e sumia quando o pagamento era filtrado.

**Independent Test**: No Resumo de um mês com despesas, a ordem da tela coloca os três números antes da média e dos filtros. Com PIX selecionado, o valor que ainda pode gastar no mês continua visível, e a frase diz quanto foi naquele pagamento.

**Acceptance Scenarios**:

1. **Given** um mês com orçado e gasto, **When** a pessoa abre o Resumo, **Then** ainda pode gastar, total orçado e total gasto aparecem antes da média diária e dos filtros.
2. **Given** o Resumo aberto, **When** a pessoa filtra por um pagamento, **Then** o quanto ainda pode gastar no mês inteiro permanece, e a frase informa o gasto daquele pagamento.
3. **Given** os cartões de tipo, **When** a pessoa lê o link de cada um, **Then** o texto nomeia o tipo (receitas, despesas fixas, despesas variáveis, anuais).

---

### User Story 2 - Ver o que ainda cabe no Orçamento (Priority: P1)

No Orçamento, o cartão do tipo mostra o que ainda cabe. A fração gasto/planejado fica secundária. Grupos sem plano e sem gasto no mês ficam em "Sem movimento neste mês" e continuam alcançáveis. Trocar o mês não troca o tipo escolhido. A barra de "perto do limite" não usa o amarelo da marca, e uma frase diz o estado.

**Why this priority**: O Orçamento do computador já existe. A revisão só torna o restante e os grupos zerados legíveis.

**Independent Test**: Em despesas fixas, o cartão mostra o que ainda cabe. Um grupo zerado só aparece dentro de "Sem movimento". Avançar o mês mantém o tipo.

**Acceptance Scenarios**:

1. **Given** despesas fixas com plano e gasto, **When** a pessoa abre o Orçamento nesse tipo, **Then** o destaque é o que ainda cabe, com gasto e planejado ao lado.
2. **Given** um grupo com plano 0 e realizado 0, **When** a lista abre, **Then** ele fica sob "Sem movimento neste mês" e pode ser visto.
3. **Given** variáveis selecionadas, **When** a pessoa muda o mês, **Then** variáveis continuam selecionadas.
4. **Given** um grupo perto do limite, **When** a pessoa olha a barra, **Then** a barra não é o amarelo da marca e a frase diz que está perto do limite.

---

### Edge Cases

- Mês sem despesas: ainda pode gastar mostra zero, e os filtros continuam abaixo.
- Mês estourado: o valor que ainda pode gastar fica negativo e a frase diz que passou do orçado.
- Filtro de categoria não apaga o quanto ainda pode gastar no mês.
- Tipo sem grupos: o Orçamento diz que não há nada desse tipo no mês e oferece criar item.
- Lançamentos, Ano, Ajustes, gráficos e a navegação de cima permanecem como estão.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O Resumo no computador MUST mostrar ainda pode gastar, total orçado e total gasto antes da média diária, dos dias restantes e dos filtros.
- **FR-002**: Filtrar por pagamento ou categoria MUST NOT substituir o quanto ainda pode gastar no mês por um vazio. A frase MUST dizer o recorte do filtro.
- **FR-003**: Cada atalho de tipo MUST nomear o tipo de destino.
- **FR-004**: O cartão do tipo no Orçamento MUST destacar o que ainda cabe e MUST manter gasto e planejado visíveis.
- **FR-005**: Grupos com plano e realizado zerados no mês MUST ficar sob "Sem movimento neste mês" e MUST continuar alcançáveis.
- **FR-006**: Trocar o mês no Orçamento MUST preservar o tipo selecionado.
- **FR-007**: O estado perto do limite MUST ser dito por escrito. A barra desse estado MUST NOT usar o amarelo da marca.
- **FR-008**: Cartões, gráficos, navegação de cima e as telas de Lançamentos, Ano e Ajustes MUST permanecer como estão.

### Key Entities

- **Mês**: competência aberta no Resumo ou no Orçamento.
- **Tipo**: receitas, despesas fixas, despesas variáveis ou anuais.
- **Grupo**: conjunto de itens de um tipo no mês, com planejado e realizado.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em uma passagem pelo Resumo, a pessoa lê o quanto ainda pode gastar antes de usar um filtro.
- **SC-002**: Com um pagamento filtrado, o quanto ainda pode gastar no mês continua na tela em 100% dos meses testados.
- **SC-003**: Os quatro atalhos de tipo têm textos diferentes, cada um com o nome do tipo.
- **SC-004**: Depois de trocar o mês duas vezes, o tipo escolhido no Orçamento é o mesmo.
- **SC-005**: Grupos zerados não ocupam a lista principal e continuam abríveis em um único controle.

## Assumptions

- Os números continuam os que o computador já calcula. Esta spec não muda a regra de receita fora do que ainda pode gastar.
- O amarelo continua na marca e na série de realizado dos gráficos.
- O foco do diálogo e o nome de Arquivar no computador não entram aqui. Continuam em aberto.
- Referência visual: proposta de 17 nov 2026, modo Computador.
