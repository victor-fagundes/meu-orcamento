# Feature Specification: Shell da aplicação

**Feature Branch**: `042-shell-web`

**Created**: 2026-11-22

**Status**: implemented

**Input**: User description: "/speckit-specify 042"

**Related**: Quem entrou na conta vê uma casca só: cabeçalho, navegação e a área aberta. As cinco áreas são Resumo, Orçamento, Lançamentos, Ano e Ajustes, nesta ordem, nos endereços que a pessoa já usa. No largo, a navegação é lateral. No estreito, é inferior. O miolo de cada área fica nas histórias 043 a 048. A aparência vem da história 040.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - A casca das cinco áreas (Priority: P1)

Quem já entrou na conta vê o cabeçalho, a navegação e a área aberta. As cinco áreas aparecem nesta ordem: Resumo, Orçamento, Lançamentos, Ano e Ajustes. Cada uma abre num toque, no endereço que a pessoa já usa. Quem não entrou não vê essa casca.

**Why this priority**: Sem a casca, as telas do rebuild não têm um lugar comum. É o que as histórias 043 a 048 ocupam.

**Independent Test**: Entrar na conta e abrir as cinco áreas, nesta ordem. Sair da conta e abrir o endereço de Resumo: a casca não aparece.

**Acceptance Scenarios**:

1. **Given** a pessoa entrou na conta, **When** a casca abre, **Then** ela vê o cabeçalho, a navegação e uma área aberta. A navegação lista Resumo, Orçamento, Lançamentos, Ano e Ajustes, nesta ordem.
2. **Given** a pessoa entrou na conta, **When** ela escolhe cada uma das cinco áreas, **Then** a área escolhida abre dentro da casca, no endereço que ela já usa para essa área.
3. **Given** a pessoa não entrou na conta, **When** ela abre o endereço de qualquer uma das cinco áreas, **Then** a casca logada não aparece.
4. **Given** uma área está aberta, **When** a pessoa escolhe outra, **Then** só a área escolhida fica marcada como a atual.

---

### User Story 2 - Lateral no largo, inferior no estreito (Priority: P1)

A partir de 720 px de largura, a navegação é uma barra lateral de 240 px, com ícone e nome de cada área. Abaixo de 720 px, a lateral some e as mesmas cinco áreas ficam numa barra inferior de 76 px de altura, também com ícone e nome. Existe uma barra ou a outra, nunca as duas. A área aberta é a única marcada como a atual, inclusive para quem usa leitor de tela.

**Why this priority**: A mesma conta é usada no computador e na janela estreita. A barra errada, ou as duas juntas, esconde o conteúdo.

**Independent Test**: Em 1280 px, a lateral mede 240 px e mostra as cinco áreas com ícone e nome, uma só marcada. Em 390 px, a lateral não está e a barra inferior mede 76 px, com as mesmas cinco áreas. Em 720 px vale a lateral. Em 719 px vale a inferior.

**Acceptance Scenarios**:

1. **Given** a largura é 1280 px, **When** a pessoa olha a navegação, **Then** vê a barra lateral de 240 px, com as cinco áreas em ícone e nome, e só a área aberta marcada como a atual. A barra inferior não está.
2. **Given** a largura é 720 px, **When** a pessoa olha a navegação, **Then** vale a mesma barra lateral, e a barra inferior não está.
3. **Given** a largura é 719 px ou 390 px, **When** a pessoa olha a navegação, **Then** a barra lateral não está e a barra inferior mede 76 px de altura, com as mesmas cinco áreas, na mesma ordem, com ícone e nome, e só a área aberta marcada como a atual.
4. **Given** Orçamento está aberto em 1280 px, **When** a janela passa para 390 px, **Then** Orçamento continua a área aberta e a única marcada, e a navegação troca da lateral para a inferior.
5. **Given** qualquer uma das quatro larguras (390, 719, 720, 1280), **When** a pessoa conta as barras, **Then** há exatamente uma: lateral a partir de 720 px, inferior abaixo disso.

