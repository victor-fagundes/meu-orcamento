# Feature Specification: Orçamento web

**Feature Branch**: `044-orcamento-web`

**Created**: 2026-11-22

**Status**: verified

**Input**: User description: "/speckit-specify 044"

**Related**: Quem entrou na conta abre o Orçamento e lê um tipo do mês: categorias recolhíveis e itens, com a frase do consumo ao lado do valor. Cria categoria e item no conteúdo, grava o plano do mês e arquiva o item pelo nome. Renomear e arquivar a categoria ficam em Ajustes. O atalho Gerenciar abre Ajustes já nesse tipo. A aparência vem da história 040. O lugar na casca vem da história 042. O nome da categoria nova segue a história 041.

## Referências visuais e de DS
- Identidade: `docs/identidade-visual/decisoes/DECISOES_identidade_visual.md` (seções aplicáveis: 5 Layout, 6 Formulários e confirmações, 7 Estados e mensagens, 8 Nomes e microcopy)
- Tela de referência: `docs/identidade-visual/telas-web/web-orc-dados.dc.html`, `web-orc-vazio.dc.html`, `web-orc-novo-item.dc.html`, `web-orc-copiar.dc.html`, `web-orc-arquivar.dc.html`, `web-orc-alertas.dc.html`
- Componentes do DS usados: `CabecalhoTela`, `Chips`, `GrupoComMedidor`, `LinhaItem`, `Medidor`, `Botao`, `CartaoVazio`, `FormularioContainer`, `CampoMoeda`, `Switch`, `RodapeAcoes`, `Dialogo`, `Banner`, `Skeleton`, `EstadoErro`
- Tokens: apenas os de `packages/design-system/src/core/tokens.ts`

## Critérios de aceite visuais
- AC-V1: hierarquia e textos iguais à tela de referência.
- AC-V2: todos os componentes vêm do DS.
- AC-V3: estados (vazio, erro, carregando) iguais aos da referência.

## Clarifications

### Session 2026-11-22

- Q: Quando os valores estão ocultos no Resumo, o que o Orçamento deve mostrar? → A: A lista mostra "R$ •••••". O plano aberto mostra o valor para editar. Frases e banner continuam com o texto.
- Q: Ao abrir um tipo, como as categorias aparecem? → A: Todas começam fechadas. Várias podem ficar abertas ao mesmo tempo.
- Q: No Orçamento, a pessoa renomeia ou arquiva uma categoria? → A: Nesta tela a pessoa cria a categoria e o item, e arquiva o item. Renomear e arquivar a categoria ficam em Ajustes.
- Q: Depois de criar um item, a categoria dele fica aberta? → A: A categoria do item abre e o item fica visível. As outras que já estavam abertas continuam abertas.
- Q: Depois de "Salvar plano", o painel fecha? → A: "Salvar plano" fecha o painel e devolve o foco ao item. "Copiar mês anterior", "Aplicar a todos os meses" e "Copiar ano anterior" deixam o painel aberto.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Um tipo do mês (Priority: P1)

A pessoa abre o Orçamento no mês da casca e vê quatro opções, uma só marcada: Receitas, Fixas, Variáveis e Anuais. A lista é só do tipo marcado. O total desse tipo mostra o realizado em reais inteiros e a linha "de R$ x planejados". Os centavos dos dois números do total são cortados, sem arredondar.

Com os valores à vista, cada categoria tem nome, realizado e planejado em reais com centavos, um medidor e uma frase. Ao abrir o tipo, todas começam fechadas. O cabeçalho informa se a categoria está aberta ou fechada. Fechada, a frase e o medidor continuam visíveis. Aberta, aparecem os itens ativos. Abrir uma categoria deixa as outras como estão. Fechar uma só fecha essa. Cada item tem nome, realizado e planejado em reais com centavos, e a mesma família de frase. Tocar o item abre o plano. Arquivar é outro controle e não abre o plano.

Categorias com plano ou realizado maior que zero no mês aberto vêm primeiro. As demais vêm depois. Dentro de cada bloco, a ordem é a alfabética do português. Item arquivado e categoria arquivada não entram na lista.

Ao abrir o Orçamento sem um tipo pedido, Fixas começa marcada e as categorias começam fechadas. Quando o Resumo pede um tipo, esse tipo começa marcado e as categorias dele começam fechadas. Trocar de tipo começa o destino fechado. Trocar o mês troca realizado, planejado, frases e banner, mantém o tipo marcado e mantém abertas as categorias que a pessoa já abriu nesse tipo.

Quando os valores estão ocultos, o total do tipo, o realizado e o planejado de cada categoria e de cada item mostram "R$ •••••". A linha do total fica "de R$ ••••• planejados". O medidor, a frase e o banner continuam visíveis. O nome anunciado dessas cifras é a máscara. O Orçamento usa a escolha que o Resumo já guardou neste navegador e não oferece outro controle de ocultar.

**Why this priority**: Esta é a leitura do mês. Sem o tipo, o total e a lista, a pessoa não acompanha o plano.

**Independent Test**: Com Fixas realizado de R$ 1.960,99 e planejado de R$ 2.080,50, o total mostra R$ 1.960 e "de R$ 2.080 planejados". Abrir Moradia revela Aluguel. Trocar para Variáveis some com Moradia. Ir ao mês seguinte mantém o tipo e mostra os números daquele mês.

**Acceptance Scenarios**:

