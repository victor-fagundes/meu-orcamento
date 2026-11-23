# Feature Specification: Resumo web

**Feature Branch**: `043-resumo-web`

**Created**: 2026-11-22

**Status**: verified

**Input**: User description: "/speckit-specify 043"

**Related**: Quem entrou na conta abre o Resumo e lê o mês de competência. O número principal passa a se chamar "Disponível neste mês": planejado das despesas menos o gasto das despesas. Os quatro cartões, os filtros, o sininho e o gráfico de gasto por semana usam essa mesma conta. A aparência vem da história 040. O lugar na casca vem da história 042.

## Referências visuais e de DS
- Identidade: `docs/identidade-visual/decisoes/DECISOES_identidade_visual.md` (seções aplicáveis: 2 Cores, 3 Tipografia, 5 Layout, 7 Estados e mensagens, 8 Nomes e microcopy)
- Tela de referência: `docs/identidade-visual/telas-web/web-resumo-dados.dc.html`, `web-resumo-vazio.dc.html`, `web-resumo-erro.dc.html`, `web-resumo-filtro.dc.html`, `web-resumo-alertas.dc.html`, `web-resumo-tipo.dc.html`
- Componentes do DS usados: `CabecalhoTela`, `BlocoSaldo`, `GradeTotais`, `Medidor`, `Chips`, `Icone`, `CartaoVazio`, `Skeleton`, `EstadoErro`
- Tokens: apenas os de `packages/design-system/src/core/tokens.ts`

## Critérios de aceite visuais
- AC-V1: hierarquia e textos iguais à tela de referência.
- AC-V2: todos os componentes vêm do DS.
- AC-V3: estados (vazio, erro, carregando) iguais aos da referência.

## Clarifications

### Session 2026-11-22

- Q: Como o gráfico do Resumo deve agrupar o gasto do mês em semanas? → A: Semanas fixas do mês: dias 1–7, 8–14, 15–21, 22–28 e, se houver, 29 até o último dia.
- Q: Quando a pessoa escolhe um tipo, o que deve mudar no Resumo? → A: O chip muda o gráfico, o detalhe da semana e a média. O disponível e os quatro cartões continuam os do mês inteiro.
- Q: O toque em um dos quatro cartões deve abrir outra tela? → A: O cartão abre o Orçamento do mesmo mês, já no tipo daquele cartão.
- Q: O Resumo deve mostrar um banner fixo com o alerta mais grave do mês? → A: Só o sininho. O Resumo não mostra banner.
- Q: A média diária deve aparecer quando o mês aberto não é o mês de hoje? → A: Aparece em todo mês. Fora do mês de hoje, é o gasto dividido pela quantidade de dias daquele mês.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Disponível neste mês (Priority: P1)

A pessoa abre o Resumo e vê um único bloco com o rótulo "Disponível neste mês" e o valor do mês. O valor é o planejado das despesas (fixas, variáveis e anuais) menos o gasto dessas despesas. Abaixo de 720 px o valor mede 40 px. A partir de 720 px mede 56 px.

Quando o planejado das despesas é maior que zero e o pagamento está em Todas, a frase diz "Usou X% do planejado". X é inteiro, sem casa decimal, e corta o que sobra (87,9 vira 87). No mês civil de hoje a frase continua com " · Faltam N dias". N é o último dia do mês menos o dia de hoje. O medidor enche na proporção de X até 100% e permanece cheio quando X passa de 100.

**Why this priority**: Este é o número que a pessoa abre o produto para ver. O nome antigo deixava esse valor parecido com a sobra do ano.

**Independent Test**: Com despesas planejadas de R$ 3.000,00 e gasto de R$ 2.400,00, o bloco mostra "Disponível neste mês" e R$ 600,00. No dia 17 de um mês de 30 dias, a frase é "Usou 80% do planejado · Faltam 13 dias" e o medidor marca 80%.

**Acceptance Scenarios**:

