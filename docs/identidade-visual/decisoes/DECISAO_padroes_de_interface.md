# Decisão: nomes de saldo, padrões de interface e Ajustes

Data: 2026-11-21 · Status: adotada, aplicação parcial (ver "Pendências")

## 1. Nomes dos saldos
- "Ainda pode gastar" → **"Disponível neste mês"** (Resumo, app e web)
- "Saldo final" → **"Sobra no ano"** (Ano, app e web)
- Regra inalterada: Disponível = planejado de despesas − gasto de despesas. Sobra no ano = receitas − despesas.
- Motivo: os dois nomes eram confundidos. Os nomes novos dizem o horizonte.
- Atualizar PRD, specs e one-pager com estes nomes antes do desenvolvimento.

## 2. Ajustes
- Menu em dois grupos: **Dia a dia** (Conta, Cartões, Limites de alerta, Itens arquivados) e **Dados e arquivos** (Importar planilha, Importar fatura, Exportar, Dados de exemplo).
- "Excluir conta" isolado no fim, em vermelho.

## 3. Cor de estado
- Sucesso e "Dentro do planejado": **verde** (#2e7d32).
- Ação: azul (#0058be). Atenção e erro: tons já definidos.
- Exceção: "No limite do planejado" continua em azul, porque não é sucesso.

## 4. Botão de ação no celular
- Botão flutuante acima da barra inferior para a ação principal da aba: "+ Novo item" em Orçamento, "+ Registrar" em Lançamentos.

## Pendências
- Padrão de formulário: bottom sheet no celular, painel lateral de 460 px no web. Diálogo centralizado só para confirmações curtas. **Não aplicado nos artboards ainda.**
- Verde nos estados dos canvases: passada manual pendente.
- Tema escuro: depois da aprovação do tema claro.
- Verificação visual em navegador real: pendente, feita por pessoa.
- Telas faltantes: importações, primeiro passo de excluir conta e 404.

## 5. Gestão de categorias (V1)
- Ajustes > **Categorias e itens** (grupo Dia a dia), com duas abas: **Categorias** e **Itens arquivados** (somente leitura).
- Renomear categoria: atualiza o nome em todos os itens dela. Não permite nome repetido no mesmo tipo.
- Arquivar categoria: arquiva os itens dela. Lançamentos antigos continuam.
- Atalho **Gerenciar** no cabeçalho de cada tipo, no Orçamento.
- Novo item continua como caminho rápido e também cria categoria.
- Substitui a decisão D-07 para renomear e arquivar. Criar categoria sem item fica para a próxima versão.
