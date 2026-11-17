# Research: Casca nativa do Android

## 1. Destino atual

**Decision**: Manter os cinco `NavigationBarItem` com ícone e texto sempre visíveis. O selecionado usa o indicador do Material além da cor. Importar, PDF e exportar continuam sob Ajustes, que permanece selecionado nessas rotas.

**Rationale**: Ícone sozinho falharia o "mais de uma pista". A barra já tem texto. Não se reconstrói a navegação.

**Alternatives considered**: Menu lateral. Rejeitado. O protótipo é a barra de baixo.

## 2. Um mês para as telas do mês

**Decision**: `AppNav` guarda `competencia` (`YYYY-MM`) e `tipo` (`F` por omissão). Resumo, Orçamento e Lançamentos leem e atualizam essa competência. Ano guarda o próprio ano. Trocar o mês não chama `navigate`. Trocar o mês não escreve o tipo.

**Rationale**: Hoje cada tela tem o próprio mês, e o seletor mostra `2026-11`. A spec pede o mês na barra e a conservação do tipo.

**Alternatives considered**: Mês independente por tela. Rejeitado porque o protótipo trata o mês como título do app, e a pessoa perderia o mês ao ir do Resumo ao Orçamento.

## 3. Nome do mês

**Decision**: O texto visível é o nome civil em pt-BR mais o ano, por exemplo "novembro de 2026". Os botões continuam com "Mês anterior" e "Próximo mês". O valor enviado à API continua `YYYY-MM`.

**Rationale**: `java.time` no minSdk 34 formata o nome. A API não aceita o nome por extenso.

**Alternatives considered**: Deixar `YYYY-MM`. Rejeitado. Mostrar só "novembro" sem ano. Rejeitado porque dois novembros ficam iguais.

## 4. Largura

**Decision**: Nenhuma largura máxima e nenhuma coluna central. O preenchimento interno das listas fica, pequeno, para o texto não colar na borda.

**Rationale**: A janela já é a largura do aparelho. O que a spec veta é o site encolhido no meio.

**Alternatives considered**: Imitar os cartões de 1120 px. Rejeitado.

## 5. Sem rede

**Decision**: Falha de rede ou resposta inválida mostra `OfflineBanner` e conserva a última lista ou os últimos totais. Não substitui por zeros. Sessão 401 volta ao entrar. Trocar de destino com um sheet aberto desmonta o sheet sem gravar, porque o sheet é estado da tela que saiu.

**Rationale**: Várias telas hoje zeram a lista no `catch`, e isso parece um mês vazio.

**Alternatives considered**: Cache do orçamento. Rejeitado pela spec e pela 027.