---

### User Story 3 - Ajustes continua a área atual (Priority: P1)

Em qualquer tela aberta a partir de Ajustes, a aba Ajustes continua a única marcada. Não nasce uma sexta aba.

**Why this priority**: Conta, categorias, cartões e o restante são partes de Ajustes. Marcar outra aba diria que a pessoa está em outro lugar.

**Independent Test**: Abrir uma tela de dentro de Ajustes, no largo e no estreito, e ver só Ajustes marcada, ainda entre cinco abas.

**Acceptance Scenarios**:

1. **Given** a pessoa entrou na conta, **When** ela abre uma tela alcançada a partir de Ajustes, **Then** Ajustes é a única aba marcada e a navegação continua com cinco abas.
2. **Given** essa tela de Ajustes está aberta, **When** a janela passa de 1280 px para 390 px, **Then** Ajustes continua a única aba marcada.
3. **Given** a pessoa abre direto o endereço de uma tela de Ajustes, **When** a casca aparece, **Then** Ajustes é a aba marcada e não existe uma sexta aba.

---

### User Story 4 - Título, mês e lugar de criar (Priority: P1)

O cabeçalho mostra o título da área aberta. O mês, com os controles "Mês anterior" e "Próximo mês", só aparece quando a tela pede navegação de mês. Quando a tela não pede, esses controles não estão. Não há botão flutuante de criar em largura nenhuma. Quando a tela oferece criar, a ação fica no topo do conteúdo.

**Why this priority**: O mês pertence a algumas telas, não à casca inteira. Um botão flutuante cobre o que a pessoa lê. No computador ele não entra.

**Independent Test**: Numa tela que pede mês, ver o título e os dois controles com esses nomes. Numa tela que não pede, ver o título e nenhum controle de mês. Em 1280 px e em 390 px, nenhum botão flutuante.

**Acceptance Scenarios**:

1. **Given** a tela pede navegação de mês, **When** a casca mostra essa tela, **Then** o cabeçalho tem o título da área, o mês e os controles nomeados "Mês anterior" e "Próximo mês".
2. **Given** a tela não pede navegação de mês, **When** a casca mostra essa tela, **Then** o cabeçalho tem o título da área e os controles de mês não estão.
3. **Given** a pessoa estava numa tela que pede mês, **When** ela abre uma tela que não pede, **Then** os controles de mês saem junto com a tela anterior.
4. **Given** qualquer uma das cinco áreas, em 1280 px ou em 390 px, **When** a pessoa procura um botão flutuante de criar, **Then** não há nenhum.
5. **Given** a tela oferece criar, **When** a ação aparece, **Then** ela fica no topo do conteúdo e não flutua sobre a página.

---

### User Story 5 - O conteúdo cabe na grade (Priority: P2)

No largo, o conteúdo tem largura máxima de 960 px, doze colunas, margem lateral de 40 px e espaço de 24 px entre colunas. No estreito, são quatro colunas, margem lateral de 16 px e espaço de 16 px. O conteúdo começa e termina dentro da margem. A barra inferior não esconde o fim da página: a pessoa rola e o fim fica visível acima dela.

**Why this priority**: Sem a mesma grade, cada tela seguinte mede diferente e o rebuild deixa de parecer um produto só.

**Independent Test**: Em 1280 px, o conteúdo não passa de 960 px e a margem lateral é 40 px. Em 390 px, a margem lateral é 16 px e dá para chegar ao fim do conteúdo acima da barra inferior.

**Acceptance Scenarios**:

1. **Given** a largura é 1280 px, **When** a pessoa mede a área de conteúdo, **Then** a largura não passa de 960 px, há doze colunas, a margem lateral é 40 px e o espaço entre colunas é 24 px.
2. **Given** a largura é 390 px, **When** a pessoa mede a área de conteúdo, **Then** há quatro colunas, a margem lateral é 16 px e o espaço entre colunas é 16 px.
3. **Given** o conteúdo é mais alto que a janela estreita, **When** a pessoa rola até o fim, **Then** o fim fica visível acima da barra inferior.

