# Contract: Sheet global

## Abrir

Em qualquer seção de `/app`, “Novo lançamento” abre o formulário que hoje está em Lançamentos: tipo, item, descrição, valor, data, pagamento.

- Largo: diálogo no centro.
- Estreito: folha pela base, com alça.
- Itens e cartões são os ativos da sessão.
- O mês sugerido é o `mes` válido da URL, senão o mês corrente.
- O item inicial de mesmo nome segue a preferência da spec 022.

## Fechar sem gravar

Cancelar, Escape e toque fora fecham e devolvem o foco ao controle que abriu. Nada é persistido.

## Gravar

O confirmar chama a action atual. Competência, parcelas e centavos saem das mesmas funções de hoje. A lista de Lançamentos, no mês afetado, mostra o valor em reais.

## Os outros formulários

Editar lançamento, plano do item e novo item usam o mesmo wrapper (diálogo ou folha) e os mesmos campos de hoje. Não passam a ser globais: continuam abrindo na tela deles.