1. **Given** o Orçamento abre sem um tipo pedido, **When** a pessoa lê as opções, **Then** vê Receitas, Fixas, Variáveis e Anuais, com Fixas marcada, e a lista é só de Fixas.
2. **Given** o Resumo pediu Variáveis, **When** o Orçamento desse mês abre, **Then** Variáveis está marcada e a lista é só de Variáveis.
3. **Given** Fixas tem realizado de R$ 1.960,99 e planejado de R$ 2.080,50, **When** a pessoa lê o total, **Then** o realizado é R$ 1.960 e a linha é "de R$ 2.080 planejados".
4. **Given** a categoria Moradia está fechada, **When** a pessoa lê o cabeçalho, **Then** vê o nome, o realizado e o planejado com centavos, o medidor e a frase, e o cabeçalho informa que está fechada. **When** ela abre Moradia, **Then** os itens ativos aparecem e o cabeçalho informa que está aberta.
5. **Given** Moradia tem plano no mês e Lazer está em zero, **When** a pessoa lê Fixas, **Then** Moradia vem antes de Lazer. Duas categorias no mesmo bloco aparecem em ordem alfabética do português.
6. **Given** Aluguel está arquivado, **When** a pessoa abre a categoria, **Then** Aluguel não aparece. Uma categoria arquivada também não aparece.
7. **Given** Variáveis está marcada, **When** a pessoa vai ao mês seguinte, **Then** Variáveis continua marcada e realizado, planejado, frases e banner são os do mês destino.
8. **Given** os valores estão ocultos e Fixas tem realizado de R$ 1.960,99 e planejado de R$ 2.080,50, **When** a pessoa lê o total, **Then** vê "R$ •••••" e "de R$ ••••• planejados".
9. **Given** os valores estão ocultos, **When** a pessoa lê uma categoria e um item, **Then** o realizado e o planejado são "R$ •••••", e o medidor, a frase e o banner continuam com o texto. O valor real não é anunciado no lugar da máscara.
10. **Given** Fixas tem Moradia e Lazer, **When** o tipo abre, **Then** as duas estão fechadas, com medidor e frase visíveis, e os itens não aparecem.
11. **Given** a pessoa abre Moradia e depois Lazer, **When** ela lê a lista, **Then** as duas continuam abertas. **When** ela fecha Moradia, **Then** só Moradia fecha e Lazer continua aberta.
12. **Given** Moradia está aberta em Fixas, **When** a pessoa marca Variáveis e volta a Fixas, **Then** as categorias de Fixas começam fechadas.
13. **Given** Moradia está aberta, **When** a pessoa vai ao mês seguinte, **Then** Moradia continua aberta e os itens são os desse mês.

---

### User Story 2 - A frase do consumo e o banner (Priority: P1)

Cada categoria e cada item mostram uma frase. A cor não é o único sinal. O medidor enche até 100% e permanece cheio quando o consumo passa de 100%. O percentual da frase, quando existe, é inteiro e corta o que sobra.

Com planejado maior que zero, a frase usa o limite que já vale para aquela categoria. Sem limite próprio, usa o limite da conta. O padrão da conta é 80%.

- Abaixo do limite: "Dentro do planejado".
- Do limite até menos de 100%: "Perto do limite · N%".
- Igual ao planejado: "No limite do planejado".
- Acima do planejado: "Estourou em R$ X", com X igual ao que passou, em reais com centavos.
- Planejado zero: "Sem valor planejado", sem percentual, com gasto ou sem gasto.

O banner fica acima das opções de tipo quando o mês já tem alerta. Ele mostra a frase do alerta mais grave que o mês já calcula. Erro vem antes de atenção. Havendo outros, a linha seguinte diz quantos. Atenção usa o banner de atenção. Erro usa o banner de erro. Sem alerta, o banner não aparece. Trocar o tipo não troca o banner: ele é do mês. Esta história não muda quem entra no alerta nem o limite.

**Why this priority**: O número sozinho não diz se o mês está folgado, perto do limite ou estourado. A frase e o banner dizem.

**Independent Test**: Planejado de R$ 100,00 e realizado de R$ 79,00 mostram "Dentro do planejado". R$ 80,00 mostram "Perto do limite · 80%". R$ 100,00 mostram "No limite do planejado". R$ 105,00 mostram "Estourou em R$ 5,00" e o medidor cheio. Planejado zero mostra "Sem valor planejado". Um mês com um estouro e uma atenção mostra o estouro no banner de erro e "E mais 1 alerta."

**Acceptance Scenarios**:

1. **Given** o limite da conta é 80% e o item tem planejado de R$ 100,00 e realizado de R$ 79,00, **When** a pessoa lê a frase, **Then** ela é "Dentro do planejado" e o medidor marca 79%.
2. **Given** o mesmo limite e realizado de R$ 80,00, **When** a pessoa lê a frase, **Then** ela é "Perto do limite · 80%".
3. **Given** realizado de R$ 87,90 em R$ 100,00 planejados, **When** a pessoa lê a frase, **Then** ela é "Perto do limite · 87%".
4. **Given** realizado igual ao planejado e o planejado é maior que zero, **When** a pessoa lê a frase, **Then** ela é "No limite do planejado" e o medidor está cheio.
5. **Given** planejado de R$ 200,00 e realizado de R$ 500,00, **When** a pessoa lê a frase, **Then** ela é "Estourou em R$ 300,00" e o medidor está cheio.
6. **Given** uma categoria com limite próprio de 50% e realizado de 50% do planejado, **When** a pessoa lê a frase, **Then** ela é "Perto do limite · 50%". Com 49%, a frase é "Dentro do planejado".
7. **Given** planejado de R$ 0,00, com realizado de R$ 0,00 ou de R$ 20,00, **When** a pessoa lê a frase do item, **Then** ela é "Sem valor planejado" e não há percentual.
8. **Given** as despesas do mês passaram do planejado e uma categoria também passou, **When** a pessoa lê o banner, **Then** a frase começa com "Despesas do mês estourou o planejado", o banner é o de erro e a linha é "E mais 1 alerta." A frase da categoria fica entre os demais, não no lugar da mais grave.
9. **Given** o mês tem dois alertas além do mais grave, **When** a pessoa lê o banner, **Then** a linha é "E mais 2 alertas."
10. **Given** o mês não tem alerta, **When** a pessoa abre o Orçamento, **Then** o banner não aparece.
11. **Given** o banner está visível em Fixas, **When** a pessoa marca Receitas, **Then** o banner continua o do mês.

