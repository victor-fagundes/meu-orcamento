# Feature Specification: Acabamento do Android

**Feature Branch**: `039-acabamento-android`

**Created**: 2026-11-17

**Status**: implemented

**Gate**: O `/speckit-implement` de 17 de novembro de 2026 abriu o gate e o código compilou. A referência continua `prototype/2026-11-17-acabamento.html`. A spec 040 está cancelada. O APK `MeuOrcamento-1.0.0-2-prodDebug.apk` foi gerado. O roteiro no aparelho (T021) continua aberto. `verified` continua com o PM.

**Input**: User description: "/speckit-specify 039. Marca continua amarelo #FFE600 e azul #0058BE. O protótipo de 17 de novembro vale para a ordem do que a tela mostra. O acabamento tem referência própria em prototype/2026-11-17-acabamento.html. O ícone da gaveta é a letra M no amarelo. A frase da entrada é 'O que ainda cabe neste mês.' Os nomes da barra continuam Resumo, Orçamento, Lançamentos, Ano e Ajustes. Ajustes lista os mesmos menus do site, com os mesmos ícones. A spec 040 está cancelada."

**Related**: A spec 038 já colocou o mês na barra, o valor em destaque e a marca na entrada. Esta história sobe o acabamento para a referência nova, sem mudar o que o app calcula nem a ordem dos blocos do modo Android de `prototype/2026-11-17-hierarquia.html`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reconhecer o app antes de entrar (Priority: P1)

A pessoa vê o ícone na gaveta e, ao abrir, a marca no centro da tela amarela. O ícone é a letra M no amarelo, legível na forma redonda e na quadrada, e também quando a gaveta pede uma versão de uma cor só. A splash usa essa mesma marca. Só depois aparece a entrada ou o Resumo.

**Why this priority**: É o que separa um app instalado de uma lista de telas. A pessoa julga o produto nesse instante, antes de ler um número.

**Independent Test**: Instalar o app, olhar o ícone na gaveta clara e na gaveta escura, abrir pelo ícone e ver a marca amarela antes da primeira tela de conteúdo.

**Acceptance Scenarios**:

1. **Given** o app instalado, **When** a pessoa olha a gaveta, **Then** o ícone é a letra M sobre o amarelo da marca, reconhecível na máscara redonda e na quadrada.
2. **Given** a gaveta no tema escuro, **When** o sistema pede o ícone de uma cor só, **Then** a letra M continua reconhecível.
3. **Given** o toque no ícone, **When** o app abre, **Then** a primeira pintura é a marca centralizada no amarelo, e em seguida a entrada (sem sessão) ou o Resumo (com sessão). Não há um flash de tela branca ou do fundo claro do sistema entre o toque e a marca.
4. **Given** o aparelho deitado, **When** o app está aberto, **Then** as telas continuam em pé.

---

### User Story 2 - Entrar com uma frase e um botão (Priority: P1)

Quem não tem sessão vê a marca em tamanho de abertura, o nome Meu Orçamento, a frase "O que ainda cabe neste mês.", os campos e um único botão preenchido na largura. "Criar conta" continua ação de texto.

**Why this priority**: É a primeira tela de quem instala. A spec 038 colocou a marca. Esta história faz a abertura parecer o mesmo produto do ícone.

**Independent Test**: Abrir sem sessão, ler a frase, entrar com uma conta válida e chegar ao Resumo.

**Acceptance Scenarios**:

1. **Given** nenhuma sessão, **When** a tela de entrar abre, **Then** a pessoa vê a marca amarela com a inicial, "Meu Orçamento", a frase "O que ainda cabe neste mês.", E-mail, Senha, o botão preenchido "Entrar" na largura e a ação de texto "Criar conta". Não há um segundo título nem um segundo botão preenchido do mesmo tamanho.
2. **Given** "Criar conta", **When** a tela troca, **Then** aparecem Nome, E-mail e Senha, o botão preenchido diz "Cadastrar" e a ação de texto diz "Já tenho conta". A frase da entrada sai.
3. **Given** e-mail ou senha recusados, **When** a entrada falha, **Then** a mensagem diz o que falhou, os campos continuam preenchidos e nenhuma sessão abre.
4. **Given** sem rede, **When** a pessoa toca Entrar, **Then** vê um aviso recuperável e permanece na mesma tela.
5. **Given** a versão publicada, **When** a pessoa tenta a conta de demonstração, **Then** a mensagem pede a conta de produção e nenhuma sessão abre. Na versão de desenvolvimento, a conta de demonstração continua podendo entrar.

---

### User Story 3 - Ler o mês com o mesmo desenho de linha (Priority: P1)

No Resumo, o número principal pesa mais do que o texto corrido. Abaixo, a frase e um medidor com trilha visível. As quatro linhas são destinos: nome, realizado à direita, planejado numa linha menor, com área de toque clara. O mesmo desenho de linha serve a Orçamento, Lançamentos, Ano e Ajustes.

