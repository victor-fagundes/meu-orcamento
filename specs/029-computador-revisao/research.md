# Research: Revisão pontual do computador

## 1. Ordem do Resumo

**Decision**: Em `resumo-dashboard.tsx`, a navegação do mês continua no topo. Em seguida vêm os três números, depois a média e os dias restantes, depois os filtros, depois os tipos e os gráficos.

**Rationale**: Hoje filtros e ritmo estão acima do hero. A spec pede os três números primeiro. Gráficos e a barra de cima ficam.

**Alternatives considered**: Mover os gráficos para o alto. Rejeitado. A spec manda conservá-los.

## 2. Filtro sem apagar o mês

**Decision**: Ainda pode gastar e total orçado usam sempre as despesas do mês inteiro. Com pagamento ou categoria filtrados, a frase diz quanto entrou naquele recorte e repete o quanto ainda pode gastar no mês. O total gasto filtrado continua visível como gasto do recorte, sem substituir o saldo do mês.

**Rationale**: O código hoje troca o hero por "—" quando o pagamento não é "Todas". A spec proíbe isso.

**Alternatives considered**: Recalcular "ainda pode gastar" só com o pagamento filtrado. Rejeitado. O protótipo mantém o mês e acrescenta a frase.

## 3. Nome dos atalhos

**Decision**: Trocar "Ver detalhes" por "Ver receitas", "Ver despesas fixas", "Ver despesas variáveis" e "Ver anuais". O endereço já leva `tipo`.

**Rationale**: Os quatro links são iguais hoje. O destino já distingue o tipo.

**Alternatives considered**: Ícone sem texto. Rejeitado.

## 4. Mês conserva o tipo

**Decision**: Os links de mês anterior e próximo em `orcamento-view.tsx` passam a incluir `tipo` junto de `mes`. A página já aplica `tipo` ao abrir.

**Rationale**: O endereço atual só tem `mes`, então o tipo volta ao padrão.

**Alternatives considered**: Guardar o tipo só na memória do componente. Rejeitado porque a troca de mês é uma navegação que remonta a página.

## 5. O que ainda cabe e grupos zerados

**Decision**: O cartão do tipo destaca plano do tipo menos realizado do tipo. Gasto e planejado ficam na mesma linha, menores. Grupos com plano e realizado zerados saem da lista principal e entram num controle "Sem movimento neste mês". Abrir o controle mostra esses grupos. Grupo com qualquer centavo positivo permanece na lista.

**Rationale**: `ordenarGrupos` já separa quem tem movimento. A spec só muda onde os zerados aparecem.

**Alternatives considered**: Esconder os zerados sem caminho de volta. Rejeitado.

## 6. Barra perto do limite

**Decision**: A marca em `.brand-mark` continua `#ffe600`. A barra `.track i.warn` no tema claro já está em `#8a7000`. No escuro ela usa `var(--tc)`, o amarelo da marca. O escuro passa a usar um tom que não é esse amarelo. A frase de estado continua.

**Rationale**: A spec veta o amarelo da marca na barra, não na marca nem na série de realizado.

**Alternatives considered**: Trocar o amarelo da marca. Rejeitado.