---

### User Story 3 - Criar categoria e item no tipo (Priority: P1)

"Nova categoria" e "Novo item" ficam no topo do conteúdo, antes da lista. Não flutuam. Os dois nascem no tipo que está marcado. Cancelar, toque fora e voltar fecham sem gravar. O foco volta a quem abriu.

Nova categoria pede o nome e segue as regras e as frases da história 041. Nome vazio, nome longo, quebra de linha e nome repetido no tipo não gravam. O nome guardado perde os espaços das pontas.

Novo item pede o nome e a categoria. A categoria oferece as categorias ativas do tipo e aceita um nome novo. Nome novo de categoria cria a categoria na mesma gravação. Se essa gravação não se completa, nem o item nem a categoria ficam pela metade. Nome de categoria que já existe ativa, mudando só maiúsculas ou acento, usa a categoria que já existe. Nome vazio de item não grava e a frase é "Informe o nome do item." Nome de item com mais de 80 caracteres não grava e a frase é "Categoria ou nome muito longo." Depois de gravar o item, a categoria dele fica aberta e o item fica visível. As categorias que já estavam abertas continuam abertas. Uma categoria criada sozinha, sem item, entra fechada. Nesta tela não há renomear nem arquivar categoria. Essas duas ações ficam em Ajustes.

**Why this priority**: A lista só cresce por estes dois gestos. Sem eles, o tipo vazio não tem plano.

**Independent Test**: Em Variáveis, criar a categoria Streaming e o item Netflix dentro dela. Os dois aparecem em Variáveis e não aparecem em Fixas. Cancelar no meio não deixa nome gravado.

**Acceptance Scenarios**:

1. **Given** Variáveis está marcada, **When** a pessoa procura criar, **Then** "Nova categoria" e "Novo item" estão no topo do conteúdo e não flutuam sobre a página.
2. **Given** o formulário de nova categoria está aberto, **When** a pessoa cancela, toca fora ou volta, **Then** nada é gravado e o foco volta a "Nova categoria".
3. **Given** nenhuma categoria ativa chamada Streaming em Variáveis, **When** a pessoa cria "  Streaming  ", **Then** a categoria guardada se chama "Streaming", aparece na lista de Variáveis e entra fechada.
4. **Given** Streaming já ativa em Variáveis, **When** a pessoa cria "streaming", **Then** nada é gravado e a frase é "Escolha outro nome. Já existe uma categoria com esse nome neste tipo."
5. **Given** o nome da categoria é vazio, **When** a pessoa cria a categoria, **Then** nada é gravado e a frase é "Informe o nome da categoria." Com 41 caracteres, a frase é "Use no máximo 40 caracteres." Com quebra de linha, a frase é "Use o nome em uma linha só."
6. **Given** Streaming está ativa e Lazer já está aberta, **When** a pessoa cria o item "  Netflix  " na categoria Streaming, **Then** o item guardado se chama "Netflix", Streaming fica aberta, Netflix fica visível e Lazer continua aberta.
7. **Given** nenhuma categoria ativa chamada Streaming, **When** a pessoa cria o item Netflix com a categoria "Streaming", **Then** o item e a categoria ativa nascem juntos, Streaming fica aberta e Netflix fica visível. Se a gravação falha, nenhum dos dois permanece.
8. **Given** o nome do item é vazio, **When** a pessoa tenta criar, **Then** nada é gravado e a frase é "Informe o nome do item."
9. **Given** o nome do item tem 81 caracteres, **When** a pessoa tenta criar, **Then** nada é gravado e a frase é "Categoria ou nome muito longo." Um nome de 80 caracteres é aceito.
10. **Given** a gravação falha com os campos preenchidos, **When** a pessoa lê o formulário, **Then** a frase é "Não foi possível salvar. Os campos continuam preenchidos."
11. **Given** a lista de Variáveis tem a categoria Streaming, **When** a pessoa procura renomear ou arquivar Streaming, **Then** essas ações não estão na tela. Em Ajustes, Categorias e itens, elas continuam disponíveis.

---

### User Story 4 - Gravar o plano do mês (Priority: P1)

Tocar o item abre o plano dele num painel. A partir de 720 px o painel mede 460 px de largura. Abaixo de 720 px ele usa a largura do conteúdo. O título é o nome do item. O campo mostra o valor já gravado do mês aberto, em reais com centavos. O interruptor "Aplicar também aos próximos meses" começa desligado.

"Salvar plano" grava o valor do mês aberto, fecha o painel e devolve o foco ao item. Com o interruptor ligado, grava esse mesmo valor também em cada mês seguinte do ano. Os meses anteriores não mudam. "Cancelar", toque fora e voltar fecham sem gravar e também devolvem o foco ao item.

"Copiar mês anterior" grava no mês aberto o valor já salvo do mês anterior do mesmo ano e deixa o painel aberto. "Aplicar a todos os meses" grava o valor que está no campo nos doze meses e deixa o painel aberto. "Copiar ano anterior" mostra "Não há plano do ano anterior para copiar.", não altera nenhum dos doze valores e deixa o painel aberto.

Valor negativo ou com mais de duas casas decimais não grava. Zero grava. A conta guardada é exata até o centavo.