1. **Given** despesas planejadas de R$ 3.000,00 e gasto de R$ 2.400,00 no mês, **When** a pessoa abre o Resumo, **Then** vê um único bloco com o rótulo "Disponível neste mês" e o valor R$ 600,00.
2. **Given** despesas planejadas de R$ 1.000,00 e gasto de R$ 1.040,00, **When** a pessoa lê o bloco, **Then** o rótulo continua "Disponível neste mês" e o valor é −R$ 40,00.
3. **Given** a largura é 390 px, **When** a pessoa mede o valor, **Then** ele tem 40 px. **Given** a largura é 720 px ou 1280 px, **When** a pessoa mede o valor, **Then** ele tem 56 px.
4. **Given** o mês aberto é o mês civil de hoje, dia 17, mês de 30 dias, e o gasto é 80% do planejado, **When** a pessoa lê o bloco, **Then** a frase é "Usou 80% do planejado · Faltam 13 dias" e o medidor marca 80%.
5. **Given** o mês aberto é outro mês civil, com o mesmo 80%, **When** a pessoa lê a frase, **Then** ela diz "Usou 80% do planejado" e não inclui "Faltam N dias".
6. **Given** o planejado das despesas é zero, **When** a pessoa lê o bloco, **Then** a frase não traz percentual e o medidor não mostra percentual.
7. **Given** o gasto passa de 100% do planejado, **When** a pessoa olha o medidor, **Then** a barra está cheia e a frase mostra o percentual acima de 100, sem casa decimal.

---

### User Story 2 - Quatro cartões do mês (Priority: P1)

A pessoa vê quatro cartões, nesta ordem: Receitas, Fixas, Variáveis e Anuais. Cada um mostra o nome, o realizado em reais inteiros e a linha "de R$ x planejados". Os centavos do cartão são cortados, sem arredondar: 8.200 reais e 99 centavos aparecem como R$ 8.200.

Abaixo de 720 px os cartões ficam em duas colunas. A partir de 720 px ficam em duas colunas, dentro de seis das doze colunas do conteúdo.

O toque num cartão abre o Orçamento do mesmo mês, já no tipo daquele cartão. Ocultar os valores não tira esse toque.

**Why this priority**: O disponível sozinho não diz de onde veio o mês. Os quatro tipos são a leitura seguinte, e cada um leva ao plano daquele tipo.

**Independent Test**: Com realizado de R$ 8.200,99 e planejado de R$ 1.200,50 em Fixas, o cartão Fixas mostra R$ 8.200 e "de R$ 1.200 planejados". Os quatro nomes aparecem na ordem acima. Ativar Fixas abre o Orçamento desse mês em Fixas.

**Acceptance Scenarios**:

1. **Given** o mês tem valores nos quatro tipos, **When** a pessoa lê os cartões, **Then** vê Receitas, Fixas, Variáveis e Anuais, nesta ordem, cada um com o realizado e a linha "de R$ x planejados".
2. **Given** um tipo tem realizado de R$ 8.200,99 e planejado de R$ 1.200,50, **When** a pessoa lê esse cartão, **Then** o realizado é R$ 8.200 e a linha é "de R$ 1.200 planejados".
3. **Given** a largura é 390 px, **When** a pessoa olha os cartões, **Then** eles estão em duas colunas. **Given** a largura é 1280 px, **When** a pessoa olha os cartões, **Then** eles ocupam duas colunas dentro de seis das doze colunas do conteúdo.
4. **Given** o mês está aberto, **When** a pessoa ativa o cartão Fixas, **Then** abre o Orçamento desse mês, já em Fixas. O mesmo vale para Receitas, Variáveis e Anuais, cada um no próprio tipo.
5. **Given** os valores estão ocultos, **When** a pessoa ativa o cartão Variáveis, **Then** abre o Orçamento desse mês, já em Variáveis.

---

### User Story 3 - Filtros sem mexer no mês (Priority: P1)

A pessoa filtra por tipo, por pagamento e por categoria. Os chips de tipo são Todas, Receitas, Fixas, Variáveis e Anuais. Os chips de pagamento são Todas, Débito, PIX, Dinheiro e cada cartão da conta, pelo nome. A categoria mostra Todas ou uma categoria. Cada controle mostra a escolha atual.

"Limpar filtros" devolve tipo, pagamento e categoria a Todas e mantém o mês. Filtrar não grava lançamento nem plano.

Com um pagamento diferente de Todas, o disponível e todo valor planejado mostram "—". O gasto, o gráfico e a média diária usam só os lançamentos daquele meio. A frase não diz percentual do planejado. No mês civil de hoje, os dias restantes continuam.

Com uma categoria escolhida, o disponível, os quatro cartões, o gráfico, o detalhe da semana e a média diária usam só os itens dela. O sininho continua com os alertas do mês inteiro.

Com um tipo escolhido, o gráfico, o detalhe da semana e a média diária usam só o gasto daquele tipo. Receitas deixa o gráfico sem gasto. O disponível e os quatro cartões não mudam por causa do tipo.

**Why this priority**: O mês é a competência. Um filtro que apagasse o mês, ou que dividisse o planejado por cartão, mudaria a conta que a pessoa confia.

