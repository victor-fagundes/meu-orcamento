# Data model: Ano no Android

A resposta já existe.

| Campo | Regra |
|-------|--------|
| ano | Quatro dígitos pedidos |
| planejado | Por item: tipo, grupo, nome e 12 inteiros |
| realizado | Por item e mês: 12 inteiros |
| Vazio | Nenhum inteiro positivo em planejado nem em realizado |

O ano mostrado é o último que a resposta confirmou. Um pedido em andamento não troca o título para o ano novo antes da resposta.
