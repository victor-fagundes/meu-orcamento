package app.meuorcamento.ui.ajustes

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
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
import app.meuorcamento.ui.OfflineBanner
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import java.io.IOException

@Serializable
private data class ExemploResp(val ok: Boolean = false, val updated: Int = 0)

@Composable
fun ExemploScreen(
    api: ApiClient,
    onBack: () -> Unit,
    onUnauthorized: () -> Unit,
) {
    var arm by remember { mutableStateOf(false) }
    var msg by remember { mutableStateOf<String?>(null) }
    var error by remember { mutableStateOf<String?>(null) }
    var offline by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    Column(Modifier.fillMaxSize().padding(horizontal = 16.dp)) {
        BarraTitulo("Dados de exemplo", onAnterior = onBack, rotuloAnterior = "Voltar")
        OfflineBanner(offline || error != null, error)
        Text("Preenche o planejamento de alguns itens com valores ilustrativos. Não cria lançamentos. Só roda se você confirmar.")
        Button(onClick = {
            if (!arm) {
                arm = true
                msg = "Toque de novo para confirmar."
                return@Button
            }
            scope.launch {
                try {
                    val resp = api.json.decodeFromString(ExemploResp.serializer(), api.postJson("/api/v1/catalogo/exemplo", "{}"))
                    arm = false
                    msg = "${resp.updated} itens atualizados com plano de exemplo."
                    error = null
                } catch (e: ApiException) {
                    if (e.status == 401) onUnauthorized() else error = e.message
                } catch (e: IOException) {
                    offline = true
                    error = e.message
                }
            }
        }, modifier = Modifier.padding(top = 16.dp)) {
            Text(if (arm) "Confirmar exemplo?" else "Carregar exemplo")
        }
        msg?.let { Text(it, modifier = Modifier.padding(top = 12.dp)) }
    }
}