**Independent Test**: Escolher um cartão, ver "—" no disponível e no planejado, e o gasto só daquele meio. Limpar e ver Todas de novo, no mesmo mês. Escolher uma categoria e ver os cartões restritos a ela.

**Acceptance Scenarios**:

1. **Given** pagamento e categoria estão preenchidos e um tipo está escolhido, **When** a pessoa aciona "Limpar filtros", **Then** tipo, pagamento e categoria voltam a Todas e o mês permanece.
2. **Given** a pessoa escolhe um cartão, **When** ela lê o Resumo, **Then** o disponível e cada planejado mostram "—", o gasto e a média usam só esse meio, e a frase não traz percentual do planejado.
3. **Given** o mês aberto é o mês civil de hoje e um cartão está escolhido, **When** a pessoa lê a frase, **Then** os dias restantes continuam e o percentual do planejado não aparece.
4. **Given** a pessoa escolhe uma categoria, **When** ela lê os cartões, o disponível, o gráfico e a média, **Then** os números usam só os itens dessa categoria, e o sininho segue com os alertas do mês inteiro.
5. **Given** a pessoa escolhe Fixas, **When** ela lê o gráfico, **Then** as semanas somam só o gasto de Fixas, e o disponível e os quatro cartões continuam os do mês.
6. **Given** a pessoa escolhe Receitas, **When** ela lê o gráfico, **Then** as semanas de gasto ficam zeradas.
7. **Given** qualquer filtro, **When** a pessoa filtra, **Then** nenhum lançamento e nenhum plano são gravados ou apagados.

---

### User Story 4 - Ocultar os valores (Priority: P1)

A pessoa oculta os valores. O controle se chama "Ocultar valores" quando os valores estão à vista e "Mostrar valores" quando estão ocultos. Oculto, o controle fica pressionado. À vista, o ícone é o olho aberto. Oculto, o ícone é o olho cortado.

Ocultar troca o disponível, o realizado e o planejado de cada cartão, os valores do gráfico e a média diária por "R$ •••••". Os rótulos, a frase de percentual, os dias restantes e os alertas continuam legíveis. A escolha permanece na próxima visita, neste navegador, também depois de trocar o mês.

**Why this priority**: O Resumo é a tela de entrada. A pessoa precisa poder abri-lo com alguém ao lado.

**Independent Test**: Ocultar, ver "R$ •••••" no disponível, nos quatro cartões e no gráfico, recarregar a tela e continuar oculto. Mostrar e ver os valores de volta.

**Acceptance Scenarios**:

1. **Given** os valores estão à vista, **When** a pessoa aciona o controle, **Then** o nome passa a "Mostrar valores", o controle fica pressionado, o ícone é o olho cortado, e o disponível, os cartões, o gráfico e a média mostram "R$ •••••".
2. **Given** os valores estão ocultos, **When** a pessoa lê a frase e o sininho, **Then** o percentual, os dias restantes e os alertas continuam legíveis.
3. **Given** os valores estão ocultos, **When** a pessoa recarrega o Resumo ou troca o mês, **Then** os valores seguem ocultos. **When** ela aciona "Mostrar valores", **Then** os valores do mês voltam.
4. **Given** os valores estão ocultos e a pessoa abre o detalhe de uma semana, **When** ela lê os lançamentos, **Then** a data e a descrição aparecem e o valor aparece como "R$ •••••".

---

### User Story 5 - Gasto por semana (Priority: P1)

O gráfico do Resumo é o gasto por semana, com a média diária. As semanas do mês são: dias 1 a 7, 8 a 14, 15 a 21, 22 a 28 e, quando o mês tem dia 29 ou seguinte, 29 até o último dia. Cada semana tem nome e o valor em texto, além da barra.

A média do mês civil de hoje é o gasto de despesas do mês dividido pelo dia de hoje, no centavo mais próximo. Em outro mês, é o gasto de despesas daquele mês dividido pela quantidade de dias dele, no centavo mais próximo.

"Ver detalhes" abre o painel dos lançamentos de gasto daquela semana: data, descrição e valor. Uma semana sem lançamento diz "Nenhum lançamento nesta semana." O foco fica no painel até fechar e volta ao controle que abriu.

Um lançamento da competência cuja data cai fora do mês entra na semana 1, se a data é anterior, ou na última semana do mês, se a data é posterior.

**Why this priority**: A pessoa precisa ver em que parte do mês o gasto aconteceu. A rosca e as barras antigas não respondem isso.

