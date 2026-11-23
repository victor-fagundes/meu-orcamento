# Feature Specification: Lançamentos web

**Feature Branch**: `045-lancamentos-web`

**Created**: 2026-11-23

**Status**: implemented

**Input**: User description: "/speckit-specify 045"

**Related**: Quem entrou na conta abre Lançamentos e lê o mês da casca numa tabela: data, descrição, item, pagamento e valor. Busca e filtra dentro desse mês. Registra e edita no painel, parcela no cartão com a prévia dos centavos e exclui com confirmação e desfazer por 10 segundos. A conta da fatura e a divisão das parcelas continuam as que o produto já usa. A aparência vem da história 040. O lugar na casca vem da história 042.

## Referências visuais e de DS
- Identidade: `docs/identidade-visual/decisoes/DECISOES_identidade_visual.md` (seções aplicáveis: 5 Layout, 6 Formulários e confirmações, 7 Estados e mensagens, 8 Nomes e microcopy)
- Tela de referência: `docs/identidade-visual/telas-web/web-lanc-lista.dc.html`, `web-lanc-vazio.dc.html`, `web-lanc-busca-vazia.dc.html`, `web-lanc-registrar.dc.html`, `web-lanc-parcelado.dc.html`, `web-lanc-editar-escopo.dc.html`, `web-lanc-excluir-escopo.dc.html`
- Componentes do DS usados: `CabecalhoTela`, `Tabela`, `CampoBusca`, `Select`, `CampoMoeda`, `CampoData`, `Campo`, `Switch`, `FormularioContainer`, `RodapeAcoes`, `Botao`, `Dialogo`, `Snackbar`, `MenuAcoes`, `CartaoVazio`, `Skeleton`, `EstadoErro`
- Tokens: apenas os de `packages/design-system/src/core/tokens.ts`

## Critérios de aceite visuais
- AC-V1: hierarquia e textos iguais à tela de referência, salvo as diferenças registradas em Assumptions.
- AC-V2: todos os componentes vêm do DS.
- AC-V3: estados (vazio, erro, carregando) iguais aos da referência.

## Clarifications

### Session 2026-11-23

- Q: Depois de confirmar a exclusão, o que acontece com o painel de edição? → A: O painel fecha e o foco vai para "Registrar". Desfazer devolve a linha na lista, sem reabrir o painel.
- Q: Depois de salvar uma edição, o painel fecha e o foco vai para onde? → A: O painel fecha. A linha que continua no mês recebe o foco. Se ela saiu do mês, o foco vai para "Registrar".

## User Scenarios & Testing *(mandatory)*

### User Story 1 - O mês numa tabela (Priority: P1)

A pessoa abre Lançamentos no mês da casca. O cabeçalho mostra "Lançamentos", o mês por extenso ("novembro de 2026") e os controles "Mês anterior" e "Próximo mês". "Registrar" fica no topo do conteúdo.

A tabela tem a legenda "Lançamentos de novembro de 2026" e cinco colunas: Data, Descrição, Item, Pagamento e Valor. O valor fica à direita, em reais com centavos ("R$ 186,40"). A data é a data da compra ("12/11/2026"). A linha mais nova vem primeiro. Na mesma data, o lançamento registrado por último vem primeiro.

A lista é a competência do mês aberto, não o calendário da data. Com fechamento no dia 25, uma compra de cartão em 26/05/2026 aparece em junho, com a data 26/05/2026 e o selo "Fatura 06/2026". A mesma data em débito, Pix ou dinheiro aparece em maio e não leva selo.

Quando a compra é parcelada, a descrição traz "Parcela 2 de 6 · restam 4". Restam é o total menos o número da parcela. À vista não traz esse texto. O pagamento mostra Débito, Pix, Dinheiro ou o apelido do cartão. Sem apelido, mostra "Crédito".

Cada linha é a ação "Editar". Não há "Excluir" na linha.

Quando os valores estão ocultos, a coluna Valor mostra "R$ •••••" e o nome anunciado é a máscara. Data, descrição, item, pagamento, parcela e selo continuam visíveis. Esta tela não oferece outro controle de ocultar: usa a escolha que o Resumo já guardou neste navegador.

**Why this priority**: Sem o mês e a tabela, a pessoa não confere o que já lançou.

**Independent Test**: Com fechamento no dia 25, ver a compra de 26/05 no mês de junho, com data 26/05/2026 e "Fatura 06/2026", e a de débito do mesmo dia no mês de maio. Na mesma data, o lançamento feito por último aparece acima.

**Acceptance Scenarios**:

1. **Given** a pessoa abre Lançamentos, **When** ela lê o cabeçalho, **Then** vê "Lançamentos", o mês por extenso e os controles "Mês anterior" e "Próximo mês", e "Registrar" no topo do conteúdo.
2. **Given** novembro tem lançamentos, **When** a pessoa lê a tabela, **Then** a legenda é "Lançamentos de novembro de 2026" e as colunas são Data, Descrição, Item, Pagamento e Valor, com o valor à direita e com centavos.
3. **Given** há compras em 14/11/2026 e em 12/11/2026, **When** a pessoa lê a tabela, **Then** 14/11 vem antes de 12/11. Dois lançamentos na mesma data aparecem com o registrado por último primeiro.
4. **Given** o cartão fecha no dia 25, **When** a pessoa abre junho, **Then** a compra de cartão de 26/05/2026 está na tabela, com a data 26/05/2026 e o selo "Fatura 06/2026". **When** ela abre maio, **Then** essa compra de cartão não está, e um débito de 26/05/2026 está, sem selo.
5. **Given** a parcela é a 2 de 6, **When** a pessoa lê a descrição, **Then** vê "Parcela 2 de 6 · restam 4". Um lançamento à vista não mostra texto de parcela.
6. **Given** a linha é de cartão com apelido, **When** a pessoa lê Pagamento, **Then** vê o apelido. Sem apelido, vê "Crédito". Débito, Pix e dinheiro mostram esses nomes.
7. **Given** a tabela está visível, **When** a pessoa procura excluir na linha, **Then** não há "Excluir". A ação da linha é "Editar".
8. **Given** os valores estão ocultos e a linha é R$ 186,40, **When** a pessoa lê o valor, **Then** vê "R$ •••••". A data, a descrição, o item, o pagamento, a parcela e o selo continuam legíveis. O valor real não é anunciado no lugar da máscara.

---

### User Story 2 - Busca e filtros no mês (Priority: P1)

