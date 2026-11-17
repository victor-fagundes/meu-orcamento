# Research: Foco do diálogo e Arquivar no computador

## 1. Para onde o foco vai ao abrir

**Decision**: O diálogo compartilhado, ao abrir, procura dentro de si o único controle marcado como alvo e chama o foco nele. Não chama seleção de texto. Se não houver alvo, o foco fica no próprio diálogo. O controle que estava ativo antes de abrir é guardado antes do movimento e recebe o foco de volta no Escape, no fundo e em Cancelar.

**Rationale**: Escape e a permanência do Tab dentro do diálogo já existem. O buraco é só o foco inicial. Um alvo marcado por cada diálogo cobre os cinco casos da spec sem um tipo diferente de diálogo por tela.

**Alternatives considered**: Focar sempre o primeiro campo. Rejeitado porque o plano abriria em "Mesmo valor todo mês" e o novo item abriria na categoria. Focar o contêiner do diálogo em todos os casos. Rejeitado porque a pessoa ainda precisaria de um Tab para chegar no valor.

## 2. Qual mês do plano recebe o foco

**Decision**: O Orçamento já conhece a competência `YYYY-MM`. O diálogo do plano recebe o índice desse mês (janeiro = 0). O alvo é o campo daquele mês. Competência ausente ou fora de 1–12 usa janeiro, que é o primeiro valor do plano.

**Rationale**: A spec pede o mês que está aberto, não o primeiro campo do formulário. A competência já está na tela. Não se cria regra nova de calendário.

**Alternatives considered**: Focar "Mesmo valor todo mês" por ser o primeiro campo. Rejeitado. Selecionar o texto para substituir rápido. Rejeitado: um toque distraído apagaria o plano.

## 3. Como cada diálogo aponta o alvo

**Decision**: Campo de texto e botão preenchido ganham um sinal opcional de alvo, repassado ao controle nativo. Cada diálogo marca um só: nome do item, valor do lançamento, valor do mês, ou Fechar nos alertas.

**Rationale**: O campo de texto hoje não expõe o input. Sem esse sinal, o diálogo compartilhado não distingue o valor do mês do valor em lote.

**Alternatives considered**: Auto-foco nativo do navegador em vários campos. Rejeitado porque mais de um campo disputaria o foco. Procurar o campo pelo texto do rótulo dentro do diálogo. Rejeitado porque o rótulo visível pode mudar e o teste fica frágil.

## 4. Texto de Arquivar e um só armado

**Decision**: O estado armado sobe para a lista do Orçamento, que guarda o id de no máximo um item. O botão fica controlado. Texto visível: "Arquivar", depois "Arquivar {nome}?", e "…" enquanto grava. O nome anunciado é sempre "Arquivar {nome}", "Arquivar {nome}?" ou "Arquivando {nome}", independente da dica. A dica deixa de ser o único lugar do nome.

**Rationale**: Cada botão com estado próprio permite dois "Arquivar Luz?" e "Arquivar Aluguel?" ao mesmo tempo. A spec proíbe isso. O texto visível curto no primeiro passo evita repetir o nome que a linha já mostra. Quem ouve a tela precisa do nome antes do passo que grava.

**Alternatives considered**: Só um nome acessível, com o segundo passo ainda dizendo "Confirmar?". Rejeitado na decisão de 17 nov 2026. Diálogo extra pedindo o nome. Rejeitado. Copiar o Android, que mostra o nome já no primeiro texto visível. Rejeitado para o computador. A spec 032 permanece diferente de propósito.

## 5. Região principal e salto

**Decision**: Cada uma das quatro telas envolve o conteúdo numa região principal com o destino `conteudo`. O chrome ganha, como primeiro controle, o salto "Ir para o conteúdo" para `#conteudo`. A região que Ajustes já tem recebe o mesmo destino, sem segunda região. O chrome continua um bloco, não uma região principal. O salto fica escondido até receber foco.

**Rationale**: Uma região em volta de todas as páginas do chrome aninharia com a de Ajustes. Quatro regiões nas páginas, mais o id na região já existente, deixam o salto único.

**Alternatives considered**: Região principal só no chrome e remover a de Ajustes. Rejeitado porque a spec manda conservar a região de Ajustes. Quatro saltos diferentes. Rejeitado porque o chrome é compartilhado.

## 6. O que automatizar

**Decision**: Vitest cobre o texto visível, o nome anunciado e o índice do mês. Foco, Escape e salto ficam no roteiro manual de `quickstart.md`.

**Rationale**: O repositório não tem teste de navegador. Fingir foco num teste de unidade não prova o teclado. A parte pura é pequena e estável.

**Alternatives considered**: Exigir Playwright nesta fatia. Adiado: a dependência existe, a suíte não. Instalar navegador só para este gap atrasa um conserto de teclado que o PM verifica em um minuto.
