# Research: Trazer e levar dados no Android

## 1. Planilha

**Decision**: O arquivo continua indo para `POST /api/v1/import/planilha/parse`. Em seguida o aparelho chama `POST /api/v1/import/planilha/preview` e mostra as linhas. Linha que pede grupo fica sem gravar até a pessoa escolher. Confirmar manda `escolhas` para `POST /api/v1/import/planilha/confirm`. Cancelar apaga a prévia local e não chama confirm.

**Rationale**: A tela hoje confirma com a contagem de linhas, sem mostrar o que será gravado e sem `escolhas`. As regras já estão no preview e no confirm do servidor.

**Alternatives considered**: Parser de xlsx no aparelho. Rejeitado. Confirmar direto depois do parse, como hoje. Rejeitado pela spec.

## 2. Mês de chegada

**Decision**: A resposta do confirm de lançamentos inclui `abrirCompetencia`, resultado de `competenciaDestinoImport` com as competências gravadas e o mês corrente. O app grava esse mês na casca e abre Lançamentos. Importação de planejamento, que devolve competências vazias, não muda de mês. Fica no Orçamento do mês corrente, como a 025.

**Rationale**: Calcular o destino no Kotlin duplicaria a 025. A função já tem teste.

**Alternatives considered**: Abrir sempre o mês corrente. Rejeitado. A spec pede a mesma regra do computador.

## 3. PDF

**Decision**: `parse` mostra a prévia que a rota já devolve. Confirmar chama `import/pdf/confirm` com o cartão. Arquivo que o computador recusa não cria lançamento e a mensagem é a da rota. Cancelar não confirma.

**Rationale**: O limite e a leitura já são do servidor. A tela precisa da prévia e do cancelar, que hoje estão incompletos.

**Alternatives considered**: Ler o PDF no aparelho. Rejeitado.

## 4. Exportar

**Decision**: `GET /api/v1/export/csv` e `GET /api/v1/export/json` seguem como a partilha que a tela já faz. Falha no meio não oferece o arquivo como completo. Conta sem lançamentos avisa que não havia movimento.

**Rationale**: O conteúdo é o do computador porque a rota é a mesma. O buraco é apresentar um corpo parcial como arquivo pronto.

**Alternatives considered**: Gerar o arquivo no aparelho. Rejeitado.