**Why this priority**: É a tela que a pessoa abre todo dia. O número fino e as linhas soltas são o que ainda parece formulário depois da spec 038.

**Independent Test**: No mês corrente, com plano e gasto, o valor que ainda pode gastar é o maior e o mais pesado texto, e tocar "Despesas fixas" abre o Orçamento em fixas.

**Acceptance Scenarios**:

1. **Given** um mês com orçado maior que o gasto, **When** a pessoa abre o Resumo, **Then** lê "Ainda pode gastar" e o valor em reais antes das quatro linhas. Esse valor é o maior texto da tela e tem peso maior que o mês na barra e que o nome das linhas.
2. **Given** o mês corrente, **When** o Resumo abre, **Then** a frase diz a parcela já gasta e quantos dias restam, incluindo hoje, e um medidor com trilha acompanha a frase. Dentro do plano o preenchimento é azul. A partir de 80% do plano, inclusive no 100%, o preenchimento é o aviso. Só acima de 100% é a cor de erro. O amarelo da marca não pinta o medidor.
3. **Given** o gasto maior que o orçado, **When** o Resumo abre, **Then** o título diz que passou do orçado, o valor usa a cor de erro e o medidor também.
4. **Given** uma linha de tipo, **When** a pessoa toca, **Then** o Orçamento abre nesse tipo, no mesmo mês. O realizado e o planejado de cada linha são os mesmos de antes desta história.
5. **Given** qualquer lista do app, **When** a pessoa compara duas linhas, **Then** o nome cede espaço, o valor fica à direita na mesma linha e a altura da linha é estável de uma tela para a outra.

---

### User Story 4 - Acompanhar o Orçamento no controle segmentado (Priority: P2)

O Orçamento troca os quatro chips soltos por um controle único: Receitas, Fixas, Variáveis, Anuais. O selecionado usa o azul claro já aceito. "Ainda cabe" usa o mesmo número de destaque do Resumo. Cada grupo é a linha padrão mais o medidor. O plano do item sobe pela base, com alça, o nome do item e a ação principal presa no pé.

**Why this priority**: É a segunda tela do dia. O controle único e a folha com alça são o que faz esta tela parecer continuação do Resumo.

**Independent Test**: Abrir Despesas fixas, ver um grupo dentro do plano, um perto do limite e um estourado, abrir o plano de um item e cancelar sem gravar.

**Acceptance Scenarios**:

1. **Given** o Orçamento, **When** a tela abre, **Then** os quatro tipos estão num controle só, o tipo ativo está preenchido com o azul claro, e o valor de "Ainda cabe" é o maior texto abaixo do controle, no mesmo peso do Resumo.
2. **Given** um grupo de despesa dentro do plano, **When** a pessoa lê a linha, **Then** vê o nome, quanto ainda cabe à direita, a frase e o medidor azul. Perto do limite, o medidor usa o aviso, não o amarelo da marca. Estourado, o medidor e a frase usam a cor de erro. "Chegou" no planejado não usa a cor de erro.
3. **Given** um grupo, **When** a pessoa expande, **Then** vê os itens desse grupo, com planejado e realizado do item, e pode abrir o plano ou arquivar com o mesmo fluxo de hoje. A primeira ação de arquivar mostra o nome do item.
4. **Given** grupos com plano e realizado zerados, **When** a lista abre, **Then** eles aparecem só depois de "Sem movimento neste mês" e continuam abríveis.
5. **Given** o plano de um item, **When** o painel abre, **Then** entra pela base, com alça, canto superior arredondado, o nome do item no título, o campo do mês em foco e a ação principal presa no pé, ao lado de Cancelar. Cancelar, toque fora e voltar não gravam.

---

### User Story 5 - Lançamentos, Ano e Ajustes na mesma linha (Priority: P2)

Lançamentos lista cada movimento na linha padrão. Ano mantém os doze meses sob o ano confirmado, com o valor em uma linha só. Ajustes abre com a conta e, em seguida, os mesmos menus do site: Cartões, Limites de alerta, Importar planilha, Importar fatura, Exportar, Simulador de competência, Itens arquivados, Dados de exemplo e Excluir conta.

**Why this priority**: Sem essas três, o acabamento acaba no Orçamento.

**Independent Test**: Abrir um mês com lançamentos, o ano com valores e Ajustes. Os números de Lançamentos e Ano são os de hoje. Ajustes mostra a conta e os nove menus, com ícone, e cada menu abre o fluxo do site.

**Acceptance Scenarios**:

