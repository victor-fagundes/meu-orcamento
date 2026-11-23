# Feature Specification: Categorias

**Feature Branch**: `041-categorias`

**Created**: 2026-11-22

**Status**: verified

**Input**: User description: "/speckit-specify 041"

**Related**: A categoria deixa de ser só o nome do grupo do item e passa a ser algo que a pessoa cria, renomeia e arquiva, por orçamento e por tipo. O que a conta já usa vira categoria, com o mesmo nome. Lançamento continua no item. As telas de Orçamento e de Ajustes ficam nas histórias 044 e 047. D-07 do PRD v1.0 fica substituída só para categoria neste rebuild: criar, renomear e arquivar entram. Reordenar continua fora.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - O que já existe vira categoria (Priority: P1)

Quem já tem orçamento abre a conta e encontra uma categoria para cada grupo que os itens já usam, no mesmo tipo e com o mesmo nome. Item e lançamento não mudam de lugar. Um grupo só aparece arquivado quando todos os itens dele já estavam arquivados.

**Why this priority**: Sem isso, criar a categoria como entidade apaga ou duplica o orçamento que a pessoa já montou.

**Independent Test**: Numa conta que já tem itens em grupos, ler as categorias e os itens. Cada par de tipo e nome de grupo tem uma categoria. Nenhum lançamento mudou de item, valor ou competência.

**Acceptance Scenarios**:

1. **Given** itens em Moradia (Despesas fixas) e em Lazer (Despesas variáveis), **When** as categorias da conta são lidas, **Then** existem Moradia em Despesas fixas e Lazer em Despesas variáveis, e não existe uma segunda Moradia no mesmo tipo.
2. **Given** um grupo em que todo item já está arquivado, **When** as categorias são lidas, **Then** essa categoria está arquivada.
3. **Given** um grupo com pelo menos um item ativo, **When** as categorias são lidas, **Then** essa categoria está ativa.
4. **Given** lançamentos já gravados nesses itens, **When** as categorias passam a existir, **Then** cada lançamento continua no mesmo item, com o mesmo valor e a mesma competência.
5. **Given** o número do mês e o número do ano que a pessoa já via, **When** as categorias são preenchidas, **Then** os dois números continuam com a mesma conta e os nomes na tela continuam os de hoje.
6. **Given** uma compra parcelada já gravada, **When** categorias são criadas, renomeadas ou arquivadas, **Then** as competências das parcelas continuam as mesmas.

---

### User Story 2 - Criar uma categoria (Priority: P1)

A pessoa cria uma categoria escolhendo o tipo e o nome. O nome é guardado sem espaços nas pontas, numa linha só, com no máximo 40 caracteres. No mesmo tipo, outro nome ativo que só muda de maiúsculas ou de acento é recusado. O mesmo nome em outro tipo é aceito. A lista mostra as ativas; as arquivadas entram quando a pessoa pede.

**Why this priority**: É o gesto novo desta história. Sem ele, a categoria só existiria por causa dos grupos antigos.

**Independent Test**: Criar "  Lazer  " em Despesas variáveis, reler a lista e ver "Lazer". Tentar "lazer" de novo no mesmo tipo e ver a recusa, sem uma segunda categoria.

**Acceptance Scenarios**:

