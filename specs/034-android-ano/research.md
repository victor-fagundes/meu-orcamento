# Research: Ano no Android

## 1. Dados

**Decision**: `GET /api/v1/ano?ano=` devolve `planejado` e `realizado` por item, cada um com doze inteiros. A tela não soma lançamentos de novo.

**Rationale**: A rota já espelha a página do computador. Uma segunda soma divergiria.

**Alternatives considered**: Doze chamadas ao resumo. Rejeitado.

## 2. Apresentação

**Decision**: Lista de itens, de borda a borda. Os doze meses rolam na horizontal dentro da linha. O valor não é cortado para caber o nome. O nome longo quebra ou rola, e o valor permanece legível. Sem os cartões de 1120 px do site.

**Rationale**: A spec pede paridade de centavos e apresentação nativa. O protótipo não desenha o miolo.

**Alternatives considered**: Tabela igual à do computador. Rejeitado.

## 3. Troca de ano e vazio

**Decision**: Ano anterior e seguinte mudam o parâmetro `ano` e substituem a grade só depois da resposta. Ano sem nenhum centavo mostra a frase de ano sem valores. Falha de rede conserva a grade do ano que já estava na tela e avisa. Não desenha o ano pedido com zeros.

**Rationale**: Zeros no meio do erro pareceriam um ano vazio de verdade.

**Alternatives considered**: Limpar a grade no erro. Rejeitado.