---

### User Story 6 - Ler e usar a casca (Priority: P1)

Cada controle da casca tem nome. O foco é visível. As cinco áreas funcionam pelo teclado. A casca continua utilizável no claro, no escuro e quando a pessoa prefere menos movimento. Com menos movimento, a troca de área é instantânea.

**Why this priority**: A casca é o caminho de toda a conta. Se o foco some ou o nome falta, a pessoa não troca de área.

**Independent Test**: Percorrer as cinco áreas pelo teclado, no claro, no escuro e com menos movimento. Em cada uma, o foco está visível e o controle tem nome. Com menos movimento, a troca não anima.

**Acceptance Scenarios**:

1. **Given** a casca está aberta, **When** a pessoa percorre os controles, **Then** cada controle tem um nome e o foco é visível.
2. **Given** o foco está na navegação, **When** a pessoa usa o teclado, **Then** ela alcança e abre as cinco áreas.
3. **Given** a aparência está clara, **When** a pessoa troca para escura, **Then** as cinco áreas, a aba atual e o cabeçalho continuam legíveis.
4. **Given** a pessoa prefere menos movimento, **When** ela troca de área, **Then** a troca é instantânea e as cinco áreas continuam utilizáveis.

---

### Edge Cases

- Em 720 px a navegação é a lateral. Em 719 px é a inferior. As duas barras não aparecem juntas.
- Encolher ou alargar a janela não troca a área aberta nem a aba marcada.
- Uma tela de Ajustes, aberta pela navegação ou pelo endereço direto, não cria sexta aba. Ajustes permanece a única marcada.
- Quem não entrou na conta não vê a casca, em nenhuma das cinco áreas.
- Só uma aba fica marcada. As outras quatro não se anunciam como a página atual.
- Controles de mês ausentes não deixam um controle vazio no lugar. O cabeçalho fica com o título.
- A janela estreita do computador continua sendo esta casca. Não ganha o botão flutuante do celular.
- O fim do conteúdo no estreito continua alcançável acima da barra inferior.
- Com preferência de menos movimento, a casca não anima a troca de área.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Quem entrou na conta MUST ver a casca: cabeçalho, navegação e a área aberta.
- **FR-002**: Quem não entrou na conta MUST NOT ver a casca logada ao abrir o endereço de qualquer uma das cinco áreas.
- **FR-003**: A navegação MUST listar, nesta ordem, Resumo, Orçamento, Lançamentos, Ano e Ajustes. Cada área MUST abrir no endereço que a pessoa já usa.
- **FR-004**: Escolher uma área MUST abrir essa área dentro da casca e MUST marcar só ela como a atual, inclusive para quem usa leitor de tela.
- **FR-005**: A partir de 720 px de largura, a navegação MUST ser uma barra lateral de 240 px, com ícone e nome em cada área, e a barra inferior MUST NOT aparecer.
- **FR-006**: Abaixo de 720 px, a barra lateral MUST NOT aparecer e a navegação MUST ser uma barra inferior de 76 px de altura, com as mesmas cinco áreas, na mesma ordem, com ícone e nome.
- **FR-007**: Mudar a largura da janela MUST NOT trocar a área aberta nem qual aba está marcada.
- **FR-008**: Em qualquer tela aberta a partir de Ajustes, inclusive pelo endereço direto, Ajustes MUST permanecer a única aba marcada e a navegação MUST continuar com cinco abas.
- **FR-009**: O cabeçalho MUST mostrar o título da área aberta.
- **FR-010**: Quando a tela pede navegação de mês, o cabeçalho MUST mostrar o mês e os controles nomeados "Mês anterior" e "Próximo mês". Quando a tela não pede, esses controles MUST NOT aparecer.
- **FR-011**: Trocar de uma tela que pede mês para uma que não pede MUST retirar os controles de mês.
- **FR-012**: A casca MUST NOT mostrar botão flutuante de criar, em nenhuma largura. Quando a tela oferece criar, a ação MUST ficar no topo do conteúdo.
- **FR-013**: A partir de 720 px, a área de conteúdo MUST ter largura máxima de 960 px, doze colunas, margem lateral de 40 px e espaço de 24 px entre colunas.
- **FR-014**: Abaixo de 720 px, a área de conteúdo MUST ter quatro colunas, margem lateral de 16 px e espaço de 16 px entre colunas. O fim do conteúdo MUST ficar alcançável acima da barra inferior.
- **FR-015**: Cada controle da casca MUST ter nome. O foco MUST ser visível. As cinco áreas MUST ser alcançáveis e abertas pelo teclado.
- **FR-016**: A casca MUST permanecer legível e utilizável no claro e no escuro. Quando a pessoa prefere menos movimento, a troca de área MUST ser instantânea.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Quem entrou na conta abre cada uma das cinco áreas num único toque, na ordem Resumo, Orçamento, Lançamentos, Ano e Ajustes. Quem não entrou vê a casca em zero dos cinco endereços.
- **SC-002**: Em 1280 px e em 720 px, a única navegação é a lateral de 240 px. Em 719 px e em 390 px, a única navegação é a inferior de 76 px. Nas quatro larguras, exatamente uma aba está marcada.
- **SC-003**: Em toda tela aberta a partir de Ajustes, em 1280 px e em 390 px, Ajustes é a aba marcada e a contagem de abas permanece cinco.
- **SC-004**: Os controles de mês aparecem em todas as telas que pedem e em nenhuma tela que não pede. O botão flutuante de criar aparece em zero telas, em 1280 px e em 390 px.
- **SC-005**: Em 1280 px o conteúdo não passa de 960 px e a margem lateral é 40 px. Em 390 px a margem lateral é 16 px e o fim do conteúdo fica visível acima da barra inferior.
- **SC-006**: Todos os controles da casca têm nome e foco visível. As cinco áreas abrem pelo teclado no claro, no escuro e com menos movimento. Com menos movimento, a troca de área não anima.