1. **Given** nenhuma categoria ativa chamada Lazer em Despesas variáveis, **When** a pessoa cria "  Lazer  " nesse tipo, **Then** a categoria guardada se chama "Lazer" e aparece na lista de ativas.
2. **Given** um nome de 40 caracteres depois de tirar os espaços das pontas, **When** a pessoa cria a categoria, **Then** o nome é aceito.
3. **Given** o nome vazio ou só com espaços, **When** a pessoa cria a categoria, **Then** nada é gravado e a mensagem é "Informe o nome da categoria."
4. **Given** 41 caracteres depois de tirar os espaços das pontas, **When** a pessoa cria a categoria, **Then** nada é gravado e a mensagem é "Use no máximo 40 caracteres."
5. **Given** um nome com quebra de linha, **When** a pessoa cria a categoria, **Then** nada é gravado e a mensagem é "Use o nome em uma linha só."
6. **Given** uma categoria ativa "Lazer" em Despesas variáveis, **When** a pessoa cria "lazer" ou "Lazer" no mesmo tipo, **Then** nada é gravado e a mensagem é "Escolha outro nome. Já existe uma categoria com esse nome neste tipo." O mesmo vale para "Ação" e "acao".
7. **Given** "Outros" ativo em Despesas fixas, **When** a pessoa cria "Outros" em Despesas variáveis, **Then** as duas categorias existem.
8. **Given** "Lazer" arquivada em Despesas variáveis e nenhuma Lazer ativa nesse tipo, **When** a pessoa cria "Lazer" de novo, **Then** a nova categoria ativa é gravada.
9. **Given** duas contas, **When** a segunda pede a lista ou tenta criar usando uma categoria da primeira, **Then** ela só vê e só altera as categorias da própria conta. A categoria da outra conta é tratada como inexistente.

---

### User Story 3 - Renomear sem perder o histórico (Priority: P1)

A pessoa troca o nome de uma categoria ativa. Os itens daquele tipo que estavam nesse grupo passam a usar o nome novo, no mesmo passo. O lançamento continua no item. Renomear para o nome que a categoria já tem não muda nada e não é erro.

**Why this priority**: O nome da categoria é o nome que a pessoa lê no Orçamento. Trocar o nome e deixar os itens para trás quebra a lista.

**Independent Test**: Renomear Moradia para Casa e ver os itens que eram Moradia, nesse tipo, passarem a Casa. Um lançamento de Aluguel continua em Aluguel, com o mesmo valor.

**Acceptance Scenarios**:

1. **Given** Moradia ativa em Despesas fixas, com itens nesse grupo, **When** a pessoa renomeia para Casa e Casa ainda não existe ativo nesse tipo, **Then** a categoria e esses itens passam a se chamar Casa. Itens de outro tipo que também se chamavam Moradia não mudam.
2. **Given** um lançamento num item de Moradia, **When** a categoria é renomeada, **Then** o lançamento continua no mesmo item, com o mesmo valor e a mesma competência.
3. **Given** a categoria já se chama Lazer, **When** a pessoa renomeia para Lazer, **Then** nada muda e não há mensagem de erro.
4. **Given** Casa já ativa no mesmo tipo, **When** a pessoa renomeia Moradia para Casa, para "casa" ou para "Cása", **Then** Moradia permanece e a mensagem é "Escolha outro nome. Já existe uma categoria com esse nome neste tipo."
5. **Given** a categoria de outra conta, **When** a pessoa tenta renomear, **Then** nada muda na outra conta e a categoria é tratada como inexistente.

---

### User Story 4 - Arquivar a categoria e os itens (Priority: P1)

A pessoa arquiva uma categoria ativa. A categoria e todos os itens daquele grupo saem da lista ativa e dos novos lançamentos, no mesmo passo. Os lançamentos antigos continuam. Não há como desarquivar nesta história, e arquivar não apaga lançamento.

**Why this priority**: Arquivar é o jeito de tirar um grupo do Orçamento sem perder o que já foi registrado. O glossário separa arquivar de excluir.

**Independent Test**: Arquivar Lazer e conferir que Lazer e os itens dela sumiram da lista ativa, e que um lançamento antigo de um desses itens continua na lista de lançamentos.

**Acceptance Scenarios**:

1. **Given** Lazer ativa, com itens ativos, **When** a pessoa arquiva Lazer, **Then** a categoria fica arquivada e todos os itens daquele grupo, nesse tipo, ficam arquivados.
2. **Given** lançamentos nesses itens, **When** a categoria é arquivada, **Then** os lançamentos continuam gravados, com o mesmo item, valor e competência, e saem do seletor de novos lançamentos.
3. **Given** a lista pedida sem arquivadas, **When** Lazer acabou de ser arquivada, **Then** Lazer não aparece. **Given** a lista com arquivadas, **Then** Lazer aparece como arquivada.
4. **Given** uma categoria ou um item, **When** a pessoa procura desarquivar ou reordenar, **Then** essas ações não existem nesta história.
5. **Given** a categoria de outra conta, **When** a pessoa tenta arquivar, **Then** nada muda na outra conta e a categoria é tratada como inexistente.

