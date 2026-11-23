# Quickstart: Acabamento do Android

Spec `Draft`. Este roteiro só vale depois de `ready` e da implementação. Os números são os da conta, não os do protótipo.

## Preparo

1. API de produção no ar, ou a local em `http://10.0.2.2:3000` no sabor dev.
2. Conta com pelo menos um mês de plano e gasto, um cartão ativo e, se possível, um item arquivado.
3. Instalar o APK prod debug por cima do que já está no aparelho, sem desinstalar. O arquivo traz `versionCode` 2 no nome.

## Gaveta e entrada

1. Olhar o ícone ao lado do quadro Ícone. Letra M no amarelo, na forma redonda e na quadrada.
2. Abrir pelo ícone. A primeira pintura é a marca no amarelo. Não aparece tela branca.
3. Sem sessão, a entrada mostra a frase "O que ainda cabe neste mês." e um único botão preenchido.
4. Entrar e chegar ao Resumo.

## Telas

Comparar cada tela com o quadro de mesmo nome em `prototype/2026-11-17-acabamento.html`.

1. Resumo: mês na barra, número principal o maior texto, medidor, quatro linhas. Tocar Despesas fixas abre o Orçamento nesse tipo.
2. Orçamento: um controle só, "Ainda cabe", grupos. Abrir o plano de um item, cancelar e confirmar que nada gravou. Arquivar mostra o nome.
3. Lançamentos: valor à direita e um "Registrar".
4. Ano: o ano da barra só troca a grade depois da resposta.
5. Ajustes: conta e os nove menus, com ícone. Excluir conta está em vermelho. A barra de baixo continua em Ajustes ao abrir importar e exportar.

## Menus novos

1. Simulador: com um cartão que fecha no dia 2, data 26/05/2026 e 3 parcelas, a primeira competência é junho de 2026. Nada é gravado.
2. Itens arquivados: a lista mostra os arquivados e não os devolve ao Orçamento ativo.
3. Dados de exemplo: o primeiro toque pede confirmação. O segundo atualiza planos e não cria lançamento.
4. Excluir conta: frase diferente de EXCLUIR não apaga. Não concluir a exclusão numa conta real neste roteiro. Usar só uma conta descartável se for preciso ver o fim do fluxo.

## Regressão curta

1. O valor que ainda pode gastar, no mesmo mês, é o de antes desta história.
2. Girar o aparelho não deita o app.
3. Tema escuro do aparelho mantém os mesmos rótulos e a marca amarela.
