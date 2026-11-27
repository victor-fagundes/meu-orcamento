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
import app.meuorcamento.ui.BarraTitulo
import app.meuorcamento.ui.OfflineBanner
import app.meuorcamento.ui.copy.Strings
import kotlinx.serialization.Serializable
import java.io.IOException
import java.util.Calendar

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

    Column(Modifier.fillMaxSize()) {
        BarraTitulo(
            titulo = confirmado.toString(),
            onAnterior = { pedido = confirmado - 1 },
            onProximo = { pedido = confirmado + 1 },
            rotuloAnterior = Strings.anoAnterior,
            rotuloProximo = Strings.proximoAno,
        )
        Column(
            Modifier
                .weight(1f)
                .padding(horizontal = 16.dp)
                .verticalScroll(rememberScrollState()),
        ) {
            OfflineBanner(offline || error != null, error)
            when {
                grade == null -> Text(Strings.erroCarregarAno, style = MaterialTheme.typography.bodyLarge)
                vazio -> Text("Este ano ainda não tem valores.", style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
                else -> {
                    grade.realizado.forEach { cell ->
                        val plano = grade.planejado.find { it.id == cell.id }?.valoresCentavos.orEmpty()
                        Column(Modifier.padding(vertical = 12.dp)) {
                            Text(
                                cell.nome ?: cell.grupo,
                                style = MaterialTheme.typography.titleMedium,
                            )
                            Row(Modifier.horizontalScroll(rememberScrollState()).padding(top = 8.dp)) {
                                Strings.mesesAbreviados.forEachIndexed { index, nome ->
                                    Column(Modifier.width(100.dp).padding(end = 12.dp)) {
                                        Text(nome, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                                        Text(
                                            formatCentavos(cell.valoresCentavos.getOrElse(index) { 0L }),
                                            maxLines = 1,
                                            softWrap = false,
                                            style = MaterialTheme.typography.bodyLarge,
                                        )
                                        Text(
                                            "${Strings.plano} ${formatCentavos(plano.getOrElse(index) { 0L })}",
                                            maxLines = 1,
                                            softWrap = false,
                                            style = MaterialTheme.typography.bodySmall,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant,
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
}