---

### User Story 5 - Item novo abre a categoria que falta (Priority: P2)

Quando um item nasce com um grupo que ainda não é categoria ativa daquele tipo, a categoria nasce junto com o item. Se a categoria ativa já existe, o item entra nela e nenhuma segunda categoria é criada.

**Why this priority**: O caminho "novo item" é o atalho de quem ainda não criou a categoria à parte. Sem essa regra, o item ficaria num grupo que a lista de categorias não conhece.

**Independent Test**: Criar um item no grupo "Streaming" em Despesas variáveis, sem categoria Streaming ativa nesse tipo, e ver a categoria Streaming ativa no mesmo resultado. Criar outro item em Streaming e ver uma única categoria.

**Acceptance Scenarios**:

1. **Given** nenhuma categoria ativa "Streaming" em Despesas variáveis, **When** um item é criado com esse grupo nesse tipo, **Then** o item e a categoria ativa "Streaming" existem juntos. Se a criação não se completa, nem o item nem a categoria ficam pela metade.
2. **Given** "Streaming" já ativa nesse tipo, **When** outro item é criado com esse grupo, **Then** o item usa a categoria existente e não nasce uma segunda Streaming.
3. **Given** "Streaming" só arquivada nesse tipo, **When** um item é criado com esse grupo, **Then** nasce uma categoria ativa "Streaming". A arquivada permanece arquivada.
4. **Given** qualquer gravação do grupo de um item, **When** ela termina, **Then** existe uma categoria ativa daquele tipo com aquele nome.

---

### User Story 6 - Limite de alerta só de 1 a 100 (Priority: P2)

O limite de alerta é um inteiro de 1 a 100. Zero, acima de 100, fração ou texto são recusados, e o valor que já estava salvo permanece.

**Why this priority**: A tela de limites (história 047) precisa recusar o número errado. Hoje um valor fora da faixa é apertado para dentro em vez de ser recusado, e a pessoa não vê o que gravou.

**Independent Test**: Com o limite salvo em 80, tentar gravar 0, 101 e 80,5. O limite continua 80. Gravar 1 e gravar 100. Cada um desses dois fica salvo.

**Acceptance Scenarios**:

1. **Given** um limite já salvo, **When** a pessoa grava um inteiro de 1 a 100, **Then** esse inteiro passa a ser o limite.
2. **Given** o limite salvo em 80, **When** a pessoa grava 0, 101, uma fração ou um texto, **Then** a gravação é recusada e o limite continua 80.

---

### User Story 7 - Exportar só quando há movimento e o arquivo fecha (Priority: P2)

Quem exporta sem lançamento e sem plano diferente de zero recebe a frase "Não havia movimento para exportar." e nenhum arquivo. Se a geração falha no meio, a frase é "Arquivo incompleto não é compartilhado." e nenhum arquivo parcial aparece. Com movimento, a pessoa recebe o mesmo CSV e o mesmo JSON de hoje, só da própria conta, com os valores em centavos inteiros.

**Why this priority**: A história 047 oferece Exportar. Sem estas duas frases, a pessoa recebe arquivo vazio ou arquivo cortado.

**Independent Test**: Exportar uma conta sem lançamento e sem plano diferente de zero e confirmar a frase, sem arquivo. Exportar uma conta com um lançamento e receber o arquivo completo.

**Acceptance Scenarios**:

1. **Given** uma conta sem lançamento e sem plano diferente de zero, **When** a pessoa exporta, **Then** a mensagem é "Não havia movimento para exportar." e nenhum arquivo é entregue.
2. **Given** a geração do arquivo falha no meio, **When** a exportação termina, **Then** a mensagem é "Arquivo incompleto não é compartilhado." e nenhum arquivo parcial é entregue.
3. **Given** a conta tem lançamento ou plano diferente de zero, **When** a pessoa exporta, **Then** ela recebe o CSV e o JSON como na história 017, só com os dados da própria conta, em centavos inteiros.

