# Research: Lançamentos no Android

## 1. Lista

**Decision**: `GET /api/v1/lancamentos?competencia=` com a competência da casca. Cada linha mostra valor formatado, data, nome do item e meio. Lista vazia diz que não há lançamentos e oferece registrar. Falha de rede conserva a lista anterior, como a casca 030.

**Rationale**: A tela hoje pede centavos num campo e não tem vazio explicado.

**Alternatives considered**: Trazer o resumo e filtrar. Rejeitado. A lista completa já tem rota.

## 2. Valor e data

**Decision**: A pessoa digita reais, como "10,50". A borda converte para centavos inteiros. Texto ilegível, zero e negativo não chamam a API. A data é um seletor de data, não um campo "2026-11-15" livre. O JSON continua `dataISO` e `valorCentavos`.

**Rationale**: O computador pede reais. O contrato da API pede centavos. Os dois se encontram na borda.

**Alternatives considered**: Continuar pedindo centavos. Rejeitado. É o estado atual e a spec pede um lançamento em menos de dois minutos.

## 3. Pagamento e item

**Decision**: Meio é uma escolha: débito, PIX, dinheiro ou um cartão ativo de `GET /api/v1/cartoes`. Itens vêm de `GET /api/v1/itens` e excluem arquivados. Parcelas, quando o meio é cartão, mandam `parcelas`. No PATCH de um parcelado, o aparelho faz a mesma pergunta de escopo que o computador (`EditScope` e `DeleteScope`) antes de enviar.

**Rationale**: A rota já exige `pagamento` e aceita `scope`. Inventar outro escopo quebraria a paridade.

**Alternatives considered**: Campo de texto com o id do cartão. Rejeitado. É o que a tela faz hoje.

## 4. Apagar

**Decision**: Apagar pede confirmação e chama `DELETE`. Não há desfazer. O total do mês seguinte, visto no Resumo, cai exatamente o valor apagado porque o servidor recalcula.

**Rationale**: A spec condiciona o desfazer ao que o computador faz. O computador não desfaz.
