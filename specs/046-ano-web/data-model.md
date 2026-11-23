# Data Model: Ano web

Não há tabela nova, coluna nova nem migração. O item continua com `planoCentavosJson` de doze inteiros. O lançamento continua com `competencia` e `valorCentavos`. Tudo é filtrado pelo `orcamentoId` da sessão.

## Leitura do ano

| Dado | Regra |
|---|---|
| Ano | Quatro dígitos em `ano`. Ausente ou inválido cai no ano civil de hoje |
| Item | `id`, `tipo`, `grupo`, `nome`, `arquivado`, plano de doze centavos |
| Lançamento | `itemId`, `competencia`, `valorCentavos`, só os que começam com `{ano}-` |
| Hoje | Data civil usada para o mês atual. A grade recebe a data pronta |

O plano não é filtrado pelo ano. O mesmo JSON aparece em qualquer ano civil.

## Grade

Derivada. Não é coluna. `gradeDoAno` devolve realizado, planejado, `vazio` e o índice do mês atual.

| Linha | Id | Quando aparece |
|---|---|---|
| Tipo | `tipo:{R\|F\|V\|E}` | Tem ao menos uma categoria visível |
| Categoria | `cat:{tipo}:{grupo}` | Tem ao menos um item visível |
| Item | `item:{id}` | Ativo, sempre. Arquivado no realizado só com lançamento naquele ano. Arquivado no planejado só com algum mês do plano diferente de zero |
| Sobra | `sobra` | Sempre |

Ordem dos tipos: Receitas, Despesas fixas, Despesas variáveis, Anuais. Categorias e itens: `localeCompare` com `pt-BR`. Nível sempre aberto. Sem controle de recolher.

| Célula | Centavos |
|---|---|
| Item realizado | Soma dos `valorCentavos` daquele item na competência `{ano}-{mês}` |
| Item planejado | O mês correspondente do plano, o mesmo em qualquer ano |
| Categoria | Soma dos itens visíveis |
| Tipo | Soma das categorias visíveis |
| Sobra do mês | Receitas menos Despesas fixas, Despesas variáveis e Anuais |
| Total | Soma dos doze centavos da própria linha |

Lançamento cujo item não está no orçamento não cria linha e não entra na soma. Valor negativo de lançamento entra na soma. O plano já gravado não tem mês negativo: `parsePlanoFromJson` continua cortando isso em zero.

`vazio` é verdadeiro quando todos os planos de todos os itens estão em zero e não há lançamento naquele ano. Não depende do modo.

O índice do mês atual é o mês de hoje, de 0 a 11, quando o ano de hoje é o ano aberto. Nos outros anos é `null`.

## Texto na célula

A grade guarda centavos. `textoCelulaAno` só na tabela.

| Centavos | À vista | Oculto |
|---|---|---|
| 0 | "—" | "—" |
| 650099 | "6.500" | "•••••" |
| 50 | "0" | "•••••" |
| −50 | "−0" | "•••••" |
| −4000 | "−40" | "•••••" |

Doze meses de 50 centavos mostram "0" em cada mês e "6" no Total. O Total não soma os textos.

## Tela

| Peça | Regra |
|---|---|
| Título com movimento | "Ano · realizado" ou "Ano · planejado" |
| Título vazio | "Ano · {ano}" |
| Legenda | "Realizado de {ano}" ou "Planejado de {ano}", também no vazio |
| Aviso com movimento | "Sobra no ano = receitas − despesas. Não é o mesmo que "Disponível neste mês", que compara o planejado com o gasto do mês." |
| Aviso vazio | "Nenhum planejamento nem lançamento em {ano}." |
| Modo | Estado da tela. Abre em Realizado. Não vai para a query |
| Ano confirmado | Query `ano`, escrita só depois da action voltar com sucesso |
| Ocultar | `mo-ocultar-valores` igual a `"1"`. Sem controle nesta tela |

Os dois avisos não aparecem juntos. Não há "Saldo final", "Disponível neste mês", "Total despesas" nem ação de copiar o ano anterior.
