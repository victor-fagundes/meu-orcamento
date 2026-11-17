# Feature Specification: Aparência Material no Android

**Feature Branch**: `038-material-android`

**Created**: 2026-11-17

**Status**: implemented

**Input**: User description: "Trabalhar a spec junto com o desenho do protótipo para implementar o front do app e deixar pronto para produção, incluindo a tela de entrar."

**Related**: As specs 030–036 já definem o que o app faz. Esta história só muda a apresentação do app instalado para a pessoa reconhecer o modo Android de `prototype/2026-11-17-hierarquia.html`, na linguagem Material já aceita em `prototype/Meu_Orcamento_material.html` e na spec 023. O computador permanece como está nas specs 023, 029 e 037.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reconhecer o app pelo mês e pelo destino (Priority: P1)

A pessoa abre o app já autenticada e vê o mês como título da barra de cima, com mês anterior e próximo. Não há um segundo título de página ("Resumo", "Orçamento", "Lançamentos") competindo com o mês. A barra de baixo mostra os cinco destinos, e o destino atual tem uma pílula atrás do ícone além do nome. O conteúdo vai de borda a borda.

**Why this priority**: É o que faz o app parecer o protótipo em qualquer tela. Sem a casca, cada tela continua uma página genérica.

**Independent Test**: Com sessão ativa, percorrer Resumo, Orçamento e Lançamentos. Em cada um, o título da barra é o mês civil com o ano, e o destino tocado fica com a pílula.

**Acceptance Scenarios**:

1. **Given** o Resumo de novembro de 2026, **When** a tela abre, **Then** a barra de cima diz o mês e o ano, com mês anterior e próximo, e não existe um título "Resumo" acima do valor.
2. **Given** Orçamento ou Lançamentos, **When** a pessoa troca o mês, **Then** o título da barra acompanha o mês, o destino não muda e o tipo escolhido no Orçamento não muda.
3. **Given** a barra de baixo, **When** a pessoa olha o destino atual, **Then** vê o nome e uma pílula no ícone. Os outros quatro destinos continuam visíveis pelo nome.
4. **Given** Ano, **When** a tela abre, **Then** a barra de cima mostra o ano, com ano anterior e próximo, sem um título "Ano" repetido. **Given** Ajustes, **When** a tela abre, **Then** o título da barra é "Ajustes", porque essa tela não é de um mês.
5. **Given** o tema claro ou o escuro do aparelho, **When** qualquer tela abre, **Then** fundo, texto e botão de ação seguem esse tema. O azul continua a cor de ação. O amarelo da marca não pinta a barra nem a navegação.

---

### User Story 2 - Ler quanto ainda pode gastar (Priority: P1)

No Resumo, a primeira informação depois da barra é "Ainda pode gastar" e o valor, maior que qualquer outro texto da tela. Abaixo, uma frase e uma barra fina. Depois, quatro linhas: Receitas, Despesas fixas, Despesas variáveis e Anuais. Cada linha tem o nome, o realizado à direita e o planejado numa linha menor.

**Why this priority**: É a pergunta que a pessoa abre o app para responder, e é o bloco que o protótipo desenha em tamanho de display.

**Independent Test**: No mês corrente, com plano e gasto, o valor que ainda pode gastar é o maior texto, e tocar "Despesas fixas" abre o Orçamento em fixas.

**Acceptance Scenarios**:

1. **Given** um mês com orçado maior que o gasto, **When** a pessoa abre o Resumo, **Then** lê "Ainda pode gastar" e o valor em reais antes das quatro linhas, e esse valor é o maior texto da tela.
2. **Given** o mês corrente, **When** o Resumo abre, **Then** a frase diz a parcela já gasta e quantos dias restam, incluindo hoje, e uma barra acompanha a frase. A barra não é amarela.
3. **Given** o gasto maior que o orçado, **When** o Resumo abre, **Then** o título diz que passou do orçado, o valor usa a cor de erro e a barra também.
4. **Given** uma linha de tipo, **When** a pessoa toca, **Then** o Orçamento abre nesse tipo, no mesmo mês. O realizado e o planejado de cada linha são os mesmos de antes desta história.

