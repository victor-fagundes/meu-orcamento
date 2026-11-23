# Feature Specification: Ano web

**Feature Branch**: `046-ano-web`

**Created**: 2026-11-23

**Status**: verified

**Input**: User description: "/speckit-specify 046"

**Related**: Quem entrou na conta abre o Ano e lê os doze meses do ano civil, em realizado ou em planejado. A linha de fechamento se chama "Sobra no ano": receitas menos despesas. A competência é a mesma do Resumo e do Orçamento. A aparência vem da história 040. O lugar na casca vem da história 042. O plano de doze meses é o da história 044.

## Referências visuais e de DS
- Identidade: `docs/identidade-visual/decisoes/DECISOES_identidade_visual.md` (seções aplicáveis: 3 Tipografia, 5 Layout, 7 Estados e mensagens, 8 Nomes e microcopy)
- Tela de referência: `docs/identidade-visual/telas-web/web-ano-dados.dc.html`, `web-ano-planejado.dc.html`, `web-ano-vazio.dc.html`
- Componentes do DS usados: `CabecalhoTela`, `Chips`, `TabelaMeses`, `Banner`, `Skeleton`, `EstadoErro`
- Tokens: apenas os de `packages/design-system/src/core/tokens.ts`

## Critérios de aceite visuais
- AC-V1: hierarquia e textos iguais à tela de referência, salvo as diferenças registradas em Assumptions.
- AC-V2: todos os componentes vêm do DS.
- AC-V3: estados (vazio, erro, carregando) iguais aos da referência, salvo as diferenças registradas em Assumptions.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Os doze meses (Priority: P1)

A pessoa abre o Ano no ano civil corrente. O título é "Ano · realizado". Ao lado estão "Ano anterior", o ano ("2026") e "Próximo ano". Duas opções, uma só marcada: Realizado começa marcado. Planejado está disponível. A frase ao lado diz "Valores em R$. Nível: tipo › grupo › item. Lançamentos ficam em Lançamentos."

Quando o ano tem planejamento ou lançamento, o aviso diz "Sobra no ano = receitas − despesas. Não é o mesmo que "Disponível neste mês", que compara o planejado com o gasto do mês."

A tabela tem a legenda "Realizado de 2026". A primeira coluna se chama "Categoria · item". Depois vêm Jan, Fev, Mar, Abr, Mai, Jun, Jul, Ago, Set, Out, Nov, Dez e Total. Os números ficam à direita. A célula não repete "R$": a frase do topo já diz que os valores estão em reais.

As linhas são o tipo, a categoria e o item, os três visíveis ao mesmo tempo. Não há controle para recolher. A ordem dos tipos é Receitas, Despesas fixas, Despesas variáveis e Anuais. Dentro do tipo, as categorias ficam em ordem alfabética do português. Dentro da categoria, os itens também. O tipo usa o nome longo: "Despesas fixas", "Despesas variáveis" e "Anuais", não "Anuais / eventuais".

Cada item ativo aparece, mesmo com o ano em traços. Item arquivado só aparece no realizado se tiver lançamento nesse ano, e no planejado se algum dos doze meses do plano for diferente de zero. Categoria sem item visível não aparece. Tipo sem categoria visível não aparece.

Mês com exatamente zero centavos mostra "—". Qualquer outro valor mostra os reais cortados, sem arredondar e sem o "R$". R$ 6.500,99 mostra "6.500". R$ 0,50 mostra "0". Menos R$ 0,50 mostra "−0". Menos R$ 40,00 mostra "−40". O sinal de menos é o texto do negativo: a cor não é o único aviso. O Total da linha soma os doze meses em centavos e só depois corta os centavos. Doze meses de R$ 0,50 somam R$ 6,00 e o Total mostra "6", mesmo que cada mês mostre "0".

No ano corrente, a coluna do mês de hoje fica destacada e o cabeçalho desse mês inclui "mês atual". Em outro ano, nenhuma coluna é o mês atual. A pessoa não edita célula. Lançamento continua em Lançamentos. Plano continua no Orçamento.