## Assumptions

- A aparência e as medidas vêm da história 040 e da grade já aprovada. Esta história não cria outra linguagem visual.
- O PRD 5.1 fala em navegação superior no computador. Neste rebuild a navegação larga é a barra lateral, como a grade e a spec anterior já definiam. A barra de cima do protótipo não é a casca.
- A ordem das áreas é a que a conta já mostra: Resumo, Orçamento, Lançamentos, Ano, Ajustes. O protótipo v3 lista Ano antes de Lançamentos. Esta história mantém a ordem já em uso.
- Os endereços permanecem os que a pessoa já usa: Resumo em `/app/resumo`, Orçamento em `/app/orcamento`, Lançamentos em `/app/lancamentos`, Ano em `/app/ano` e Ajustes em `/app/ajustes`. Não há endereço novo.
- O miolo de Resumo, Orçamento, Lançamentos, Ano, Ajustes e Entrada fica nas histórias 043 a 048. Os botões de criar de cada tela nascem com essas histórias. Aqui só fica a regra: sem flutuante, e no topo do conteúdo quando a tela oferece criar.
- Quais telas pedem navegação de mês é decisão dessas histórias. A conta do mês não muda aqui.
- A casca nativa do celular fica fora. A janela estreita do computador é esta casca, sem botão flutuante.
- Trocar claro e escuro fica em Ajustes (história 047). Aqui a casca só precisa continuar legível nos dois.
- A entrada na conta é a história 048. Aqui basta que quem não entrou não veja a casca.
- A spec anterior, no formato SDD e com status `ready`, está no commit `9e4f072`. Esta versão guarda as mesmas regras em linguagem de produto. A implementação desta casca deixa o status em `implemented`. O PM marca `verified`.