Com lançamentos no mês, o topo oferece "Buscar por descrição", "Todos os itens" e "Todos os pagamentos". A busca olha a descrição e o nome do item, ignora maiúsculas e não ignora acento. Ela fica no mês aberto e combina com os dois filtros.

"Limpar busca" esvazia o texto. Não muda o mês e não mexe nos filtros. Trocar o mês mantém o texto e os filtros e aplica os três ao mês destino.

O filtro de item lista, em ordem alfabética do português, os itens que têm lançamento nesse mês, inclusive item arquivado. O filtro de pagamento oferece Débito, Pix, Dinheiro e Crédito. Crédito reúne todos os cartões.

Sem resultado para um texto, a pessoa vê `Nenhum resultado para "{texto}"`, a frase "Confira a descrição ou limpe a busca para ver todos os lançamentos." e "Limpar busca". Sem texto e com filtro que esconde tudo, vê "Nenhum lançamento com esses filtros." Os filtros continuam na tela para ela voltar a "Todos os itens" ou "Todos os pagamentos".

**Why this priority**: O mês pode ter muitas linhas. A busca e os filtros são o jeito de achar uma sem sair do mês.

**Independent Test**: Buscar "uber99" e ver a frase com essa palavra. Limpar a busca e continuar em novembro. Filtrar um item e Crédito ao mesmo tempo e ver só a interseção.

**Acceptance Scenarios**:

1. **Given** novembro tem linhas e a busca está vazia, **When** a pessoa lê o topo, **Then** vê "Buscar por descrição", "Todos os itens" e "Todos os pagamentos".
2. **Given** a descrição "Uber" e o item "Mercado", **When** a pessoa busca "uber", **Then** a linha da Uber aparece e a do Mercado não. "UBER" também encontra. "acucar" não encontra "açúcar".
3. **Given** a busca é "uber" e o filtro é um item que não é o da Uber, **When** a pessoa lê a tabela, **Then** não há linha. A busca e o filtro valem juntos.
4. **Given** a busca "uber99" não encontra nada, **When** a pessoa lê a tela, **Then** vê `Nenhum resultado para "uber99"`, "Confira a descrição ou limpe a busca para ver todos os lançamentos." e "Limpar busca".
5. **Given** essa busca vazia está na tela, **When** a pessoa limpa a busca, **Then** o texto some, o mês continua o mesmo e os filtros continuam como estavam.
6. **Given** a busca "uber" está preenchida em novembro, **When** a pessoa vai a dezembro, **Then** a busca e os filtros continuam e passam a valer em dezembro. **When** dezembro não tem lançamento, **Then** ela vê `Nenhum resultado para "uber"` e "Limpar busca". **When** limpa a busca, **Then** vê o cartão de mês vazio.
7. **Given** o mês tem Mercado e Aluguel, **When** a pessoa abre o filtro de item, **Then** vê "Todos os itens", Mercado e Aluguel, em ordem alfabética do português.
8. **Given** há débito e dois cartões no mês, **When** a pessoa filtra Crédito, **Then** vê os dois cartões e não vê o débito.
9. **Given** não há texto e o filtro não deixa linha, **When** a pessoa lê a tela, **Then** vê "Nenhum lançamento com esses filtros." e os dois filtros continuam disponíveis.

---

### User Story 3 - Registrar à vista (Priority: P1)

"Registrar" abre o painel "Registrar lançamento". Os campos são Item, "Valor (R$)", Data, Descrição e Pagamento. O item vem agrupado por Receitas, Fixas, Variáveis e Anuais, nessa ordem. Cada opção mostra o item e a categoria, como "Mercado · Alimentação". Item arquivado não aparece. Cancelar, toque fora, voltar e Esc fecham sem gravar e devolvem o foco a "Registrar".

O pagamento oferece Débito, Pix, Dinheiro e Crédito. Em Débito, Pix ou Dinheiro não há cartão e não há "Parcelar". A competência é o mês da data. A pessoa vê essa competência antes de gravar.

Descrição vazia, ou só com espaços, grava o nome do item. Valor vazio, zero ou negativo não grava e mostra "Informe um valor maior que zero." Sem item, "Selecione o item." Data vazia ou impossível, "Data inválida." O valor aceita no máximo duas casas decimais. O que fica gravado é exato até o centavo.

Salvar fecha o painel, devolve o foco a "Registrar" e mostra "Lançamento salvo." por 5 segundos, sem desfazer. A linha aparece no mês da competência. Se a gravação falha, o painel continua aberto, os campos continuam preenchidos e a pessoa vê "Não foi possível salvar. Os campos continuam preenchidos."

Com os valores ocultos, o painel aberto mostra o valor digitado. Ao fechar, a lista volta à máscara.

**Why this priority**: Registrar um gasto à vista é o caminho mais curto da tela.

**Independent Test**: Registrar um débito de R$ 186,40 em 12/11/2026, com descrição vazia e item Supermercado. Ver a linha em novembro como "Supermercado", o aviso "Lançamento salvo." por 5 segundos e nenhum desfazer nesse aviso.

**Acceptance Scenarios**:

1. **Given** a pessoa aciona "Registrar", **When** o painel abre, **Then** o título é "Registrar lançamento" e os campos são Item, "Valor (R$) ", Data, Descrição e Pagamento. O item está agrupado em Receitas, Fixas, Variáveis e Anuais.
2. **Given** Mercado está em Alimentação, **When** a pessoa lê a opção, **Then** vê "Mercado · Alimentação". Um item arquivado não está na lista.
3. **Given** o pagamento é Pix, **When** a pessoa lê o painel, **Then** não há cartão nem "Parcelar". A competência mostrada é o mês da data.
4. **Given** o item é Supermercado e a descrição está vazia, **When** a pessoa salva R$ 186,40 em 12/11/2026 no débito, **Then** a descrição gravada é Supermercado, a linha aparece em novembro e o aviso "Lançamento salvo." fica 5 segundos, sem desfazer.
5. **Given** o valor está vazio, zero ou negativo, **When** a pessoa salva, **Then** nada é gravado e o campo mostra "Informe um valor maior que zero." Sem item, mostra "Selecione o item." Com data vazia, mostra "Data inválida."
6. **Given** a pessoa cancela, toca fora, volta ou usa Esc, **When** o painel fecha, **Then** nada é gravado e o foco volta a "Registrar".
7. **Given** a gravação falha, **When** a pessoa lê o painel, **Then** ele continua aberto, os campos continuam preenchidos e a frase é "Não foi possível salvar. Os campos continuam preenchidos."
8. **Given** os valores estão ocultos, **When** o painel de registro está aberto, **Then** o valor digitado está visível. **When** o painel fecha, **Then** a lista volta a "R$ •••••".