**Why this priority**: Sem os doze meses, o Ano não existe.

**Independent Test**: Com Salário de R$ 6.500,00 só em novembro, ver "6.500" em Nov e no Total, "—" nos outros meses, e o cabeçalho de novembro com "mês atual" quando o ano aberto é o ano de hoje.

**Acceptance Scenarios**:

1. **Given** a pessoa abre o Ano no ano corrente, **When** ela lê o topo, **Then** vê "Ano · realizado", "Ano anterior", o ano, "Próximo ano", Realizado marcado, Planejado disponível e a frase "Valores em R$. Nível: tipo › grupo › item. Lançamentos ficam em Lançamentos."
2. **Given** o ano tem planejamento ou lançamento, **When** a pessoa lê o aviso, **Then** vê "Sobra no ano = receitas − despesas. Não é o mesmo que "Disponível neste mês", que compara o planejado com o gasto do mês."
3. **Given** o realizado de 2026 está na tela, **When** a pessoa lê a tabela, **Then** a legenda é "Realizado de 2026" e as colunas são "Categoria · item", os doze meses e Total.
4. **Given** há Receitas, Despesas fixas, Despesas variáveis e Anuais, **When** a pessoa lê as linhas, **Then** os tipos aparecem nessa ordem, com categoria e item visíveis, sem um controle de recolher. Categorias e itens estão em ordem alfabética do português.
5. **Given** Salário tem R$ 6.500,99 em novembro e zero nos outros meses, **When** a pessoa lê a linha, **Then** novembro e o Total mostram "6.500" e os outros meses mostram "—". A célula não traz "R$".
6. **Given** um mês tem R$ 0,50 e outro tem menos R$ 40,00, **When** a pessoa lê as células, **Then** vê "0" e "−40". Doze meses de R$ 0,50 mostram "0" em cada mês e "6" no Total.
7. **Given** o ano aberto é o ano de hoje e hoje é novembro, **When** a pessoa lê o cabeçalho, **Then** novembro está destacado e inclui "mês atual". **When** o ano aberto é outro, **Then** nenhuma coluna inclui "mês atual".
8. **Given** a tabela está visível, **When** a pessoa procura editar uma célula, **Then** não há edição. A frase do topo continua dizendo que os lançamentos ficam em Lançamentos.

---

### User Story 2 - Realizado, planejado e a sobra (Priority: P1)

Realizado e Planejado trocam a tabela inteira. Os dois não se misturam na mesma célula. O ano aberto permanece. A legenda e o título acompanham a opção: "Ano · planejado" e "Planejado de 2026", ou "Ano · realizado" e "Realizado de 2026".

Planejado mostra os doze valores do plano de cada item. É o único plano da conta. Abrir 2025, 2026 ou 2027 não troca esses doze números. Realizado muda com o ano: entra só o lançamento cuja competência cai naquele ano.

A última linha se chama "Sobra no ano (receitas − despesas)" e fica destacada. Em cada mês, a sobra é a receita daquele mês menos as despesas daquele mês. Despesa é a soma de Despesas fixas, Despesas variáveis e Anuais. A receita é o tipo Receitas. O Total dessa linha é a receita do ano menos a despesa do ano. Receitas de R$ 5.000,00 e despesas de R$ 2.400,00 mostram "2.600" no Total da sobra. Não existe a linha "Total despesas". A linha não se chama "Saldo final" e o número não é o "Disponível neste mês".

A categoria soma os itens visíveis dela. O tipo soma as categorias visíveis dele. Item arquivado com lançamento no ano entra nessa soma do realizado. Item arquivado com algum mês do plano diferente de zero entra no planejado. Esta tela não cria frase de alerta.

**Why this priority**: A sobra é o motivo da tela, e ela só vale se realizado e planejado não se misturam.

**Independent Test**: Receitas R$ 5.000,00 e despesas R$ 2.400,00 no realizado. O Total da linha "Sobra no ano (receitas − despesas)" mostra "2.600". Trocar para Planejado troca todos os números e não deixa um mês de realizado no meio.