**Independent Test**: Num mês de 31 dias, ver cinco semanas. Num mês de 28 dias, ver quatro. Abrir "Ver detalhes" da semana 1 e ver só os lançamentos dos dias 1 a 7.

**Acceptance Scenarios**:

1. **Given** um mês de 31 dias com gasto, **When** a pessoa lê o gráfico, **Then** vê cinco semanas, cada uma com nome e valor, e a média diária.
2. **Given** um mês de 28 dias, **When** a pessoa lê o gráfico, **Then** vê quatro semanas e não vê uma quinta.
3. **Given** o mês aberto é o mês civil de hoje, dia 10, e o gasto de despesas é R$ 100,00, **When** a pessoa lê a média, **Then** ela é R$ 10,00.
4. **Given** outro mês de 30 dias com gasto de despesas de R$ 30,00, **When** a pessoa lê a média, **Then** ela é R$ 1,00.
5. **Given** a semana 1 tem lançamentos de gasto e a semana 2 não tem, **When** a pessoa abre "Ver detalhes" de cada uma, **Then** a semana 1 lista data, descrição e valor dos seus lançamentos, e a semana 2 diz "Nenhum lançamento nesta semana."
6. **Given** o painel de uma semana está aberto, **When** a pessoa fecha, **Then** o foco volta ao "Ver detalhes" daquela semana.

---

### User Story 6 - Alertas do mês (Priority: P1)

O sininho mostra a quantidade de alertas que o mês já calcula: atenção, a partir do limite preventivo, e estouro, inclusive o mês ou a categoria que chegou no planejado e o gasto sem planejado. Abaixo do limite, o item não entra na conta. Esta tela não cria outra regra de alerta.

Zero alertas: o sininho não mostra quantidade. Aberto, o painel diz "Nenhum alerta neste mês." Com alertas, cada um abre o Orçamento do mesmo mês. O foco fica no painel até fechar e volta ao sininho.

**Why this priority**: O Resumo é onde a pessoa descobre que o mês cruzou o limite, antes de abrir o Orçamento.

**Independent Test**: Um mês com um alerta de atenção e um de estouro mostra 2. Cada item abre o Orçamento daquele mês. Um mês abaixo do limite mostra o sininho sem quantidade.

**Acceptance Scenarios**:

1. **Given** o mês tem um alerta de atenção e um de estouro, **When** a pessoa olha o sininho, **Then** a quantidade é 2 e o painel lista os dois, na ordem que o mês já calcula.
2. **Given** o painel está aberto, **When** a pessoa escolhe um alerta, **Then** abre o Orçamento do mesmo mês.
3. **Given** o mês não tem alerta, **When** a pessoa olha o sininho, **Then** não há quantidade. **When** ela abre o painel, **Then** lê "Nenhum alerta neste mês."
4. **Given** o gasto está abaixo do limite preventivo, **When** a pessoa conta os alertas, **Then** esse item não entra.

---

### User Story 7 - Vazio, carregando e erro (Priority: P1)

Sem receita planejada e sem lançamento no mês, o Resumo mostra um cartão vazio: título "Nenhuma receita neste mês", a frase "Defina as receitas para acompanhar o disponível." e a ação "Definir receitas". A ação abre o Orçamento do mesmo mês, em Receitas. Um filtro que esconde movimento existente não troca a tela por esse cartão.

Enquanto o mês carrega, a pessoa vê o lugar dos números, sem um valor que pareça verdadeiro. Se o carregamento falha, a pessoa lê "Não foi possível carregar o mês." e pode acionar "Tentar de novo". Os números não aparecem como se tivessem carregado.

**Why this priority**: Um zero no lugar de um mês que ainda não chegou faz a pessoa achar que não gastou nada.

**Independent Test**: Abrir um mês sem receita planejada e sem lançamento e ver o cartão com "Definir receitas". Provocar a falha de carregamento e ver a frase de erro, sem totais.

**Acceptance Scenarios**:

1. **Given** o mês não tem receita planejada e não tem lançamento, **When** a pessoa abre o Resumo, **Then** vê o título "Nenhuma receita neste mês", a frase "Defina as receitas para acompanhar o disponível." e a ação "Definir receitas". O bloco do disponível, os quatro cartões e o gráfico não aparecem.
2. **Given** esse cartão está visível, **When** a pessoa aciona "Definir receitas", **Then** abre o Orçamento do mesmo mês, em Receitas.
3. **Given** o mês tem lançamento e o filtro não encontra nada, **When** a pessoa lê a tela, **Then** o cartão "Nenhuma receita neste mês" não aparece.
4. **Given** o mês ainda está carregando, **When** a pessoa olha o disponível e os cartões, **Then** não vê R$ 0,00 no lugar dos números.
5. **Given** o carregamento falhou, **When** a pessoa lê a tela, **Then** vê "Não foi possível carregar o mês." e "Tentar de novo", e não vê totais como se o mês tivesse carregado.

