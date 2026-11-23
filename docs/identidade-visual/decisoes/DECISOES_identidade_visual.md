# Decisões de identidade visual · Meu Orçamento

Data: 2026-11-21 · Vale para: app Android (PWA) e web (desktop 1280 px)
Status: **adotadas** salvo onde indicado como pendente.

## 1. Marca
- Símbolo: **carteira** em quadrado de fundo amarelo (#FFE600), com corpo preto arredondado, cartão saindo do topo, aba azul (#0058BE) e fecho amarelo.
- Nome: "Meu Orçamento" (com maiúsculas), à direita do símbolo.
- O amarelo é **só da marca**. Não é cor de destaque nem de estado.

## 2. Cores
| Função | Valor |
|---|---|
| Ação (botões, links, FAB) | #0058BE |
| Texto principal | #191C20 |
| Texto secundário | #43474E |
| Fundo da tela | #F8F9FF |
| Cartões e sheets | #FFFFFF |
| Linhas e divisórias | #E3E6EF |
| Campo e chip inativo | #ECEEF6 |
| Pílula de seleção | #D7E3FF (texto #001B3F) |
| Atenção | texto #6B4B00 · barra #9A6B00 · fundo #FFF3C4 |
| Erro | texto #410002 · fundo #FFDAD6 · barra e botão destrutivo #BA1A1A |
| Sucesso e "Dentro do planejado" | #2E7D32 |
| Estado "No limite do planejado" | azul de ação (não é sucesso) |

## 3. Tipografia
- Família: **Manrope** em tudo (pendente: ver item 10).
- Escala: valor principal 40/44 px no app e 56/60 px no web · título 28/32 · corpo 16/24 · apoio 14/20 · legenda 12/16.
- Números de tabela em 12 px, com colunas alinhadas.

## 4. Forma e espaço
- Cartões: raio 16 px (app) e 20 px (web).
- Campos, botões e chips: raio 14 px. Chips de filtro: 12 px.
- Sheets do celular: topo com raio 28 px e puxador cinza.
- Snackbar: fundo #2F3033, raio 14 px, texto claro.
- Alvo de toque: mínimo 48 px no celular.

## 5. Layout
- **Celular:** barra inferior com as 5 abas (Resumo, Orçamento, Lançamentos, Ano, Ajustes).
- **Desktop (a partir de 720 px):** barra lateral de 240 px com as mesmas 5 abas. Conteúdo com largura de 1280 px no artboard.
- **FAB (botão flutuante):** só no celular, no canto inferior direito, acima da barra. Mostra a ação principal de criação da aba: "+ Novo item" (Orçamento), "+ Registrar" (Lançamentos), "+ Adicionar cartão" e "+ Nova categoria" (dentro de Ajustes).
- **Web:** sem FAB. A ação de criação fica no cabeçalho da área de conteúdo.
- Estados vazios: título, uma frase de explicação e uma ação. No celular, a ação é o FAB; no web, é o botão dentro do cartão vazio.

## 6. Formulários e confirmações
- Formulário ou edição no **celular:** bottom sheet.
- Formulário ou edição no **web:** painel lateral de 460 px, com o fundo escurecido.
- **Confirmação curta** (excluir, arquivar, desativar): diálogo centralizado.
- Excluir conta: dois passos, com a frase EXCLUIR no segundo.
- Excluir lançamento: confirmação e desfazer por 10 segundos.

## 7. Estados e mensagens
- Banners: **atenção** (amarelo claro), **erro** (vermelho claro) e **info** (azul claro). O erro usa `role="alert"`, e o aviso usa `role="status"`.
- Snackbar de sucesso e de desfazer, na base da tela.
- Erro ao carregar: banner de erro, blocos cinza e botão "Tentar de novo".
- Erro ao salvar: os campos continuam preenchidos.
- Sessão expirada: banner de aviso com a informação de que nada foi perdido.
- Textos de estado do Orçamento: "Dentro do planejado", "Perto do limite · n%", "No limite do planejado", "Estourou em R$ x".

## 8. Nomes e microcopy
- Saldo do mês: **"Disponível neste mês"**.
- Saldo do ano: **"Sobra no ano"** (receitas menos despesas). Não é o mesmo que "Disponível neste mês".
- Ocultar valores: botão de olho ao lado do saldo principal, no Resumo.

## 9. Acessibilidade
- Padrão: WCAG 2.2 AA.
- Foco visível em todos os controles.
- Cor nunca é o único sinal: todo estado tem frase.
- Contraste mínimo de 4,5:1 para texto.

## 10. Pendências
- **Tema escuro:** não definido. No web, sem escolha anterior, vale o claro (PM, 2026-11-23). Escuro e Sistema continuam em Conta só quando a pessoa marca.
- **Fonte:** Manrope adotada, mas o produto ainda não confirmou (Roboto é o padrão Android).
- **Verificação visual:** ainda não feita em navegador real, em celular e desktop.
- **Categoria vazia no Orçamento:** não definido se aparece com "Nenhum item".
- **Importações (planilha, fatura, planejamento, duplicatas, PDF escaneado):** marcadas como V2 no protótipo, com telas no artefato do app.
- **Badges da tela Ano:** "Em curso" e "Planejado" propostos e aplicados no app, aguardando confirmação.
