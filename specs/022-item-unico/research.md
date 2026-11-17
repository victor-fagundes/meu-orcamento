# Research: Um item só no Orçamento

## 1. Onde o grupo “Despesas Fixas” nasce

**Decision**: A seção da planilha continua só para descobrir o tipo (R, F, V, E). Ela deixa de ser o grupo gravado.

**Rationale**: `sectionTipoGrupo` em `src/domain/import-planilha.ts` devolve `grupo: "Despesas Fixas"` (e os equivalentes). `importVfPlano` grava esse grupo. O catálogo padrão, em `buildCatalogSeeds`, já tem Moradia / Aluguel, Habitação / Luz, etc. O nome da aba duplica a tab do Orçamento.

**Alternatives considered**: Esconder o grupo na UI e manter a gravação. Rejeitado: o Novo lançamento continuaria com dois Aluguéis. Pedir grupo em toda linha. Rejeitado: a spec só pede escolha quando o nome é ambíguo.

## 2. O que conta como item do catálogo

**Decision**: Item ativo cujo grupo, comparado sem acento e sem diferença de maiúsculas, não é Receitas, Despesas Fixas, Despesas Variáveis nem Anuais. A comparação de nome reusa `normalizeHeader`.

**Rationale**: Esses quatro textos são os que a spec proíbe como grupo novo e são os nomes que a seção grava hoje. “Cartões” e “Importado” não são aba do Orçamento; não disparam a correção automática. Um único item do catálogo com o mesmo nome vence, mesmo se o tipo for outro (Luz variável).

**Alternatives considered**: Tratar só itens nascidos de `seedCatalog`. Rejeitado: um item criado à mão em Moradia também é o destino certo. Casar tipo e nome. Rejeitado pela clarificação 1A.

## 3. Nome que não existe e nome repetido

**Decision**: Zero matches no catálogo → tipo da seção e grupo Outros. Dois ou mais matches → a linha não confirma até a pessoa escolher um desses grupos. A escolha volta no confirm; o servidor recalcula a prévia e só então aplica a escolha. Sem escolha, a linha é rejeitada e nada daquela linha é gravado.

**Rationale**: O confirm da 020 já reconstrói a prévia no servidor a partir das linhas. A escolha não pode ser só estado do browser. Receitas não têm grupo Outros no catálogo; a spec manda Outros do tipo, então R|Outros pode nascer. Isso não cria o grupo proibido “Receitas”.

**Alternatives considered**: Cair no primeiro Outros da lista. Rejeitado: há Outros em mais de um tipo e a spec exige escolha quando o nome não é único.

## 4. Quando a duplicata já gravada some

**Decision**: `src/app/app/layout.tsx` chama a correção depois da sessão e antes do miolo de `/app`. Não há coluna nova. A segunda abertura não acha extra ativo, então não copia de novo e não rearquiva.

**Rationale**: A pessoa pode cair em Resumo, não na tela Orçamento. A spec pede o efeito antes da tela. Arquivar (`arquivado = 1`) já tira o item da lista ativa e do seletor (spec 003). Lançamentos permanecem no `itemId` antigo.

**Alternatives considered**: Flag `corrigidoEm` em `orcamentos`. Rejeitado: a varredura idempotente é menor e o efeito da segunda abertura é o mesmo. Botão em Ajustes. Rejeitado pela clarificação A.

## 5. Dois extras com valor no mesmo mês

**Decision**: Se o mês do catálogo está em zero e mais de um extra ativo tem centavos positivos, copia o maior inteiro. Todos os extras desse nome são arquivados.

**Rationale**: A clarificação deixou este caso de fora por ser raro na conta demo. O plano precisa de uma regra estável para o teste não depender da ordem do banco.

**Alternatives considered**: Somar os planos. Rejeitado: dois Aluguéis no mesmo mês virariam o dobro. Copiar o primeiro da query. Rejeitado: a ordem não é contrato.

## 6. Ordem da lista e item inicial do lançamento

**Decision**: Funções puras. Grupo com plano ou realizado maior que zero no mês aberto vem antes; empate por nome em pt-BR. No seletor, entre itens de mesmo nome, preferir plano do mês da competência, depois qualquer mês do ano com valor, depois o primeiro da lista atual.

**Rationale**: A tela já soma plano e realizado por grupo. O seletor hoje usa o primeiro item ativo e não recebe o plano. A página de Lançamentos passa o plano em centavos junto do item.

**Alternatives considered**: Ordenar só na UI, sem teste. Rejeitado: a constituição pede a regra no domínio quando a aplicação e a tela compartilham o critério.
