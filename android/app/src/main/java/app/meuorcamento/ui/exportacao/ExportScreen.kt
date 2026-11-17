package app.meuorcamento.ui.exportacao

import android.content.Intent
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import app.meuorcamento.data.ApiClient
import app.meuorcamento.data.ApiException
import app.meuorcamento.ui.BarraTitulo
import app.meuorcamento.ui.OfflineBanner
import app.meuorcamento.ui.components.BotaoPrimario
import app.meuorcamento.ui.copy.Strings
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import java.io.IOException

@Serializable
private data class ExportJson(val lancamentos: List<ExportLanc> = emptyList())

@Serializable
private data class ExportLanc(val id: String = "")

@Composable
fun ExportScreen(api: ApiClient, onUnauthorized: () -> Unit) {
    var status by remember { mutableStateOf<String?>(null) }
    var offline by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val context = LocalContext.current

    fun share(path: String, type: String, name: String) {
        scope.launch {
            offline = false
            try {
                val body = api.get(path)
                if (body.isBlank()) {
                    status = "A exportação não veio completa."
                    return@launch
                }
                val semMovimento = if (name.endsWith(".json")) {
                    val parsed = runCatching {
                        api.json.decodeFromString(ExportJson.serializer(), body)
                    }.getOrNull()
                    if (parsed == null) {
                        status = "A exportação não veio completa."
                        return@launch
                    }
                    parsed.lancamentos.isEmpty()
                } else {
                    if (!body.contains("# lancamentos")) {
                        status = "A exportação não veio completa."
                        return@launch
                    }
                    body.substringAfter("# lancamentos").lineSequence().drop(2).none { it.isNotBlank() }
                }
                val send = Intent(Intent.ACTION_SEND).apply {
                    this.type = type
                    putExtra(Intent.EXTRA_TEXT, body)
                    putExtra(Intent.EXTRA_TITLE, name)
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                context.startActivity(Intent.createChooser(send, "Exportar $name"))
                status = if (semMovimento) "Não havia movimento para exportar." else "Export $name pronto"
            } catch (e: ApiException) {
                if (e.status == 401) onUnauthorized() else status = e.message
            } catch (e: IOException) {
                offline = true
                status = e.message
            }
        }
    }

    Column(Modifier.fillMaxSize()) {
        BarraTitulo("Exportar")
        Column(Modifier.padding(horizontal = 16.dp)) {
        OfflineBanner(offline, status)
        BotaoPrimario(
            text = Strings.exportarCsv,
            onClick = { share("/api/v1/export/csv", "text/csv", "meu-orcamento.csv") },
            modifier = Modifier.padding(top = 12.dp),
        )
        BotaoPrimario(
            text = Strings.exportarJson,
            onClick = { share("/api/v1/export/json", "application/json", "meu-orcamento.json") },
            modifier = Modifier.padding(top = 8.dp),
        )
        status?.let { Text(it, modifier = Modifier.padding(top = 12.dp)) }
        }
    }
}
