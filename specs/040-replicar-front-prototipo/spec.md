# Feature Specification: Replicar o front do protótipo

**Feature Branch**: `040-replicar-front-prototipo`

**Created**: 2026-11-17

**Status**: Cancelled

**Cancelada em**: 2026-11-17. O PM cancelou esta spec e manteve a 039. Não implementar.

**Input**: User description: "Conseguimos agora replicar exatamente o front do protótipo?"

**Related**: Cancelada. Não substitui a spec 039. A referência visual citada era `prototype/2026-11-17-acabamento.html`. A ordem dos blocos continua a do modo Android de `prototype/2026-11-17-hierarquia.html` e da spec 038. Os fluxos de dinheiro, competência e importação continuam os das specs 030–038. Os menus de Ajustes que o protótipo não desenha por dentro seguem o fluxo do site.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - O app é o protótipo, da gaveta à entrada (Priority: P1)

A pessoa instala o app e, ao lado do protótipo, reconhece o mesmo ícone, a mesma splash e a mesma tela de entrar. A letra M está no amarelo, na gaveta redonda, na quadrada e na versão de uma cor só. A abertura é a marca no centro do amarelo, sem flash branco. A entrada mostra a marca, o nome, a frase "O que ainda cabe neste mês.", os campos e um único botão preenchido.

**Why this priority**: É a pergunta desta história. Se a gaveta e a entrada divergem do protótipo, o restante da réplica não se sustenta.

**Independent Test**: Colocar o aparelho ao lado dos quadros Ícone, Splash e Entrar do protótipo e conferir rótulo, cor e quantidade de botões preenchidos.

**Acceptance Scenarios**:

1. **Given** o app instalado, **When** a pessoa compara a gaveta com o protótipo, **Then** vê a letra M no amarelo `#FFE600`, com a letra em `#221B00`, na máscara redonda, na quadrada e na versão de uma cor só.
2. **Given** o toque no ícone, **When** o app abre, **Then** a primeira pintura é a marca centralizada no amarelo, e em seguida a entrada (sem sessão) ou o Resumo (com sessão). Não há flash branco.
3. **Given** nenhuma sessão, **When** a entrada abre, **Then** a pessoa vê a marca, "Meu Orçamento", a frase "O que ainda cabe neste mês.", E-mail, Senha, o botão preenchido "Entrar" na largura e a ação de texto "Criar conta". Não há segundo título nem segundo botão preenchido.
4. **Given** "Criar conta", **When** a tela troca, **Then** aparecem Nome, E-mail e Senha, o botão preenchido diz "Cadastrar" e a ação de texto diz "Já tenho conta". A frase da entrada sai.
5. **Given** falha de entrada, falta de rede ou conta de demonstração na versão publicada, **When** a pessoa tenta entrar, **Then** o desfecho é o de hoje: mensagem visível, campos preservados, sem sessão indevida. Na versão de desenvolvimento, a conta de demonstração continua podendo entrar.

---

### User Story 2 - Resumo e Orçamento iguais aos quadros (Priority: P1)

No Resumo e no Orçamento, a pessoa encontra os mesmos blocos do protótipo, na mesma ordem. O número principal é o maior e o mais pesado texto. O medidor tem trilha. As linhas trazem o valor à direita. O controle de tipo é um só. O plano do item sobe como no quadro "Plano do item".

**Why this priority**: São as duas telas do dia a dia. A réplica se prova aqui, com os números da conta no lugar dos números de exemplo.

**Independent Test**: Com a mesma conta e o mesmo mês, comparar Resumo, Orçamento e o plano de um item com os três quadros. Os valores são os da conta. A ordem dos blocos é a do protótipo.

**Acceptance Scenarios**:

1. **Given** o Resumo de um mês com dados, **When** a pessoa compara com o quadro Resumo, **Then** vê o mês na barra, "Ainda pode gastar" ou "Passou do orçado", o valor em destaque, a frase, o medidor e as quatro linhas Receitas, Despesas fixas, Despesas variáveis e Anuais. Não há um título "Resumo" acima do valor.
2. **Given** o Orçamento, **When** a pessoa compara com o quadro Orçamento, **Then** vê um controle só com Receitas, Fixas, Variáveis e Anuais, o ativo no azul claro `#D7E3FF`, "Ainda cabe em {tipo}" com o nome completo em minúsculas, e o valor no mesmo peso do Resumo.
3. **Given** um grupo, **When** a pessoa lê a linha, **Then** vê o nome, quanto ainda cabe à direita e o medidor. Dentro do plano o preenchimento é azul. A partir de 80%, inclusive no 100%, é o aviso. Só acima de 100% é erro. O amarelo da marca não pinta o medidor. "Chegou" no planejado não usa erro.
4. **Given** grupos zerados, **When** a lista abre, **Then** eles aparecem só depois de "Sem movimento neste mês" e continuam abríveis.
5. **Given** o plano de um item, **When** o painel abre, **Then** entra pela base, com alça, canto superior arredondado, o nome do item, o campo do mês em foco, Cancelar e a ação principal presa no pé, e "Arquivar {nome}". Cancelar, toque fora e voltar não gravam.
6. **Given** a mesma conta e o mesmo mês, **When** a pessoa lê o valor principal e o realizado de cada tipo, **Then** os números são os de antes desta história, não os números de exemplo do protótipo.

