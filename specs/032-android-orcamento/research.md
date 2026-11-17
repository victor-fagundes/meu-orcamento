# Research: Orçamento no Android

## 1. Números do grupo

**Decision**: Ainda cabe do tipo e os totais do grupo vêm de `totais.porTipo` e `totais.porGrupo`. Itens dentro do grupo usam `itens` filtrados por tipo e grupo, e o realizado do item é a soma dos `lancamentos` daquele `itemId`. Essa soma não substitui o total do grupo.

**Rationale**: O total do mês e do grupo tem uma função só, a da 028. A linha do item é a lista que já desce na mesma resposta.

**Alternatives considered**: Somar os grupos no aparelho para obter o tipo. Rejeitado.

## 2. Frase de estado

**Decision**: Cada linha de `porTipo` e de `porGrupo` ganha `frase`, produzida no servidor com `textoConsumoDespesa` ou `textoConsumoReceita` e `estadoConsumo`. O aparelho mostra essa frase. A barra de "perto" usa a cor terciária, não `#ffe600`. Chegou no planejado não é erro.

**Rationale**: Copiar o limiar no Kotlin criaria uma segunda regra. A constituição pede uma regra só.

**Alternatives considered**: Quatro frases fixas escritas no Kotlin. Rejeitado.

## 3. Sem movimento

**Decision**: Grupo com plano e realizado zerados fica fora da lista principal, sob "Sem movimento neste mês". O controle abre esses grupos. Grupo com qualquer centavo positivo fica na lista.

**Rationale**: Igual à decisão da 029, na lista nativa.

**Alternatives considered**: Omitir os zerados. Rejeitado. A spec pede que continuem alcançáveis.

## 4. Sheet do plano

**Decision**: Tocar o item abre um sheet com o nome e o valor do mês aberto. O foco entra nesse campo e o texto não fica selecionado. Os doze meses vêm de `GET /api/v1/plano`. Salvar envia `PUT` com `mesesCentavos`, alterando só o mês aberto. Valor ilegível não envia o PUT. Cancelar, toque fora e voltar fecham sem PUT. Nome vazio em item novo não chama `POST /api/v1/itens`.

**Rationale**: As rotas já existem. O aparelho não inventa competência.

**Alternatives considered**: Enviar o valor em reais solto. Rejeitado. O contrato do PUT é centavos inteiros.

## 5. Arquivar

**Decision**: O primeiro texto é "Arquivar {nome}". O segundo é "Confirmar arquivar {nome}". Confirmar chama `DELETE /api/v1/itens?id=`, que já arquiva e conserva lançamentos. Outro toque fora do controle desarma sem chamar o DELETE.

**Rationale**: A spec 032 pede o nome já no primeiro texto. Isso é diferente da 037, de propósito. O DELETE atual é o arquivar do computador.

**Alternatives considered**: Um DELETE que apaga lançamentos. Rejeitado. A função `archiveItem` não apaga.
