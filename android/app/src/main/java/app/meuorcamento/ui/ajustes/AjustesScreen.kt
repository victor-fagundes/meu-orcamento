package app.meuorcamento.ui.ajustes

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
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
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.unit.dp
import app.meuorcamento.data.ApiClient
import app.meuorcamento.data.ApiException
import app.meuorcamento.data.AuthRepository
import app.meuorcamento.ui.OfflineBanner
import app.meuorcamento.ui.lancamentos.CartaoDto
import app.meuorcamento.ui.lancamentos.CartoesResponse
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import java.io.IOException

@Serializable
data class ContaResponse(val email: String? = null, val resetPasswordUrl: String? = null)

@Serializable
data class LimitesResponse(val limites: LimitesDto? = null)

@Serializable
data class LimitesDto(val globalPct: Int = 80)

@Serializable
data class SaveLimitesBody(val globalPct: Int, val cats: Map<String, Int> = emptyMap())

@Serializable
data class InativarCartaoBody(val id: String, val inativar: Boolean = true)

@Serializable
data class NewCartaoBody(
    val apelido: String,
    val diaFechamento: Int,
    val diaVencimento: Int,
)

@Composable
fun AjustesScreen(
    api: ApiClient,
    auth: AuthRepository,
    onUnauthorized: () -> Unit,
    onSignedOut: () -> Unit,
    onImportPlanilha: () -> Unit,
    onImportPdf: () -> Unit,
    onExport: () -> Unit,
) {
    var email by remember { mutableStateOf<String?>(null) }
    var resetUrl by remember { mutableStateOf<String?>(null) }
    var cartoes by remember { mutableStateOf<List<CartaoDto>>(emptyList()) }
    var globalPct by remember { mutableStateOf("80") }
    var offline by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var salvoPct by remember { mutableStateOf("80") }
    var confirmarSaida by remember { mutableStateOf(false) }
    var cartaoSair by remember { mutableStateOf<CartaoDto?>(null) }
    var apelido by remember { mutableStateOf("") }
    var diaFecha by remember { mutableStateOf("10") }
    var diaVenc by remember { mutableStateOf("17") }
    val scope = rememberCoroutineScope()
    val uriHandler = LocalUriHandler.current

    fun reload() {
        scope.launch {
            offline = false
            error = null
            try {
                val conta = api.json.decodeFromString(ContaResponse.serializer(), api.get("/api/v1/conta"))
                email = conta.email
                resetUrl = conta.resetPasswordUrl
                cartoes = api.json.decodeFromString(CartoesResponse.serializer(), api.get("/api/v1/cartoes")).cartoes
                    .filter { it.ativo }
                val lim = api.json.decodeFromString(LimitesResponse.serializer(), api.get("/api/v1/limites"))
                val pct = (lim.limites?.globalPct ?: 80).toString()
                globalPct = pct
                salvoPct = pct
            } catch (e: ApiException) {
                if (e.status == 401) onUnauthorized() else error = e.message
            } catch (e: IOException) {
                offline = true
                error = e.message
            }
        }
    }

    LaunchedEffect(Unit) { reload() }

    Column(
        Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
    ) {
        Text("Ajustes", style = MaterialTheme.typography.headlineSmall)
        OfflineBanner(offline || error != null, error)
        Text("Conta: ${email ?: "—"}", modifier = Modifier.padding(vertical = 8.dp))
        Button(onClick = { resetUrl?.let { uriHandler.openUri(it) } }, enabled = !resetUrl.isNullOrBlank()) {
            Text("Esqueci a senha (web)")
        }
        Button(onClick = { confirmarSaida = true }, modifier = Modifier.padding(top = 8.dp)) { Text("Sair") }

        Text("Alertas — % global", style = MaterialTheme.typography.titleMedium, modifier = Modifier.padding(top = 16.dp))
        OutlinedTextField(value = globalPct, onValueChange = { globalPct = it.filter(Char::isDigit) }, modifier = Modifier.fillMaxWidth())
        Button(onClick = {
            val pct = globalPct.toIntOrNull()
            if (pct == null || pct !in 1..100) {
                error = "Informe um inteiro de 1 a 100."
                globalPct = salvoPct
                return@Button
            }
            scope.launch {
                try {
                    api.putJson("/api/v1/limites", api.json.encodeToString(SaveLimitesBody(pct)))
                    salvoPct = pct.toString()
                    reload()
                } catch (e: Exception) {
                    error = e.message
                }
            }
        }) { Text("Salvar limites") }

        Text("Cartões", style = MaterialTheme.typography.titleMedium, modifier = Modifier.padding(top = 16.dp))
        if (cartoes.isEmpty()) Text("Nenhum cartão ativo")
        cartoes.forEach { c ->
            Text("${c.apelido}")
            TextButton(onClick = { cartaoSair = c }) { Text("Desativar ${c.apelido}") }
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
                        api.json.encodeToString(
                            NewCartaoBody(apelido.trim(), diaFecha.toIntOrNull() ?: 10, diaVenc.toIntOrNull() ?: 17),
                        ),
                    )
                    apelido = ""
                    reload()
                } catch (e: Exception) {
                    error = e.message
                }
            }
        }) { Text("Adicionar cartão") }

        Text("Dados", style = MaterialTheme.typography.titleMedium, modifier = Modifier.padding(top = 24.dp))
        TextButton(onClick = onImportPlanilha) { Text("Importar planilha") }
        TextButton(onClick = onImportPdf) { Text("Importar PDF") }
        TextButton(onClick = onExport) { Text("Exportar") }
    }

    if (confirmarSaida) {
        AlertDialog(
            onDismissRequest = { confirmarSaida = false },
            title = { Text("Sair da conta") },
            text = { Text("A sessão desta conta será encerrada neste aparelho.") },
            confirmButton = {
                TextButton(onClick = {
                    confirmarSaida = false
                    scope.launch {
                        auth.signOut()
                        onSignedOut()
                    }
                }) { Text("Sair") }
            },
            dismissButton = { TextButton(onClick = { confirmarSaida = false }) { Text("Cancelar") } },
        )
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
                            api.patchJson(
                                "/api/v1/cartoes",
                                api.json.encodeToString(InativarCartaoBody(cartao.id)),
                            )
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
