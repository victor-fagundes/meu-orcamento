# Research: Ano web

## 1. Onde a tela está hoje

**Decision**: `src/app/app/ano/page.tsx` deixa de montar `AnoView`. Monta `AnoTela` com as duas grades do ano, o flag de vazio e a data de hoje. O arquivo `ano-view.tsx` fica no repositório até a história 049.

**Rationale**: A página já exige sessão e lê `?ano=`. O miolo atual usa Material, chama a linha de "Saldo final (R − despesas)", mistura o plano em qualquer ano sem dizer isso, e não tem o aviso da sobra nem o ano vazio da spec. Apagar o arquivo agora é a história 049.

**Alternatives considered**: Estilizar `AnoView` até parecer a grade nova. Rejeitado: o Material e o rótulo antigo continuariam no mesmo componente. Criar outra rota. Rejeitado: o endereço permanece `/app/ano`.

## 2. Cabeçalho da casca e o ano no conteúdo

**Decision**: `casca-abas.ts` continua com `pedeMes: false` no Ano. O cabeçalho da casca mostra "Ano" e não mostra "Mês anterior" nem "Próximo ano". No conteúdo, o título é "Ano · realizado", "Ano · planejado" ou, no vazio, "Ano · {ano}". Ao lado ficam os botões "Ano anterior" e "Próximo ano", com o ano entre eles. Esse título é heading de nível 2. A casca conserva o único h1.

**Rationale**: A história 042 exige o título da área e proíbe setas de mês quando a área não pede mês. O título da spec muda com o modo e com o vazio, e esses dois dados não estão na casca. `CabecalhoTela` junta o título com o rótulo da navegação e nomeia as setas como mês, então não serve para este par.

**Alternatives considered**: Esconder o cabeçalho da casca no Ano. Rejeitado: a história 042 pede o título da área. Por o ano dentro de `navegacaoMes`. Rejeitado: o nome acessível seria "Mês anterior" e o h1 engoliria o ano.

## 3. Grade pura

**Decision**: `src/domain/ano-grade.ts` exporta `gradeDoAno`. A entrada são os itens do orçamento, os lançamentos daquele ano e a data de hoje. A saída são as linhas de realizado, as de planejado, o flag `vazio` e o índice do mês atual, ou `null` quando o ano aberto não é o ano de hoje. Cada linha tem id, nível (`tipo`, `categoria`, `item`, `sobra`), rótulo e doze centavos. A função não importa `competencia.ts`. O mês do realizado é o mês já gravado em `competencia`. O planejado é `parsePlanoFromJson` do item, o mesmo nos dois anos.

**Rationale**: A spec pede uma conta só, testável sem React. Recalcular a fatura na grade criaria uma segunda regra. O plano único é a decisão D-08 e a história 044.

**Alternatives considered**: Somar na página, como `AnoView` faz hoje. Rejeitado: a página reimplementaria a sobra. Guardar doze planos por ano. Rejeitado: não há coluna para isso e a spec não cria.

## 4. Quem entra na linha

**Decision**: Os tipos saem nesta ordem e com estes nomes: Receitas, Despesas fixas, Despesas variáveis, Anuais. Não usa o rótulo "Anuais / eventuais" de `TIPOS_LABEL`. Categorias e itens usam `localeCompare` com `pt-BR`. Item ativo entra nos dois modos, mesmo com doze zeros. Item arquivado entra no realizado só se tiver lançamento naquele ano, e no planejado só se algum mês do plano for diferente de zero. Categoria sem item visível some. Tipo sem categoria visível some. A sobra permanece, inclusive se for a única linha. Lançamento cujo item não está na lista do orçamento não cria linha.

**Rationale**: A spec pede os três níveis abertos, a ordem alfabética estável e o arquivado só quando ele muda a soma. A ordem do Orçamento, que põe quem tem valor primeiro, mudaria a linha quando um mês ganhasse valor.

**Alternatives considered**: Reutilizar `categoriasDoTipo`. Rejeitado: aquela ordem é do mês aberto, não dos doze meses. Recolher tipo e categoria. Rejeitado: o artboard mostra os três abertos e a spec não pede controle.

## 5. Sobra, vazio e mês atual

**Decision**: Em cada mês, a sobra é o tipo Receitas menos a soma de Despesas fixas, Despesas variáveis e Anuais. O total da linha é a soma dos doze centavos. O total da sobra tem de ser igual a `saldoFinalAno` das mesmas receitas e despesas. Não há linha "Total despesas". `vazio` é verdadeiro só quando todo plano de todo item está em zero e não há lançamento naquele ano. O índice do mês atual é o mês de `hoje` quando o ano de `hoje` é o ano aberto. Nos outros anos é `null`.

**Rationale**: A spec separa o ano sem movimento do realizado só com traços. Um plano preenchido e um 2027 sem lançamento não é vazio. Destacar novembro em 2027 seria copiar o artboard, e a spec recusou isso.

**Alternatives considered**: Tratar realizado sem lançamento como vazio. Rejeitado: a spec mantém "Ano · realizado" e o aviso da sobra quando o plano existe. Usar o mês da query do Resumo como coluna ativa. Rejeitado: a spec usa o mês de hoje.

