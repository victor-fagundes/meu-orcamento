# Contract: Aparência do Android

Contrato de apresentação. A API não muda. Os números continuam os das specs 028 e 030–036.

## Casca

- Barra de cima, telas de mês: "novembro de 2026", botões com nome "Mês anterior" e "Próximo mês". Sem segundo título com o nome do destino.
- Barra de cima, Ano: o ano confirmado. A grade anterior permanece se o pedido falhar.
- Barra de cima, Ajustes: "Ajustes".
- Barra de baixo: Resumo, Orçamento, Lançamentos, Ano, Ajustes. Ícone, nome e pílula no ativo. A pílula usa o contentor azul, não o amarelo.
- Tema do aparelho. Troca de tema repinta sem seletor e sem novo login.

## Resumo

Ordem: barra do mês, rótulo "Ainda pode gastar" ou "Passou do orçado", valor em display, frase, barra de 4 dp, quatro linhas (Receitas, Despesas fixas, Despesas variáveis, Anuais). Cada linha tem realizado à direita e planejado no detalhe. Toque abre o Orçamento no tipo.

## Entrada

Marca amarela com M, "Meu Orçamento", campos, um botão preenchido ("Entrar" ou "Cadastrar") e uma ação de texto ("Criar conta" ou "Já tenho conta"). Falha conserva o que foi digitado. Sem rede mostra aviso recuperável. Conta de demonstração na versão publicada não abre sessão.

## Orçamento

Chips Receitas, Fixas, Variáveis, Anuais. "Ainda cabe em {tipo}" em display. Linha de grupo com frase e barra. Zerados só sob "Sem movimento neste mês". Painel pela base, canto superior de 28 dp. Cancelar, fora e voltar não gravam.

## Lançamentos, Ano, Ajustes

Mesma barra, lista com valor à direita e um único botão preenchido quando há ação principal. Ajustes não ganha exclusão de conta. "Esqueci a senha" permanece onde já está.

## Fora

Computador, login do site, botão flutuante, cache local e mudança de cálculo.
