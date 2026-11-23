package app.meuorcamento.ui.ano

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.meuorcamento.data.ApiClient
import app.meuorcamento.data.ApiException
import app.meuorcamento.domain.formatCentavos
import app.meuorcamento.ui.BarraTitulo
import app.meuorcamento.ui.LinhaValor
import app.meuorcamento.ui.OfflineBanner
import kotlinx.serialization.Serializable
import java.io.IOException
import java.util.Calendar

private val MESES = listOf("Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez")

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

    Column(Modifier.fillMaxSize()) {
        BarraTitulo(
            titulo = confirmado.toString(),
            onAnterior = { pedido = confirmado - 1 },
            onProximo = { pedido = confirmado + 1 },
            rotuloAnterior = "Ano anterior",
            rotuloProximo = "Próximo ano",
        )
        Column(
            Modifier
                .weight(1f)
                .padding(horizontal = 16.dp)
                .verticalScroll(rememberScrollState()),
        ) {
        OfflineBanner(offline || error != null, error)
        when {
            grade == null -> Text("Não foi possível carregar o ano.")
            else -> {
                val meses = MESES.mapIndexed { index, nome ->
                    val plano = grade.planejado.filter { it.tipo != "R" }.sumOf { it.valoresCentavos.getOrElse(index) { 0L } }
                    val real = grade.realizado.filter { it.tipo != "R" }.sumOf { it.valoresCentavos.getOrElse(index) { 0L } }
                    nome to (plano - real)
                }
                meses.chunked(2).forEach { par ->
                    Row(
                        Modifier.fillMaxWidth().padding(bottom = 8.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                    ) {
                        par.forEach { (nome, valor) ->
                            LinhaValor(
                                nome = nome,
                                valor = formatCentavos(valor),
                                cartao = true,
                                modifier = Modifier.weight(1f),
                            )
                        }
                    }
                }
            }
        }
        }
    }
}