**Why this priority**: Ler o consumo sem poder ajustar o plano deixa a tela só de consulta. O plano é o que a pessoa veio corrigir.

**Independent Test**: No item Mercado, em novembro, gravar R$ 400,00 com o interruptor desligado e ver só novembro mudar. Gravar R$ 400,00 com o interruptor ligado e ver novembro e dezembro nesse valor, com janeiro a outubro intactos. "Copiar ano anterior" deixa os doze valores como estavam.

**Acceptance Scenarios**:

1. **Given** Mercado tem R$ 350,00 em novembro, **When** a pessoa abre o plano, **Then** o título é "Mercado", o campo mostra R$ 350,00 e o interruptor "Aplicar também aos próximos meses" está desligado. Em 1280 px o painel mede 460 px. Em 390 px ele usa a largura do conteúdo.
2. **Given** o campo está em R$ 400,00 e o interruptor está desligado, **When** a pessoa salva, **Then** só o mês aberto passa a R$ 400,00, os outros onze meses permanecem, o painel fecha e o foco volta ao item.
3. **Given** o mês aberto é novembro, o campo está em R$ 400,00 e o interruptor está ligado, **When** a pessoa salva, **Then** novembro e dezembro ficam em R$ 400,00, janeiro a outubro permanecem, o painel fecha e o foco volta ao item.
4. **Given** o mês aberto é dezembro e o interruptor está ligado, **When** a pessoa salva R$ 400,00, **Then** só dezembro muda, o painel fecha e o foco volta ao item.
5. **Given** o plano está aberto com uma alteração ainda não salva, **When** a pessoa cancela, toca fora ou volta, **Then** os doze valores permanecem e o foco volta ao item.
6. **Given** outubro tem R$ 300,00 gravados e novembro é o mês aberto, **When** a pessoa aciona "Copiar mês anterior", **Then** novembro passa a R$ 300,00, os outros meses permanecem e o painel continua aberto.
7. **Given** o mês aberto é janeiro, **When** a pessoa aciona "Copiar mês anterior", **Then** a frase é "Janeiro não tem mês anterior neste ano.", nenhum valor muda e o painel continua aberto.
8. **Given** o campo está em R$ 650,00, **When** a pessoa aciona "Aplicar a todos os meses", **Then** os doze meses ficam em R$ 650,00 e o painel continua aberto.
9. **Given** qualquer plano, **When** a pessoa aciona "Copiar ano anterior", **Then** a frase é "Não há plano do ano anterior para copiar.", os doze valores permanecem e o painel continua aberto.
10. **Given** o campo está vazio, negativo ou com três casas decimais, **When** a pessoa salva, copia ou aplica a todos, **Then** nada é gravado. Vazio mostra "Informe o valor do plano." Negativo mostra "Informe um valor maior ou igual a zero." Três casas mostram "Use no máximo duas casas decimais."
11. **Given** o campo está em R$ 0,00, **When** a pessoa salva, **Then** o mês aberto fica em R$ 0,00, o painel fecha e o foco volta ao item.
12. **Given** a gravação falha, **When** a pessoa lê o painel, **Then** a frase é "Não foi possível salvar. Os campos continuam preenchidos." e os doze valores já gravados permanecem.
13. **Given** os valores estão ocultos e Mercado tem R$ 350,00 em novembro, **When** a pessoa abre o plano, **Then** o campo mostra R$ 350,00. Ao fechar, a lista volta a mostrar "R$ •••••".

---

### User Story 5 - Arquivar o item pelo nome (Priority: P1)

Arquivar pede confirmação com o nome do item. O título é "Arquivar Mercado?" quando o item se chama Mercado. A frase é "Ele sai do Orçamento e de novos lançamentos. Os lançamentos antigos continuam." Só o botão Arquivar conclui. Cancelar, toque fora, voltar e Esc fecham sem arquivar. O foco entra no diálogo e volta ao controle que o abriu.

Depois de arquivar, o item sai da lista do Orçamento e dos novos lançamentos. Os lançamentos antigos continuam, no mesmo item, valor e competência. Nesta tela não há desarquivar, reordenar, renomear categoria nem arquivar categoria.

**Why this priority**: Arquivar é o jeito de tirar um item do plano sem apagar o histórico. O nome na pergunta evita arquivar o item errado.

**Independent Test**: Arquivar Mercado, ler o título "Arquivar Mercado?" e a frase de consequência, confirmar, e ver Mercado fora da lista. Um lançamento antigo de Mercado continua na lista de lançamentos. Cancelar deixa Mercado na lista.

**Acceptance Scenarios**:

1. **Given** o item Mercado está na lista, **When** a pessoa aciona Arquivar, **Then** o título é "Arquivar Mercado?" e a frase é "Ele sai do Orçamento e de novos lançamentos. Os lançamentos antigos continuam."
2. **Given** o diálogo está aberto, **When** a pessoa confirma Arquivar, **Then** Mercado sai do Orçamento e dos novos lançamentos. Um lançamento antigo de Mercado continua, com o mesmo valor e a mesma competência.
3. **Given** o diálogo está aberto, **When** a pessoa cancela, toca fora, volta ou pressiona Esc, **Then** Mercado continua na lista e o foco volta ao controle Arquivar.
4. **Given** a lista do Orçamento, **When** a pessoa procura desarquivar, reordenar, renomear uma categoria ou arquivar uma categoria, **Then** essas ações não estão na tela. Arquivar continua disponível no item.

---

### User Story 6 - Gerenciar, vazio, carregando e erro (Priority: P1)

"Gerenciar" fica no cabeçalho do tipo e abre Ajustes em Categorias e itens, já no tipo que está na tela.

