package app.meuorcamento.ui.ano

import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.meuorcamento.data.ApiClient
import app.meuorcamento.data.ApiException
import app.meuorcamento.domain.formatCentavos
import app.meuorcamento.ui.OfflineBanner
import kotlinx.serialization.Serializable
import java.io.IOException
import java.util.Calendar

private val MESES = listOf("jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez")

@Serializable
data class AnoResponse(
    val ano: String,
    val planejado: List<AnoCellDto> = emptyList(),
    val realizado: List<AnoCellDto> = emptyList(),
)

@Serializable
data class AnoCellDto(
    val id: String? = null,
    val tipo: String,
    val grupo: String,
    val nome: String? = null,
    val valoresCentavos: List<Long> = emptyList(),
)

@Composable
fun AnoScreen(api: ApiClient, onUnauthorized: () -> Unit) {
    var pedido by remember { mutableIntStateOf(Calendar.getInstance().get(Calendar.YEAR)) }
    var confirmado by remember { mutableIntStateOf(pedido) }
    var data by remember { mutableStateOf<AnoResponse?>(null) }
    var offline by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(pedido) {
        offline = false
        error = null
        try {
            val body = api.get("/api/v1/ano?ano=$pedido")
            data = api.json.decodeFromString(AnoResponse.serializer(), body)
            confirmado = pedido
        } catch (e: ApiException) {
            if (e.status == 401) onUnauthorized() else error = e.message
        } catch (e: IOException) {
            offline = true
            error = e.message
        }
    }

    val grade = data
    val vazio = grade != null &&
        grade.planejado.none { it.valoresCentavos.any { v -> v > 0 } } &&
        grade.realizado.none { it.valoresCentavos.any { v -> v > 0 } }

    Column(
        Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
    ) {
        Text("Ano $confirmado", style = MaterialTheme.typography.headlineSmall)
        Row {
            TextButton(onClick = { pedido = confirmado - 1 }) { Text("Ano anterior") }
            TextButton(onClick = { pedido = confirmado + 1 }) { Text("Próximo ano") }
        }
        OfflineBanner(offline || error != null, error)
        when {
            grade == null -> Text("Não foi possível carregar o ano.")
            vazio -> Text("Este ano ainda não tem valores.")
            else -> {
                grade.realizado.forEach { cell ->
                    val plano = grade.planejado.find { it.id == cell.id }?.valoresCentavos.orEmpty()
                    Column(Modifier.padding(vertical = 8.dp)) {
                        Text(
                            cell.nome ?: cell.grupo,
                            style = MaterialTheme.typography.titleMedium,
                        )
                        Row(Modifier.horizontalScroll(rememberScrollState())) {
                            MESES.forEachIndexed { index, nome ->
                                Column(Modifier.width(88.dp).padding(end = 8.dp)) {
                                    Text(nome, style = MaterialTheme.typography.labelSmall)
                                    Text(
                                        formatCentavos(cell.valoresCentavos.getOrElse(index) { 0L }),
                                        maxLines = 1,
                                        softWrap = false,
                                    )
                                    Text(
                                        "plano ${formatCentavos(plano.getOrElse(index) { 0L })}",
                                        maxLines = 1,
                                        softWrap = false,
                                        style = MaterialTheme.typography.bodySmall,
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
