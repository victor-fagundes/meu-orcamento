# Feature Specification: Ajustes no Android

**Feature Branch**: `035-android-ajustes`

**Created**: 2026-11-17

**Status**: implemented

**Input**: User description: "Ajustes no Android cobre conta, cartões, alertas e a saída, na casca do app."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver a conta e sair (Priority: P1)

A pessoa abre Ajustes, reconhece a conta em que está e sai. Depois de sair, os dados do orçamento não ficam na tela.

**Why this priority**: Sem saída clara, o aparelho compartilhado mostra o orçamento de outra pessoa.

**Independent Test**: Sair e reabrir o app pede entrada de novo e não lista itens da sessão anterior.

**Acceptance Scenarios**:

1. **Given** uma sessão ativa, **When** a pessoa abre Ajustes, **Then** vê qual conta está em uso.
2. **Given** Ajustes, **When** a pessoa sai e confirma, **Then** a sessão termina e o orçamento deixa de aparecer.
3. **Given** a saída feita, **When** a pessoa abre o app de novo, **Then** precisa entrar outra vez.

---

### User Story 2 - Cartões e alertas (Priority: P1)

A pessoa vê os cartões ativos, cria um e desativa outro, como no computador. Ela vê e altera o limite em que o mês avisa que está perto de estourar. O aviso do Resumo passa a usar o limite novo.

**Why this priority**: Cartão e limite mudam o lançamento e o alerta. Se só existirem no computador, o app fica incompleto.

**Independent Test**: Criar um cartão no Android e vê-lo no computador. Mudar o limite e ver o Resumo do mês respeitar o novo limite.

**Acceptance Scenarios**:

1. **Given** cartões já cadastrados, **When** a pessoa abre a lista, **Then** vê os mesmos cartões ativos do computador.
2. **Given** um cartão novo com apelido, **When** a pessoa salva, **Then** o cartão aparece no Android e no computador e pode ser usado num lançamento.
3. **Given** um cartão ativo, **When** a pessoa desativa e confirma, **Then** ele sai da escolha de lançamento novo e os lançamentos antigos permanecem.
4. **Given** um limite de alerta, **When** a pessoa grava outro percentual válido, **Then** o aviso do mês usa esse percentual.

---

### Edge Cases

- Apelido de cartão vazio: não grava, e a mensagem pede o apelido.
- Limite fora de 1 a 100: não grava, e a mensagem diz o intervalo aceito.
- Sem rede ao salvar: o valor anterior permanece e a pessoa pode tentar de novo.
- Último cartão desativado: lançamento no cartão deixa de ser oferecido. Débito, PIX e dinheiro continuam.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Ajustes MUST mostrar a conta da sessão.
- **FR-002**: Sair MUST encerrar a sessão e MUST esconder o orçamento até um novo entrar.
- **FR-003**: A pessoa MUST poder listar, criar e desativar cartões, com os mesmos efeitos do computador.
- **FR-004**: Desativar um cartão MUST NOT apagar lançamentos já feitos nele.
- **FR-005**: A pessoa MUST poder ver e gravar o limite de alerta do mês, dentro de 1 a 100 por cento.
- **FR-006**: Apelido vazio ou limite inválido MUST NOT gravar.
- **FR-007**: Ajustes MUST oferecer o caminho para importar e exportar, cujos fluxos estão na spec 036.

### Key Entities

- **Conta**: a sessão que está usando o orçamento.
- **Cartão**: apelido e se está ativo para lançamentos novos.
- **Limite de alerta**: percentual do orçado a partir do qual o mês avisa.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Depois de sair, reabrir o app não mostra item nem valor da conta anterior.
- **SC-002**: Um cartão criado no Android aparece no computador e aceita um lançamento novo.
- **SC-003**: Um limite gravado no Android é o limite que o computador mostra para a mesma conta.
- **SC-004**: Tentativas com apelido vazio ou limite inválido não alteram o que já estava gravado.

## Assumptions

- A casca vem da spec 030.
- Redefinir senha continua o caminho que a conta já tem. Esta spec não cria outro método.
- Importar e exportar são a spec 036. Aqui só existe a entrada a partir de Ajustes.
