# Research: Resumo no Android

## 1. Origem dos números

**Decision**: A tela só renderiza `totais.aindaPodeGastarCentavos`, `totalOrcadoCentavos`, `totalGastoCentavos` e `porTipo` de `GET /api/v1/resumo?competencia=`. Se `totais` vier nulo, mostra o erro e nenhum valor.

**Rationale**: A 028 já colocou esse objeto na resposta. Somar de novo no aparelho foi o defeito que a 028 corrigiu.

**Alternatives considered**: Somar `itens` e `lancamentos` na tela. Rejeitado.

## 2. Frase e dias

**Decision**: A parcela gasta é o gasto de despesas sobre o orçado de despesas, em inteiro, só quando o orçado é maior que zero. No mês corrente, a frase acrescenta quantos dias civis restam, incluindo o dia de hoje. Fora do mês corrente, a frase não cita dias. Estouro troca o título para passou do orçado e o valor fica negativo.

**Rationale**: A spec pede a frase e os dias. Isso não muda competência nem centavos.

**Alternatives considered**: Pedir os dias ao servidor. Rejeitado. É calendário do aparelho, não regra de orçamento.

## 3. Toque no tipo

**Decision**: A linha escreve o tipo na casca (`R`, `F`, `V` ou `E`) e navega para `orcamento`. A ordem das linhas é a de `porTipo`: receitas, fixas, variáveis, anuais.

**Rationale**: A 030 guarda o tipo justamente para essa passagem.

**Alternatives considered**: Query própria só nesta tela. Rejeitado. O tipo se perderia ao trocar o mês.

## 4. Barra

**Decision**: A barra acompanha a frase e usa a cor primária. Não usa o amarelo da marca. A frase existe mesmo se a barra falhar em contraste.

**Rationale**: A spec pede um segundo sinal além da barra.