---

### Edge Cases

- Nome comparado sem diferença de maiúsculas e sem acento. "Lazer" e "lazer" são o mesmo nome. "Ação" e "acao" são o mesmo nome. Nomes parecidos que não são o mesmo ("NET" e "Internet") são categorias diferentes.
- O mesmo nome em tipos diferentes é permitido. "Outros" existe uma vez em cada tipo.
- Categoria arquivada não bloqueia um nome igual ativo no mesmo tipo.
- Renomear só alcança os itens do mesmo tipo. "Outros" em Despesas fixas e "Outros" em Despesas variáveis seguem independentes.
- Arquivar não apaga lançamento e não oferece desarquivar. Reordenar categoria ou item fica fora desta história.
- Categoria ou item de outra conta é tratado como inexistente. A pessoa não fica sabendo que o dado existe e está proibido.
- A regra de competência das parcelas não muda.
- Os rótulos visíveis do mês e do ano não mudam nesta história. "Disponível neste mês" e "Sobra no ano" entram nas histórias 043 e 046. A conta dos dois números permanece a de hoje: no mês, orçado menos gasto; no ano, receitas menos despesas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Cada orçamento MUST ter categorias. Cada categoria pertence a um tipo: Receitas, Despesas fixas, Despesas variáveis ou Anuais.
- **FR-002**: Na entrega, cada par distinto de tipo e nome de grupo já usado pelos itens MUST existir como categoria, com esse tipo e esse nome. A categoria MUST estar arquivada somente quando todos os itens daquele grupo estão arquivados. Havendo um item ativo, a categoria MUST estar ativa.
- **FR-003**: O lançamento MUST continuar apontando para o item. Criar as categorias MUST NOT mover lançamento de item, valor ou competência.
- **FR-004**: A pessoa MUST poder listar só as categorias ativas do próprio orçamento e MUST poder pedir a lista incluindo as arquivadas.
- **FR-005**: A pessoa MUST poder criar uma categoria informando tipo e nome. O nome guardado MUST ser o nome sem espaços nas pontas.
- **FR-006**: Nome vazio ou só com espaços MUST ser recusado, sem gravar, com a mensagem "Informe o nome da categoria."
- **FR-007**: Nome com mais de 40 caracteres depois de tirar os espaços das pontas MUST ser recusado, sem gravar, com a mensagem "Use no máximo 40 caracteres." Nome de 40 caracteres MUST ser aceito.
- **FR-008**: Nome com quebra de linha MUST ser recusado, sem gravar, com a mensagem "Use o nome em uma linha só."
- **FR-009**: Entre categorias ativas do mesmo tipo, nomes que só diferem por maiúsculas ou acento MUST ser o mesmo nome e MUST ser recusados com "Escolha outro nome. Já existe uma categoria com esse nome neste tipo."
- **FR-010**: O mesmo nome em tipos diferentes MUST ser permitido.
- **FR-011**: Uma categoria arquivada MUST NOT impedir uma categoria ativa nova com o mesmo nome no mesmo tipo.
- **FR-012**: Renomear uma categoria para o nome que ela já tem MUST ser concluído sem mudança e sem erro.
- **FR-013**: Renomear para um nome novo e único no tipo MUST atualizar, no mesmo passo, a categoria e os itens daquele tipo cujo grupo era o nome antigo. Itens de outro tipo MUST permanecer. Lançamentos MUST permanecer no mesmo item.
- **FR-014**: Arquivar uma categoria ativa MUST arquivar, no mesmo passo, a categoria e todos os itens daquele grupo naquele tipo. Lançamentos MUST permanecer. Arquivar MUST NOT apagar lançamento.
- **FR-015**: Esta história MUST NOT oferecer desarquivar nem reordenar categoria ou item.
- **FR-016**: Ao criar um item cujo grupo ainda não é categoria ativa daquele tipo, a categoria ativa MUST nascer no mesmo passo. Se a criação não se completa, item e categoria MUST NOT ficar pela metade. Se a categoria ativa já existe, MUST NOT nascer outra.
- **FR-017**: Toda gravação do grupo de um item MUST terminar com uma categoria ativa daquele tipo e daquele nome.
- **FR-018**: Categoria ou item de outro orçamento MUST ser tratado como inexistente. A resposta MUST NOT informar que o dado existe e está proibido.
- **FR-019**: O limite de alerta MUST aceitar só inteiro de 1 a 100. Fora disso, a gravação MUST ser recusada e o valor já salvo MUST permanecer.
- **FR-020**: Exportar uma conta sem lançamento e sem plano diferente de zero MUST devolver "Não havia movimento para exportar." e MUST NOT entregar arquivo.
- **FR-021**: Se a exportação falha no meio da geração, a pessoa MUST receber "Arquivo incompleto não é compartilhado." e MUST NOT receber arquivo parcial.
- **FR-022**: Exportar uma conta com lançamento ou com plano diferente de zero MUST entregar o CSV e o JSON da história 017, só com os dados dessa conta, em centavos inteiros.
- **FR-023**: A conta do número do mês (orçado menos gasto) e a conta do número do ano (receitas menos despesas) MUST permanecer. Esta história MUST NOT trocar os rótulos na tela.
- **FR-024**: A regra de competência das parcelas MUST permanecer.