---

### User Story 4 - Parcelar no cartão (Priority: P1)

Crédito pede um cartão ativo. Sem cartão ativo, o campo diz "Nenhum cartão ativo." e salvar mostra "Selecione o cartão." Cartão inativo não entra na lista de um registro novo.

"Parcelar" só aparece no crédito. Desligado, a compra é uma parcela e não há prévia de várias. Ligado, a quantidade começa em 2 e aceita de 1 a 60. Fora disso, "Parcelas devem ser entre 1 e 60." e nada é gravado.

A prévia aparece antes de gravar. Ela mostra a competência e o valor de cada parcela, em centavos. R$ 100,00 em 3× mostram R$ 33,34, R$ 33,33 e R$ 33,33, nessa ordem, e a soma é R$ 100,00. Quando os valores são iguais, a prévia pode dizer "Prévia: 3 parcelas de R$ 1.000,00". Quando não são, diz "Prévia: 3 parcelas" e cada linha traz o próprio valor. As linhas usam o mês curto, como "Jun/2026 · R$ 33,34".

A primeira competência é a fatura da compra. Cada parcela seguinte cai um mês depois. As três guardam a data da compra. Com fechamento no dia 25, 10/05/2026 cai em maio, 25/05/2026 e 26/05/2026 caem em junho. 26/05/2026 em 3× cai em junho, julho e agosto. 26/12/2026 cai em janeiro do ano seguinte. Sem dia de fechamento, a competência é o mês da compra, a prévia não leva selo de fatura e o painel avisa "Sem dia de fechamento, a competência é o mês da compra."

O selo "Fatura MM/AAAA" aparece na linha quando o cartão tem dia de fechamento. A gravação é inteira: ou todas as parcelas entram, ou nenhuma fica. Não há como escolher outra competência na mão. Mudar o fechamento do cartão depois não move este lançamento.

Quantidade 1, com o interruptor ligado ou desligado, grava um lançamento à vista, sem texto de parcela.

**Why this priority**: A parcela é o motivo de a competência não ser o mês da compra. A prévia existe para a pessoa ver isso antes de gravar.

**Independent Test**: Cartão com fechamento 25, compra de R$ 100,00 em 26/05/2026 em 3×. A prévia mostra junho R$ 33,34, julho R$ 33,33 e agosto R$ 33,33. Depois de salvar, cada mês tem uma linha com a data 26/05/2026 e o selo da própria fatura.

**Acceptance Scenarios**:

1. **Given** o pagamento é Crédito e há cartão ativo, **When** a pessoa lê o painel, **Then** vê o cartão e o interruptor "Parcelar". Em Pix, esse interruptor não está.
2. **Given** não há cartão ativo, **When** a pessoa escolhe Crédito, **Then** vê "Nenhum cartão ativo." **When** salva, **Then** nada é gravado e a frase é "Selecione o cartão."
3. **Given** "Parcelar" está desligado, **When** a pessoa salva no crédito, **Then** entra um lançamento, sem texto de parcela. **When** liga "Parcelar", **Then** a quantidade começa em 2.
4. **Given** o total é R$ 100,00 e a quantidade é 3, **When** a pessoa lê a prévia, **Then** vê "Jun/2026 · R$ 33,34", "Jul/2026 · R$ 33,33" e "Ago/2026 · R$ 33,33" no exemplo do fechamento 25 em 26/05/2026, e a soma é R$ 100,00.
5. **Given** essa prévia está correta, **When** a pessoa salva, **Then** junho, julho e agosto têm uma linha cada, todas com a data 26/05/2026, os selos "Fatura 06/2026", "Fatura 07/2026" e "Fatura 08/2026", e os textos "Parcela 1 de 3 · restam 2", "Parcela 2 de 3 · restam 1" e "Parcela 3 de 3 · restam 0".
6. **Given** o fechamento é dia 25, **When** a pessoa compara as datas, **Then** 10/05/2026 cai em maio e 25/05/2026 cai em junho. 26/12/2026 cai em janeiro seguinte.
7. **Given** o cartão não tem dia de fechamento, **When** a pessoa lê a prévia, **Then** a competência é o mês da compra, não há selo de fatura e o aviso é "Sem dia de fechamento, a competência é o mês da compra."
8. **Given** a quantidade é 0 ou 61, **When** a pessoa salva, **Then** nada é gravado e a frase é "Parcelas devem ser entre 1 e 60."
9. **Given** a gravação de uma parcela do grupo não se completa, **When** a pessoa abre os meses, **Then** nenhuma parcela desse grupo está lá.

---

### User Story 5 - Editar e o alcance da correção (Priority: P1)

"Editar" abre o mesmo painel, com o título "Editar lançamento" e os dados desta parcela: o valor é o dela, não o total original da compra. Não há campo para mudar a quantidade de parcelas. No fim do painel está "Excluir lançamento".

À vista, Salvar grava só essa linha e não pergunta alcance. Num grupo, Salvar abre "Corrigir parcelamento" antes de gravar. O texto é "{descrição} · parcela {N} de {T}. Escolha o alcance da correção." As opções são "Só esta parcela" e "Esta e as próximas". Nenhuma vem marcada. Salvar do diálogo só fica disponível depois da escolha. Não há "Todas do parcelamento" na correção. Cancelar volta ao painel sem gravar.

"Só esta parcela" muda a parcela aberta e deixa as outras com valor, data, competência, descrição, item e pagamento anteriores. "Esta e as próximas" aplica a mudança da parcela aberta até a última. O valor informado é o valor de cada parcela do alcance, não um novo total redistribuído. Descrição, item e pagamento seguem o mesmo alcance. A data nova vale para a parcela aberta; cada seguinte avança um mês e, se o dia não existe, fica no último dia daquele mês. A competência de cada uma é recalculada. O total de parcelas do grupo não muda. "Parcela N de T" continua com os mesmos N e T.

Descrição esvaziada passa a ser o nome do item nas linhas do alcance. Item arquivado que já é o desta linha continua visível e selecionado; outros itens arquivados não aparecem. Cartão inativo que já é o desta linha continua disponível para mantê-la; outros cartões inativos não aparecem.

Salvar, à vista ou depois do alcance escolhido, fecha o painel e mostra "Lançamento salvo." por 5 segundos, sem desfazer. Se a linha continua no mês aberto, o foco volta para ela. Se a competência a tirou deste mês, o foco vai para "Registrar". Falha ao salvar deixa o painel aberto, com os campos preenchidos.

