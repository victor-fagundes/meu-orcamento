# Feature Specification: Material Design

**Feature Branch**: `023-material-design`

**Created**: 2026-11-16

**Status**: `implemented`

**Input**: User description: "Adotar o Material Design 3 no Meu Orçamento, com a cor azul do produto e o amarelo só como acento, como no protótipo `prototype/Meu_Orcamento_material.html`. Não muda regras de orçamento."

**Related**: Muda a apresentação das telas já cobertas por 001–012, 016–018 e 021. O número do Resumo continua “despesas planejadas menos gasto” (012); o rótulo principal passa a ser “Ainda pode gastar”. “Ver detalhes” de um tipo abre o Orçamento nesse tipo (completa o pedido visível do GAP-006). Não fecha GAP-003 nem o anúncio de Arquivar do GAP-007.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reconhecer o app e mudar de seção (Priority: P1)

Como pessoa que usa o Meu Orçamento no computador e no celular, quero uma casca única, com a cor azul do produto e o amarelo só na marca, para achar a seção certa sem reaprender o app.

**Why this priority**: A navegação é o que se vê em toda tela. Sem ela, o restante do visual fica inconsistente.

**Independent Test**: Entrar no app em janela larga e em janela estreita, no tema claro e no escuro do aparelho, e percorrer Resumo, Orçamento, Lançamentos, Ano e Ajustes.

**Acceptance Scenarios**:

1. **Given** uma janela larga, **When** o usuário entra no app, **Then** vê a marca (marca amarela com a inicial), o nome Meu Orçamento, abas de texto com a seção ativa sublinhada em azul, e o botão Novo lançamento em azul.
2. **Given** uma janela estreita, **When** o usuário entra no app, **Then** a barra de baixo mostra ícone e nome das cinco seções, a seção ativa tem uma pílula, e Novo lançamento aparece como botão flutuante com o texto “Novo lançamento”.
3. **Given** o tema claro ou o escuro do aparelho, **When** a tela abre, **Then** fundo, texto e botão de ação seguem esse tema, o azul continua sendo a cor de ação e o amarelo não pinta a barra inteira.
4. **Given** qualquer seção principal, **When** o usuário olha a navegação, **Then** as cinco seções continuam sendo Resumo, Orçamento, Lançamentos, Ano e Ajustes, na mesma ordem de hoje.

---

### User Story 2 - Ler o mês no Resumo (Priority: P1)

Como pessoa acompanhando o mês, quero ver primeiro quanto ainda posso gastar, com o alerta e os gráficos legíveis, para decidir sem abrir outra tela.

**Why this priority**: O Resumo é a tela de chegada e foi o que o protótipo comparou com o app atual.

**Independent Test**: Abrir o Resumo de um mês com plano e gastos, inclusive um gasto de categoria em ou acima de 80% do planejado, e conferir os mesmos números de hoje com a nova hierarquia.

**Acceptance Scenarios**:

1. **Given** um mês com despesas planejadas e gasto, **When** o usuário abre o Resumo, **Then** o bloco principal mostra “Ainda pode gastar” (planejado de despesas menos gasto), a barra da parcela já usada e o texto com essa porcentagem.
2. **Given** o mesmo mês, **When** o usuário olha ao lado do bloco principal, **Then** total orçado e total gasto continuam visíveis, menores que o bloco principal.
3. **Given** o filtro de pagamento em Todas, **When** o mês tem alerta preventivo (a partir de 80% do planejado), **Then** um aviso amarelo explica a categoria e a porcentagem; estouro usa a cor de erro.
4. **Given** o filtro de pagamento diferente de Todas, **When** o Resumo atualiza, **Then** orçado e “ainda pode gastar” mostram “—” e o gasto mostra só o que o filtro pegou, como na spec 012.
5. **Given** gastos no mês, **When** o usuário vê os gráficos, **Then** a rosca tem no máximo quatro categorias mais “Outros”, com legenda e porcentagem, e as barras comparam planejado (azul) e realizado (amarelo) com os nomes Receitas, Fixas, Variáveis e Anuais.
6. **Given** um card de tipo, **When** o usuário escolhe Ver detalhes, **Then** abre o Orçamento daquele tipo, no mesmo mês.
7. **Given** o mês corrente, **When** o Resumo abre, **Then** a média diária e os dias que restam continuam visíveis.

---

### User Story 3 - Lançar sem mudar a regra (Priority: P1)

Como pessoa registrando um gasto, quero abrir Novo lançamento de qualquer seção e preencher os mesmos campos de hoje, para o visual novo não criar um segundo jeito de lançar.

**Why this priority**: O botão flutuante e o sheet são o gesto mais visível do Material. O valor tem que continuar o mesmo de um lançamento feito pela lista.

**Independent Test**: Na janela larga, usar o botão do topo; na estreita, o botão flutuante. Salvar um lançamento e ver o mesmo valor, a mesma competência e o mesmo item na lista.

