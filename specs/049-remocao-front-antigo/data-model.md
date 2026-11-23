# Data Model: Remoção do front antigo

Não há tabela nova, coluna nova nem migração. Conta, sessão, categorias, cartões, itens e lançamentos continuam onde estão. Nenhum valor em centavos é recalculado por esta história.

## O que a tela lê

| Dado | Regra nesta história |
|---|---|
| Lançamentos do mês | Os mesmos de antes. O disponível, o gasto e a sobra não ganham fórmula nova |
| Categorias e itens | Permanecem. Arquivados continuam arquivados |
| Conta e sessão | O mecanismo atual abre e fecha. Sem sessão, Entrada. Com sessão, as cinco áreas |
| Competência | O mês pedido na rota continua o mês já aceito. Não há ano civil novo |

## Estados da entrada no site

| Estado | O que a pessoa vê |
|---|---|
| Abre `/` sem sessão | Vai para `/login`, sem a vitrine antiga |
| Abre `/` com sessão | Vai para `/app/resumo` |
| Abre uma das seis áreas | A tela já verificada em 042–048, no mesmo endereço |

Não há entidade nova para a vitrine. Ela deixa de existir.

## Transições

1. Sessão válida em `/` → Resumo. Nada é gravado nessa passagem.
2. Sem sessão em `/` → Entrada. Não nasce sessão.
3. Limpeza do front → os lançamentos já gravados permanecem os mesmos.