---

### User Story 8 - Ler e usar o Resumo (Priority: P1)

Cada controle tem nome. O foco é visível. Pelo teclado a pessoa alcança os quatro cartões, os filtros, "Limpar filtros", ocultar, o sininho, "Ver detalhes" e "Definir receitas". O Resumo continua legível no claro e no escuro. Com preferência de menos movimento, o gráfico e os painéis aparecem sem animação.

O Resumo pede a navegação de mês. Trocar o mês troca todos os números da tela. Não há intervalo livre de datas. Não há botão flutuante de criar.

**Why this priority**: O Resumo é a primeira tela da conta. Se o foco some ou o mês não troca, a pessoa não acompanha o período.

**Independent Test**: Percorrer ocultar, um filtro, limpar, o sininho e o detalhe de uma semana pelo teclado, no claro, no escuro e com menos movimento. Trocar o mês e ver os números do mês destino.

**Acceptance Scenarios**:

1. **Given** o Resumo está aberto, **When** a pessoa percorre os controles, **Then** cada um tem nome e o foco é visível.
2. **Given** o foco está no Resumo, **When** a pessoa usa o teclado, **Then** ela alcança os quatro cartões, os filtros, "Limpar filtros", ocultar, o sininho e "Ver detalhes". Ativar um cartão abre o Orçamento daquele tipo. No mês vazio, ela alcança "Definir receitas".
3. **Given** a aparência está clara, **When** a pessoa troca para escura, **Then** o disponível, os cartões, o gráfico e o sininho continuam legíveis.
4. **Given** a pessoa prefere menos movimento, **When** ela abre o sininho ou o detalhe de uma semana, **Then** o painel aparece sem animação.
5. **Given** a pessoa aciona o próximo mês, **When** o Resumo atualiza, **Then** o disponível, os cartões, o gráfico, a média e os alertas são os do mês destino.
6. **Given** o Resumo em 390 px ou em 1280 px, **When** a pessoa procura um intervalo de datas ou um botão flutuante de criar, **Then** nenhum dos dois está na tela.

---

### Edge Cases

