# Research: Ajustes no Android

## 1. Conta e saída

**Decision**: `GET /api/v1/conta` mostra o e-mail. Sair pede confirmação e usa o fluxo de sessão que o app já tem. Depois de sair, o orçamento não permanece na tela. Redefinir senha continua o endereço que a conta já devolve. Esta spec não cria outro método.

**Rationale**: A rota já existe. A spec não pede exclusão de conta nesta fatia. O DELETE de conta fica de fora.

**Alternatives considered**: Incluir "excluir conta" porque a rota DELETE existe. Rejeitado. A spec 035 não pede isso.

## 2. Cartões

**Decision**: Lista os cartões ativos de `GET /api/v1/cartoes`. Criar manda o apelido. Apelido vazio não chama o POST. Desativar confirma e usa a inativação já exposta. Lançamentos antigos permanecem. Sem cartão ativo, lançamento novo não oferece cartão. Débito, PIX e dinheiro continuam.

**Rationale**: A tela de lançamentos já filtra `ativo`. Desativar não é apagar histórico.

**Alternatives considered**: Apagar o cartão e os lançamentos. Rejeitado.

## 3. Limite

**Decision**: `GET /api/v1/limites` mostra o percentual. Gravar só chama `PUT` se o número está entre 1 e 100. Fora disso, a mensagem diz o intervalo e o valor anterior fica.

**Rationale**: A spec fecha o intervalo. O servidor não deve ser o primeiro a recusar um valor que a tela já sabe inválido.

**Alternatives considered**: Mandar qualquer número e mostrar o erro cru. Rejeitado.

## 4. Entrada da 036

**Decision**: Três linhas no fim de Ajustes: importar planilha, importar PDF, exportar. Elas só navegam. Os botões que hoje estão acima de `AjustesScreen` no `AppNav` saem dali.

**Rationale**: A spec 035 pede o caminho. A spec 036 pede o fluxo. Os dois botões no mesmo lugar confundem a entrega.