**Acceptance Scenarios**:

1. **Given** Resumo, Orçamento, Ano ou Ajustes, **When** o usuário aciona Novo lançamento, **Then** abre o mesmo formulário de hoje: tipo, item, descrição, valor, data e pagamento.
2. **Given** a janela estreita, **When** o formulário abre, **Then** entra pela base da tela, com alça de arraste. **Given** a janela larga, **When** abre, **Then** aparece como diálogo no centro.
3. **Given** o formulário aberto, **When** o usuário confirma, **Then** o lançamento segue as regras já aceitas (centavos, competência, parcelas) e a lista mostra o valor em reais.
4. **Given** o formulário aberto pelo teclado, **When** o usuário pressiona Escape ou Cancelar, **Then** nada é gravado, o formulário fecha e o foco volta ao controle que abriu.
5. **Given** a lista de lançamentos, **When** o usuário edita ou desfaz uma exclusão, **Then** esses fluxos continuam disponíveis, só com o visual novo.

---

### User Story 4 - Acompanhar o Orçamento (Priority: P2)

Como pessoa ajustando o plano, quero chips de tipo, barra de consumo e grupos expansíveis no visual novo, para ver estouro e alerta sem perder o que a tela já faz.

**Why this priority**: É a segunda tela do dia a dia, depois do Resumo e do lançamento.

**Independent Test**: Abrir Orçamento em Despesas fixas, expandir um grupo em ou acima de 80% e outro estourado, e conferir os mesmos reais de hoje.

**Acceptance Scenarios**:

1. **Given** o Orçamento, **When** a tela abre, **Then** os chips são Receitas, Fixas, Variáveis e Anuais, com o tipo ativo preenchido, e o total do tipo mostra realizado e planejado.
2. **Given** um grupo de despesa, **When** o realizado fica entre 80% e 100% do planejado, **Then** a barra fica amarela e a porcentagem aparece; acima de 100%, a barra e o texto usam a cor de erro.
3. **Given** um grupo, **When** o usuário expande, **Then** vê os itens, o planejado e o realizado, e pode abrir o plano do item ou criar um item novo no tipo atual.
4. **Given** o mês trocado no Orçamento, **When** o usuário volta ao Resumo, **Then** as duas telas respeitam a competência que cada uma já usa hoje.

---

### User Story 5 - Ano, Ajustes e entrada (Priority: P2)

Como pessoa nas telas de apoio, quero o mesmo visual sem a tabela do ano virar cartões enormes e sem os formulários de entrada mudarem de fluxo.

**Why this priority**: Completa o app. A tabela anual perde se ganhar o espaçamento largo das outras telas.

**Independent Test**: Abrir Ano e ler um mês sem rolagem vertical extra por linha; abrir Ajustes e concluir um caminho já existente (por exemplo, ver cartões); abrir login e cadastro e reconhecer os mesmos campos.

**Acceptance Scenarios**:

1. **Given** a visão Ano, **When** o usuário alterna Planejado e Realizado, **Then** a tabela continua com os meses em colunas, total e saldo, e na janela estreita desliza para o lado em vez de quebrar um mês por cartão.
2. **Given** Ajustes, **When** a tela abre, **Then** cartões, limites, importar planilha, importar fatura, exportar, carregar exemplo e excluir conta continuam no mesmo fluxo, com campos, botões e listas no visual novo.
3. **Given** login, cadastro ou esqueci a senha, **When** a tela abre em janela larga, **Then** o painel da marca permanece e os campos e o botão principal seguem o mesmo visual do app; em janela estreita, o formulário ocupa a tela.
4. **Given** um erro de formulário (senha, valor vazio, exclusão sem a frase EXCLUIR), **When** a validação falha, **Then** a mensagem continua visível e nada é apagado ou gravado fora da regra atual.

---

### Edge Cases