- No último dia do mês, N é zero e a frase do mês civil de hoje inclui "Faltam 0 dias".
- Com planejado de despesas em zero, não há percentual no bloco, mesmo que exista gasto. Esse gasto segue as regras de alerta que o mês já calcula.
- Pagamento diferente de Todas junto com uma categoria: o gasto é a interseção dos dois; o disponível e o planejado mostram "—".
- A categoria escolhida não reduz o sininho. O sininho é o mês inteiro.
- O tipo escolhido não muda o disponível nem os quatro cartões.
- Ativar um cartão de tipo abre o Orçamento do mês aberto, já nesse tipo, com os valores ocultos ou à vista. O destino não muda por causa do filtro de pagamento ou de categoria.
- Fevereiro de 28 dias tem quatro semanas. Um mês de 31 dias tem cinco. A quinta semana soma do dia 29 ao último.
- Lançamento da competência com data anterior ao mês entra na semana 1. Data posterior ao mês entra na última semana.
- Ocultar mascara também o valor dentro de "Ver detalhes". Data e descrição permanecem.
- A preferência de ocultar vale na próxima visita deste navegador e ao trocar de mês. Outro navegador começa com os valores à vista.
- Mês sem receita planejada e sem lançamento mostra o cartão vazio, mesmo que exista despesa planejada.
- Mês com movimento, e um filtro que não encontra lançamento, não mostra o cartão "Nenhuma receita neste mês".
- Carregar não mostra R$ 0,00. Falhar mostra a frase de erro e "Tentar de novo".
- Abaixo de 720 px o valor principal tem 40 px. A partir de 720 px tem 56 px. Em 719 px vale 40 px. Em 720 px vale 56 px.
- "Limpar filtros" não troca o mês.
- Filtrar não grava e não apaga lançamento nem plano.
- O gráfico desta tela é o de semanas. A rosca, as barras de planejado × realizado, a seção Insights, o indicador de dívida e o banner fixo não aparecem.
- Com menos movimento, gráfico e painéis não animam.
- O painel do sininho e o painel da semana devolvem o foco a quem os abriu.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O Resumo MUST mostrar um único bloco com o rótulo "Disponível neste mês". O valor MUST ser o planejado das despesas (fixas, variáveis e anuais) menos o gasto dessas despesas, em reais com centavos. Planejado de R$ 3.000,00 e gasto de R$ 2.400,00 MUST mostrar R$ 600,00.
- **FR-002**: Com o valor negativo, o rótulo MUST permanecer "Disponível neste mês". Planejado de R$ 1.000,00 e gasto de R$ 1.040,00 MUST mostrar −R$ 40,00.
- **FR-003**: Abaixo de 720 px o valor MUST medir 40 px. A partir de 720 px o valor MUST medir 56 px.
- **FR-004**: Quando o planejado das despesas é maior que zero e o pagamento está em Todas, a frase MUST ser "Usou X% do planejado". X MUST ser inteiro, sem casa decimal, cortando o que sobra. No mês civil de hoje a frase MUST continuar com " · Faltam N dias", e N MUST ser o último dia do mês menos o dia de hoje. O medidor MUST encher na proporção de X até 100% e MUST permanecer cheio quando X é 100 ou mais.
- **FR-005**: Numa competência que não é o mês civil de hoje, a frase MUST NOT incluir "Faltam N dias".
- **FR-006**: Quando o planejado das despesas é zero, a frase MUST NOT incluir percentual e o medidor MUST NOT mostrar percentual.
- **FR-007**: O Resumo MUST mostrar quatro cartões, nesta ordem: Receitas, Fixas, Variáveis e Anuais. Cada cartão MUST mostrar o nome, o realizado em reais inteiros e "de R$ x planejados". Os centavos MUST ser cortados, sem arredondar. Abaixo de 720 px os cartões MUST ficar em duas colunas. A partir de 720 px MUST ficar em duas colunas, dentro de seis das doze colunas do conteúdo. Ativar um cartão MUST abrir o Orçamento do mesmo mês, já no tipo daquele cartão, com os valores à vista ou ocultos.
- **FR-008**: O Resumo MUST oferecer chips de tipo (Todas, Receitas, Fixas, Variáveis, Anuais), chips de pagamento (Todas, Débito, PIX, Dinheiro e cada cartão da conta, pelo nome) e uma escolha de categoria (Todas ou uma categoria ativa). Cada controle MUST mostrar a escolha atual.
- **FR-009**: "Limpar filtros" MUST devolver tipo, pagamento e categoria a Todas e MUST manter o mês. Filtrar MUST NOT gravar nem apagar lançamento ou plano.
- **FR-010**: Com pagamento diferente de Todas, o disponível e todo valor planejado MUST mostrar "—". O gasto, o gráfico e a média diária MUST usar só os lançamentos desse meio. A frase MUST NOT dizer percentual do planejado. No mês civil de hoje, os dias restantes MUST continuar.
- **FR-011**: Com uma categoria escolhida, o disponível, os quatro cartões, o gráfico, o detalhe da semana e a média diária MUST usar só os itens dessa categoria. Os alertas MUST continuar os do mês inteiro.
- **FR-012**: Com um tipo escolhido, o gráfico, o detalhe da semana e a média diária MUST usar só o gasto desse tipo. O tipo Receitas MUST deixar o gráfico de gasto sem valor. O disponível e os quatro cartões MUST permanecer os do mês.
- **FR-013**: O controle de ocultar MUST se chamar "Ocultar valores" com os valores à vista e "Mostrar valores" com os valores ocultos. Oculto, MUST ficar pressionado, com o ícone de olho cortado. À vista, o ícone MUST ser o olho aberto. Ocultar MUST trocar o disponível, o realizado e o planejado de cada cartão, os valores do gráfico, a média diária e o valor dentro de "Ver detalhes" por "R$ •••••". Rótulos, percentual, dias restantes e alertas MUST permanecer legíveis. A escolha MUST permanecer na próxima visita deste navegador e ao trocar o mês.
- **FR-014**: O gráfico MUST ser o gasto por semana, com a média diária. As semanas MUST ser os dias 1 a 7, 8 a 14, 15 a 21, 22 a 28 e, se o mês tiver dia 29 ou seguinte, 29 até o último dia. Cada semana MUST ter nome e valor em texto. Um lançamento da competência com data fora do mês MUST entrar na semana 1, se a data é anterior, ou na última semana, se a data é posterior.
- **FR-015**: No mês civil de hoje, a média diária MUST ser o gasto de despesas do mês dividido pelo dia de hoje, no centavo mais próximo. Em outro mês, MUST ser o gasto de despesas daquele mês dividido pela quantidade de dias dele, no centavo mais próximo.
- **FR-016**: "Ver detalhes" MUST abrir os lançamentos de gasto daquela semana, com data, descrição e valor. Sem lançamento, MUST dizer "Nenhum lançamento nesta semana." O foco MUST permanecer no painel até fechar e MUST voltar ao controle que abriu.
- **FR-017**: O sininho MUST mostrar a quantidade de alertas que o mês já calcula. Atenção, estouro, planejado atingido e gasto sem planejado entram quando a regra já existente do mês os inclui. Abaixo do limite preventivo, o item MUST NOT entrar. Esta história MUST NOT criar outra regra de alerta. Zero alertas: o sininho MUST NOT mostrar quantidade e o painel MUST dizer "Nenhum alerta neste mês." Cada alerta MUST abrir o Orçamento do mesmo mês.
- **FR-018**: Sem receita planejada e sem lançamento no mês, o Resumo MUST mostrar o título "Nenhuma receita neste mês", a frase "Defina as receitas para acompanhar o disponível." e a ação "Definir receitas". Nesse estado o bloco do disponível, os quatro cartões e o gráfico MUST NOT aparecer. A ação MUST abrir o Orçamento do mesmo mês, em Receitas. Um filtro sobre um mês que tem movimento MUST NOT mostrar esse cartão.
- **FR-019**: Enquanto o mês carrega, o Resumo MUST NOT mostrar R$ 0,00 no lugar dos números. Se o carregamento falha, a pessoa MUST ver "Não foi possível carregar o mês." e "Tentar de novo", e MUST NOT ver totais como se o mês tivesse carregado.
- **FR-020**: Cada controle MUST ter nome. O foco MUST ser visível. Os quatro cartões, filtros, "Limpar filtros", ocultar, sininho, "Ver detalhes" e "Definir receitas" MUST ser alcançáveis pelo teclado. Ativar um cartão pelo teclado MUST abrir o Orçamento daquele tipo. O Resumo MUST permanecer legível no claro e no escuro. Com menos movimento, o gráfico e os painéis MUST aparecer sem animação.
- **FR-021**: O Resumo MUST pedir a navegação de mês. Trocar o mês MUST atualizar o disponível, os cartões, o gráfico, a média e os alertas. O Resumo MUST NOT oferecer intervalo livre de datas nem botão flutuante de criar.
- **FR-022**: O gráfico do Resumo MUST ser o de gasto por semana. A rosca, as barras de planejado × realizado, a seção Insights, o indicador de dívida e o banner fixo MUST NOT aparecer nesta tela.