**Why this priority**: Corrigir uma parcela sem alcançar as anteriores é o que evita refazer a compra inteira.

**Independent Test**: Na 3ª de 6, salvar R$ 40,00 com "Só esta parcela" e ver as outras cinco iguais. Repetir com "Esta e as próximas" e ver só a 3ª, a 4ª, a 5ª e a 6ª em R$ 40,00.

**Acceptance Scenarios**:

1. **Given** a pessoa aciona "Editar" numa linha à vista, **When** o painel abre, **Then** o título é "Editar lançamento", os campos mostram essa linha e "Excluir lançamento" está no fim. Não há quantidade de parcelas.
2. **Given** a linha é à vista e continua no mesmo mês, **When** a pessoa salva uma descrição nova, **Then** só essa linha muda, não aparece "Corrigir parcelamento", o painel fecha, o foco volta para a linha e "Lançamento salvo." aparece por 5 segundos, sem desfazer.
3. **Given** a linha é a 3ª de 6, **When** a pessoa salva, **Then** vê "Corrigir parcelamento", "Notebook · parcela 3 de 6. Escolha o alcance da correção." quando a descrição é Notebook, e as opções "Só esta parcela" e "Esta e as próximas". Não vê "Todas do parcelamento". Nenhuma opção começa marcada.
4. **Given** a pessoa ainda não escolheu o alcance, **When** ela olha Salvar do diálogo, **Then** Salvar não grava. **When** cancela, **Then** nenhuma linha muda e o painel continua com o que ela tinha digitado.
5. **Given** a 3ª de 6 recebe R$ 40,00 em "Só esta parcela", **When** a pessoa lê o grupo, **Then** só a 3ª está em R$ 40,00. As outras cinco permanecem.
6. **Given** o mesmo valor em "Esta e as próximas", **When** a pessoa lê o grupo, **Then** a 3ª, a 4ª, a 5ª e a 6ª estão em R$ 40,00. A 1ª e a 2ª permanecem. A soma do grupo pode deixar de ser o total original. O texto continua "Parcela 3 de 6".
7. **Given** a data da parcela aberta passa a 31/01/2026 e o alcance é "Esta e as próximas", **When** a pessoa lê a parcela seguinte, **Then** a data é 28/02/2026, ou 29/02/2026 num ano bissexto, e a competência dessa data foi recalculada pela regra do pagamento.
8. **Given** a descrição fica vazia no alcance, **When** a gravação termina, **Then** essas linhas passam a usar o nome do item. O número de parcelas do grupo continua o mesmo.
9. **Given** a linha à vista está em novembro, **When** a pessoa salva uma data de dezembro, **Then** o painel fecha, a linha sai de novembro, o foco vai para "Registrar" e "Lançamento salvo." aparece por 5 segundos.

---

### User Story 6 - Excluir e desfazer (Priority: P1)

"Excluir lançamento" pede confirmação. Não exclui pela linha. À vista, o diálogo diz "Excluir lançamento?", "1 lançamento sai da lista." e "Você pode desfazer por 10 segundos." Os botões são Cancelar e "Excluir lançamento".

Num grupo, o título é "Excluir parcela?" e o texto é "{descrição} · parcela {N} de {T}. Escolha o alcance da exclusão." As opções são "Só esta parcela", "Esta e as próximas" e "Todas do parcelamento". Nenhuma vem marcada. A frase de quantidade acompanha a escolha: "1 lançamento sai da lista." ou "4 lançamentos saem da lista." "Excluir lançamento" só fica disponível depois da escolha. Cancelar, toque fora, voltar e Esc não excluem.

Confirmar tira essas linhas na hora, fecha o painel e leva o foco para "Registrar". O aviso na base da tela oferece "Desfazer" por 10 segundos e diz "Lançamento excluído." ou "4 lançamentos excluídos." Desfazer recoloca os mesmos registros na lista, com os mesmos valores, datas, competências, itens, descrições, pagamentos e o mesmo vínculo de parcela, sem duplicar e sem reabrir o painel. Se a pessoa estiver noutro mês, as linhas voltam no mês da competência delas.

Aos 10 segundos o aviso some e não há outro desfazer. Recarregar a tela durante os 10 segundos não devolve as linhas e o aviso não volta. Uma segunda exclusão substitui o aviso: a primeira deixa de poder ser desfeita. "Lançamento salvo." não cobre um desfazer que ainda está na tela. Se desfazer falha, a frase é "Não foi possível desfazer. A exclusão continua." e "Desfazer" permanece até o fim dos 10 segundos. Se excluir falha, nada sai e a frase é "Não foi possível excluir. O lançamento continua na lista."

"Só esta parcela" tira uma e não renumera as outras. "Esta e as próximas" tira da aberta até a última. "Todas do parcelamento" tira o grupo inteiro, inclusive linhas de outros meses. As que ficam continuam com o mesmo "Parcela N de T".

**Why this priority**: Excluir sem desfazer, ou desfazer duplicando, perde ou dobra dinheiro lançado.

**Independent Test**: Excluir as 4 últimas de um grupo de 6, desfazer dentro de 10 segundos e ver as mesmas 4 de volta, sem duplicar. Excluir de novo, esperar 10 segundos e não encontrar desfazer.

**Acceptance Scenarios**:

1. **Given** a linha é à vista, **When** a pessoa aciona "Excluir lançamento", **Then** vê "Excluir lançamento?", "1 lançamento sai da lista." e "Você pode desfazer por 10 segundos."
2. **Given** a linha é a 3ª de 6, **When** o diálogo abre, **Then** vê "Excluir parcela?", as três opções "Só esta parcela", "Esta e as próximas" e "Todas do parcelamento", e nenhuma marcada. "Excluir lançamento" não conclui até haver escolha.
3. **Given** a pessoa escolhe "Esta e as próximas" na 3ª de 6, **When** lê a quantidade, **Then** vê "4 lançamentos saem da lista." **When** confirma, **Then** saem a 3ª, a 4ª, a 5ª e a 6ª. A 1ª e a 2ª ficam, ainda como "Parcela 1 de 6" e "Parcela 2 de 6".
4. **Given** a pessoa escolhe "Todas do parcelamento", **When** confirma, **Then** saem todas as parcelas do grupo, também as de outros meses.
5. **Given** a exclusão acabou de acontecer, **When** a pessoa olha a tela, **Then** o painel está fechado e o foco está em "Registrar". **When** ela aciona "Desfazer" dentro de 10 segundos, **Then** as mesmas linhas voltam na lista, sem segunda cópia e sem o painel reabrir, no mês da competência de cada uma.
6. **Given** 10 segundos se passam sem desfazer, **When** a pessoa procura desfazer, **Then** o aviso sumiu e as linhas continuam fora.
7. **Given** o aviso de desfazer está na tela, **When** a pessoa recarrega, **Then** as linhas continuam fora e o aviso não volta.
8. **Given** a pessoa cancela o diálogo, **When** ela lê a tabela, **Then** nenhuma linha saiu.
9. **Given** uma exclusão falha, **When** a pessoa lê a tela, **Then** a linha continua, o painel continua aberto, o foco volta a "Excluir lançamento" e a frase é "Não foi possível excluir. O lançamento continua na lista."