Sem item ativo no tipo, a pessoa vê o título "Nenhum item neste tipo", a frase "Crie um item para planejar o mês." e a ação "Novo item". "Nova categoria" e "Novo item" do topo continuam.

Enquanto o mês carrega, a tela não mostra R$ 0,00 no lugar dos números. Se o carregamento falha, a pessoa vê "Não foi possível carregar o mês." e "Tentar de novo", e não vê totais como se o mês tivesse carregado.

**Why this priority**: O tipo vazio, a espera e a falha são o que a pessoa encontra antes de ter uma lista. Gerenciar é o caminho para o cadastro completo.

**Independent Test**: Abrir um tipo sem item e ver o cartão com "Novo item". Durante o carregamento, não ver R$ 0,00. Na falha, ver a frase e "Tentar de novo". Em Fixas, Gerenciar abre Categorias e itens já em Fixas.

**Acceptance Scenarios**:

1. **Given** Fixas está marcada, **When** a pessoa aciona "Gerenciar", **Then** abre Ajustes em Categorias e itens, já filtrado em Fixas.
2. **Given** o tipo marcado não tem item ativo, **When** a pessoa lê a lista, **Then** vê "Nenhum item neste tipo", "Crie um item para planejar o mês." e "Novo item". As ações do topo continuam.
3. **Given** o mês ainda está carregando, **When** a pessoa olha o total, **Then** não vê R$ 0,00 como se o mês já tivesse carregado.
4. **Given** o carregamento falha, **When** a pessoa lê a tela, **Then** vê "Não foi possível carregar o mês." e "Tentar de novo", e não vê totais do mês.

---

### User Story 7 - Teclado, foco e aparência (Priority: P1)

Cada controle tem nome. O foco é visível. Pelo teclado a pessoa alcança as quatro opções, Gerenciar, Nova categoria, Novo item, os cabeçalhos de categoria, os itens e Arquivar. No painel e no diálogo, o foco permanece até fechar e volta a quem abriu.

A tela continua legível no claro e no escuro. Com preferência de menos movimento, painel e diálogo aparecem sem animação.

O Orçamento pede a navegação de mês. Não há intervalo livre de datas. Não há botão flutuante de criar.

**Why this priority**: Sem foco e sem teclado, criar, gravar e arquivar ficam pela metade. O mês é o que troca os números.

**Independent Test**: Percorrer tipo, Gerenciar, um item, o plano e o diálogo de arquivar pelo teclado, no claro, no escuro e com menos movimento. Em 390 px e em 1280 px, não há botão flutuante.

**Acceptance Scenarios**:

1. **Given** o Orçamento está aberto, **When** a pessoa percorre os controles, **Then** cada um tem nome e o foco é visível.
2. **Given** o foco está na lista, **When** a pessoa usa o teclado, **Then** ela alcança as quatro opções, Gerenciar, Nova categoria, Novo item, os cabeçalhos, os itens e Arquivar.
3. **Given** o plano ou o diálogo de arquivar está aberto, **When** a pessoa percorre o teclado, **Then** o foco permanece ali até fechar e, ao fechar, volta a quem abriu.
4. **Given** a aparência está clara, **When** a pessoa troca para escura, **Then** o total, as frases, o banner e os formulários continuam legíveis.
5. **Given** a pessoa prefere menos movimento, **When** ela abre o plano ou o diálogo, **Then** eles aparecem sem animação.
6. **Given** o Orçamento em 390 px ou em 1280 px, **When** a pessoa procura um intervalo de datas ou um botão flutuante de criar, **Then** nenhum dos dois está na tela.

---

### Edge Cases