---

### User Story 3 - Entrar com a cara do app (Priority: P1)

Quem ainda não entrou vê a marca amarela com a inicial, o nome Meu Orçamento e o formulário alinhado à esquerda. Há um único botão preenchido, "Entrar". "Criar conta" é uma ação de texto. No cadastro, o botão preenchido passa a "Cadastrar" e aparece o campo Nome. "Já tenho conta" volta ao entrar.

**Why this priority**: É a primeira tela de quem instala o app. Hoje ela é um formulário centralizado, sem a marca.

**Independent Test**: Abrir o app sem sessão, entrar com uma conta válida e chegar ao Resumo. Voltar, criar o caminho de cadastro só até ver os campos, sem precisar gravar uma conta nova na verificação visual.

**Acceptance Scenarios**:

1. **Given** nenhuma sessão, **When** o app abre, **Then** a pessoa vê a marca amarela, "Meu Orçamento", os campos E-mail e Senha, o botão preenchido "Entrar" e a ação de texto "Criar conta". Não há um segundo botão preenchido do mesmo tamanho.
2. **Given** "Criar conta", **When** a tela troca, **Then** aparecem Nome, E-mail e Senha, o botão preenchido diz "Cadastrar" e a ação de texto diz "Já tenho conta".
3. **Given** e-mail ou senha recusados, **When** a entrada falha, **Then** a mensagem diz o que falhou, os campos continuam preenchidos e nenhuma sessão abre.
4. **Given** sem rede, **When** a pessoa toca Entrar, **Then** vê um aviso recuperável e permanece na mesma tela.
5. **Given** a versão publicada, **When** a pessoa tenta a conta de demonstração, **Then** a mensagem pede a conta de produção e nenhuma sessão abre. Na versão de desenvolvimento, a conta de demonstração continua podendo entrar.

---

### User Story 4 - Acompanhar o Orçamento no mesmo desenho (Priority: P2)

O Orçamento usa chips de tipo, o texto "Ainda cabe em {tipo}" e o valor no mesmo tamanho de display do Resumo. Cada grupo é uma linha com o valor à direita, a frase de consumo e uma barra. Grupos sem movimento ficam atrás de "Sem movimento neste mês". O plano do item abre pela base da tela.

**Why this priority**: É a segunda tela do dia a dia. O protótipo já desenha chips, display e barras; o app hoje mostra texto empilhado.

**Independent Test**: Abrir Despesas fixas, ver um grupo dentro do plano, um perto do limite e um estourado, e abrir o plano de um item sem gravar.

**Acceptance Scenarios**:

1. **Given** o Orçamento, **When** a tela abre, **Then** os chips são Receitas, Fixas, Variáveis e Anuais, o chip ativo está preenchido, e o valor de "Ainda cabe" é o maior texto abaixo dos chips.
2. **Given** um grupo de despesa dentro do plano, **When** a pessoa lê a linha, **Then** vê o nome, quanto ainda cabe, a frase e uma barra azul. Perto do limite, a barra não é o amarelo da marca. Estourado, a barra e a frase usam a cor de erro. "Chegou" no planejado não usa a cor de erro.
3. **Given** um grupo, **When** a pessoa expande, **Then** vê os itens desse grupo, com planejado e realizado do item, e pode abrir o plano ou arquivar com o mesmo fluxo de hoje.
4. **Given** grupos com plano e realizado zerados, **When** a lista abre, **Then** eles aparecem só depois de "Sem movimento neste mês" e continuam abríveis.
5. **Given** o plano de um item, **When** o painel abre, **Then** entra pela base, com o canto superior arredondado, o campo do mês aberto em foco e as ações Cancelar e Salvar. Cancelar, toque fora e voltar não gravam.

---

### User Story 5 - Lançamentos, Ano e Ajustes na mesma língua (Priority: P2)

