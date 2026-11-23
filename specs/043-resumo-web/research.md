# Research: Resumo web

## 1. Onde a tela está hoje

**Decision**: `src/app/app/resumo/page.tsx` deixa de montar `AlertBanner` e `ResumoDashboard`. Monta `ResumoTela` com os dados do mês. Os arquivos antigos ficam no repositório até a história 049.

**Rationale**: A página já exige sessão, lê `?mes=` e carrega itens, cartões, lançamentos e alertas do `orcamentoId`. O miolo atual diz "Ainda pode gastar", desenha o mês de novo e mostra rosca e barras. A spec troca esse miolo e tira o banner. Apagar os arquivos agora é a história 049.

**Alternatives considered**: Estilizar `ResumoDashboard` até parecer o bloco novo. Rejeitado: a rosca e o banner continuariam no mesmo componente. Criar outra rota. Rejeitado: o endereço permanece `/app/resumo`.

## 2. Mês no cabeçalho

**Decision**: Em `casca-abas.ts`, só Resumo fica com `pedeMes: true`. As outras quatro continuam falsas. A página nova não desenha "Mês anterior" nem "Próximo mês". O teste de `casca-abas` que espera as cinco falsas passa a esperar verdadeiro só em Resumo.

**Rationale**: A história 042 deixou o slot e mandou a tela pedir. `CabecalhoTela` já nomeia os dois controles. Dois controles de mês, um na casca e outro no miolo, divergem. `shiftCompetencia` não muda.

**Alternatives considered**: Manter as setas dentro da página. Rejeitado: a spec manda o Resumo pedir a navegação de mês da casca. Ligar o mês nas outras quatro áreas. Rejeitado: cada uma pede na história dela.

## 3. O disponível e os quatro cartões

**Decision**: A página continua chamando `totaisDoMes`. O rótulo visível é "Disponível neste mês". Os cartões usam os nomes curtos Receitas, Fixas, Variáveis e Anuais, nesta ordem, a partir dos tipos `R`, `F`, `V` e `E`. Com pagamento em Todas, o valor é `aindaPodeGastarCentavos` e o planejado de cada cartão é o `planoCentavos` do tipo. Com outro pagamento, o disponível e cada planejado mostram "—" e o realizado usa só os lançamentos daquele meio. `totaisDoMes` não ganha um modo novo.

**Rationale**: A fórmula já é planejado de despesas menos gasto de despesas. O filtro de pagamento não divide o plano; a spec manda o traço, não outra conta. `GradeTotais` já formata com `formatarBRLInteiro` e a frase "de R$ x planejados", e corta os centavos. Falta o traço, a máscara e o toque. `BlocoSaldo` já tem o rótulo, `aria-pressed`, o olho e o olho cortado. O valor hoje é sempre `display-md`. A spec pede 40 px abaixo de 720 e 56 px a partir de 720, que são `--type-display-md-size` e `--type-display-lg-size`.

**Alternatives considered**: Recalcular o saldo no cliente quando o pagamento muda. Rejeitado: seria a segunda fórmula. Passar um centavo sentinela para desenhar "—". Rejeitado: o zero e o negativo já são valores de verdade. `valorCentavos` e `planejadoCentavos` aceitam `null`.

## 4. Frase, medidor e média

**Decision**: `src/domain/resumo-semana.ts` devolve o percentual inteiro, cortado, ou `null` quando o planejado das despesas é zero ou o pagamento não é Todas. A frase é "Usou X% do planejado" e, só quando a competência é o mês civil de `hoje`, " · Faltam N dias", com N igual ao último dia menos o dia de hoje. O medidor recebe esse percentual; `larguraDaBarra` já para em 100. Sem percentual, `BlocoSaldo` não monta o `Medidor` e ainda mostra a frase dos dias, se houver. A média é o gasto de despesas do recorte dividido pelo dia de hoje, no mês corrente, ou pelo número de dias da competência, nos outros meses. A divisão é inteira, ao centavo mais próximo: para um valor positivo, `(gasto + floor(divisor / 2)) / divisor`, truncado. `hoje` entra como `AAAA-MM-DD` vindo do mesmo `Date` de `competenciaAtual`. O teste injeta a data.

