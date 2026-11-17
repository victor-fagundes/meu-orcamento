# Feature Specification: Foco do diálogo e Arquivar no computador

**Feature Branch**: `037-foco-arquivar`

**Created**: 2026-11-17

**Status**: implemented

**Input**: User description: "Prossiga com a spec do GAP-007 no computador: foco no campo certo, sem selecionar o texto; o primeiro Arquivar continua curto e o segundo nomeia o item; Resumo, Orçamento, Lançamentos e Ano ganham região principal."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entrar no diálogo pelo teclado (Priority: P1)

A pessoa abre um diálogo no computador e o foco já está no campo que ela veio preencher. O texto que já estava no campo permanece inteiro, sem ficar selecionado. Escape fecha e devolve o foco ao controle que abriu o diálogo.

**Why this priority**: Hoje o diálogo abre e o foco fica na página de trás. Quem usa teclado escreve no lugar errado.

**Independent Test**: No Orçamento de novembro, abrir o plano de Aluguel deixa o foco no valor de novembro, com o texto não selecionado. Escape devolve o foco ao Aluguel.

**Acceptance Scenarios**:

1. **Given** o Orçamento aberto em novembro, **When** a pessoa abre o plano de um item, **Then** o foco está no valor de novembro e o texto desse valor não está selecionado.
2. **Given** o diálogo de novo item, **When** ele abre, **Then** o foco está no nome do item.
3. **Given** o diálogo de novo lançamento ou de editar lançamento, **When** ele abre, **Then** o foco está no valor.
4. **Given** o diálogo de alertas do mês, **When** ele abre, **Then** o foco está em Fechar.
5. **Given** qualquer um desses diálogos aberto, **When** a pessoa pressiona Escape, **Then** o diálogo fecha e o foco volta ao controle que o abriu.

---

### User Story 2 - Arquivar dizendo qual item na confirmação (Priority: P1)

No Orçamento, o primeiro texto visível do controle continua "Arquivar". Quem ouve a tela ouve o nome do item já nesse primeiro passo. O segundo toque, o que grava, mostra "Arquivar {nome}?". Só um item fica armado por vez. O segundo toque arquiva e não apaga lançamentos.

**Why this priority**: O passo que grava hoje diz só "Confirmar?" e o nome do item fica numa dica que o teclado não mostra.

**Independent Test**: Armar Aluguel mostra "Arquivar Aluguel?". Armar Luz em seguida desarma Aluguel. Confirmar Luz arquiva só Luz.

**Acceptance Scenarios**:

1. **Given** o item Aluguel na lista, **When** a pessoa olha o controle, **Then** o texto visível é "Arquivar" e quem ouve a tela ouve que é Aluguel.
2. **Given** o primeiro toque em Aluguel, **When** o controle arma, **Then** o texto visível passa a "Arquivar Aluguel?".
3. **Given** Aluguel armado, **When** a pessoa arma Luz, **Then** só Luz fica armada e Aluguel volta a "Arquivar".
4. **Given** "Arquivar Aluguel?" visível, **When** a pessoa confirma, **Then** Aluguel sai da lista ativa e os lançamentos dele permanecem.

---

### User Story 3 - Achar o conteúdo da tela (Priority: P2)

Resumo, Orçamento, Lançamentos e Ano têm uma região principal que envolve o conteúdo daquela tela. A pessoa que salta para o conteúdo principal cai nessa região.

**Why this priority**: Essas quatro telas são o uso diário e hoje não anunciam onde o conteúdo principal começa. Ajustes já anuncia.

**Independent Test**: Em cada uma das quatro telas, existe uma região principal e o salto para o conteúdo cai nela.

**Acceptance Scenarios**:

1. **Given** Resumo, Orçamento, Lançamentos ou Ano, **When** a pessoa pede o conteúdo principal, **Then** o foco entra na região principal daquela tela.
2. **Given** Ajustes, **When** a pessoa abre a tela, **Then** a região principal que já existe continua lá.

---

### Edge Cases

- O mês aberto não tem campo de valor: o foco vai para o primeiro valor do plano, ainda sem selecionar o texto.
- Diálogo sem campo e sem Fechar: o foco fica no próprio diálogo, e Tab percorre só o que está dentro dele.
- Enquanto arquiva, o controle não aceita outro toque, e quem ouve a tela continua sabendo qual item está em andamento.
- Fechar o diálogo pelo fundo ou por Cancelar não grava plano, item nem lançamento.
- Dois itens não ficam armados ao mesmo tempo. Recarregar a tela desarma o que estava pendente de confirmação.
- O texto armado cabe na linha. Se o nome for longo, ele continua perceptível por completo para quem ouve a tela.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Ao abrir o plano de um item, o foco MUST ir para o valor do mês que está aberto, e o texto desse campo MUST NOT ficar selecionado.
- **FR-002**: Ao abrir novo item, o foco MUST ir para o nome do item.
- **FR-003**: Ao abrir novo lançamento ou editar lançamento, o foco MUST ir para o valor, sem selecionar o texto já presente.
- **FR-004**: Ao abrir os alertas do mês, o foco MUST ir para Fechar.
- **FR-005**: Escape MUST fechar o diálogo e MUST devolver o foco ao controle que o abriu. Tab MUST permanecer dentro do diálogo enquanto ele estiver aberto.
- **FR-006**: O primeiro texto visível de arquivar MUST ser "Arquivar". O nome do item MUST ser anunciado nesse passo para quem ouve a tela.
- **FR-007**: O segundo passo MUST mostrar "Arquivar {nome}?" e MUST ser o único passo que arquiva.
- **FR-008**: No máximo um item MUST estar armado por vez. Armar outro MUST desarmar o anterior.
- **FR-009**: Arquivar MUST tirar o item da lista ativa e MUST NOT apagar os lançamentos dele.
- **FR-010**: Resumo, Orçamento, Lançamentos e Ano MUST ter uma região principal que receba o salto para o conteúdo.
- **FR-011**: Esta spec MUST NOT mudar a regra de competência, de centavos, nem o desenho dos cartões do computador.

### Key Entities

- **Diálogo**: plano do item, novo item, novo lançamento, editar lançamento ou alertas do mês, aberto por cima da tela.
- **Controle de arquivar**: dois passos do mesmo item. O primeiro anuncia o nome. O segundo mostra o nome e grava.
- **Região principal**: o miolo de Resumo, Orçamento, Lançamentos e Ano.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Nos cinco diálogos, o foco está no destino certo no momento em que o diálogo aparece, em 100% das aberturas de teste.
- **SC-002**: Em nenhuma abertura de teste o texto já preenchido fica selecionado.
- **SC-003**: Escape devolve o foco ao controle de origem nas cinco aberturas de teste.
- **SC-004**: Com dois itens armados em sequência, só o último mostra "Arquivar {nome}?" e só ele é arquivado na confirmação.
- **SC-005**: Resumo, Orçamento, Lançamentos e Ano aceitam o salto ao conteúdo principal.

## Assumptions

- Vale só para o computador. No Android, o foco e o nome de Arquivar continuam na spec 032, que mostra o nome já no primeiro texto visível. Aqui o primeiro texto visível fica curto de propósito.
- A revisão visual do mês continua na spec 029. Esta spec não entra na ordem dos números, dos filtros nem da barra de limite.
- Login, cadastro e a página inicial ficam de fora. Ajustes já tem região principal e não muda.
- A dica que hoje guarda o nome do item deixa de ser o único lugar em que esse nome existe.
- Não há diálogo extra de confirmação e a pessoa não precisa digitar o nome do item para arquivar.