1. **Given** um mês com lançamentos, **When** a lista abre, **Then** cada linha mostra a descrição, o detalhe (data, item, meio) e o valor à direita. Há um único botão preenchido "Registrar".
2. **Given** um mês sem lançamentos, **When** a lista abre, **Then** uma frase explica o mês vazio e há um único botão preenchido "Registrar". O botão some enquanto o formulário está aberto.
3. **Given** o Ano, **When** a pessoa troca o ano, **Then** a barra mostra o ano confirmado e os doze meses só trocam depois da resposta. Se falhar, o ano confirmado permanece. Cada mês mostra o valor na mesma linha do nome.
4. **Given** Ajustes, **When** a tela abre, **Then** a pessoa vê o e-mail da conta, Esqueci a senha, Sair com confirmação, e os menus Cartões, Limites de alerta, Importar planilha, Importar fatura, Exportar, Simulador de competência, Itens arquivados, Dados de exemplo e Excluir conta, cada um com o mesmo ícone e o mesmo subtítulo do site. O ícone é azul, e o de Excluir conta é vermelho, como no site. Tocar um menu abre o mesmo fluxo do site. Importar e exportar deixam Ajustes selecionado na barra de baixo. Excluir conta pede a mesma confirmação do site e, confirmada, encerra a sessão.

---

### Edge Cases

- Mês sem plano e sem gasto: o Resumo mostra o valor zerado de forma legível, a frase não inventa porcentagem e as quatro linhas continuam presentes.
- Valor com muitos milhares de reais: o número grande reduz até caber na largura, sem cortar dígito e sem empurrar a barra de baixo para fora.
- Nome longo de grupo, item ou lançamento: o nome cede espaço e o valor permanece visível na mesma linha.
- Tema do aparelho muda com o app aberto: a pintura seguinte usa o tema novo. A hierarquia, a frase da entrada e a marca amarela permanecem. Não há seletor de tema em Ajustes.
- Sem rede, com dados já mostrados: a lista ou os totais permanecem até a resposta, e um aviso recuperável aparece. Mês, marca e destinos não somem.
- Troca de mês ou de ano ainda sem resposta: o conteúdo anterior permanece. A barra pode mostrar o pedido, e a grade ou a lista só troca com a resposta.
- Sessão inválida: a pessoa volta à tela de entrar, sem dados da conta anterior.
- Painel aberto e troca de destino: o painel fecha sem gravar.
- Campo de entrar vazio ou senha ilegível para a conta: nada é enviado como sucesso e a mensagem diz o que falta ou o que foi recusado.
- "Chegou" no planejado (exatamente o limite): a frase e o medidor usam o aviso, não a cor de erro.
- Atualizar por cima da instalação anterior: a entrega nova entra no aparelho sem exigir desinstalar.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O acabamento MUST seguir `prototype/2026-11-17-acabamento.html` em tipo, peso do número principal, canto, linha, medidor, ícone e splash. A ordem dos blocos MUST continuar a do modo Android de `prototype/2026-11-17-hierarquia.html` e da spec 038.
- **FR-002**: O ícone da gaveta MUST ser a letra M no amarelo `#FFE600`, com a letra em `#221B00`, desenhado para a máscara redonda e a quadrada, e MUST ter versão de uma cor só para a gaveta escura. A splash MUST usar essa mesma marca, centralizada no amarelo, antes da entrada ou do Resumo.
- **FR-003**: A tela de entrar MUST mostrar a marca, "Meu Orçamento", a frase "O que ainda cabe neste mês.", os campos e um único botão preenchido na largura. "Criar conta" MUST ser ação de texto. O cadastro MUST acrescentar Nome, trocar o botão para "Cadastrar" e esconder a frase.
- **FR-004**: O número principal do Resumo e o de "Ainda cabe" MUST ser o maior texto da tela e MUST ter peso maior que o título da barra e que o corpo. O medidor MUST ter trilha visível. Azul dentro do plano, aviso a partir de 80% inclusive no 100%, erro só acima de 100%. O amarelo da marca MUST NOT pintar medidor, aviso, chip, controle de tipo nem destino ativo.
- **FR-005**: Resumo, Orçamento, Lançamentos, Ano e Ajustes MUST usar a mesma linha: nome que cede, detalhe opcional, valor à direita na mesma linha, altura estável. Tocar a linha de tipo no Resumo MUST abrir o Orçamento naquele tipo.
- **FR-006**: Os tipos do Orçamento MUST aparecer num controle único, com rótulos Receitas, Fixas, Variáveis e Anuais. O ativo MUST usar o azul claro `#D7E3FF`. "Ainda cabe em {tipo}" MUST continuar com o nome completo do tipo em minúsculas.
- **FR-007**: O painel do plano MUST entrar pela base, com alça, canto superior arredondado, nome do item no título, foco no campo do mês e ação principal presa no pé. Arquivar MUST nomear o item na primeira ação visível. Cancelar, toque fora e voltar MUST NOT gravar.
- **FR-008**: Lançamentos MUST oferecer um único "Registrar" preenchido quando a lista tem itens e quando o mês está vazio. O formulário aberto MUST esconder esse botão. Ano MUST manter os doze meses e o ano confirmado na barra. Ajustes MUST listar, nesta ordem, a conta (e-mail, Esqueci a senha e Sair) e os menus do site: Cartões, Limites de alerta, Importar planilha, Importar fatura, Exportar, Simulador de competência, Itens arquivados, Dados de exemplo e Excluir conta. Cada menu MUST mostrar o mesmo ícone e o mesmo subtítulo do site e MUST abrir o mesmo fluxo. O ícone MUST ser azul, exceto Excluir conta, que MUST ser vermelho. A conta no topo MUST mostrar o ícone de pessoa.
- **FR-009**: A barra de baixo MUST manter Resumo, Orçamento, Lançamentos, Ano e Ajustes, nessa ordem, com ícone e nome. O destino atual MUST ter a pílula no azul claro. Os nomes MUST caber na largura do aparelho sem cortar no meio da palavra.
- **FR-010**: O tema MUST seguir a preferência claro ou escuro do aparelho. Com o aparelho deitado, o app MUST permanecer em pé.
- **FR-011**: Falha de entrada, falta de rede, conta de demonstração na versão publicada, mês vazio, ano que falha ao carregar e painel fechado sem gravar MUST continuar com o mesmo desfecho das specs 030–038.
- **FR-012**: Uma entrega nova MUST instalar por cima da anterior no mesmo aparelho, sem exigir desinstalar.
- **FR-013**: Esta história MUST NOT alterar competência, parcelas, centavos, as regras de importação e exportação, o cálculo dos saldos, o computador nem o login do site. MUST NOT acrescentar entrada pelo Google, biometria, notificação nem seletor de tema. Excluir conta no Android MUST repetir o fluxo já existente no site. Onde a referência usa números de exemplo, vale o número da conta.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Na gaveta, a pessoa reconhece a letra M no amarelo em menos de 2 segundos, na máscara redonda e na quadrada.
- **SC-002**: Do toque no ícone até a marca amarela no centro, a pessoa não vê tela branca nem o fundo claro do sistema.
- **SC-003**: Sem sessão, a pessoa lê a frase "O que ainda cabe neste mês." e aponta um único botão preenchido. Com rede, entra numa conta válida e chega ao Resumo na primeira tentativa.
- **SC-004**: No Resumo e no Orçamento de um mês com dados, o maior e o mais pesado texto é o valor principal, e ele aparece antes das listas.
- **SC-005**: Para a mesma conta e o mesmo mês, o valor que ainda pode gastar, o total orçado, o total gasto e o realizado de cada tipo permanecem iguais aos de antes desta história.
- **SC-006**: Numa passagem pelas seis telas, mais o ícone e a splash, a ordem dos blocos e os rótulos batem com a referência de acabamento. No tema claro e no escuro, as mesmas informações permanecem.
- **SC-007**: Instalar a entrega nova por cima da anterior conclui sem desinstalar.