### Key Entities

- **Categoria**: agrupamento de itens dentro de um tipo, com nome, tipo e situação ativa ou arquivada. Pertence a um orçamento. Na interface o nome é categoria. Grupo fica só como o nome que liga o item à categoria.
- **Item**: gasto ou receita planejada, com tipo, grupo (o nome da categoria) e situação ativa ou arquivada. O lançamento aponta para o item.
- **Lançamento**: registro com valor, competência e item. Não aponta para a categoria.
- **Limite de alerta**: percentual inteiro de 1 a 100, guardado por orçamento. Um valor recusado não substitui o que já estava salvo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Numa conta que já tem itens, 100% dos pares tipo + nome de grupo aparecem como categoria, e nenhum lançamento muda de item, valor ou competência.
- **SC-002**: A pessoa grava um nome válido, inclusive com espaços nas pontas ou com 40 caracteres, numa única tentativa. Cada um dos quatro nomes inválidos (vazio, 41 caracteres, quebra de linha, duplicado no tipo) é recusado sem gravar, com a frase desta história.
- **SC-003**: Renomear uma categoria atualiza, na mesma ação, todos os itens daquele tipo que usavam o nome antigo. Um lançamento já gravado permanece no mesmo item.
- **SC-004**: Arquivar tira a categoria e os itens dela da lista ativa. Os lançamentos desses itens continuam consultáveis, com o mesmo valor. Não há ação de desarquivar.
- **SC-005**: Com o limite em 80, gravar 1 ou 100 substitui o valor. Gravar 0, 101 ou uma fração deixa 80 intacto.
- **SC-006**: Uma conta sem lançamento e sem plano diferente de zero recebe a frase e zero arquivos. Uma conta com lançamento recebe o arquivo completo. Uma geração interrompida entrega zero arquivos parciais.
- **SC-007**: Uma segunda conta não vê e não altera as categorias da primeira. A tentativa é tratada como categoria inexistente.

## Assumptions

- As telas que criam, renomeiam e arquivam categoria no Orçamento e em Ajustes são as histórias 044 e 047. Esta história entrega a capacidade e as frases. Não desenha essas telas.
- D-07 (renomear e reordenar fora do MVP) fica substituída só para categoria: criar, renomear e arquivar entram. Reordenar categoria ou item continua fora. Desarquivar continua fora.
- "Mesmo nome" ignora maiúsculas e acentos e não aproxima sinônimos.
- Valores seguem em centavos inteiros. A spec fala em reais só na leitura da tela.
- Os rótulos "Disponível neste mês" e "Sobra no ano" não entram aqui. Entram nas histórias 043 e 046.
- Importar planilha e importar fatura não mudam aqui. Escondê-los da navegação é a história 047.
- A pessoa só acessa o próprio orçamento. Conta de outra pessoa não aparece como proibida; aparece como inexistente.
- O PM marcou a spec `verified` em 23 nov 2026.
