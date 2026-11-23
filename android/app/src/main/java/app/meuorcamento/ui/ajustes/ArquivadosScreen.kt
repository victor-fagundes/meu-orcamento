package app.meuorcamento.ui.ajustes

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.meuorcamento.data.ApiClient
import app.meuorcamento.data.ApiException
import app.meuorcamento.ui.BarraTitulo
import app.meuorcamento.ui.LinhaValor
import app.meuorcamento.ui.OfflineBanner
import app.meuorcamento.ui.resumo.labelTipo
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import java.io.IOException

@Serializable
data class ArquivadoDto(val id: String, val tipo: String, val grupo: String, val nome: String)

@Serializable
data class ArquivadosResponse(val itens: List<ArquivadoDto> = emptyList())

@Composable
fun ArquivadosScreen(
    api: ApiClient,
    onBack: () -> Unit,
    onUnauthorized: () -> Unit,
) {
    var itens by remember { mutableStateOf<List<ArquivadoDto>>(emptyList()) }
    var error by remember { mutableStateOf<String?>(null) }
    var offline by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        scope.launch {
            try {
                itens = api.json.decodeFromString(
                    ArquivadosResponse.serializer(),
                    api.get("/api/v1/itens?escopo=arquivados"),
                ).itens
            } catch (e: ApiException) {
                if (e.status == 401) onUnauthorized() else error = e.message
            } catch (e: IOException) {
                offline = true
                error = e.message
            }
        }
    }

    Column(Modifier.fillMaxSize()) {
        BarraTitulo("Itens arquivados", onAnterior = onBack, rotuloAnterior = "Voltar")
        OfflineBanner(offline || error != null, error)
        Text(
            "Arquivados não entram em novos lançamentos nem na lista ativa do Orçamento.",
            modifier = Modifier.padding(horizontal = 16.dp),
        )
        if (itens.isEmpty() && error == null) {
            Text("Nenhum item arquivado.", modifier = Modifier.padding(16.dp))
        }
        LazyColumn(Modifier.weight(1f).padding(horizontal = 16.dp)) {
            items(itens, key = { it.id }) { item ->
                LinhaValor(
                    nome = item.nome,
                    valor = "",
                    detalhe = "${labelTipo(item.tipo)} · ${item.grupo}",
                )
            }
        }
    }
}