- No último mês do ano, "Aplicar também aos próximos meses" grava só esse mês.
- Em janeiro, "Copiar mês anterior" não grava e explica que não há mês anterior neste ano.
- "Copiar ano anterior" nunca altera valor nesta versão, mesmo com alteração ainda não salva no campo. O painel continua aberto.
- "Salvar plano" fecha o painel e devolve o foco ao item. "Copiar mês anterior" e "Aplicar a todos os meses" gravam e deixam o painel aberto. Valor inválido ou falha de gravação também deixam o painel aberto.
- "Copiar mês anterior" usa o valor já gravado do mês anterior. Uma digitação ainda não salva no campo não entra nessa cópia.
- "Aplicar a todos os meses" usa o valor que está no campo. Com o campo inválido, os doze valores permanecem.
- Planejado zero e realizado zero mostram "Sem valor planejado" e não entram no banner.
- Planejado zero e realizado maior que zero mostram "Sem valor planejado" na linha, sem percentual. O banner, se esse for o primeiro erro do mês, mostra "{categoria}: gasto sem orçamento planejado".
- Se as despesas do mês só estão em atenção e uma categoria estourou, o banner mostra o estouro da categoria, não a atenção do mês.
- O medidor não passa de 100%, mesmo quando a frase diz que estourou.
- Uma categoria com limite próprio usa esse limite na frase. As outras usam o limite da conta.
- Trocar o tipo não troca o banner do mês e não mostra item de outro tipo.
- Nesta tela não há renomear nem arquivar categoria. As duas ações ficam em Ajustes, Categorias e itens.
- Depois de gravar um item, a categoria dele fica aberta e o item fica visível. Categorias que já estavam abertas continuam abertas. Uma categoria criada sem item entra fechada.
- Categoria ou item de outra conta não aparecem e não são alterados.
- Nome de item perde espaços das pontas e espaços repetidos no meio. "  Netflix  " fica "Netflix".
- Dois itens ativos podem ter o mesmo nome. A confirmação de arquivar usa o nome do item acionado.
- Tipo sem item ativo mostra o cartão vazio, mesmo que o mês tenha movimento em outro tipo.
- Falha ao salvar plano, categoria ou item mantém o que já estava gravado e mantém os campos preenchidos.
- Abaixo de 720 px o painel do plano usa a largura do conteúdo. A partir de 720 px mede 460 px. Em 719 px vale a largura do conteúdo. Em 720 px vale 460 px.
- Com os valores ocultos, a lista usa "R$ •••••" e o plano aberto mostra o valor do mês. A frase, inclusive "Estourou em R$ X", e o banner continuam com os reais. O medidor continua visível.
- Ao abrir um tipo, toda categoria dele começa fechada. Abrir uma não fecha outra. Fechar uma só fecha essa. Trocar de tipo recomeça fechado. Trocar o mês mantém as que já estavam abertas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O Orçamento MUST oferecer quatro opções, uma só marcada: Receitas, Fixas, Variáveis e Anuais. A lista MUST ser só do tipo marcado.
- **FR-002**: Sem um tipo pedido, Fixas MUST começar marcada. Quando outra tela pede um tipo, esse tipo MUST começar marcado.
- **FR-003**: Com os valores à vista, o total do tipo MUST mostrar o realizado em reais inteiros e "de R$ x planejados". Os centavos dos dois MUST ser cortados, sem arredondar. Realizado de R$ 1.960,99 e planejado de R$ 2.080,50 MUST aparecer como R$ 1.960 e "de R$ 2.080 planejados".
- **FR-004**: Com os valores à vista, cada categoria MUST mostrar nome, realizado e planejado em reais com centavos, medidor e frase. Ao abrir o tipo, todas as categorias MUST começar fechadas. O cabeçalho MUST informar se está aberta ou fechada. Fechada, a frase e o medidor MUST continuar visíveis e os itens MUST NOT aparecer. Aberta, MUST mostrar os itens ativos. Abrir uma categoria MUST NOT fechar as outras. Fechar uma MUST fechar só essa. Com os valores ocultos, o realizado e o planejado da categoria e do item MUST mostrar "R$ •••••", e o medidor e a frase MUST permanecer.
- **FR-005**: Categorias com plano ou realizado maior que zero no mês aberto MUST vir primeiro. As demais MUST vir depois. Dentro de cada bloco, a ordem MUST ser a alfabética do português. Item arquivado e categoria arquivada MUST NOT aparecer.
- **FR-006**: Trocar o mês MUST atualizar realizado, planejado, frases e banner, MUST manter o tipo marcado e MUST manter abertas as categorias que a pessoa já abriu nesse tipo. Trocar de tipo MUST começar as categorias do destino fechadas. Voltar a um tipo MUST começar as categorias dele fechadas.
- **FR-007**: Com planejado maior que zero, a frase MUST ser "Dentro do planejado" abaixo do limite, "Perto do limite · N%" do limite até menos de 100%, "No limite do planejado" quando o realizado iguala o planejado, e "Estourou em R$ X" quando o realizado passa do planejado. N MUST ser inteiro, cortando o que sobra. X MUST ser o excesso em reais com centavos. O limite MUST ser o da categoria, quando ela tem um, e o da conta nos outros casos.
- **FR-008**: Com planejado zero, a frase MUST ser "Sem valor planejado", sem percentual, haja gasto ou não.
- **FR-009**: O medidor MUST encher na proporção do consumo até 100% e MUST permanecer cheio quando o consumo passa de 100%.
- **FR-010**: Havendo alerta no mês, o banner MUST aparecer acima das opções de tipo. Ele MUST mostrar o alerta de erro que o mês lista primeiro; se não houver erro, MUST mostrar o primeiro alerta de atenção. Atenção MUST usar o banner de atenção. Erro MUST usar o banner de erro. Com mais alertas, MUST mostrar "E mais 1 alerta." ou "E mais N alertas." Sem alerta, o banner MUST NOT aparecer. Trocar o tipo MUST NOT trocar o banner.
- **FR-011**: Esta história MUST NOT alterar quem entra no alerta, o limite, nem a regra de competência.
- **FR-012**: "Nova categoria" e "Novo item" MUST ficar no topo do conteúdo, no tipo marcado, e MUST NOT flutuar. Cancelar, toque fora e voltar MUST fechar sem gravar e MUST devolver o foco a quem abriu.
- **FR-013**: Nova categoria MUST seguir as regras e as frases da história 041. Novo item com categoria ainda inexistente MUST criar a categoria ativa na mesma gravação. Se a gravação não se completa, item e categoria MUST NOT ficar pela metade. Depois de gravar o item, a categoria dele MUST ficar aberta e o item MUST ficar visível. Categorias que já estavam abertas MUST continuar abertas. Uma categoria criada sem item MUST entrar fechada.
- **FR-014**: Nome de item vazio MUST ser recusado com "Informe o nome do item." Nome de item com mais de 80 caracteres MUST ser recusado com "Categoria ou nome muito longo." Nome de 80 caracteres MUST ser aceito. O nome guardado MUST perder espaços das pontas e espaços repetidos no meio.
- **FR-015**: Falha ao salvar MUST mostrar "Não foi possível salvar. Os campos continuam preenchidos." e MUST manter o que já estava gravado.
- **FR-016**: O plano MUST abrir com o nome do item, o valor já gravado do mês aberto em reais com centavos, e o interruptor "Aplicar também aos próximos meses" desligado. Isso MUST valer também com os valores ocultos na lista. A partir de 720 px o painel MUST medir 460 px. Abaixo de 720 px MUST usar a largura do conteúdo.
- **FR-017**: "Salvar plano" MUST gravar o valor no mês aberto, fechar o painel e devolver o foco ao item. Com o interruptor ligado, MUST gravar esse valor também em cada mês seguinte do mesmo ano. Meses anteriores MUST permanecer. Cancelar, toque fora e voltar MUST fechar sem gravar e devolver o foco ao item. "Copiar mês anterior", "Aplicar a todos os meses" e "Copiar ano anterior" MUST deixar o painel aberto. Valor inválido ou falha de gravação MUST deixar o painel aberto.
- **FR-018**: "Copiar mês anterior" MUST gravar no mês aberto o valor já salvo do mês anterior do mesmo ano. Em janeiro MUST mostrar "Janeiro não tem mês anterior neste ano." e MUST NOT alterar valor.
- **FR-019**: "Aplicar a todos os meses" MUST gravar o valor do campo nos doze meses.
- **FR-020**: "Copiar ano anterior" MUST mostrar "Não há plano do ano anterior para copiar." e MUST NOT alterar nenhum dos doze valores.
- **FR-021**: Valor vazio, negativo ou com mais de duas casas decimais MUST NOT ser gravado, com as frases "Informe o valor do plano.", "Informe um valor maior ou igual a zero." e "Use no máximo duas casas decimais." Zero MUST ser aceito. O valor gravado MUST ser exato até o centavo.
- **FR-022**: Arquivar MUST pedir "Arquivar {nome}?" e a frase "Ele sai do Orçamento e de novos lançamentos. Os lançamentos antigos continuam." Só a confirmação MUST arquivar. Cancelar, toque fora, voltar e Esc MUST NOT arquivar. O item MUST sair do Orçamento e dos novos lançamentos. Os lançamentos antigos MUST permanecer no mesmo item, valor e competência.
- **FR-023**: Esta tela MUST NOT oferecer desarquivar, reordenar, renomear categoria nem arquivar categoria. Arquivar MUST existir no item. Renomear e arquivar categoria MUST continuar em Ajustes, Categorias e itens.
- **FR-024**: "Gerenciar" MUST abrir Ajustes em Categorias e itens, já no tipo marcado.
- **FR-025**: Sem item ativo no tipo, a tela MUST mostrar "Nenhum item neste tipo", "Crie um item para planejar o mês." e a ação "Novo item".
- **FR-026**: Enquanto o mês carrega, a tela MUST NOT mostrar R$ 0,00 no lugar dos números. Se o carregamento falha, a pessoa MUST ver "Não foi possível carregar o mês." e "Tentar de novo", e MUST NOT ver totais como se o mês tivesse carregado.
- **FR-027**: Cada controle MUST ter nome. O foco MUST ser visível. Opções de tipo, Gerenciar, Nova categoria, Novo item, cabeçalhos, itens e Arquivar MUST ser alcançáveis pelo teclado. No painel e no diálogo, o foco MUST permanecer até fechar e MUST voltar a quem abriu. A tela MUST permanecer legível no claro e no escuro. Com menos movimento, painel e diálogo MUST aparecer sem animação.
- **FR-028**: O Orçamento MUST pedir a navegação de mês. MUST NOT oferecer intervalo livre de datas nem botão flutuante de criar.
- **FR-029**: Categoria, item e plano de outra conta MUST ser tratados como inexistentes.
- **FR-030**: Quando os valores estão ocultos, o total do tipo MUST mostrar "R$ •••••" e "de R$ ••••• planejados". O nome anunciado dessas cifras, e o do realizado e do planejado de categoria e item, MUST ser a máscara. O medidor, as frases e o banner MUST permanecer com o texto. Ao fechar o plano, a lista MUST voltar a mostrar a máscara. Esta tela MUST usar a escolha que o Resumo já guardou neste navegador e MUST NOT oferecer outro controle de ocultar.

