# Quickstart: Material Design

Validação no navegador depois da implementação. O Vitest do domínio só precisa continuar verde. Ele não cobre esta história.

## Pré-requisitos

- App em `http://localhost:3000`
- Conta demo: `demo@local.test` / `demo1234`
- Referência visual: `prototype/Meu_Orcamento_material.html`
- Uma janela larga e uma estreita (abaixo de 720px)
- Tema claro e tema escuro do sistema

## 1. Casca

1. Entrar e abrir Resumo.
2. Esperado no largo: barra clara, marca amarela, abas com a ativa sublinhada em azul, botão azul “Novo lançamento”. Sem faixa navy e sem pílula de inicial.
3. Esperado no estreito: cinco itens com ícone e nome; o ativo tem pílula; o botão flutuante diz “Novo lançamento”.
4. Repetir no tema escuro. Esperado: as mesmas informações, superfície escura, azul ainda é a ação.

## 2. Resumo

1. No mês da conta demo, ler o bloco principal.
2. Esperado: rótulo “Ainda pode gastar”, porcentagem usada, total orçado e total gasto ainda visíveis.
3. Filtrar pagamento para um cartão. Esperado: orçado e “ainda pode gastar” viram “—”.
4. Limpar o filtro. “Ver detalhes” em Despesas fixas abre o Orçamento nesse tipo e nesse mês.
5. A rosca tem legenda. As barras separam planejado (azul) e realizado (amarelo) com os nomes por extenso.

## 3. Novo lançamento

1. No Resumo, abrir Novo lançamento, preencher um valor conhecido e salvar.
2. Esperado: o lançamento aparece na lista, no mês certo, com o mesmo valor em reais.
3. Abrir de novo e pressionar Escape. Esperado: fecha, nada novo é gravado, o foco volta ao botão.
4. No estreito, o formulário entra pela base e tem alça. No largo, é um diálogo.

## 4. Orçamento, Ano e Ajustes

1. Orçamento: chips com o tipo ativo preenchido. Grupo entre 80% e 100% fica amarelo. Acima de 100%, vermelho.
2. Ano: continua tabela. No estreito, desliza para o lado.
3. Ajustes: abrir importar planilha até a prévia e cancelar. Esperado: nenhum dado muda. Excluir conta sem digitar EXCLUIR não apaga.

## 5. Entrada

1. Sair. Login no largo ainda tem o painel da marca, com campo e botão no visual novo.
2. Senha errada mostra o erro e não entra.

## Teste automático

```bash
npm test
```

Esperado: a suíte de domínio que já existia continua verde. Falha nova só é aceitável se um teste de UI antigo depender de classe removida; nesse caso o teste passa a procurar o rótulo visível, sem afrouxar regra de domínio.