**Acceptance Scenarios**:

1. **Given** Realizado está marcado, **When** a pessoa marca Planejado, **Then** o título passa a "Ano · planejado", a legenda passa a "Planejado de {ano}" e cada célula passa a ser do plano. Nenhum mês continua mostrando o realizado.
2. **Given** Salário está planejado em R$ 6.500,00 em novembro, **When** a pessoa abre 2026 e depois 2027 em Planejado, **Then** novembro continua "6.500" nos dois anos.
3. **Given** 2026 tem um lançamento e 2027 não tem, **When** a pessoa compara o Realizado dos dois anos, **Then** o lançamento só aparece em 2026.
4. **Given** no realizado as receitas do ano são R$ 5.000,00 e as despesas são R$ 2.400,00, **When** a pessoa lê a última linha, **Then** o nome é "Sobra no ano (receitas − despesas)", a linha está destacada e o Total é "2.600".
5. **Given** um mês tem receita R$ 1.000,00 e despesa R$ 1.600,00, **When** a pessoa lê a sobra desse mês, **Then** vê "−600", com o menos visível, e não vê "Disponível neste mês" nem "Saldo final".
6. **Given** a tabela está visível, **When** a pessoa procura "Total despesas" ou uma frase de alerta, **Then** não há essa linha e não há alerta desta tela.
7. **Given** a categoria tem dois itens, **When** a pessoa soma os dois, **Then** a linha da categoria é essa soma. A linha do tipo é a soma das categorias dele.

---

### User Story 3 - Trocar o ano e cair no mês certo (Priority: P1)

"Ano anterior" e "Próximo ano" pedem outro ano civil. O ano que está na tela, o título e os números só trocam depois da resposta. Se a troca falha, o ano confirmado permanece e a pessoa vê "Não foi possível carregar o ano." e "Tentar de novo". "Tentar de novo" repete o ano que falhou. Enquanto o ano carrega, a pessoa não vê uma grade de zeros nem a frase de ano sem movimento no lugar do ano que ainda não chegou.

O mês da célula é a competência, a mesma do Resumo e do Orçamento. Com fechamento no dia 25, a compra de cartão em 26/05/2026 entra em junho. Um débito, Pix ou dinheiro nessa data entra em maio. A compra de cartão em 26/12/2026 entra em janeiro de 2027, não em dezembro de 2026. Cada parcela entra no próprio mês: R$ 100,00 em 26/05/2026 em 3× coloca R$ 33,34 em junho, R$ 33,33 em julho e R$ 33,33 em agosto. Junho mostra "33", julho "33", agosto "33" e a soma em centavos continua R$ 100,00 onde esses três meses se encontram no Total do item.

O plano não usa a regra do cartão. O mês do plano é o mês do próprio plano.

**Why this priority**: Sem trocar o ano, o histórico fica preso no ano corrente. Sem a mesma competência, o Ano mente em relação ao mês.

**Independent Test**: Cartão com fechamento 25, compra de R$ 100,00 em 26/05/2026 em 3×. Junho, julho e agosto do realizado recebem essas parcelas, e dezembro de 2026 não recebe a compra de cartão feita em 26/12/2026.

**Acceptance Scenarios**:

1. **Given** 2026 está confirmado, **When** a pessoa pede 2025, **Then** os números de 2026 permanecem até a resposta. **When** a resposta chega, **Then** o ano mostrado é 2025.
2. **Given** a troca para 2025 falha, **When** a pessoa lê a tela, **Then** continua em 2026 e vê "Não foi possível carregar o ano." e "Tentar de novo".
3. **Given** o cartão fecha no dia 25, **When** a pessoa lê o realizado de 2026, **Then** a compra de cartão de 26/05/2026 está em junho e não está em maio. Um débito de 26/05/2026 está em maio.
4. **Given** a mesma compra de cartão é em 26/12/2026, **When** a pessoa lê 2026, **Then** dezembro não a inclui. **When** ela lê 2027, **Then** janeiro a inclui.
5. **Given** R$ 100,00 em 26/05/2026 em 3×, **When** a pessoa lê o item, **Then** junho, julho e agosto mostram "33" e os centavos desses três meses somam R$ 100,00.
6. **Given** o Planejado está marcado, **When** a pessoa compara com o fechamento do cartão, **Then** o mês do plano não se move por causa do cartão.