**Rationale**: `consumoPct` usa divisão fracionária. A spec pede inteiro sem casa. O medidor do pacote já limita a barra. A história 012 escondia a média fora do mês corrente; a clarificação de 2026-11-22 manda mostrá-la em todo mês.

**Alternatives considered**: Montar a frase no componente. Rejeitado: a regra de quando o percentual e os dias entram é teste de domínio. Usar `Math.round(gasto / dias)`. Rejeitado: passa por float.

## 5. Semanas

**Decision**: A mesma função pura parte o mês em dias 1–7, 8–14, 15–21, 22–28 e, se o mês tem dia 29 ou seguinte, 29 até o último. Cada semana se chama "Semana 1" em diante. Entram lançamentos de despesa (`F`, `V`, `E`) da competência, já recortados por pagamento, categoria e tipo. Data anterior ao mês cai na Semana 1. Data posterior cai na última semana que o mês tem. Fevereiro de 28 dias devolve quatro semanas. O tipo Receitas zera as semanas. O gráfico no pacote mostra o nome, o valor em texto e a barra. "Ver detalhes da semana N" abre o painel.

**Rationale**: A clarificação fechou o bloco fixo de dias. A página hoje não lê `dataTransacao` nem `descricao`; as colunas já existem em `lancamentos`. Sem função pura, o teste do dia 31 e do fevereiro ficaria no navegador.

**Alternatives considered**: Semana de calendário, segunda ou domingo. Rejeitado na clarificação. Desenhar a barra em `src/components` com `style` em px. Rejeitado: a regra de token e o gráfico servem a esta tela, então o componente nasce no pacote.

## 6. Filtros

**Decision**: A query de `/app/resumo` ganha `tipo`, `pagamento` e `categoria`. Ausente ou inválido vale Todas. `tipo` é `R`, `F`, `V` ou `E` e só recorta o gráfico, o detalhe e a média. `pagamento` é `deb`, `pix`, `din` ou `cartao:<id>`. `categoria` é o grupo de um item ativo. "Limpar filtros" volta à mesma rota só com `mes`, quando o mês estiver na query. Nada disso grava. O chip e o select usam `Chips` e `Select` do pacote. A categoria não é chip: a spec pede chip para tipo e pagamento, e a categoria como escolha visível.

**Rationale**: `?mes=` já é o contrato da casca. Guardar o filtro só em estado perderia o link e o teste. `tipo` na query do Resumo não é o `tipo` do Orçamento: são páginas diferentes. O id do cartão vai prefixado para não coincidir com `deb`, `pix` ou `din`.

**Alternatives considered**: Estado só no cliente. Rejeitado: recarregar a página esqueceria o filtro, e a spec pede que limpar mantenha o mês. Um único controle chamado filtro. Rejeitado: tipo, pagamento e categoria têm efeitos diferentes, já fechados na spec.

## 7. Ocultar

**Decision**: A chave é `mo-ocultar-valores`. Valor `"1"` oculta. Ausência mostra. O cliente lê na montagem e grava no clique. Não há segunda chave e não há coluna. Oculto, `BlocoSaldo` já troca o valor por "R$ •••••". `GradeTotais`, o gráfico e o valor dentro do detalhe passam a respeitar o mesmo booleano. Rótulo, percentual, dias e alertas não usam essa máscara.

**Rationale**: O pacote já mascara o saldo com esse texto. A chave está nomeada no prompt desta reconstrução e ainda não é lida em lugar nenhum. Criar outro nome seria a segunda preferência que a spec proíbe.