---

### User Story 7 - Vazio, espera, erro, teclado e aparência (Priority: P1)

Mês sem lançamento, e sem texto de busca, mostra o título "Nenhum lançamento em novembro" (o nome do mês aberto), a frase "Registre cada gasto ou receita para acompanhar o que já foi usado no mês." e a ação "Registrar lançamento". Busca e filtros não aparecem nesse vazio. "Registrar" do topo continua. Os dois abrem o mesmo painel.

Enquanto o mês carrega, a pessoa não vê R$ 0,00 no lugar das linhas e não vê o cartão de vazio. Se o carregamento falha, vê "Não foi possível carregar o mês." e "Tentar de novo", e não vê a tabela como se o mês tivesse carregado.

Cada controle tem nome. O foco é visível. Pelo teclado a pessoa alcança o mês, a busca, os filtros, "Registrar", as linhas, o painel e os diálogos. No painel e no diálogo, o foco permanece até fechar e volta a quem abriu. A exclusão confirmada leva o foco para "Registrar". Depois de salvar uma edição, o foco volta para a linha se ela continua no mês, e vai para "Registrar" se ela saiu do mês.

A tela continua legível no claro e no escuro. Com preferência de menos movimento, painel e diálogo aparecem sem animação. A partir de 720 px o painel mede 460 px. Abaixo de 720 px usa a largura do conteúdo. Em 390 px e em 1280 px não há botão flutuante nem intervalo livre de datas.

Lançamento de outra conta não aparece e não pode ser alterado.

**Why this priority**: O mês vazio, a espera e o teclado são o que a pessoa encontra antes da primeira linha, e o foco fecha o ciclo de gravar e excluir.

**Independent Test**: Abrir um mês sem lançamento e ler o cartão com o nome do mês. Durante o carregamento, não ver R$ 0,00. Na falha, ver "Tentar de novo". Percorrer Registrar, uma linha, o painel e o diálogo pelo teclado.

**Acceptance Scenarios**:

1. **Given** novembro não tem lançamento e a busca está vazia, **When** a pessoa lê a tela, **Then** vê "Nenhum lançamento em novembro", "Registre cada gasto ou receita para acompanhar o que já foi usado no mês." e "Registrar lançamento". Não vê a busca nem os filtros.
2. **Given** esse cartão está visível, **When** a pessoa aciona "Registrar lançamento" ou "Registrar", **Then** abre o mesmo painel "Registrar lançamento".
3. **Given** o mês ainda está carregando, **When** a pessoa olha a lista, **Then** não vê R$ 0,00 e não vê o cartão de vazio.
4. **Given** o carregamento falha, **When** a pessoa lê a tela, **Then** vê "Não foi possível carregar o mês." e "Tentar de novo", e não vê linhas como se o mês tivesse carregado.
5. **Given** Lançamentos está aberto, **When** a pessoa percorre o teclado, **Then** alcança "Mês anterior", "Próximo mês", a busca, os filtros, "Registrar" e as linhas. No painel e no diálogo, o foco fica ali até fechar e depois volta a quem abriu. Depois de uma exclusão confirmada, o foco vai para "Registrar". Depois de salvar uma edição, o foco volta para a linha se ela continua no mês, e vai para "Registrar" se ela saiu do mês.
6. **Given** a aparência está clara, **When** a pessoa troca para escura, **Then** a tabela, o painel e os diálogos continuam legíveis. Com menos movimento, painel e diálogo aparecem sem animação.
7. **Given** a largura é 1280 px, **When** a pessoa abre o painel, **Then** ele mede 460 px. Em 390 px ele usa a largura do conteúdo. Nas duas larguras não há botão flutuante nem intervalo livre de datas.
8. **Given** um lançamento é de outra conta, **When** a pessoa abre o mês, **Then** ele não aparece e não há como alterá-lo.

---

### Edge Cases