## Assumptions

- O PM confirmou em 17 de novembro de 2026: a marca permanece `#FFE600` e `#0058BE`; a ordem da informação permanece a do protótipo de 17 de novembro; o ícone é a letra M no amarelo; a frase da entrada é "O que ainda cabe neste mês."; os cinco nomes da barra permanecem.
- No mesmo dia, o PM pediu que Ajustes tenha os mesmos menus do site. A conta (e-mail, Esqueci a senha e Sair) fica no topo porque no site Sair está na barra de cima, e o app não tem essa barra. Simulador de competência, Itens arquivados, Dados de exemplo e Excluir conta entram no app com o mesmo fluxo do site. O restante da história continua sendo acabamento.
- A referência de acabamento a aprovar é `prototype/2026-11-17-acabamento.html`. Os números desse arquivo são exemplo. A verificação usa a conta real ou a conta de exemplo já existente.
- O amarelo da marca continua só na marca, no ícone e na splash. Aviso preventivo continua o tom já aceito, distinto desse amarelo. Barra e medidor dentro do plano usam o azul de ação `#0058BE`.
- O tipo, o canto e a densidade que o PM aprovar nesse HTML passam a valer. Até o sim, a spec fica em `Draft`.
- Não há botão flutuante de novo lançamento. "Esqueci a senha" continua em Ajustes. Não há seletor manual de tema.
- O tema escuro reaproveita as superfícies já aceitas na spec 038. A referência HTML mostra o tema claro. O escuro mantém a mesma hierarquia, a mesma frase e a mesma marca.
- Público é quem já instala o app Android e usa a mesma conta do computador. Não há persona nova.
- Chave de publicação na loja fica fora. A entrega desta história é o app de aceite, instalável por cima do anterior.