Lançamentos, Ano e Ajustes usam a mesma barra, o mesmo texto e as mesmas listas do restante. Lançamentos lista cada movimento com descrição, detalhe e valor à direita. Ano mostra os doze meses lado a lado, com o ano na barra. Ajustes agrupa conta, alertas, cartões e dados em linhas, não em botões soltos.

**Why this priority**: Sem essas três, o app volta ao visual genérico assim que a pessoa sai do Resumo.

**Independent Test**: Abrir um mês com lançamentos, o ano com valores e Ajustes com um cartão ativo. Conferir que os números e as ações são os de hoje.

**Acceptance Scenarios**:

1. **Given** um mês com lançamentos, **When** a lista abre, **Then** cada linha mostra a descrição, o detalhe (data, item, meio) e o valor à direita, sem cortar o valor quando o nome é longo.
2. **Given** um mês sem lançamentos, **When** a lista abre, **Then** uma frase explica e oferece registrar, com um único botão preenchido.
3. **Given** o Ano, **When** a pessoa troca o ano, **Then** a grade dos doze meses só troca depois da resposta. Se falhar, o ano anterior confirmado permanece.
4. **Given** Ajustes, **When** a tela abre, **Then** a pessoa vê o e-mail, sai com confirmação, gerencia cartões ativos, ajusta o limite e alcança importar planilha, importar fatura e exportar em linhas no fim da tela. Não surge exclusão de conta.

---

### Edge Cases

- Mês sem plano e sem gasto: o Resumo mostra o valor zerado de forma legível, a frase não inventa porcentagem e as quatro linhas continuam presentes.
- Valor com muitos milhares de reais: o número grande quebra ou encolhe dentro da largura, sem empurrar a barra de baixo para fora.
- Nome longo de grupo, item ou lançamento: o nome cede espaço e o valor permanece visível na mesma linha.
- Tema do aparelho muda com o app aberto: a pintura seguinte usa o tema novo, sem pedir para sair e entrar. Não há seletor de tema em Ajustes.
- Sem rede, com dados já mostrados: a lista ou os totais permanecem e um aviso recuperável aparece. A casca (mês, pílula, marca) não some.
- Sessão inválida: a pessoa volta à tela de entrar, sem dados da conta anterior.
- Painel aberto e troca de destino: o painel fecha sem gravar.
- Campo de entrar vazio ou senha ilegível para a conta: nada é enviado como sucesso e a mensagem diz o que falta ou o que foi recusado.
- "Chegou" no planejado (exatamente o limite): a frase não usa a cor de erro.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O app instalado MUST apresentar a hierarquia do modo Android de `prototype/2026-11-17-hierarquia.html`: mês como título da barra, valor em tamanho de display, linhas com o valor à direita, chips de tipo e pílula no destino ativo. A linguagem de cor MUST ser a do Material já aceito: azul do produto na ação e nas barras dentro do plano, amarelo só na marca.
- **FR-002**: Nas telas de um mês, a barra de cima MUST mostrar o mês civil e o ano, com mês anterior e próximo nomeados. MUST NOT haver um título de página repetindo o nome do destino acima do conteúdo.
- **FR-003**: A barra de baixo MUST manter Resumo, Orçamento, Lançamentos, Ano e Ajustes, nessa ordem, com ícone e nome sempre visíveis. O destino atual MUST ter pílula e nome.
- **FR-004**: O tema MUST seguir a preferência claro ou escuro do aparelho. O amarelo da marca MUST NOT ser a cor da barra de consumo, do aviso preventivo nem do destino ativo.
- **FR-005**: O Resumo MUST abrir com "Ainda pode gastar" ou "Passou do orçado", o valor maior que o restante do texto, a frase, a barra e as quatro linhas de tipo. Tocar a linha MUST abrir o Orçamento naquele tipo. Os números MUST ser os já definidos nas specs 028 e 031.
- **FR-006**: A tela de entrar MUST mostrar a marca amarela com a inicial, o nome Meu Orçamento, E-mail, Senha e um único botão preenchido "Entrar". "Criar conta" MUST ser ação de texto. O cadastro MUST acrescentar Nome e trocar o botão preenchido para "Cadastrar".
- **FR-007**: Falha de entrada, falta de rede e a conta de demonstração na versão publicada MUST continuar com o mesmo desfecho de hoje: mensagem visível, campos preservados, sem sessão indevida.
- **FR-008**: O Orçamento MUST mostrar os quatro chips, "Ainda cabe em {tipo}" no tamanho de display, as linhas de grupo com frase e barra, e "Sem movimento neste mês" só para grupos zerados. Arquivar, plano do mês e novo item MUST gravar só no mesmo passo em que gravam hoje.
- **FR-009**: O painel que sobe pela base MUST ter o canto superior arredondado, foco no campo previsto pela spec 032 e fechamento sem gravar por Cancelar, toque fora ou voltar.
- **FR-010**: Lançamentos, Ano e Ajustes MUST usar a mesma barra, o mesmo alinhamento de lista e o mesmo peso de botão do restante. As ações já existentes (registrar, editar, excluir com confirmação, trocar o ano, cartões, limite, importar e exportar) MUST continuar disponíveis e MUST NOT ganhar exclusão de conta.
- **FR-011**: Texto longo MUST NOT esconder o valor. Alvos de toque da barra, dos chips e das linhas MUST ser separados o bastante para o dedo acertar um de cada vez. O foco do teclado MUST ser visível.
- **FR-012**: Esta história MUST NOT alterar competência, parcelas, centavos, importação, exportação, o cálculo dos saldos nem o computador. Onde o protótipo usa números de exemplo, vale o número da conta.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em uma passagem pelos cinco destinos, a pessoa aponta o destino atual em menos de 2 segundos pela pílula e pelo nome.
- **SC-002**: No Resumo e no Orçamento de um mês com dados, o maior texto da tela é o valor principal ("Ainda pode gastar" ou "Ainda cabe"), e ele aparece antes das listas.
- **SC-003**: Para a mesma conta e o mesmo mês, o valor que ainda pode gastar, o total orçado, o total gasto e o realizado de cada tipo permanecem iguais aos de antes desta história.
- **SC-004**: Sem sessão, a pessoa descreve a tela de entrar com a marca, um botão preenchido e uma ação de texto, e entra numa conta válida até o Resumo na primeira tentativa quando a rede responde.
- **SC-005**: No tema claro e no escuro, as mesmas informações permanecem: mês na barra, valor principal, quatro linhas do Resumo, chips do Orçamento e os cinco destinos.
- **SC-006**: Comparando com o modo Android do protótipo de 17 de novembro, casca, Resumo, Orçamento e painel de plano batem na ordem dos blocos, no alinhamento do valor à direita e no amarelo restrito à marca.