## 6. Texto da célula

**Decision**: `textoCelulaAno` mora em `packages/design-system/src/modulos/tabela-meses.ts`. Zero centavo mostra "—". Qualquer outro valor mostra os reais cortados, sem "R$" e sem arredondar. O sinal é "−". Menos R$ 0,50 mostra "−0". R$ 6.500,99 mostra "6.500". O Total passa pela mesma função, aplicado à soma dos centavos, não à soma dos textos. Com `ocultado` e centavo diferente de zero, o texto é "•••••". Zero oculto continua "—". `TabelaMeses` deixa de chamar `formatarBRLInteiro`. O teste que espera "R$ 3.590" passa a esperar "3.590".

**Rationale**: O artboard não repete "R$" na célula. A frase "Valores em R$." cobre a unidade. Cortar antes de somar faria doze meses de R$ 0,50 virarem Total "0". A máscara do Ano não leva "R$" porque a célula também não leva. `formatarBRLInteiro` continua no Orçamento, onde o "R$" é da spec 044.

**Alternatives considered**: Formatar no domínio. Rejeitado: a borda visual é o pacote, e o domínio fica em centavos. Manter "R$ 3.590" no componente. Rejeitado: a spec 046 é o primeiro uso real da tabela na app, e o texto atual não bate com o artboard.

## 7. Contrato de TabelaMeses

**Decision**: A linha ganha `id` e `nivel`. `valoresPorMes` passa a ser doze inteiros. `legenda` vira o `caption`. `mesAtivo` aceita `null`. Quando o índice existe, o cabeçalho daquela coluna inclui o texto "mês atual", visível. `ocultado` troca o texto da célula. A primeira coluna se chama "Categoria · item". A linha `sobra` usa o destaque que o componente já tem. Categoria e item ganham classe de nível, com recuo por token, sem `px` solto. O wrapper já rola na horizontal. Não se mexe em `src/modulos/TabelaMeses.native.tsx` nem em `core/types.ts`.

**Rationale**: O export que a app usa é `src/web.ts`, e ele aponta para `web/modulos/tabela-meses.tsx`. A chave não pode ser o rótulo: Saúde existe em mais de um tipo. O pacote nativo é outra árvore e a história 055 ainda não começou.

**Alternatives considered**: Montar uma `<table>` só nesta página. Rejeitado: a spec lista `TabelaMeses` e o módulo já existe. Estender também a cópia nativa. Rejeitado: o celular não entra nesta história.

## 8. Troca de ano

**Decision**: A primeira entrada usa `loading.tsx` com `Skeleton`, sem moeda e sem a frase de vazio, e `error.tsx` com "Não foi possível carregar o ano." e "Tentar de novo". A troca seguinte chama `carregarAnoAction`. Enquanto a action não volta, ano, título e números confirmados permanecem. Um segundo clique nesse intervalo é ignorado. Falha mostra `EstadoErro` com a mesma frase e o mesmo botão, sem trocar a grade. "Tentar de novo" repete o ano pedido. Sucesso substitui a grade e grava `?ano=` com `history.replaceState`. A action não lança, e a mensagem crua do banco não aparece. `ano` ausente ou fora de quatro dígitos, na primeira leitura, cai no ano civil de hoje.

**Rationale**: Com `loading.tsx`, um `router.push` do ano suspende o segmento e esconde a grade. A spec manda a grade ficar até a resposta e, na falha, o ano confirmado continuar na tela. A action devolve o resultado sem trocar a rota. O endereço só muda depois do sucesso, para o recarregar abrir o mesmo ano.

**Alternatives considered**: Link de `?ano=` como o mês da casca. Rejeitado: a falha cairia no `error.tsx` e a grade sumiria. Não ter `loading.tsx`. Rejeitado: a primeira entrada poderia pintar traços antes da leitura.

## 9. Modo e ocultar

**Decision**: A leitura já traz realizado e planejado. O `Chips` tem o grupo "Modo do ano" e as opções Realizado e Planejado. Realizado começa marcado. Trocar o chip só troca o estado local. Não há nova leitura e o ano não muda. A chave `mo-ocultar-valores` é lida na montagem. `"1"` oculta. Não há botão nesta tela e não há segunda chave.

**Rationale**: Os dois modos cabem numa leitura. Uma ida ao servidor a cada chip atrasaria a troca e poderia mostrar o modo anterior com o título novo. A spec manda a preferência que o Resumo já guarda.

**Alternatives considered**: Guardar o modo na query. Rejeitado: a spec abre em Realizado, e o recarregar pode voltar a esse padrão. Máscara "R$ •••••". Rejeitado: a célula do Ano não usa "R$".

## 10. O que não muda

**Decision**: Não muda schema, `competencia.ts`, `saldoFinalAno`, `parsePlanoFromJson`, `pedeMes` do Ano, o Android, `globals.css` nem `@material/web`. Não há cópia de plano, não há alerta e não há edição. A página nova não repete `id="conteudo"`, porque a casca já marca esse alvo.

**Rationale**: A spec conserva a fatura, os centavos e o plano de doze meses. A casca e o celular não são esta tela.