---

### User Story 4 - Ano sem movimento, valores ocultos e leitura (Priority: P2)

Ano sem planejamento e sem lançamento troca o aviso e o título. O título fica "Ano · {ano}", como "Ano · 2027". O aviso diz "Nenhum planejamento nem lançamento em {ano}." A tabela continua, com os itens ativos e a sobra em "—". Não há um cartão que esconda a grade, e não há ação de copiar o ano anterior nesta tela.

Isso só acontece quando os doze meses de todo plano estão em zero e o ano aberto não tem lançamento. Se há plano e não há lançamento, o Realizado mostra traços, o título continua "Ano · realizado" e o aviso continua sendo o da sobra.

Com os valores ocultos, cada célula que teria número mostra "•••••". O "—" continua "—". Nomes, aviso e mês atual continuam legíveis. O nome anunciado do número é a máscara. Esta tela não oferece outro controle de ocultar: usa a escolha que o Resumo já guardou neste navegador.

Pelo teclado a pessoa alcança "Ano anterior", "Próximo ano", Realizado e Planejado. O foco é visível. A tabela se lê no claro e no escuro. Com preferência de menos movimento, a troca de ano e de opção aparece sem animação. Em 390 px a pessoa rola na horizontal até Dez e Total. Em 1280 px e em 390 px não há botão flutuante nem intervalo livre de datas. Dado de outra conta não aparece.

**Why this priority**: O ano vazio e o valor oculto são estados, não a leitura principal. Sem eles a tela mente quando não há número ou quando a pessoa pediu para esconder.

**Independent Test**: Abrir 2027 sem plano e sem lançamento e ver "Ano · 2027" e "Nenhum planejamento nem lançamento em 2027." Ocultar no Resumo, voltar ao Ano e ver "•••••" onde havia "6.500".

**Acceptance Scenarios**:

1. **Given** todo plano está em zero e 2027 não tem lançamento, **When** a pessoa abre 2027, **Then** o título é "Ano · 2027", o aviso é "Nenhum planejamento nem lançamento em 2027." e a sobra mostra "—". Realizado continua marcado e a legenda continua "Realizado de 2027". Não há botão de copiar o ano anterior.
2. **Given** há plano e 2027 não tem lançamento, **When** a pessoa lê o Realizado de 2027, **Then** o título continua "Ano · realizado", o aviso é o da sobra e os meses do realizado mostram "—".
3. **Given** os valores estão ocultos e novembro é "6.500", **When** a pessoa lê a célula, **Then** vê "•••••". O nome da linha continua visível. Uma célula "—" continua "—".
4. **Given** o foco está no Ano, **When** a pessoa usa o teclado, **Then** ela alcança "Ano anterior", "Próximo ano", Realizado e Planejado. O foco é visível no claro, no escuro e com menos movimento.
5. **Given** a largura é 390 px, **When** a pessoa rola a tabela, **Then** ela alcança Dez e Total. Em 390 px e em 1280 px não há botão flutuante.

---

### Edge Cases