## Assumptions

- O público é quem instala o app Android e usa a mesma conta do computador. Não há persona nova.
- A referência de composição é o modo Android de `prototype/2026-11-17-hierarquia.html`. A referência de cor, tema escuro, marca e peso de botão é `prototype/Meu_Orcamento_material.html` junto com a spec 023. O computador, inclusive o login do site, fica fora.
- O mês na barra inclui o ano, como a spec 030 já exige. O protótipo desenha só "Novembro"; o produto mostra o ano para não confundir competências.
- O amarelo da marca continua o amarelo do produto. Aviso preventivo e "perto do limite" usam o tom já aceito para alerta, distinto desse amarelo. Barra dentro do plano usa o azul de ação.
- Não há botão flutuante de novo lançamento. Registrar continua pelo caminho que as specs 033 e 035 já definem. "Esqueci a senha" continua em Ajustes, abrindo o endereço que já existe.
- Não há seletor manual de tema.
- Números de exemplo do protótipo não são massa obrigatória. A verificação usa a conta real ou a conta de exemplo já existente.
- Esta história é apresentação. A entrega é o app usável nas telas listadas, com os fluxos de 030–036 intactos. Não há regra nova de domínio.
- O desenho gasta o destaque num lugar só: o valor do mês. A entrada gasta o destaque na marca. O resto fica quieto, alinhado à esquerda, sem rótulo decorativo acima de cada bloco.