### Key Entities

- **Disponível neste mês**: planejado das despesas do mês menos o gasto dessas despesas. Pode ser negativo. Não é o número do ano.
- **Cartão do tipo**: um dos quatro tipos (Receitas, Fixas, Variáveis, Anuais), com realizado e planejado do mês. Na tela, os centavos desse cartão são cortados. Ativar o cartão abre o Orçamento do mesmo mês, já nesse tipo.
- **Alerta do mês**: atenção ou estouro que a conta do mês já produz, no total ou numa categoria. O sininho lista os do mês aberto.
- **Semana do mês**: um bloco de dias da competência (1–7, 8–14, 15–21, 22–28, 29–fim) e os lançamentos de gasto que caem nele.
- **Preferência de ocultar**: escolha deste navegador. Vale na próxima visita e ao trocar o mês. Não acompanha outro navegador.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Com despesas planejadas de R$ 3.000,00 e gasto de R$ 2.400,00, a pessoa vê "Disponível neste mês" e R$ 600,00. Com R$ 1.000,00 planejados e R$ 1.040,00 gastos, vê −R$ 40,00 sob o mesmo rótulo. Há um único bloco de saldo.
- **SC-002**: Os quatro cartões aparecem na ordem Receitas, Fixas, Variáveis e Anuais. R$ 8.200,99 realizado e R$ 1.200,50 planejados aparecem como R$ 8.200 e "de R$ 1.200 planejados". Ativar Fixas abre o Orçamento desse mês em Fixas. Em 390 px o valor principal tem 40 px e os cartões estão em duas colunas. Em 1280 px o valor tem 56 px.
- **SC-003**: No dia 17 de um mês civil de 30 dias, com 80% usado, a frase é "Usou 80% do planejado · Faltam 13 dias" e o medidor marca 80%. Em outro mês, a mesma conta mostra "Usou 80% do planejado" e não mostra os dias. Com planejado zero, não há percentual.
- **SC-004**: Escolher um cartão mostra "—" no disponível e em todo planejado, e o gasto daquele meio. "Limpar filtros" devolve tipo, pagamento e categoria a Todas e mantém o mês. Escolher uma categoria restringe disponível, cartões, gráfico e média a ela. Escolher Fixas restringe o gráfico, e o disponível permanece o do mês.
- **SC-005**: Ocultar troca disponível, cartões, gráfico, média e o valor do detalhe da semana por "R$ •••••". Depois de recarregar, os valores seguem ocultos. "Mostrar valores" devolve os números do mês.
- **SC-006**: Um mês de 31 dias mostra cinco semanas. Um mês de 28 dias mostra quatro. No dia 10, R$ 100,00 de gasto mostram média de R$ 10,00. Num mês de 30 dias que não é o mês de hoje, R$ 30,00 de gasto mostram média de R$ 1,00. "Ver detalhes" lista os lançamentos de gasto daquela semana.
- **SC-007**: Um mês com um alerta de atenção e um de estouro mostra quantidade 2, e cada um abre o Orçamento desse mês. Um mês sem alerta mostra o sininho sem quantidade e a frase "Nenhum alerta neste mês."
- **SC-008**: Um mês sem receita planejada e sem lançamento mostra o cartão com "Definir receitas" e não mostra o bloco do disponível, os quatro cartões nem o gráfico. A ação abre o Orçamento desse mês em Receitas. Durante o carregamento a pessoa não vê R$ 0,00. Na falha, vê "Não foi possível carregar o mês." e nenhum total falso.
- **SC-009**: Pelo teclado, no claro, no escuro e com menos movimento, a pessoa alcança os quatro cartões, filtros, limpar, ocultar, sininho e detalhe da semana. Ativar um cartão abre o Orçamento daquele tipo. Com menos movimento, o painel abre sem animação. Em 390 px e em 1280 px não há intervalo de datas nem botão flutuante.