- Valor negativo na sobra, ou numa célula, mostra o menos. A cor não é o único sinal.
- Centavos não aparecem na célula. O Total usa a soma em centavos e só então corta. A soma dos números impressos nos meses pode não bater com o Total impresso.
- Exatamente zero centavos é "—", não "0". R$ 0,50 é "0". Menos R$ 0,50 é "−0".
- Item ativo sem movimento continua na tabela. Item arquivado sem lançamento no ano fica fora do realizado. Item arquivado com plano todo em zero fica fora do planejado.
- Conta só com itens arquivados, sem lançamento no ano e com plano em zero, mostra a frase de ano sem movimento e a linha "Sobra no ano (receitas − despesas)" em traços.
- Ano futuro ou passado sem lançamento não é erro. Se o plano também está em zero, vale a frase de ano sem movimento. Se o plano tem valor, o Planejado mostra esse plano e o Realizado mostra traços.
- Troca de ano que falha não substitui o ano confirmado por zeros nem pela frase de ano vazio.
- Enquanto o primeiro ano carrega, a pessoa não vê "—" como se o ano estivesse vazio e não vê "0" como se houvesse movimento.
- Lançamento de outra conta não entra na soma.
- Mês de hoje só leva "mês atual" quando o ano aberto é o ano de hoje. O mês escolhido no Resumo não escolhe a coluna destacada.
- Não há frase de alerta, não há "Total despesas" e não há edição de célula.
- A pessoa não copia o plano de outro ano nesta tela. O plano não muda ao trocar o ano.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O Ano MUST abrir no ano civil corrente, em Realizado. O título MUST ser "Ano · realizado". MUST haver "Ano anterior", o ano e "Próximo ano", as opções Realizado e Planejado com Realizado marcada, e a frase "Valores em R$. Nível: tipo › grupo › item. Lançamentos ficam em Lançamentos."
- **FR-002**: Quando o ano tem planejamento ou lançamento, o aviso MUST ser "Sobra no ano = receitas − despesas. Não é o mesmo que "Disponível neste mês", que compara o planejado com o gasto do mês."
- **FR-003**: A tabela MUST ter a legenda "{Realizado ou Planejado} de {ano}" e as colunas "Categoria · item", Jan, Fev, Mar, Abr, Mai, Jun, Jul, Ago, Set, Out, Nov, Dez e Total. Tipo, categoria e item MUST estar visíveis ao mesmo tempo, sem controle de recolher. Os tipos MUST ser Receitas, Despesas fixas, Despesas variáveis e Anuais, nessa ordem. Categorias e itens MUST seguir a ordem alfabética do português. A célula MUST NOT ser editável.
- **FR-004**: Mês com exatamente zero centavos MUST mostrar "—". Qualquer outro valor MUST mostrar os reais cortados, sem arredondar e sem "R$". O negativo MUST trazer o sinal de menos. O Total MUST somar os centavos dos doze meses e só então cortar os centavos. Os números MUST ficar à direita.
- **FR-005**: No ano corrente, a coluna do mês de hoje MUST ficar destacada e o cabeçalho MUST incluir "mês atual". Em outro ano, nenhuma coluna MUST ser o mês atual. O mês escolhido no Resumo MUST NOT escolher essa coluna.
- **FR-006**: A última linha MUST se chamar "Sobra no ano (receitas − despesas)" e MUST ficar destacada. Em cada mês, MUST ser a receita menos a soma de Despesas fixas, Despesas variáveis e Anuais. O Total MUST ser a receita do ano menos a despesa do ano. Receitas de R$ 5.000,00 e despesas de R$ 2.400,00 MUST mostrar "2.600". A tela MUST NOT mostrar "Total despesas", "Saldo final", "Disponível neste mês" nem frase de alerta.
- **FR-007**: Trocar Realizado e Planejado MUST substituir todas as células, a legenda e o título, e MUST NOT misturar os dois na mesma célula. O ano MUST permanecer. Planejado MUST usar os doze valores do único plano de cada item e MUST NOT mudar quando o ano muda. Realizado MUST usar só os lançamentos da competência daquele ano.
- **FR-008**: A categoria MUST somar os itens visíveis. O tipo MUST somar as categorias visíveis. Item ativo MUST aparecer mesmo sem movimento. Item arquivado MUST aparecer no realizado só se tiver lançamento no ano aberto, e no planejado só se algum mês do plano for diferente de zero. Esse item MUST entrar na soma. Categoria ou tipo sem linha visível MUST NOT aparecer.
- **FR-009**: "Ano anterior" e "Próximo ano" MUST pedir outro ano civil. O ano confirmado e os números MUST permanecer até a resposta. Falha MUST manter o ano confirmado e MUST mostrar "Não foi possível carregar o ano." e "Tentar de novo". "Tentar de novo" MUST repetir o ano que falhou. Durante o carregamento, a tela MUST NOT mostrar zeros nem a frase de ano sem movimento no lugar do ano que ainda não chegou.
- **FR-010**: A competência MUST ser a mesma do Resumo e do Orçamento. Com fechamento no dia 25, a compra de cartão em 26/05/2026 MUST entrar em junho e a de 26/12/2026 MUST entrar em janeiro de 2027. Débito, Pix e dinheiro em 26/05/2026 MUST entrar em maio. Cada parcela MUST entrar no próprio mês. R$ 100,00 em 3× MUST continuar somando R$ 100,00 em centavos. O plano MUST NOT se mover por causa do cartão.
- **FR-011**: Quando todo plano está em zero e o ano não tem lançamento, o título MUST ser "Ano · {ano}" e o aviso MUST ser "Nenhum planejamento nem lançamento em {ano}." Realizado e Planejado MUST continuar na tela, e a legenda MUST continuar "{modo} de {ano}". A tabela MUST continuar, com "—" onde não há valor. A tela MUST NOT esconder a grade num cartão e MUST NOT oferecer copiar o ano anterior. Se há plano e não há lançamento, o Realizado MUST manter "Ano · realizado", o aviso da sobra e os traços nos meses.
- **FR-012**: Com os valores ocultos, a célula que teria número MUST mostrar "•••••" e o nome anunciado MUST ser a máscara. "—" MUST permanecer. Nomes, aviso e "mês atual" MUST permanecer legíveis. A tela MUST usar a escolha que o Resumo já guardou neste navegador e MUST NOT oferecer outro controle de ocultar.
- **FR-013**: "Ano anterior", "Próximo ano", Realizado e Planejado MUST ter nome e foco visível, e MUST ser alcançáveis pelo teclado. A tela MUST permanecer legível no claro e no escuro. Com menos movimento, a troca de ano e de opção MUST aparecer sem animação. Em 390 px a pessoa MUST alcançar Dez e Total rolando na horizontal. Em 390 px e em 1280 px MUST NOT haver botão flutuante nem intervalo livre de datas.
- **FR-014**: Lançamento de outra conta MUST ser tratado como inexistente. Esta história MUST NOT alterar a conta da fatura, a divisão dos centavos nem o plano de doze meses. MUST NOT criar plano de outro ano. A tabela detalhada do celular fica fora.