### Key Entities

- **Tipo**: uma das quatro opções do mês (Receitas, Fixas, Variáveis, Anuais). A lista e a criação usam o tipo marcado. O banner não usa.
- **Categoria**: agrupamento de itens dentro de um tipo. Na lista, mostra realizado, planejado, medidor e frase. Ao abrir o tipo, começa fechada. Várias podem ficar abertas. Arquivada não aparece.
- **Item**: gasto ou receita planejada, com doze valores no ano, um por mês. Na lista, mostra realizado, planejado e frase. O lançamento aponta para o item.
- **Plano do mês**: o valor previsto do item naquele mês. A tela lê e grava em reais. O valor guardado é exato até o centavo. Zero é um plano.
- **Alerta do mês**: atenção ou erro que a conta do mês já produz. O banner mostra o mais grave e a quantidade dos demais. A frase da linha é outra frase, a do consumo do item ou da categoria.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em Fixas, realizado de R$ 1.960,99 e planejado de R$ 2.080,50 aparecem como R$ 1.960 e "de R$ 2.080 planejados". As quatro opções estão na tela e só o tipo marcado lista categorias. Ao abrir o tipo, as categorias estão fechadas. Abrir duas deixa as duas abertas. Trocar de tipo recomeça fechado. Trocar o mês mantém o tipo, mantém as categorias abertas e troca os números.
- **SC-002**: Com limite de 80%, R$ 79,00 de R$ 100,00 mostram "Dentro do planejado"; R$ 80,00 mostram "Perto do limite · 80%"; R$ 87,90 mostram "Perto do limite · 87%"; R$ 100,00 mostram "No limite do planejado"; R$ 500,00 de R$ 200,00 mostram "Estourou em R$ 300,00" com o medidor cheio. Planejado zero mostra "Sem valor planejado", sem percentual.
- **SC-003**: Um mês com um estouro e uma atenção mostra a frase de estouro no banner de erro e "E mais 1 alerta." Um mês sem alerta não mostra banner. Trocar o tipo deixa o banner do mês.
- **SC-004**: A pessoa cria uma categoria, cria um item nela, grava o plano do mês e arquiva o item pelo diálogo com o nome, numa só visita. Ao gravar o item, a categoria dele fica aberta e o item fica visível, e outra categoria que já estava aberta continua aberta. Cancelar em qualquer um desses passos não grava. Na lista do Orçamento não há renomear nem arquivar categoria.
- **SC-005**: Em novembro, salvar R$ 400,00 com o interruptor desligado muda só novembro, fecha o painel e devolve o foco ao item. Com o interruptor ligado, novembro e dezembro ficam em R$ 400,00 e janeiro a outubro permanecem. "Aplicar a todos os meses" com R$ 650,00 deixa os doze meses nesse valor e o painel aberto. "Copiar ano anterior" não muda nenhum valor e deixa o painel aberto.
- **SC-006**: Arquivar Mercado pede "Arquivar Mercado?" e a frase de consequência. Depois de confirmar, Mercado sai do Orçamento e dos novos lançamentos, e um lançamento antigo continua. Cancelar mantém Mercado na lista.
- **SC-007**: Um tipo sem item mostra o cartão com "Novo item". Durante o carregamento a pessoa não vê R$ 0,00. Na falha, vê "Não foi possível carregar o mês." e nenhum total falso. Gerenciar, a partir de Fixas, abre Categorias e itens já em Fixas.
- **SC-008**: Pelo teclado, no claro, no escuro e com menos movimento, a pessoa alcança tipo, Gerenciar, criação, item, plano e arquivar. O foco volta a quem abriu o painel ou o diálogo. Em 390 px e em 1280 px não há intervalo de datas nem botão flutuante. Em 1280 px o painel do plano mede 460 px.
- **SC-009**: Com os valores ocultos, o total de R$ 1.960,99 realizado e R$ 2.080,50 planejados aparece como "R$ •••••" e "de R$ ••••• planejados". Categoria e item usam a mesma máscara. A frase e o banner continuam legíveis. Abrir o plano de novembro mostra R$ 350,00 quando esse é o valor gravado. Ao fechar, a lista volta à máscara.

