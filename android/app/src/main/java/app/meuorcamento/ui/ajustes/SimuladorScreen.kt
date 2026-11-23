package app.meuorcamento.ui.ajustes

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
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
import app.meuorcamento.ui.lancamentos.CartaoDto
import app.meuorcamento.ui.lancamentos.CartoesResponse
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import java.io.IOException
import java.util.Calendar
import java.util.Locale

@Serializable
private data class SimularBody(val data: String, val parcelas: Int, val diaFechamento: Int? = null)

@Serializable
private data class SimularResp(val primeira: String? = null, val parcelas: List<String> = emptyList())

@Composable
fun SimuladorScreen(
    api: ApiClient,
    onBack: () -> Unit,
    onUnauthorized: () -> Unit,
) {
    var cartoes by remember { mutableStateOf<List<CartaoDto>>(emptyList()) }
    var indice by remember { mutableIntStateOf(0) }
    var data by remember { mutableStateOf("2026-05-26") }
    var parcelas by remember { mutableStateOf("3") }
    var linhas by remember { mutableStateOf<List<String>>(emptyList()) }
    var error by remember { mutableStateOf<String?>(null) }
    var offline by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    androidx.compose.runtime.LaunchedEffect(Unit) {
        scope.launch {
            try {
                cartoes = api.json.decodeFromString(CartoesResponse.serializer(), api.get("/api/v1/cartoes")).cartoes
                    .filter { it.ativo }
            } catch (e: ApiException) {
                if (e.status == 401) onUnauthorized() else error = e.message
            } catch (e: IOException) {
                offline = true
                error = e.message
            }
        }
    }

    Column(Modifier.fillMaxSize()) {
        BarraTitulo("Simulador de competência", onAnterior = onBack, rotuloAnterior = "Voltar")
        Column(
            Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 16.dp),
        ) {
            OfflineBanner(offline || error != null, error)
            Text("Prévia da regra de fatura. Compra no dia do fechamento ou depois vai para a fatura seguinte.")
            if (cartoes.isEmpty()) {
                Text("Cadastre um cartão ativo para simular.", modifier = Modifier.padding(top = 12.dp))
            } else {
                val cartao = cartoes[indice.coerceIn(0, cartoes.lastIndex)]
                TextButtonCartao(cartao) {
                    indice = (indice + 1) % cartoes.size
                }
                OutlinedTextField(value = data, onValueChange = { data = it }, label = { Text("Data da compra") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = parcelas, onValueChange = { parcelas = it.filter(Char::isDigit) }, label = { Text("Parcelas") }, modifier = Modifier.fillMaxWidth())
                Button(onClick = {
                    scope.launch {
                        error = null
                        try {
                            val body = api.json.encodeToString(
                                SimularBody(data.trim(), parcelas.toIntOrNull() ?: 1, cartao.diaFechamento),
                            )
                            val resp = api.json.decodeFromString(SimularResp.serializer(), api.postJson("/api/v1/competencia/simular", body))
                            linhas = resp.parcelas.mapIndexed { i, comp ->
                                "Parcela ${i + 1}/${resp.parcelas.size} · ${mesCivil(comp)}"
                            }
                        } catch (e: ApiException) {
                            if (e.status == 401) onUnauthorized() else error = e.message
                            linhas = emptyList()
                        } catch (e: IOException) {
                            offline = true
                            error = e.message
                        }
                    }
                }, modifier = Modifier.padding(top = 8.dp)) { Text("Ver competência") }
                linhas.forEach { Text(it, modifier = Modifier.padding(top = 8.dp)) }
            }
        }
    }
}

@Composable
private fun TextButtonCartao(cartao: CartaoDto, onClick: () -> Unit) {
    androidx.compose.material3.TextButton(onClick = onClick) {
        val fecha = cartao.diaFechamento?.let { " · fecha $it" } ?: " · sem fechamento"
        Text("${cartao.apelido}$fecha")
    }
}

private fun mesCivil(comp: String): String {
    val partes = comp.split("-")
    val ano = partes.getOrNull(0)?.toIntOrNull() ?: return comp
    val mes = partes.getOrNull(1)?.toIntOrNull() ?: return comp
    val cal = Calendar.getInstance()
    cal.set(ano, mes - 1, 1)
    val nome = cal.getDisplayName(Calendar.MONTH, Calendar.LONG, Locale("pt", "BR")) ?: return comp
    return "$nome de $ano"
}