### Key Entities

- **Ano civil**: janeiro a dezembro de um ano. O realizado desse ano usa a competência. O planejado usa o único plano de doze meses da conta.
- **Linha da tabela**: um tipo, uma categoria, um item ou a sobra. Cada uma tem doze meses e um total.
- **Célula**: o valor da linha naquele mês, em centavos, mostrado em reais cortados, em traço ou na máscara.
- **Sobra no ano**: receitas menos despesas, no modo que está marcado. Não é o disponível do mês.
- **Plano**: doze valores do item. Não há um plano diferente para cada ano civil.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: No ano corrente, a pessoa vê "Ano · realizado", os doze meses, o Total e "mês atual" na coluna de hoje. Salário de R$ 6.500,99 em novembro aparece como "6.500" em Nov e no Total, e como "—" nos outros meses.
- **SC-002**: Receitas de R$ 5.000,00 e despesas de R$ 2.400,00 mostram "2.600" no Total de "Sobra no ano (receitas − despesas)". Um mês com receita R$ 1.000,00 e despesa R$ 1.600,00 mostra "−600". A tela não mostra "Saldo final", "Disponível neste mês" nem "Total despesas".
- **SC-003**: Trocar para Planejado substitui todas as células. O plano de Salário em novembro permanece "6.500" em 2026 e em 2027. O realizado de um lançamento de 2026 não aparece em 2027.
- **SC-004**: Com fechamento no dia 25, a compra de cartão de 26/05/2026 entra em junho e a de 26/12/2026 entra em janeiro de 2027. R$ 100,00 em 3× a partir de 26/05/2026 mostra "33" em junho, julho e agosto, e os centavos desses três meses somam R$ 100,00. Um débito de 26/05/2026 entra em maio.
- **SC-005**: Pedir outro ano não troca os números antes da resposta. Se a troca falha, o ano confirmado permanece, com "Não foi possível carregar o ano." e "Tentar de novo". 2027 sem plano e sem lançamento mostra "Ano · 2027" e "Nenhum planejamento nem lançamento em 2027.", sem ação de copiar.
- **SC-006**: Com os valores ocultos, "6.500" vira "•••••" e "—" continua "—". Pelo teclado, no claro, no escuro e com menos movimento, a pessoa alcança o ano, Realizado e Planejado. Em 390 px ela alcança Dez e Total. Em 390 px e em 1280 px não há botão flutuante.