- Compra no dia do fechamento cai na fatura do mês seguinte. Compra anterior a esse dia cai na fatura do mês da compra. O vencimento do cartão não entra na conta.
- Sem dia de fechamento, a competência é o mês da compra e não há selo "Fatura MM/AAAA".
- Débito, Pix e dinheiro usam o mês da data, mesmo depois do dia de fechamento de algum cartão.
- Na criação, todas as parcelas guardam a data da compra. Só a competência avança um mês por parcela. Na correção "Esta e as próximas", a data avança um mês por parcela e a competência é recalculada.
- 31/01 com "Esta e as próximas" leva a parcela seguinte ao último dia de fevereiro.
- R$ 100,00 em 3× é R$ 33,34 + R$ 33,33 + R$ 33,33. A soma é R$ 100,00. O centavo extra fica nas primeiras parcelas.
- Quantidade 1 não cria texto "Parcela 1 de 1".
- A correção não oferece "Todas do parcelamento" e não alcança as parcelas anteriores. O número de parcelas não muda. Para mudar a quantidade, a pessoa exclui o grupo e registra de novo.
- Excluir uma parcela não renumera as outras. "Parcela 2 de 6 · restam 4" continua assim.
- "Todas do parcelamento" remove também as parcelas que estão em outros meses.
- Exclusão confirmada fecha o painel e leva o foco para "Registrar". Desfazer devolve as linhas na lista e não reabre o painel. Falha ao excluir deixa o painel aberto.
- Salvar uma edição fecha o painel. Se a linha continua no mês aberto, o foco volta para ela. Se a competência a tirou deste mês, o foco vai para "Registrar". Falha ao salvar deixa o painel aberto.
- Desfazer depois de 10 segundos não existe. Recarregar durante os 10 segundos não restaura.
- Uma segunda exclusão substitui o desfazer da primeira. "Lançamento salvo." não esconde um desfazer ainda visível.
- Falha no meio de um parcelamento novo não deixa parcela pela metade.
- Valor vazio, zero ou negativo não grava. Mais de duas casas decimais não é aceito no campo.
- Descrição vazia grava o nome do item. Isso vale no registro e na correção.
- Item arquivado não entra num registro novo e continua no lançamento antigo. No filtro do mês, ele aparece se tiver linha.
- Cartão inativo não entra num registro novo. Na edição, o cartão já usado por aquela linha continua disponível para mantê-la.
- Mudar o dia de fechamento depois não move lançamento já gravado. Não há competência escolhida na mão.
- Busca não olha outros meses, nem a forma de pagamento, nem a categoria. Acento conta. Maiúscula não conta.
- "Limpar busca" não muda o mês nem os filtros. Mês sem lançamento e sem texto de busca não mostra busca nem filtros. Com texto de busca, o mês vazio mostra o resultado da busca; limpar a busca revela o cartão de vazio.
- Com valores ocultos, a lista usa "R$ •••••" e o painel aberto mostra o valor. O aviso "Lançamento salvo." não repete o valor.
- Abaixo de 720 px o painel usa a largura do conteúdo. A partir de 720 px mede 460 px. Em 719 px vale a largura do conteúdo. Em 720 px vale 460 px.
- Lançamento de outra conta não aparece.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Lançamentos MUST pedir a navegação de mês. O cabeçalho MUST mostrar "Lançamentos", o mês por extenso e os controles "Mês anterior" e "Próximo mês". "Registrar" MUST ficar no topo do conteúdo. MUST NOT haver botão flutuante nem intervalo livre de datas.
- **FR-002**: A tabela MUST ter a legenda "Lançamentos de {mês}" e as colunas Data, Descrição, Item, Pagamento e Valor. O valor MUST ficar à direita, em reais com centavos. A ordenação MUST ser a data da compra, da mais nova para a mais antiga. Na mesma data, o registrado por último MUST vir primeiro.
- **FR-003**: A lista MUST ser a competência do mês aberto. Com fechamento no dia 25, a compra de cartão em 26/05/2026 MUST aparecer em junho com a data 26/05/2026. Um débito, Pix ou dinheiro nessa data MUST aparecer em maio.
- **FR-004**: Parcela de grupo MUST mostrar "Parcela N de T · restam X", com X igual a T menos N. Lançamento à vista MUST NOT mostrar texto de parcela.
- **FR-005**: Pagamento MUST mostrar Débito, Pix, Dinheiro ou o apelido do cartão. Sem apelido, MUST mostrar "Crédito". Cartão com dia de fechamento MUST mostrar o selo "Fatura MM/AAAA" da competência. Sem dia de fechamento, MUST NOT mostrar esse selo.
- **FR-006**: Cada linha MUST ser a ação "Editar" e MUST NOT oferecer "Excluir".
- **FR-007**: Com os valores ocultos, a coluna Valor MUST mostrar "R$ •••••" e o nome anunciado MUST ser a máscara. Data, descrição, item, pagamento, parcela e selo MUST permanecer. O painel aberto MUST mostrar o valor. Ao fechar, a lista MUST voltar à máscara. Esta tela MUST usar a escolha que o Resumo já guardou neste navegador e MUST NOT oferecer outro controle de ocultar.
- **FR-008**: Com lançamentos no mês, a tela MUST oferecer "Buscar por descrição", "Todos os itens" e "Todos os pagamentos". A busca MUST olhar descrição e nome do item, MUST ignorar maiúsculas, MUST considerar acento e MUST ficar no mês aberto, combinada com os filtros.
- **FR-009**: Sem resultado para um texto, a tela MUST mostrar `Nenhum resultado para "{texto}"`, "Confira a descrição ou limpe a busca para ver todos os lançamentos." e "Limpar busca". "Limpar busca" MUST esvaziar só o texto. MUST NOT mudar o mês nem os filtros.
- **FR-010**: O filtro de item MUST listar "Todos os itens" e os itens que têm lançamento no mês, em ordem alfabética do português, inclusive arquivado. O filtro de pagamento MUST oferecer Débito, Pix, Dinheiro e Crédito. Crédito MUST reunir todos os cartões. Sem texto e sem linha, a tela MUST mostrar "Nenhum lançamento com esses filtros."
- **FR-011**: Trocar o mês MUST manter o texto e os filtros e MUST aplicá-los ao mês destino. Mês destino sem lançamento e com texto de busca MUST mostrar o resultado da busca. Limpar a busca nesse mês MUST mostrar o cartão de vazio.
- **FR-012**: "Registrar" MUST abrir o painel "Registrar lançamento", com Item, "Valor (R$)", Data, Descrição e Pagamento. O item MUST estar agrupado em Receitas, Fixas, Variáveis e Anuais, e cada opção MUST mostrar item e categoria. Item arquivado MUST NOT aparecer num registro novo. Cancelar, toque fora, voltar e Esc MUST fechar sem gravar e devolver o foco a "Registrar".
- **FR-013**: Descrição vazia ou só com espaços MUST gravar o nome do item. Valor vazio, zero ou negativo MUST ser recusado com "Informe um valor maior que zero." Sem item, "Selecione o item." Data vazia ou impossível, "Data inválida." O campo MUST aceitar no máximo duas casas decimais. O valor gravado MUST ser exato até o centavo.
- **FR-014**: Em Débito, Pix ou Dinheiro, o painel MUST NOT oferecer cartão nem "Parcelar". A competência MUST ser o mês da data, e MUST ser mostrada antes de gravar.
- **FR-015**: Crédito MUST exigir cartão ativo. Sem cartão ativo, o campo MUST dizer "Nenhum cartão ativo." e salvar MUST mostrar "Selecione o cartão." Cartão inativo MUST NOT entrar num registro novo.
- **FR-016**: "Parcelar" MUST aparecer só no crédito. Desligado, a compra MUST ser uma parcela. Ligado, a quantidade MUST começar em 2 e MUST aceitar de 1 a 60. Fora desse intervalo, a frase MUST ser "Parcelas devem ser entre 1 e 60." e nada MUST ser gravado. Quantidade 1 MUST gravar lançamento à vista, sem texto de parcela.
- **FR-017**: A prévia MUST aparecer antes de gravar e MUST mostrar a competência e o valor em centavos de cada parcela. R$ 100,00 em 3× MUST ser R$ 33,34, R$ 33,33 e R$ 33,33, nessa ordem, somando R$ 100,00. Quando todas as parcelas têm o mesmo valor, a prévia MUST dizer "Prévia: N parcelas de R$ X", como "Prévia: 3 parcelas de R$ 1.000,00". Quando os valores diferem, MUST dizer "Prévia: N parcelas" e o valor de cada linha. O mês da linha MUST ser curto, como "Jun/2026 · R$ 33,34".
- **FR-018**: Na criação, a primeira competência MUST ser a fatura da compra e cada parcela seguinte MUST cair um mês depois. Todas MUST guardar a data da compra. Fechamento dia 25: 10/05/2026 MUST cair em maio; 25/05/2026 e 26/05/2026 MUST cair em junho; 26/05/2026 em 3× MUST cair em junho, julho e agosto; 26/12/2026 MUST cair em janeiro seguinte. O vencimento MUST NOT alterar a competência.
- **FR-019**: Sem dia de fechamento, a competência MUST ser o mês da compra, MUST NOT haver selo de fatura e o painel MUST avisar "Sem dia de fechamento, a competência é o mês da compra." A pessoa MUST NOT escolher a competência na mão. Mudar o fechamento depois MUST NOT mover lançamento já gravado.
- **FR-020**: A gravação de um grupo MUST ser inteira: ou todas as parcelas entram, ou nenhuma fica. No registro, Salvar MUST fechar o painel, devolver o foco a "Registrar" e mostrar "Lançamento salvo." por 5 segundos, sem desfazer. A linha MUST aparecer no mês da competência dela. Falha ao salvar MUST manter o painel e os campos e MUST mostrar "Não foi possível salvar. Os campos continuam preenchidos."
- **FR-021**: "Editar" MUST abrir "Editar lançamento" com o valor desta parcela. MUST NOT oferecer mudar a quantidade de parcelas. "Excluir lançamento" MUST ficar no fim do painel de edição. À vista, Salvar MUST gravar só essa linha, sem perguntar alcance. Salvar uma edição, à vista ou depois do alcance, MUST fechar o painel e mostrar "Lançamento salvo." por 5 segundos, sem desfazer. Se a linha continua no mês aberto, o foco MUST voltar para ela. Se a competência a tirou deste mês, o foco MUST ir para "Registrar". Falha ao salvar MUST manter o painel aberto.
- **FR-022**: Num grupo, Salvar MUST abrir "Corrigir parcelamento" antes de gravar, com "{descrição} · parcela {N} de {T}. Escolha o alcance da correção.", "Só esta parcela" e "Esta e as próximas". Nenhuma opção MUST começar marcada. MUST NOT haver "Todas do parcelamento" na correção. Salvar do diálogo MUST esperar a escolha. Cancelar MUST NOT gravar.
- **FR-023**: "Só esta parcela" MUST alterar só a parcela aberta. "Esta e as próximas" MUST alterar da aberta até a última. O valor MUST ser o de cada parcela do alcance e MUST NOT redistribuir o total original. Descrição, item e pagamento MUST seguir o alcance. A data nova MUST valer para a parcela aberta; cada seguinte MUST avançar um mês, no último dia quando o dia não existir, e a competência MUST ser recalculada. O total de parcelas MUST permanecer. Descrição esvaziada MUST passar a ser o nome do item.
- **FR-024**: Na edição, o item arquivado que já é o da linha MUST continuar selecionável, e os outros itens arquivados MUST NOT aparecer. O cartão inativo que já é o da linha MUST continuar disponível, e os outros cartões inativos MUST NOT aparecer.
- **FR-025**: Excluir MUST pedir diálogo. À vista, o diálogo MUST dizer "Excluir lançamento?", "1 lançamento sai da lista." e "Você pode desfazer por 10 segundos." Num grupo, MUST dizer "Excluir parcela?", o alcance, e as opções "Só esta parcela", "Esta e as próximas" e "Todas do parcelamento", nenhuma marcada. A quantidade MUST acompanhar a escolha. "Excluir lançamento" MUST esperar a escolha. Cancelar, toque fora, voltar e Esc MUST NOT excluir.
- **FR-026**: "Só esta parcela" MUST remover uma linha e MUST NOT renumerar as outras. "Esta e as próximas" MUST remover da aberta até a última. "Todas do parcelamento" MUST remover o grupo, inclusive em outros meses. As linhas que ficam MUST manter "Parcela N de T".
- **FR-027**: Depois de excluir, o painel MUST fechar e o foco MUST ir para "Registrar". O aviso MUST oferecer "Desfazer" por 10 segundos, com "Lançamento excluído." ou "N lançamentos excluídos." Desfazer MUST recolher os mesmos registros na lista, sem duplicar e sem reabrir o painel, no mês da competência de cada um. Aos 10 segundos MUST acabar o desfazer. Recarregar durante os 10 segundos MUST NOT restaurar. Uma segunda exclusão MUST substituir o aviso anterior. "Lançamento salvo." MUST NOT cobrir um desfazer visível.
- **FR-028**: Falha ao desfazer MUST mostrar "Não foi possível desfazer. A exclusão continua." e MUST manter "Desfazer" até o fim dos 10 segundos. Falha ao excluir MUST mostrar "Não foi possível excluir. O lançamento continua na lista.", MUST NOT remover a linha, MUST manter o painel aberto e MUST devolver o foco a "Excluir lançamento".
- **FR-029**: Mês sem lançamento e sem texto de busca MUST mostrar "Nenhum lançamento em {mês}", "Registre cada gasto ou receita para acompanhar o que já foi usado no mês." e "Registrar lançamento". Busca e filtros MUST NOT aparecer nesse vazio. "Registrar" do topo MUST continuar e MUST abrir o mesmo painel.
- **FR-030**: Enquanto o mês carrega, a tela MUST NOT mostrar R$ 0,00 nem o cartão de vazio. Se o carregamento falha, a pessoa MUST ver "Não foi possível carregar o mês." e "Tentar de novo", e MUST NOT ver a tabela como se o mês tivesse carregado.
- **FR-031**: Cada controle MUST ter nome e o foco MUST ser visível. Mês, busca, filtros, "Registrar", linhas, painel e diálogos MUST ser alcançáveis pelo teclado. No painel e no diálogo, o foco MUST permanecer até fechar e MUST voltar a quem abriu. Na exclusão confirmada, o foco MUST ir para "Registrar". Depois de salvar uma edição, o foco MUST voltar para a linha se ela continua no mês aberto, e MUST ir para "Registrar" se ela saiu do mês. A tela MUST permanecer legível no claro e no escuro. Com menos movimento, painel e diálogo MUST aparecer sem animação.
- **FR-032**: A partir de 720 px o painel MUST medir 460 px. Abaixo de 720 px MUST usar a largura do conteúdo.
- **FR-033**: Lançamento de outra conta MUST ser tratado como inexistente.
- **FR-034**: Esta história MUST NOT alterar a conta da fatura nem a divisão dos centavos. MUST NOT oferecer campo de observação separado da descrição.

