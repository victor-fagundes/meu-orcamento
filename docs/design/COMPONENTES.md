# Componentes · Meu Orçamento · v0.1

Status: **proposta para aprovação**. Medidas usam os tokens de `tokens.css`. Tudo que não estiver listado aqui fica fora do sistema até ser aprovado.

Regra geral: todo componente tem os estados **padrão, foco, pressionado, desabilitado** e, quando faz sentido, **carregando** e **erro**. Foco visível em todos. Alvo de toque mínimo de 48 px no celular.

## Ícones
- Conjunto único: **Material Symbols (estilo outlined)**, tamanho 24 px, traço padrão. Ícone de 20 px só dentro de linha de lista.
- Ícone sem texto precisa de nome acessível. Ícone com texto é decorativo.

## Botões
| Variação | Uso | Visual |
|---|---|---|
| Primário | Uma ação principal por tela | Fundo `--md-action`, texto branco, raio `lg` |
| Secundário | Ação de apoio, como Cancelar ao lado de Salvar | Contorno, texto `--md-action` |
| Texto | Ação de baixa prioridade, como "Esqueci a senha" | Só texto `--md-action` |
| Destrutivo | Excluir, arquivar, sair | Fundo `--md-error`, texto branco |
- Altura 48 px. Largura total no celular; no web, largura do conteúdo da ação.
- Não usar mais de um primário por área.
- Acessibilidade: texto descreve a ação ("Excluir lançamento", não "Sim").

## Campos
- Altura 52 px no celular, 48 px no web. Fundo `--md-field`, raio `lg`, texto `body`.
- Rótulo acima, em `caption` e peso 700. Nunca só placeholder.
- Estados: vazio, preenchido, foco (contorno de 2 px em `--md-action`), erro (contorno `--md-error` + mensagem abaixo), desabilitado, somente leitura.
- Mensagem de erro sempre abaixo do campo, em `--md-error`, com o motivo ("Use pelo menos 8 caracteres").

## Chips
- Filtro e seleção de tipo. Raio `md`. Selecionado: fundo `--md-selected`, texto `--md-on-selected`.
- Nunca usar chip como botão de ação.

## Cartões e linhas de lista
- Cartão: fundo `--md-card`, raio `xl` (celular) ou `2xl` (web), sombra `1`.
- Linha: altura mínima 48 px, divisória `--md-line`, texto principal + apoio em `label`.
- Toque na linha abre a edição. Ação destrutiva não fica na linha; fica dentro da tela de edição.

## Medidor de progresso
- Altura 8 px, raio `full`, trilha `--md-line`.
- Cor por estado: azul de ação (no limite ou normal), `--md-warn-bar` (perto do limite), `--md-error` (estourou).
- Sempre acompanhado de frase de estado. Nunca só a cor.

## Banners
- Três tipos: **info** (`--md-selected`), **atenção** (`--md-warn-bg`) e **erro** (`--md-error-bg`).
- Raio `lg`, padding de 16 px. Erro usa `role="alert"`; atenção e info usam `role="status"`.
- Fica no topo da área de conteúdo, acima da lista.

## Snackbar
- Fundo `--md-snackbar`, texto `--md-snackbar-text`, raio `lg`.
- Aparece na base, por 10 segundos quando tem desfazer. Sem ação, some sozinho em 5 segundos.
- Uma mensagem por vez.

## FAB (somente celular)
- Botão estendido com texto (ex.: "+ Novo item"), fundo `--md-action`, raio `xl`, sombra `fab`.
- Posição: canto inferior direito, 16 px da borda, acima da barra inferior.
- Uma ação por tela. Não aparece em tela sem ação de criação.
- Não cobre conteúdo: a lista ganha margem inferior de 96 px.

## Barra de navegação
- Celular: barra inferior com 5 abas. Ícone 24 px + rótulo `caption`. Aba ativa com pílula `--md-selected`.
- Web: barra lateral de 240 px com as mesmas 5 abas, texto `label`, aba ativa com fundo `--md-selected`.
- Subseções de Ajustes não mudam a aba ativa; Ajustes continua marcada.

## Sheet (celular)
- Sobe de baixo, topo com raio `sheet` (28 px), puxador de 32 × 4 px.
- Para formulários e edições. Cancelar à esquerda, ação principal à direita.
- Fecha com toque fora e com botão Cancelar. Não fecha com dado digitado sem aviso.

## Painel lateral (web)
- Largura 460 px, altura total, sobreposição escurecida.
- Para formulários e edições. Fecha com Esc e com Cancelar.

## Diálogo (confirmação)
- Centralizado, raio `sheet`, largura até 440 px.
- Só para confirmação curta: excluir, arquivar, desativar, sair. Título com o nome do objeto ("Arquivar Lazer?").
- Ação destrutiva à direita, em vermelho. Cancelar à esquerda.
- Excluir conta: dois passos, com a frase EXCLUIR.

## Tabela (web)
- Cabeçalho em `caption` com fundo `#f2f3fb`. Números alinhados à direita, com dígitos tabulares.
- Linha de tipo em negrito; grupo com recuo de 22 px; item com recuo de 40 px.
- Coluna do mês ativo destacada em `--md-selected`.

## Estados vazios
- Título + uma frase + uma ação. Sem ilustração nesta versão.
- Celular: ação no FAB. Web: botão dentro do cartão vazio.

## Fora do sistema
- Modais de tela cheia.
- Tooltips (exceto em ícone sem texto no web).
- Carrosséis e abas dentro de abas.
- Cores fora de `tokens.css`.