## Assumptions

- A aparência vem da história 040. A casca é a história 042. O Orçamento pede mês no cabeçalho. O botão flutuante continua de fora. O endereço continua `/app/orcamento`.
- A spec anterior, no formato SDD e com status `ready`, está no commit `9e4f072`. Esta versão guarda as mesmas regras em linguagem de produto: um tipo por vez, total com "de R$ x planejados", categorias recolhíveis, frase do consumo, Gerenciar, criar no topo, plano com o interruptor e as três cópias, arquivar pelo nome, vazio, banner, carregando e erro. Verificação em 2026-11-23: o roteiro Playwright de `e2e/orcamento.spec.ts` passou. O status fica `verified`.
- Os nomes curtos das opções são os do seletor já definido e os mesmos dos cartões do Resumo: Receitas, Fixas, Variáveis e Anuais. O cartão do Resumo abre este mês já no tipo daquele cartão. Sem tipo pedido, Fixas começa marcada, como a tela já faz hoje.
- O total do tipo corta centavos, no mesmo corte dos cartões do Resumo. Categoria e item mostram centavos, porque a frase de estouro também mostra centavos.
- A frase da linha é a do consumo: "Dentro do planejado", "Perto do limite · N%", "No limite do planejado", "Estourou em R$ X" e "Sem valor planejado". Ela substitui, na linha, as frases antigas "Ainda pode gastar", "Orçamento atingido" e "Gasto sem orçamento planejado". O banner não muda: continua a frase que o mês já calcula, a mais grave, com a contagem dos demais.
- O banner fica nesta tela. No Resumo, a história 043 deixou os alertas só no sininho. Aqui a lista não é reaberta; o banner mostra o alerta que o mês lista primeiro entre os de erro, ou o primeiro se só houver atenção, e diz quantos restam, sem apontar para o sininho. A frase do banner continua a que o mês já calcula. A frase da linha é a frase nova do consumo.
- A ordem das categorias é a que a tela já usa: com valor no mês primeiro, depois as zeradas, cada bloco em ordem alfabética do português.
- Ao abrir um tipo, as categorias começam fechadas. Várias podem ficar abertas. Trocar de tipo recomeça fechado. Trocar o mês, no mesmo tipo, mantém as que a pessoa abriu.
- Criar categoria nesta tela usa o tipo marcado e as frases da história 041. Criar categoria de outro tipo é trocar a opção, ou usar Ajustes. Renomear e arquivar a categoria ficam em Ajustes. A tela de Categorias e itens é a história 047. Esta história só leva até lá, já no tipo marcado.
- O plano continua com doze valores no ano. O painel edita o mês aberto. "Aplicar também aos próximos meses" copia o valor do campo para os meses seguintes do mesmo ano, no momento de salvar. "Salvar plano" fecha o painel. "Aplicar a todos os meses" e "Copiar mês anterior" gravam e deixam o painel aberto. "Copiar mês anterior" usa o mês aberto, não o mês civil de hoje.
- D-08 permanece: não há plano de outro ano. A frase desta tela é "Não há plano do ano anterior para copiar."
- Reordenar e desarquivar continuam fora. Arquivar não apaga lançamento.
- A janela estreita do computador usa esta tela. O app do celular fica fora.
- A pessoa vê e altera só o mês da própria conta.
- A ocultação é a preferência que o Resumo já guarda neste navegador. A máscara é "R$ •••••". Com ela ligada, a lista esconde os reais e o plano aberto mostra o valor do mês. Frase, banner e medidor permanecem. Esta tela não cria um segundo controle.
