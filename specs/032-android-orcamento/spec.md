# Feature Specification: Orçamento no Android

**Feature Branch**: `032-android-orcamento`

**Created**: 2026-11-17

**Status**: implemented

**Input**: User description: "O Orçamento do Android segue o protótipo: o que ainda cabe, grupos, sheet e arquivar."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver o que ainda cabe no tipo (Priority: P1)

A pessoa escolhe um tipo e vê quanto ainda cabe nele. Cada grupo com movimento mostra o que ainda cabe, o realizado contra o planejado e uma frase de estado. Grupos zerados ficam em "Sem movimento neste mês".

**Why this priority**: É a tela em que a pessoa confere o mês por grupo.

**Independent Test**: Em despesas fixas, o valor que ainda cabe e os grupos batem com o computador no mesmo mês. Educação zerada só aparece em "Sem movimento".

**Acceptance Scenarios**:

1. **Given** fixas selecionadas, **When** o Orçamento abre, **Then** o título diz que ainda cabe em despesas fixas e mostra o valor.
2. **Given** um grupo com gasto, **When** a pessoa lê a linha, **Then** vê o que ainda cabe, o realizado, o planejado e uma frase de estado.
3. **Given** grupos com plano 0 e realizado 0, **When** a lista abre, **Then** eles ficam sob "Sem movimento neste mês" e podem ser abertos.
4. **Given** variáveis selecionadas, **When** a pessoa troca o mês, **Then** variáveis continuam selecionadas.

---

### User Story 2 - Ajustar o plano de um item (Priority: P2)

Tocar um item abre um sheet com o nome do item e o valor planejado daquele mês. O foco entra no valor. Salvar plano grava e fecha. Cancelar fecha sem gravar. Escape ou toque fora cancela.

**Why this priority**: Sem o sheet, o Orçamento só consulta.

**Independent Test**: Abrir Aluguel, mudar o valor, salvar, e ver o grupo atualizado. Cancelar não muda o valor.

**Acceptance Scenarios**:

1. **Given** um item visível, **When** a pessoa toca o item, **Then** o sheet abre com o foco no valor planejado daquele mês.
2. **Given** o sheet aberto, **When** a pessoa salva um valor válido, **Then** o plano daquele mês muda e o que ainda cabe é recalculado.
3. **Given** o sheet aberto, **When** a pessoa cancela, **Then** o plano anterior permanece.

---

### User Story 3 - Arquivar dizendo qual item (Priority: P2)

O controle de arquivar nomeia o item. O segundo toque confirma com o mesmo nome. Arquivar tira o item da lista ativa e não apaga o histórico de lançamentos.

**Why this priority**: Arquivar sem o nome do item é fácil de errar no toque.

**Independent Test**: "Arquivar Aluguel" e depois "Confirmar arquivar Aluguel" remove Aluguel da lista ativa. Um lançamento antigo de Aluguel continua existindo.

**Acceptance Scenarios**:

1. **Given** o item Aluguel, **When** a pessoa vê o controle, **Then** o nome é "Arquivar Aluguel".
2. **Given** o primeiro toque, **When** a pessoa confirma, **Then** Aluguel sai da lista ativa e os lançamentos dele permanecem.
3. **Given** o primeiro toque, **When** a pessoa toca outro lugar, **Then** a confirmação desfaz e nada é arquivado.

---

### Edge Cases

- Tipo sem itens: a tela diz que não há nada desse tipo no mês.
- Valor de plano ilegível: salvar não grava e a mensagem diz que o valor não foi entendido.
- Grupo estourado: o que ainda cabe é negativo e a frase diz que passou do planejado.
- Chegou exatamente no planejado: a frase diz que chegou, e isso não é tratado como erro.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O Orçamento MUST mostrar o que ainda cabe no tipo selecionado.
- **FR-002**: Cada grupo com plano ou realizado no mês MUST mostrar o que ainda cabe, realizado, planejado e uma frase de estado.
- **FR-003**: Grupos zerados MUST ficar em "Sem movimento neste mês" e MUST continuar alcançáveis.
- **FR-004**: Trocar o mês MUST preservar o tipo.
- **FR-005**: Tocar um item MUST abrir o plano daquele mês com o foco no valor.
- **FR-006**: Salvar plano MUST gravar só um valor entendido. Cancelar MUST NOT gravar.
- **FR-007**: Arquivar MUST nomear o item no primeiro passo e na confirmação.
- **FR-008**: Arquivar MUST tirar o item da lista ativa e MUST NOT apagar lançamentos.
- **FR-009**: Os centavos MUST ser os da spec 028 para a mesma conta e o mesmo mês.
- **FR-010**: A barra de perto do limite MUST NOT usar o amarelo da marca.

### Key Entities

- **Tipo selecionado**: um dos quatro tipos, mantido ao trocar o mês.
- **Grupo**: soma dos itens daquele tipo e grupo no mês.
- **Item**: nome, plano do mês e lançamentos já feitos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Para cada grupo do mês, planejado, realizado e o que ainda cabe no Android igualam o computador.
- **SC-002**: Cancelar o sheet deixa o plano igual em 100% das tentativas de teste.
- **SC-003**: Depois de arquivar um item, ele some da lista ativa e os lançamentos dele continuam consultáveis.
- **SC-004**: Duas trocas de mês não mudam o tipo selecionado.

## Assumptions

- A casca vem da spec 030. Os totais vêm da spec 028.
- Criar item novo pode usar o mesmo sheet, com o nome vazio e o botão "Criar item". Nome vazio não cria.
- Referência visual: proposta de 17 nov 2026, Orçamento no modo Android.