**Alternatives considered**: Gravar na conta. Rejeitado: a spec limita a escolha a este navegador. Cookie. Rejeitado: a preferência não precisa ir ao servidor.

## 8. Toque no cartão e painéis

**Decision**: Com `onAbrir`, cada cartão de `GradeTotais` vira botão e abre `hrefOrcamentoMes(mes, tipo)`. O Orçamento já lê `tipo` `R`, `F`, `V` ou `E`. Ocultar não remove o botão. O sininho e "Ver detalhes" abrem um `Painel` novo no pacote, que reusa `prenderFoco` e devolve o foco ao fechar. O sininho lista `alertasDoMes` como já vem de `loadAlertasMes`. Cada alerta é um link para `/app/orcamento?mes=`. Zero alertas: o botão não mostra quantidade e o painel diz "Nenhum alerta neste mês." O detalhe lista data, descrição e valor; sem lançamento, "Nenhum lançamento nesta semana." `LinhaLancamento` ganha `ocultado` e `onAbrir` opcional. Sem `onAbrir`, a linha não é botão, para o detalhe não abrir a edição da história 045.

**Rationale**: `Dialogo` só confirma uma ação e não recebe lista. `FormularioContainer` exige salvar. O foco preso já está em `prenderFoco`. `hrefOrcamentoMes` já aponta o tipo. O alerta não escolhe tipo: a página de Orçamento, quando `tipo` falta, continua abrindo em Fixas, e mudar esse padrão é a história 044.

**Alternatives considered**: Envolver o `<article>` atual num `<a>` na página. Rejeitado: o cartão deixaria de ser o componente do pacote. Reusar `Dialogo` com o confirmar chamado Fechar. Rejeitado: o contrato é uma confirmação, com dois botões.

## 9. Vazio, carregando e erro

**Decision**: Vazio é planejado de Receitas igual a zero e nenhum lançamento na competência, antes dos filtros. Aí a página monta só `CartaoVazio`: título "Nenhuma receita neste mês", frase "Defina as receitas para acompanhar o disponível." e ação "Definir receitas", que abre `hrefOrcamentoMes(mes, "R")`. Filtro sobre um mês com movimento não usa esse cartão. `loading.tsx` monta `Skeleton` e não renderiza moeda. `error.tsx` monta `EstadoErro` com "Não foi possível carregar o mês." e "Tentar de novo".

**Rationale**: A spec separa o mês vazio de um filtro que não acha linha. O carregamento do App Router já tem esses dois arquivos como lugar do estado, e o pacote já tem os dois componentes. `EstadoErro` já usa "Tentar de novo" como texto padrão.

**Alternatives considered**: Tratar vazio dentro de `totaisDoMes`. Rejeitado: a função também serve o Orçamento, que não tem esse cartão. Mostrar R$ 0,00 até a promise resolver. Rejeitado: a spec proíbe o zero falso.

## 10. Grade e o que não muda

**Decision**: `.mo-grade-totais` continua em duas colunas. A partir de 720 px, no mesmo `@media (min-width: 720px)` do pacote, a largura máxima da grade é a de seis colunas do miolo: `(var(--content-max-width) - 11 * var(--grid-gutter-desktop)) / 12 * 6 + 5 * var(--grid-gutter-desktop)`. Não entra número novo em `tokens.ts`. Não muda schema, `totaisDoMes`, a API `/api/v1/resumo`, o Android, `globals.css` nem `@material/web`.

**Rationale**: A ficha de módulos pede duas colunas no estreito e, no largo, duas colunas dentro de seis das doze. A conta da coluna de 58 px já está na história 042. A API e o celular não são esta tela.

**Alternatives considered**: Fazer a página escolher `grid-column: span 6`. Rejeitado: o filho direto da casca ocupa as doze colunas; o limite fica no próprio bloco. Criar token de 468 px. Rejeitado: seis colunas já se calculam com as variáveis existentes.