---

### User Story 3 - Lançamentos, Ano e Ajustes iguais aos quadros (Priority: P2)

Lançamentos, Ano e Ajustes repetem os quadros do protótipo. Ajustes lista a conta e os mesmos menus do site, cada um com o ícone do quadro: pessoa, cartão, sino, folha, PDF, seta para baixo, calendário, caixa, frasco e lixeira vermelha.

**Why this priority**: Sem essas três, a réplica acaba no Orçamento.

**Independent Test**: Abrir os quadros Lançamentos, Ano e Ajustes ao lado do app e conferir rótulos, ícones e a quantidade de botões preenchidos.

**Acceptance Scenarios**:

1. **Given** um mês com lançamentos, **When** a lista abre, **Then** cada linha mostra a descrição, o detalhe (data, item, meio) e o valor à direita, e há um único botão preenchido "Registrar".
2. **Given** um mês sem lançamentos, **When** a lista abre, **Then** uma frase explica o mês vazio e há um único botão preenchido "Registrar". O botão some enquanto o formulário está aberto.
3. **Given** o Ano, **When** a pessoa compara com o quadro, **Then** a barra mostra o ano confirmado e os doze meses, com o valor na mesma linha do nome. A grade só troca depois da resposta. Se falhar, o ano confirmado permanece.
4. **Given** Ajustes, **When** a pessoa compara com o quadro, **Then** vê, nesta ordem, a conta (ícone de pessoa, e-mail, Esqueci a senha e Sair) e os menus Cartões, Limites de alerta, Importar planilha, Importar fatura, Exportar, Simulador de competência, Itens arquivados, Dados de exemplo e Excluir conta. Cada menu tem o mesmo ícone e o mesmo subtítulo do quadro. O ícone é azul, e o de Excluir conta é vermelho.
5. **Given** um menu de Ajustes, **When** a pessoa toca, **Then** abre o mesmo fluxo do site. Excluir conta pede a mesma confirmação do site e, confirmada, encerra a sessão. Importar e exportar deixam Ajustes selecionado na barra de baixo. Sair pede confirmação.

---

### Edge Cases