### Key Entities

- **Lançamento**: um gasto ou uma receita numa data, apontando para um item. Guarda a data da compra, a competência, o valor em centavos, a descrição, o pagamento e, no crédito, o cartão.
- **Competência**: o mês em que o lançamento entra na lista. No débito, no Pix e no dinheiro, é o mês da data. No cartão com fechamento, é o mês da fatura.
- **Grupo de parcelas**: as parcelas de uma mesma compra. Cada uma tem número e total. A soma dos valores é o total da compra no momento do registro. Uma correção posterior pode fazer a soma deixar de ser esse total.
- **Cartão**: meio de crédito com apelido e, quando existe, dia de fechamento de 1 a 28. Sem esse dia, a compra fica no mês da data.
- **Busca e filtros**: texto, item e pagamento aplicados só ao mês aberto. Não alteram lançamento.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Com fechamento no dia 25, a compra de cartão de 26/05/2026 aparece em junho com a data 26/05/2026 e o selo "Fatura 06/2026", e não aparece em maio. Um débito de 26/05/2026 aparece em maio, sem selo. Uma compra de 14/11 aparece acima de uma de 12/11. Dois lançamentos na mesma data ficam com o registrado por último primeiro.
- **SC-002**: A busca "uber99" mostra `Nenhum resultado para "uber99"` e "Limpar busca". Limpar a busca não muda o mês. Item e Crédito, juntos, mostram só a interseção. "uber" encontra "Uber" e não encontra um item cujo nome só coincide sem acento.
- **SC-003**: Um débito de R$ 186,40 em 12/11/2026, com item Supermercado e descrição vazia, aparece em novembro como Supermercado. O aviso "Lançamento salvo." dura 5 segundos e não oferece desfazer. Valor zero não grava e mostra "Informe um valor maior que zero."
- **SC-004**: R$ 100,00 em 26/05/2026, cartão com fechamento 25, em 3×, mostra na prévia R$ 33,34, R$ 33,33 e R$ 33,33 e, depois de salvar, uma linha em junho, uma em julho e uma em agosto, todas com a data 26/05/2026. A soma é R$ 100,00. Se a gravação não se completa, nenhuma das três aparece.
- **SC-005**: Editar a 3ª de 6 com "Só esta parcela" deixa as outras cinco iguais. "Esta e as próximas" altera da 3ª à 6ª e não altera a 1ª nem a 2ª. A correção não oferece "Todas do parcelamento". Data 31/01/2026 nesse alcance leva a parcela seguinte a 28/02/2026. O texto continua "Parcela N de 6". Salvar fecha o painel. Se a linha continua no mês, o foco volta para ela. Se uma data de novembro passa a dezembro, a linha sai de novembro e o foco vai para "Registrar".
- **SC-006**: Excluir as 4 últimas de um grupo de 6 fecha o painel, deixa o foco em "Registrar" e, ao desfazer dentro de 10 segundos, devolve essas 4 na lista, sem duplicar e sem reabrir o painel. Aos 10 segundos não há desfazer. Cancelar o diálogo não remove linha. Recarregar durante o aviso não devolve as linhas.
- **SC-007**: Novembro sem lançamento mostra "Nenhum lançamento em novembro" e "Registrar lançamento". Durante o carregamento a pessoa não vê R$ 0,00. Na falha, vê "Não foi possível carregar o mês." e "Tentar de novo". Pelo teclado, no claro, no escuro e com menos movimento, ela alcança o mês, Registrar, uma linha, o painel e o diálogo. Em 1280 px o painel mede 460 px. Em 390 px e em 1280 px não há botão flutuante.
- **SC-008**: Com os valores ocultos, a linha de R$ 186,40 mostra "R$ •••••" e o painel aberto mostra R$ 186,40. Ao fechar, a lista volta à máscara. Data, descrição e selo continuam legíveis.

