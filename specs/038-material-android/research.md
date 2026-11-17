# Research: Aparência Material no Android

## 1. Tema claro e escuro

**Decision**: `MainActivity` deixa o `lightColorScheme` solto e passa a usar um tema único, claro ou escuro conforme o aparelho. Azul de ação `#0058BE`, contentor `#D7E3FF`, superfície `#F8F9FF` no claro e `#111318` no escuro, erro `#BA1A1A`. O amarelo `#FFE600` existe só como cor da marca, não como `secondary` pintando controle. Aviso preventivo: `#8A7000` no claro e `#D7B07A` no escuro. Sem interruptor em Ajustes.

**Rationale**: O app hoje fixa o tema claro e ainda registra o amarelo como `secondary`, o que o Material aplica em controles. A spec 023 já decidiu seguir o aparelho e restringir o amarelo.

**Alternatives considered**: Seletor em Ajustes. Rejeitado pela spec. Manter `#0057B8`. Rejeitado porque o protótipo e a spec desta história fecham `#0058BE`.

## 2. Barra de cima

**Decision**: Nas telas de mês, a barra é o nome civil com o ano ("novembro de 2026"), com os botões "Mês anterior" e "Próximo mês". Some o título "Resumo", "Orçamento" ou "Lançamentos". Ano mostra o ano confirmado, com ano anterior e próximo. Ajustes mostra "Ajustes". Importar e exportar mostram o nome da tarefa. O valor enviado à API continua `YYYY-MM`.

**Rationale**: A spec 030 já pedia o mês na barra. A implementação deixou o mês numa linha abaixo de um título de página. O ano não sobe para o `AppNav` porque a spec 034 só troca a grade depois da resposta.

**Alternatives considered**: Título de página mais o mês, como no protótipo Material do site. Rejeitado para o app. O modo Android de 17 de novembro usa o mês como título.

## 3. Pílula da navegação

**Decision**: Manter os cinco `NavigationBarItem` com ícone e nome sempre visíveis. O indicador do item selecionado usa o contentor azul-claro, não o amarelo. Importar, PDF e exportar continuam com Ajustes selecionado.

**Rationale**: A barra já tem nome e ícone. Falta o indicador parecer a pílula do protótipo. Reconstruir a barra perderia o comportamento já aceito.

**Alternatives considered**: Barra desenhada à mão. Rejeitada. Menu lateral. Rejeitado.

## 4. Valor em display

**Decision**: Um estilo só, 45 sp, peso regular, entrelinha 52 sp, alinhado à esquerda. Resumo usa em "Ainda pode gastar" ou "Passou do orçado". Orçamento usa em "Ainda cabe". Negativo usa a cor de erro. A frase fica em corpo menor. A barra de consumo tem 4 dp.

**Rationale**: Hoje o valor é `headlineMedium`, do mesmo tamanho de vários títulos. O protótipo separa o valor do resto.

**Alternatives considered**: `displayLarge` padrão (57 sp). Rejeitado. Estoura em valores longos com mais facilidade e não é o tamanho do protótipo.

## 5. Linhas

**Decision**: Cada linha de tipo, grupo ou lançamento é uma faixa: nome à esquerda, valor à direita, detalhe na largura toda por baixo. Nome longo encolhe. O valor não vai para a linha de baixo. Grupos zerados continuam só depois de "Sem movimento neste mês".

**Rationale**: O app lista texto empilhado. O protótipo usa a linha com o valor na ponta.

**Alternatives considered**: Cartões iguais para cada grupo. Rejeitado. É o kit genérico que o protótipo não usa nessas listas.

## 6. Entrada

**Decision**: Coluna alinhada à esquerda, a partir do topo com respiro, não centralizada. Marca amarela quadrada com cantos de 10 dp e a letra M. Um `Button` "Entrar" ou "Cadastrar". Um `TextButton` "Criar conta" ou "Já tenho conta". A lógica de sessão, o bloqueio de `demo@local.test` na versão publicada e o aviso sem rede permanecem.

**Rationale**: A tela atual centra dois botões do mesmo peso e não tem marca. O protótipo não desenha a entrada. A spec desta história fecha essa composição.

**Alternatives considered**: Copiar o painel duplo do login do site. Rejeitado. Esse painel é do computador. Trazer "Esqueci a senha" para esta tela. Rejeitado. Continua em Ajustes.

## 7. Orçamento e painel

**Decision**: `FilterChip` para Receitas, Fixas, Variáveis e Anuais, com o ativo no contentor. `corBarra` permanece: azul dentro do plano, `#8A7000` a partir de 80% inclusive 100%, erro só acima de 100%. O painel continua `ModalBottomSheet`, com canto superior de 28 dp, foco no mês aberto e descarte sem gravar.

**Rationale**: A regra de cor e o fluxo de gravar já estão certos. O que falta é chip, display e o canto do painel.

**Alternatives considered**: Repintar 100% como erro. Rejeitado. "Chegou" não é erro. Botão flutuante de lançamento. Rejeitado pela spec.

## 8. O que não entra

**Decision**: Sem mudança em `src/`, sem endpoint novo, sem subir `versionCode`. O APK de aceitação é o de produção, com a URL publicada, gerado depois da implementação e do roteiro.

**Rationale**: A história é apresentação. Versão nova só quando o PM pedir o arquivo versionado de novo.

**Alternatives considered**: Reestilizar o login do site na mesma entrega. Rejeitado. A spec deixa o computador fora.