- Mês sem plano e sem gasto: o Resumo mostra o valor zerado, a frase não inventa porcentagem e as quatro linhas continuam presentes.
- Valor com muitos milhares de reais: o número grande reduz até caber na largura, sem cortar dígito e sem esconder a barra de baixo.
- Nome longo: o nome cede e o valor permanece na mesma linha.
- Tema escuro: o protótipo desenha o tema claro. No escuro, a hierarquia, os rótulos, os ícones e a marca amarela permanecem. Não há seletor de tema.
- Aparelho deitado: as telas continuam em pé, como o protótipo, que é um telefone em pé.
- Sem rede, com dados já mostrados: a lista ou os totais permanecem e um aviso recuperável aparece.
- Troca de mês ou de ano ainda sem resposta: o conteúdo anterior permanece.
- Sessão inválida: a pessoa volta à entrada, sem dados da conta anterior.
- Painel aberto e troca de destino: o painel fecha sem gravar.
- Campo vazio ou senha recusada: nada entra como sucesso e a mensagem diz o que falta ou o que foi recusado.
- Atualizar por cima da instalação anterior: a entrega nova entra sem exigir desinstalar.
- Quadro do protótipo sem o miolo de um fluxo (formulário de cartão, simulador, lista de arquivados, carga de exemplo, confirmação de exclusão): a linha do menu replica o quadro. O miolo replica o fluxo do site.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O app instalado MUST replicar `prototype/2026-11-17-acabamento.html`. Colocado ao lado de cada quadro, o app MUST mostrar os mesmos blocos, na mesma ordem, com os mesmos rótulos e os mesmos ícones. MUST NOT exigir a mesma largura em pixels do navegador. Onde o quadro usa número de exemplo, MUST valer o número da conta.
- **FR-002**: O ícone da gaveta MUST ser a letra M no amarelo `#FFE600`, letra `#221B00`, nas máscaras redonda e quadrada, com versão de uma cor só. A splash MUST ser essa marca centralizada no amarelo, antes da entrada ou do Resumo, sem flash branco.
- **FR-003**: A entrada MUST mostrar a marca, "Meu Orçamento", a frase "O que ainda cabe neste mês.", os campos e um único botão preenchido na largura. "Criar conta" MUST ser ação de texto. O cadastro MUST acrescentar Nome, trocar o botão para "Cadastrar" e esconder a frase.
- **FR-004**: O número principal do Resumo e o de "Ainda cabe" MUST ser o maior e o mais pesado texto da tela. O medidor MUST ter trilha visível. Azul dentro do plano, aviso a partir de 80% inclusive no 100%, erro só acima de 100%. O amarelo da marca MUST NOT pintar medidor, aviso, controle de tipo nem destino ativo.
- **FR-005**: Resumo, Orçamento, Lançamentos, Ano e Ajustes MUST usar a mesma linha do protótipo: nome que cede, detalhe opcional, valor à direita. Tocar a linha de tipo no Resumo MUST abrir o Orçamento naquele tipo.
- **FR-006**: O Orçamento MUST usar um controle único com Receitas, Fixas, Variáveis e Anuais. O ativo MUST usar o azul claro `#D7E3FF`. O painel do plano MUST repetir o quadro "Plano do item": alça, nome do item, foco no campo do mês, ação principal no pé e "Arquivar {nome}". Cancelar, toque fora e voltar MUST NOT gravar.
- **FR-007**: Lançamentos MUST oferecer um único "Registrar" preenchido, com itens ou com o mês vazio, e MUST escondê-lo enquanto o formulário está aberto. Ano MUST manter os doze meses sob o ano confirmado, com o valor na mesma linha do nome.
- **FR-008**: Ajustes MUST repetir o quadro Ajustes: conta com ícone de pessoa e, nesta ordem, Cartões, Limites de alerta, Importar planilha, Importar fatura, Exportar, Simulador de competência, Itens arquivados, Dados de exemplo e Excluir conta. Cada menu MUST ter o ícone e o subtítulo do quadro. O ícone MUST ser azul, exceto Excluir conta, que MUST ser vermelho. Cada menu MUST abrir o mesmo fluxo do site.
- **FR-009**: A barra de baixo MUST manter Resumo, Orçamento, Lançamentos, Ano e Ajustes, nessa ordem, com ícone, nome e pílula azul clara no destino atual. Os nomes MUST caber sem cortar no meio da palavra.
- **FR-010**: O tema MUST seguir o claro ou o escuro do aparelho. Com o aparelho deitado, o app MUST permanecer em pé. Uma entrega nova MUST instalar por cima da anterior, sem exigir desinstalar.
- **FR-011**: Esta história MUST NOT alterar competência, parcelas, centavos, as regras de importação e exportação, o cálculo dos saldos, o computador nem o login do site. MUST NOT acrescentar entrada pelo Google, biometria, notificação, seletor de tema nem botão flutuante. Falha de entrada, mês vazio, ano que falha ao carregar e painel fechado sem gravar MUST continuar com o desfecho das specs 030–038.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Ao lado dos quadros Ícone, Splash e Entrar, a pessoa aponta cada diferença de rótulo, ícone ou botão preenchido em uma passagem de menos de 2 minutos, e a lista de diferenças fica vazia.
- **SC-002**: Ao lado dos quadros Resumo, Orçamento e Plano do item, a ordem dos blocos e os rótulos coincidem. O valor principal é o da conta.
- **SC-003**: Ao lado dos quadros Lançamentos, Ano e Ajustes, os rótulos e os ícones coincidem, inclusive a lixeira vermelha de Excluir conta.
- **SC-004**: Para a mesma conta e o mesmo mês, o valor que ainda pode gastar, o total orçado, o total gasto e o realizado de cada tipo permanecem iguais aos de antes desta história.
- **SC-005**: No tema claro e no escuro, as mesmas informações permanecem. Instalar a entrega nova por cima da anterior conclui sem desinstalar.

## Assumptions

- "Exatamente" é a comparação lado a lado com `prototype/2026-11-17-acabamento.html`: mesmos blocos, mesma ordem, mesmos rótulos, mesmos ícones. Não é a mesma medida em pixels do navegador. Os números de exemplo do arquivo não são a massa da conta.
- O protótipo desenha o tema claro. O escuro mantém a mesma hierarquia, os mesmos rótulos e a mesma marca.
- A conta fica no topo de Ajustes porque no site Sair está na barra de cima, e o app não tem essa barra. O ícone dessa linha é o de pessoa, como no quadro.
- O miolo dos menus que o quadro não desenha (cartão, limite, simulador, arquivados, exemplo, exclusão) é o fluxo já existente no site. A linha do menu é a do quadro.
- O PM cancelou esta spec e manteve a 039. Não se implementa a 040.
- Público é quem já instala o app Android e usa a mesma conta do computador.
- Chave de publicação na loja fica fora. A entrega é o app de aceite, instalável por cima do anterior.
- Esta spec permanece `Draft` até o planejamento. O código espera o status `ready`.
