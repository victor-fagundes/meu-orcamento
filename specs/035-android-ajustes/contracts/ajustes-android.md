# Contract: Ajustes no Android

| Ação | Rota | Quando não chama |
|------|------|------------------|
| Ver conta | `GET /api/v1/conta` | — |
| Listar cartões | `GET /api/v1/cartoes` | — |
| Criar cartão | `POST /api/v1/cartoes` | Apelido vazio |
| Desativar | A inativação já exposta em cartões | Sem confirmação |
| Ver e gravar limite | `GET` e `PUT /api/v1/limites` | Percentual fora de 1 a 100 |
| Sair | Sessão já existente | Sem confirmação |

Importar planilha, importar PDF e exportar são navegações para as rotas da spec 036.