## Assumptions

- A aparência vem da história 040. A casca é a história 042. Lançamentos pede mês no cabeçalho. O botão flutuante continua de fora. O endereço continua `/app/lancamentos`. A branch de trabalho é `rebuild-web`.
- A spec anterior, no formato SDD e com status `ready`, está no commit `42a9a04`. Esta versão guarda as mesmas regras em linguagem de produto: tabela do mês, busca que não sai do mês, painel de registro, prévia dos centavos, selo da fatura, correção por alcance, exclusão com desfazer de 10 segundos, vazio, carregando e erro. O status fica `implemented`. O PM marca `verified`.
- A conta da fatura e a divisão dos centavos não mudam. Compra no dia do fechamento vai para a fatura do mês seguinte. R$ 100,00 em 3× continua R$ 33,34 + R$ 33,33 + R$ 33,33. Não há competência escolhida na mão.
- Na criação, as parcelas compartilham a data da compra e diferem na competência. O avanço da data, mês a mês, fica na correção "Esta e as próximas".
- O artboard de corrigir mostra "Todas do parcelamento". Esta spec não oferece essa opção na correção, porque a regra já fechada não alcança as parcelas anteriores. Na exclusão, "Todas do parcelamento" permanece, como o artboard e a regra já fechada.
- O artboard de registrar mostra "Parcelar" ao lado de Pix. Esta spec só mostra "Parcelar" no crédito. Débito, Pix e dinheiro continuam à vista.
- O artboard de lista usa "Transferência" e "Crédito" como exemplos de pagamento. Não há forma Transferência. A coluna mostra o apelido do cartão para distinguir dois cartões; sem apelido, mostra "Crédito". O filtro Crédito reúne os cartões.
- O vazio segue o artboard, em título, frase e ação, com o nome do mês. A frase única antiga do microcopy fica coberta por esse cartão.
- "Limpar busca" não limpa filtros. Filtro sem linha, e sem texto, usa "Nenhum lançamento com esses filtros." Não há um segundo botão de limpar.
- A busca também encontra o nome do item, embora o campo se chame "Buscar por descrição" e a frase do vazio fale em descrição.
- A ocultação é a preferência que o Resumo já guarda neste navegador. A máscara é "R$ •••••". A lista esconde o valor e o painel aberto mostra o valor da linha. Esta tela não cria um segundo controle.
- O painel mede 460 px a partir de 720 px, como os outros formulários do computador. O endereço e essa medida são o que a pessoa já vê.
- A pessoa vê e altera só o mês da própria conta. O app do celular fica fora.