- Mês sem lançamentos e sem plano: o Resumo mostra zeros ou vazio legível, sem bloco quebrado, e a rosca explica que não há despesas.
- “Ainda pode gastar” negativo: o valor usa a cor de erro e o texto deixa claro que passou do orçado.
- Nome longo de categoria ou descrição: o texto quebra ou corta com reticências, sem empurrar o valor para fora da tela.
- Troca do tema do aparelho com o app aberto: a próxima pintura usa o tema novo, sem exigir sair e entrar.
- Sheet aberto e toque fora dele: fecha sem gravar, como Escape.
- Foco visível: quem navega por teclado vê qual aba, botão ou campo está ativo.
- Valores grandes (muitos milhares de reais): o bloco principal não estoura a largura da tela.
- Filtro de categoria no Resumo: a rosca some, como hoje, e o texto pede para limpar o filtro.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O app MUST usar o Material Design 3 como linguagem visual de referência, com a cor de ação azul do produto (a mesma família de `#0057B8`) e o amarelo `#FFE600` só na marca, no alerta preventivo e na série Realizado dos gráficos.
- **FR-002**: A barra superior MUST ser clara no tema claro (e a superfície escura equivalente no tema escuro). A faixa navy atual MUST sair.
- **FR-003**: Em janela larga, as seções MUST ser abas de texto na barra, com indicador azul na ativa. Em janela estreita, MUST ser barra inferior com ícone, nome e pílula na ativa.
- **FR-004**: Novo lançamento MUST estar disponível em todas as seções principais: botão azul no topo em janela larga e botão flutuante “Novo lançamento” em janela estreita.
- **FR-005**: O tema MUST seguir a preferência claro/escuro do aparelho. Esta história MUST NOT adicionar um seletor de tema em Ajustes.
- **FR-006**: O Resumo MUST destacar “Ainda pode gastar”, manter total orçado e total gasto, e preservar filtros, média diária, rosca (até quatro categorias + Outros) e barras da spec 012.
- **FR-007**: Ver detalhes de um tipo no Resumo MUST abrir o Orçamento desse tipo no mês em contexto.
- **FR-008**: Alertas do Resumo e do Orçamento MUST continuar os da spec 011: preventivo a partir do limite (padrão 80%) em amarelo, estouro em cor de erro.
- **FR-009**: O formulário de novo lançamento, o de edição, o plano do item e o de novo item MUST manter os campos e as regras atuais. Em janela estreita abrem pela base; em janela larga, como diálogo.
- **FR-010**: Escape, Cancelar e toque fora de um formulário desses MUST fechar sem gravar, e o foco MUST voltar ao controle que abriu.
- **FR-011**: A visão Ano MUST permanecer uma tabela de meses, com Planejado/Realizado e rolagem horizontal na janela estreita.
- **FR-012**: Login, cadastro, esqueci a senha e Ajustes MUST usar os mesmos campos, botões e listas do visual novo, sem mudar o que cada ação grava ou apaga.
- **FR-013**: Valores MUST continuar exibidos em reais (pt-BR) a partir de centavos inteiros. Esta história MUST NOT alterar competência, parcelas, importação, exportação nem o cálculo dos saldos.
- **FR-014**: O protótipo `prototype/Meu_Orcamento_material.html` é a referência visual desta história para casca, Resumo, Orçamento, lista, formulário de lançamento, Ano e Ajustes. Onde o protótipo simplifica dados, vale a regra da spec de produto já aceita.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em uma passagem de cinco seções, no computador e no celular, a seção ativa é reconhecível em menos de 2 segundos, pelo sublinhado (largo) ou pela pílula (estreito).
- **SC-002**: No Resumo de um mês com dados, a pessoa lê “ainda pode gastar” e a porcentagem usada sem abrir Orçamento ou Lançamentos.
- **SC-003**: Um lançamento criado pelo botão novo, no Resumo, aparece na lista com o mesmo valor e a mesma competência de um lançamento criado na própria lista.
- **SC-004**: Claro e escuro mostram as mesmas informações. Os cinco destinos, os três números do Resumo e a tabela do ano permanecem presentes nos dois temas.
- **SC-005**: Comparando com o protótipo, casca, Resumo, Orçamento, formulário de lançamento, Ano e Ajustes batem em hierarquia, cor de ação e amarelo de acento, no largo e no estreito.
- **SC-006**: Para a mesma conta e o mesmo mês, total orçado, total gasto e saldo numérico permanecem iguais aos de antes desta história. Só mudam rótulo principal, hierarquia e controles.
- **SC-007**: Pelo teclado, a pessoa abre Novo lançamento, percorre os campos, cancela com Escape e o foco volta ao botão que abriu, sem registro novo.

## Assumptions

- O público é quem já usa o app (uma conta, no computador e no celular). Não há persona nova.
- “Material Design” aqui é o Material Design 3, não a paleta roxa padrão de demonstração do Google e não um kit de terceiros escolhido por nome na spec.
- A referência visual é `prototype/Meu_Orcamento_material.html`. O protótipo v3 antigo deixa de ser a referência de cor e de casca quando esta história for verificada.
- Esta história é só apresentação e o acesso global a Novo lançamento. Não há regra nova de domínio, então a entrega é a interface usável nas telas listadas, não uma API.
- O mês de exemplo do protótipo (novembro, com totais ilustrativos) não é massa obrigatória. A verificação usa a conta real ou a conta de exemplo já existente.
- Trocar o mês no protótipo só muda o rótulo; no produto, trocar o mês continua carregando os dados daquele mês.
- GAP-003 (orientação depois do import) e o anúncio do nome ao Arquivar (GAP-007) ficam de fora. Teclado do formulário entra nesta história.
- Não há seletor manual de tema. Quem quiser escuro muda no aparelho.
- Status `ready` desde 2026-11-16, com o PM aceitando o escopo: só o design system. Implementar a partir deste plano.