## Assumptions

- A aparência vem da história 040. As medidas 40 px e 56 px são os tamanhos de destaque já aprovados. A máscara "R$ •••••" é a máscara de saldo já definida. Os quatro cartões seguem a grade já aprovada: duas colunas no estreito e, no largo, duas colunas dentro de seis das doze.
- A casca é a história 042. O Resumo pede mês no cabeçalho. O botão flutuante continua de fora. O endereço continua `/app/resumo`.
- A spec anterior, no formato SDD e com status `ready`, está no commit `9e4f072`. Esta versão guarda as mesmas regras em linguagem de produto. Verificação em 2026-11-23: o roteiro Playwright de `e2e/resumo.spec.ts` passou. O status fica `verified`.
- O valor é exato até o centavo. O bloco principal mostra os centavos. Os quatro cartões cortam os centavos, sem arredondar.
- A conta do disponível é a que o mês já usa: planejado das despesas menos gasto das despesas. O número do ano, receitas menos despesas, com o nome "Sobra no ano", é a história 046.
- Os alertas são os que o mês já calcula, com o limite que a conta já guardou. Esta história não muda limite, frase nem quem entra na lista. Fica confirmado: a lista é o sininho. O banner fixo do PRD 5.10 e da história 011 não entra nesta tela.
- A rosca, as barras de planejado × realizado, a seção Insights e o indicador de dívida ficam de fora. O gráfico desta reconstrução é o de gasto por semana.
- As semanas do gráfico ficam confirmadas: dias 1–7, 8–14, 15–21, 22–28 e, se houver, 29 até o último dia. A média diária fica confirmada em todo mês: no mês de hoje, gasto dividido pelo dia de hoje; nos outros, gasto dividido pelos dias daquele mês.
- D-09 manda "Limpar filtros" zerar pagamento e categoria, e manter o mês. O chip de tipo entra no mesmo gesto, para a tela não continuar filtrada. O efeito do tipo fica confirmado: o chip restringe o gráfico, o detalhe da semana e a média; o disponível e os quatro cartões continuam os do mês. Pagamento tira o planejado. Categoria restringe os números.
- Cada cartão de tipo abre o Orçamento do mês aberto, já nesse tipo. O alerta abre o Orçamento do mês. "Definir receitas" abre o Orçamento do mês em Receitas. Desenhar o Orçamento é a história 044. Esta história só leva até lá.
- A preferência de ocultar é a que este navegador já guarda. Esta história não cria uma segunda preferência e não leva a escolha a outro navegador.
- Os nomes dos cartões são os curtos já escolhidos para esta tela: Receitas, Fixas, Variáveis e Anuais.
- A janela estreita do computador usa esta tela. O app do celular fica fora.
- A pessoa vê o mês da própria conta.