## Assumptions

- A aparência vem da história 040. A casca é a história 042. O Ano não pede mês no cabeçalho: pede ano. O endereço continua `/app/ano`. A branch de trabalho é `rebuild-web`. O app do celular fica para a história 055 e não leva esta tabela.
- A spec curta anterior, com status `ready`, pedia a grade, a sobra e a troca de ano, tratava o ano vazio como um cartão sem grade e não descrevia a troca Realizado/Planejado. Esta versão guarda a sobra e a troca de ano, e segue o artboard e o PRD 5.4 na troca de modo e na grade que continua visível no ano vazio.
- O artboard do ano vazio diz "Copie o planejamento de 2026 para começar." Esta história não oferece essa cópia. A decisão D-08 e a história 044 já fecharam: não há plano de outro ano, e a ação de copiar não altera os doze valores. A frase desta tela é só "Nenhum planejamento nem lançamento em {ano}."
- O planejado é o mesmo em qualquer ano civil porque existe um único plano de doze meses. Trocar o ano muda o realizado. Não muda o planejado.
- O artboard de 2027 destaca novembro. Esta história só destaca o mês de hoje, e só quando o ano aberto é o ano de hoje. Novembro num ano que não é o corrente foi tratado como cópia do quadro, não como regra.
- A história 021 e o PRD 5.4 paravam na categoria e não mostravam o item. O artboard desta rebuild mostra tipo, categoria e item, os três abertos. Esta história segue o artboard. Não há controle para recolher.
- A ordem das categorias no Orçamento coloca primeiro quem tem valor no mês. No Ano, categorias e itens ficam em ordem alfabética do português, para a linha não mudar de lugar quando um mês ganha valor.
- O nome do tipo na linha é o do artboard: Receitas, Despesas fixas, Despesas variáveis e Anuais. Não usa "Anuais / eventuais".
- A célula não repete "R$". A frase "Valores em R$." cobre a unidade. Os centavos continuam na soma e só saem na hora de mostrar. Doze vezes R$ 0,50 podem mostrar "0" no mês e "6" no Total.
- A ocultação é a preferência que o Resumo já guarda neste navegador. A máscara na célula é "•••••", sem "R$", porque a célula do Ano também não usa "R$". Esta tela não cria um segundo controle.
- "mês atual" no cabeçalho é o sinal em texto da coluna de hoje. Os selos "Em curso" e "Planejado" continuam pendentes e não entram nesta tela.
- A pessoa vê só o ano da própria conta. Nada nesta tela grava lançamento ou plano.
- A spec anterior, no formato SDD e com status `ready`, está no histórico do git. Esta versão guarda a grade de doze meses, a sobra, a troca Realizado/Planejado e a troca de ano. Verificação em 2026-11-23: o roteiro Playwright de `e2e/ano.spec.ts` passou. O status fica `verified`. AC-V1, AC-V2 e AC-V3 ficam cobertos pela tela no DS, com as diferenças já listadas acima.
