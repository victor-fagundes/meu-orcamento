# Contract: Ano web

Contrato de tela. Não há rota HTTP nova. O endereço continua `/app/ano`.

## Sessão e ano

| Situação | Resultado |
|---|---|
| Sem sessão | A casca não aparece. O redirect atual leva a `/login`. |
| Com sessão | Grade do ano, chips e aviso. A casca mostra "Ano" e não mostra "Mês anterior" nem "Próximo mês". |
| `ano` ausente ou inválido | O ano civil de hoje |
| Troca pedida | Ano, título e números confirmados ficam até a action voltar |
| Troca que falha | O ano confirmado permanece. "Não foi possível carregar o ano." e "Tentar de novo" |
| Troca que volta | A grade e o endereço `?ano=` passam a ser o ano pedido |
| Primeira entrada carregando | `Skeleton`, sem moeda e sem a frase de ano sem movimento |
| Primeira entrada que falha | A mesma frase e "Tentar de novo", no lugar da grade que ainda não existia |

## Topo

| Peça | Texto |
|---|---|
| Título, com movimento, Realizado | "Ano · realizado" |
| Título, com movimento, Planejado | "Ano · planejado" |
| Título, ano vazio | "Ano · {ano}" |
| Ano anterior | nome acessível "Ano anterior" |
| Próximo ano | nome acessível "Próximo ano" |
| Chips | grupo "Modo do ano"; Realizado e Planejado; um só marcado |
| Frase | "Valores em R$. Nível: tipo › grupo › item. Lançamentos ficam em Lançamentos." |

Trocar o chip troca todas as células, a legenda e, quando há movimento, o título. Não mistura os modos. Não muda o ano. Não lê de novo.

## Tabela

Legenda "Realizado de {ano}" ou "Planejado de {ano}". Primeira coluna "Categoria · item". Depois Jan, Fev, Mar, Abr, Mai, Jun, Jul, Ago, Set, Out, Nov, Dez e Total. Números à direita. Sem "R$" na célula.

| Entrada | Tela |
|---|---|
| Tipos | Receitas, Despesas fixas, Despesas variáveis, Anuais, nessa ordem, só se tiverem item visível |
| Categorias e itens | ordem alfabética do português, os três níveis visíveis |
| Item ativo sem movimento | a linha aparece, meses em "—" |
| Item arquivado sem lançamento no ano | fora do realizado |
| Item arquivado com plano todo em zero | fora do planejado |
| R$ 6.500,99 num mês | "6.500" no mês e no Total, se o resto for zero |
| Doze meses de R$ 0,50 | "0" em cada mês e "6" no Total |
| Menos R$ 40,00 | "−40" |
| Exatamente zero | "—" |
| Ano de hoje, mês de hoje | a coluna inclui "mês atual" |
| Outro ano | nenhuma coluna inclui "mês atual" |
| Valores ocultos | "•••••" onde havia número. "—" permanece |
| Última linha | "Sobra no ano (receitas − despesas)", destacada |
| Receitas R$ 5.000,00 e despesas R$ 2.400,00 | Total da sobra "2.600" |
| Célula | não é botão |

Não há "Total despesas", "Saldo final" nem frase de alerta.

## Competência

A grade soma a `competencia` gravada. Não recalcula a fatura.

| Entrada já gravada | Mês |
|---|---|
| Cartão, fechamento 25, compra 26/05/2026 | junho de 2026 |
| Débito, Pix ou dinheiro em 26/05/2026 | maio de 2026 |
| Cartão, fechamento 25, compra 26/12/2026 | janeiro de 2027 |
| R$ 100,00 em 3× a partir de 26/05/2026, fechamento 25 | R$ 33,34 em junho, R$ 33,33 em julho, R$ 33,33 em agosto. Na célula, "33". A soma dos centavos continua R$ 100,00 |
| Plano | o mês do JSON, sem deslocar pelo cartão |
| O mesmo plano em 2026 e 2027 | os mesmos doze números |

## Vazio

Todo plano em zero e nenhum lançamento no ano.

| Peça | Texto |
|---|---|
| Título | "Ano · {ano}" |
| Aviso | "Nenhum planejamento nem lançamento em {ano}." |
| Grade | permanece, com "—" |
| Copiar ano anterior | não existe |

Se há plano e o ano não tem lançamento, o Realizado mantém "Ano · realizado", o aviso da sobra e os traços. O Planejado mostra o plano.

## Isolamento

Lançamento ou item de outra conta não entra na soma. A action sem sessão não devolve grade.
