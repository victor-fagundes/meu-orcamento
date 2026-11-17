# Contract: Lançamentos no Android

| Ação | Rota | Efeito |
|------|------|--------|
| Listar | `GET /api/v1/lancamentos?competencia=` | Linhas do mês |
| Criar | `POST /api/v1/lancamentos` | 201 ou 400 com a mensagem do domínio |
| Corrigir | `PATCH /api/v1/lancamentos/{id}` | Mesmos campos, mais `scope` se parcelado |
| Apagar | `DELETE /api/v1/lancamentos/{id}` | Depois da confirmação |

Valor ilegível, zero ou negativo: nenhuma dessas rotas é chamada.

Item arquivado não aparece na escolha de um lançamento novo.
