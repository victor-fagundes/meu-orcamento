# Feature Specification: Casca nativa do Android

**Feature Branch**: `030-android-casca`

**Created**: 2026-11-17

**Status**: implemented

**Input**: User description: "O app ocupa a janela inteira, com navegação embaixo, como no protótipo."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Andar pelo app (Priority: P1)

A pessoa abre o app já autenticada e encontra cinco destinos: Resumo, Orçamento, Lançamentos, Ano e Ajustes. A navegação fica na base da tela. O destino atual é reconhecível sem depender só da cor. O conteúdo ocupa a largura da janela.

**Why this priority**: Sem a casca, cada módulo vira uma página solta. O protótipo trata o Android como um app, não como o site encolhido.

**Independent Test**: Com sessão ativa, a pessoa toca os cinco destinos e volta ao Resumo. A barra de baixo permanece visível.

**Acceptance Scenarios**:

1. **Given** uma sessão ativa, **When** o app abre, **Then** o Resumo aparece e a barra de baixo mostra os cinco destinos.
2. **Given** a barra de baixo, **When** a pessoa toca Orçamento, Lançamentos, Ano e Ajustes, **Then** cada destino abre e o item tocado fica marcado.
3. **Given** a tela de um destino, **When** a pessoa olha a largura, **Then** o conteúdo vai de borda a borda da janela.

---

### User Story 2 - Mudar o mês sem sair do destino (Priority: P2)

Nas telas de um mês, o mês fica na barra de cima, com mês anterior e próximo. Trocar o mês não muda o destino nem o tipo que a pessoa tinha escolhido.

**Why this priority**: O protótipo usa o mês como título, no lugar de um título de página competindo com o valor.

**Independent Test**: No Orçamento, em variáveis, a pessoa avança o mês e continua em Orçamento, em variáveis.

**Acceptance Scenarios**:

1. **Given** o Orçamento em novembro e em variáveis, **When** a pessoa toca o próximo mês, **Then** o título passa a dezembro e variáveis seguem selecionadas.
2. **Given** o Resumo, **When** a pessoa troca o mês, **Then** continua no Resumo.

---

### Edge Cases

- Sem rede, com sessão já aberta: a tela mostra um aviso recuperável e não apresenta um orçamento local vazio.
- Sessão inválida: a pessoa volta ao entrar, sem ver dados da conta anterior.
- Destino no meio de uma tarefa (sheet aberto): trocar de destino fecha o sheet sem gravar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O app MUST oferecer Resumo, Orçamento, Lançamentos, Ano e Ajustes na navegação da base.
- **FR-002**: O destino atual MUST ser indicado por mais de uma pista visual.
- **FR-003**: O conteúdo MUST ocupar a largura da janela.
- **FR-004**: Telas de um mês MUST mostrar o mês na barra de cima e MUST permitir mês anterior e próximo, com nome acessível.
- **FR-005**: Trocar o mês MUST NOT trocar o destino nem o tipo selecionado.
- **FR-006**: Sem rede, o app MUST mostrar falha recuperável e MUST NOT mostrar um orçamento só local.
- **FR-007**: Esta spec MUST NOT redesenhar o conteúdo interno de cada módulo. Isso fica nas specs de cada tela.

### Key Entities

- **Destino**: uma das cinco áreas do app.
- **Mês**: a competência mostrada na barra de cima.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A pessoa alcança os cinco destinos em uma sessão, sem sair do app.
- **SC-002**: Depois de três trocas de mês, o destino e o tipo escolhido são os mesmos do início.
- **SC-003**: Em uma tela sem rede, nenhuma lista de orçamento local aparece.

## Assumptions

- Entrar e sair da conta continuam como a entrega anterior do app. O protótipo não redesenha o login.
- A mesma conta do computador. Números de Resumo e Orçamento seguem a spec 028.
- Referência visual: proposta de 17 nov 2026, modo Android.
