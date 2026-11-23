package app.meuorcamento.ui.ajustes

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
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
import app.meuorcamento.ui.OfflineBanner
import app.meuorcamento.ui.lancamentos.CartaoDto
import app.meuorcamento.ui.lancamentos.CartoesResponse
import kotlinx.coroutines.launch
import kotlinx.serialization.encodeToString
import java.io.IOException

@Composable
fun CartoesAjusteScreen(
    api: ApiClient,
    onBack: () -> Unit,
    onUnauthorized: () -> Unit,
) {
    var cartoes by remember { mutableStateOf<List<CartaoDto>>(emptyList()) }
    var offline by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var cartaoSair by remember { mutableStateOf<CartaoDto?>(null) }
    var apelido by remember { mutableStateOf("") }
    var diaFecha by remember { mutableStateOf("10") }
    var diaVenc by remember { mutableStateOf("17") }
    val scope = rememberCoroutineScope()

    fun reload() {
        scope.launch {
            offline = false
            error = null
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

    LaunchedEffect(Unit) { reload() }

    Column(Modifier.fillMaxSize()) {
        BarraTitulo("Cartões", onAnterior = onBack, rotuloAnterior = "Voltar")
        Column(
            Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 16.dp),
        ) {
            OfflineBanner(offline || error != null, error)
            if (cartoes.isEmpty()) Text("Nenhum cartão ativo", modifier = Modifier.padding(vertical = 8.dp))
            cartoes.forEach { c ->
                TextButton(onClick = { cartaoSair = c }) {
                    val fecha = c.diaFechamento?.let { " · fecha dia $it" } ?: ""
                    Text("${c.apelido}$fecha · Desativar")
                }
            }
            OutlinedTextField(value = apelido, onValueChange = { apelido = it }, label = { Text("Novo apelido") }, modifier = Modifier.fillMaxWidth())
            OutlinedTextField(value = diaFecha, onValueChange = { diaFecha = it }, label = { Text("Dia fechamento") }, modifier = Modifier.fillMaxWidth())
            OutlinedTextField(value = diaVenc, onValueChange = { diaVenc = it }, label = { Text("Dia vencimento") }, modifier = Modifier.fillMaxWidth())
            Button(onClick = {
                if (apelido.isBlank()) {
                    error = "Informe o apelido do cartão."
                    return@Button
                }
                scope.launch {
                    try {
                        api.postJson(
                            "/api/v1/cartoes",
                            api.json.encodeToString(NewCartaoBody(apelido.trim(), diaFecha.toIntOrNull() ?: 10, diaVenc.toIntOrNull() ?: 17)),
                        )
                        apelido = ""
                        reload()
                    } catch (e: Exception) {
                        error = e.message
                    }
                }
            }, modifier = Modifier.padding(top = 8.dp)) { Text("Adicionar cartão") }
        }
    }

    cartaoSair?.let { cartao ->
        AlertDialog(
            onDismissRequest = { cartaoSair = null },
            title = { Text("Desativar ${cartao.apelido}") },
            text = { Text("O cartão sai dos pagamentos novos. Lançamentos antigos permanecem.") },
            confirmButton = {
                TextButton(onClick = {
                    cartaoSair = null
                    scope.launch {
                        try {
                            api.patchJson("/api/v1/cartoes", api.json.encodeToString(InativarCartaoBody(cartao.id)))
                            reload()
                        } catch (e: Exception) {
                            error = e.message
                        }
                    }
                }) { Text("Desativar") }
            },
            dismissButton = { TextButton(onClick = { cartaoSair = null }) { Text("Cancelar") } },
        )
    }
}
