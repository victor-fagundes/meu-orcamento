# Design system · Meu Orçamento · v0.1

Este é o índice do sistema. Cada documento tem um papel.

| Documento | O que contém | Dono |
|---|---|---|
| `tokens.css` e `TOKENS.md` | Cores, tipo, espaço, raio, elevação e movimento | Design |
| `COMPONENTES.md` | Fichas dos componentes, com estados, medidas e acessibilidade | Design |
| `MICROCOPY.md` | Glossário, padrões de texto e formatos pt-BR | Produto |
| `TEMA-ESCURO.md` | Proposta de cores do tema escuro | Design |
| `../DECISOES_identidade_visual.md` | Decisões de marca e de layout | Produto |
| `../DECISAO_padroes_de_interface.md` | Decisões de padrão e de funcionalidade | Produto |

## Movimento (regras de uso)
- Abertura de sheet e painel: 300 ms, com o easing dos tokens.
- Snackbar entra e sai em 200 ms.
- Mudança de aba e de chip: 150 ms.
- Com "reduzir movimento" ativo, tudo acontece sem animação.
- Nenhuma animação em loop.

## Plataforma
- **Comum ao celular e ao web:** tokens, componentes, textos e cores.
- **Só celular:** barra inferior, FAB, sheet.
- **Só web:** barra lateral, painel lateral, tabela, diálogo centralizado para confirmação.
- Quando uma tela muda de plataforma, o componente é o mesmo; só o contêiner muda.

## Governança
- **Quem aprova mudança de token ou de componente:** Design, com validação de produto quando afetar regra de negócio.
- **Como propor:** uma nota curta com o problema, a proposta, a tela afetada e o impacto nas telas existentes.
- **Versão:** v0.1 agora. Mudança de valor de token é uma minor (v0.x). Mudança de componente que quebra uma tela é major.
- **Sincronização Figma ↔ código:** o nome de cada variável do Figma é o nome da variável CSS. Quem muda um lado atualiza o outro no mesmo dia.

## Checklist de revisão de tela
Antes de considerar uma tela pronta:
1. Usa só cores e medidas dos tokens.
2. Tem no máximo um botão principal.
3. Ação destrutiva fora da linha da lista e com confirmação adequada.
4. Textos seguem o glossário e o padrão de erro, sucesso e vazio.
5. Valores em pt-BR e com dígitos tabulares quando for tabela.
6. Todo ícone sem texto tem nome acessível.
7. Estados completos: padrão, foco, desabilitado, erro e vazio, quando existirem.
8. Foco visível e contraste mínimo de 4,5:1 para texto.
9. Funciona com "reduzir movimento".
10. Mensagem de estado não depende só da cor.

## Verificação
- **Automática:** teste de contraste nas combinações de token, e teste de acessibilidade por tela (nome e foco).
- **Visual:** revisão em celular e desktop, em navegador real, antes de cada publicação.
- **Humana:** teste de usabilidade com cinco pessoas, nas tarefas do one-pager.

## Pendências para fechar a v1.0
- Aprovar a escala de espaço e o mapeamento (já proposto em `TOKENS.md`).
- Aprovar a paleta escura e rodar o teste de contraste.
- Confirmar a fonte (Manrope embutida ou Roboto).
- Refletir as variáveis no Figma.
- Aplicar a ficha de componentes nos artefatos, tela por tela.
