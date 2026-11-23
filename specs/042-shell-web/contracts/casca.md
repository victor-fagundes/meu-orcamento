# Contract: Casca logada

Contrato de tela. Não há rota HTTP nova. Os endereços abaixo são os que a pessoa já abre.

## Sessão

| Situação | Resultado |
|---|---|
| Sem sessão, em qualquer um dos cinco endereços | A casca não aparece. O redirect atual leva a `/login`. |
| Com sessão | Cabeçalho, navegação e a área. “Sair” encerra a sessão e abre `/login`, sem diálogo. |

## Navegação

Cinco botões, nesta ordem, com ícone decorativo e o nome visível: Resumo, Orçamento, Lançamentos, Ano, Ajustes.

| Largura | Barra | Medida |
|---|---|---|
| 720 px e 1280 px | Só a lateral | 240 px de largura |
| 719 px e 390 px | Só a inferior | 76 px de altura |

- Escolher a área abre o endereço dela.
- `aria-current="page"` fica só na área do caminho. Prefixo `/app/ajustes` marca Ajustes, inclusive numa subtela.
- Não há sexta aba.
- Mudar a largura não muda o endereço nem a aba marcada.

## Cabeçalho

- Título da área aberta.
- Com `pedeMes` falso: não há “Mês anterior” nem “Próximo mês”.
- Com `pedeMes` verdadeiro: os dois controles, com esses nomes, e o mês no título. Nesta história os cinco `pedeMes` são falsos.
- “Sair” é um botão de texto fora da navegação. Nome acessível “Sair”.

## Conteúdo

| Largura | Colunas | Margem lateral | Espaço | Outros |
|---|---|---|---|---|
| Abaixo de 720 px | 4 | 16 px | 16 px | O fim do conteúdo rola para cima da barra de 76 px |
| A partir de 720 px | 12 | 40 px | 24 px | O miolo das colunas não passa de 960 px |

O filho direto da área ocupa a largura inteira das colunas. Não há botão flutuante de criar em nenhuma largura.

## Teclado, tema, movimento

- O primeiro controle é “Ir para o conteúdo”.
- Cada controle da casca tem nome. O foco é visível.
- As cinco áreas abrem pelo teclado.
- Claro e escuro usam o tema já aplicado na página.
- A troca de área não anima. Com preferência de menos movimento, a duração dos tokens de movimento é 0 ms.
