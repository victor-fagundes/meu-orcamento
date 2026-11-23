package app.meuorcamento.ui.ajustes

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Archive
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.CreditCard
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Download
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.PictureAsPdf
import androidx.compose.material.icons.filled.Science
import androidx.compose.material.icons.filled.UploadFile
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.unit.dp
import app.meuorcamento.data.ApiClient
import app.meuorcamento.data.ApiException
import app.meuorcamento.data.AuthRepository
import app.meuorcamento.ui.BarraTitulo
import app.meuorcamento.ui.ListaCartao
import app.meuorcamento.ui.OfflineBanner
import app.meuorcamento.ui.corDivisor
import app.meuorcamento.ui.theme.AzulAcao
import app.meuorcamento.ui.lancamentos.CartaoDto
import app.meuorcamento.ui.lancamentos.CartoesResponse
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
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
    onCartoes: () -> Unit,
    onLimites: () -> Unit,
    onImportPlanilha: () -> Unit,
    onImportPdf: () -> Unit,
    onExport: () -> Unit,
    onSimulador: () -> Unit,
    onArquivados: () -> Unit,
    onExemplo: () -> Unit,
    onExcluir: () -> Unit,
) {
    var email by remember { mutableStateOf<String?>(null) }
    var resetUrl by remember { mutableStateOf<String?>(null) }
    var cartoesSub by remember { mutableStateOf("Nenhum cartão ativo") }
    var limiteSub by remember { mutableStateOf("Preventivo em 80% do planejado") }
    var arquivadosSub by remember { mutableStateOf("Nenhum item arquivado") }
    var offline by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var confirmarSaida by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val uriHandler = LocalUriHandler.current

    LaunchedEffect(Unit) {
        scope.launch {
            offline = false
            error = null
            try {
                val conta = api.json.decodeFromString(ContaResponse.serializer(), api.get("/api/v1/conta"))
                email = conta.email
                resetUrl = conta.resetPasswordUrl
                val ativos = api.json.decodeFromString(CartoesResponse.serializer(), api.get("/api/v1/cartoes")).cartoes
                    .filter { it.ativo }
                val primeiro = ativos.firstOrNull()
                cartoesSub = if (primeiro == null) {
                    "Nenhum cartão ativo"
                } else {
                    val extra = if (ativos.size > 1) " · e mais ${ativos.size - 1}" else ""
                    val fecha = primeiro.diaFechamento?.let { " · fecha dia $it" } ?: ""
                    "${primeiro.apelido}$fecha$extra"
                }
                val lim = api.json.decodeFromString(LimitesResponse.serializer(), api.get("/api/v1/limites"))
                limiteSub = "Preventivo em ${lim.limites?.globalPct ?: 80}% do planejado"
                val arq = api.json.decodeFromString(ArquivadosResponse.serializer(), api.get("/api/v1/itens?escopo=arquivados"))
                arquivadosSub = if (arq.itens.isEmpty()) "Nenhum item arquivado" else "${arq.itens.size} fora da lista ativa"
            } catch (e: ApiException) {
                if (e.status == 401) onUnauthorized() else error = e.message
            } catch (e: IOException) {
                offline = true
                error = e.message
            }
        }
    }

    Column(Modifier.fillMaxSize()) {
        BarraTitulo("Ajustes")
        Column(
            Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState()),
        ) {
            OfflineBanner(offline || error != null, error)
            ListaCartao(Modifier.padding(horizontal = 16.dp, vertical = 8.dp)) {
            MenuLinha(
                icon = Icons.Filled.Person,
                titulo = email ?: "Conta",
                subtitulo = "Esqueci a senha · Sair",
                chevron = false,
                divisor = false,
                onClick = {},
                subtituloAcao = {
                    Text(
                        "Esqueci a senha",
                        style = MaterialTheme.typography.bodySmall,
                        color = if (resetUrl.isNullOrBlank()) MaterialTheme.colorScheme.onSurfaceVariant else AzulAcao,
                        modifier = Modifier.clickable(enabled = !resetUrl.isNullOrBlank()) {
                            resetUrl?.let { uriHandler.openUri(it) }
                        },
                    )
                    Text(" · ", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Text(
                        "Sair",
                        style = MaterialTheme.typography.bodySmall,
                        color = AzulAcao,
                        modifier = Modifier.clickable { confirmarSaida = true },
                    )
                },
            )
            MenuLinha(Icons.Filled.CreditCard, "Cartões", cartoesSub, onClick = onCartoes)
            MenuLinha(Icons.Filled.Notifications, "Limites de alerta", limiteSub, onClick = onLimites)
            MenuLinha(Icons.Filled.UploadFile, "Importar planilha", "CSV, XLSX ou ODS, com mapeamento", onClick = onImportPlanilha)
            MenuLinha(Icons.Filled.PictureAsPdf, "Importar fatura", "PDF com texto selecionável", onClick = onImportPdf)
            MenuLinha(Icons.Filled.Download, "Exportar", "Planilha do orçamento e dos lançamentos", onClick = onExport)
            MenuLinha(Icons.Filled.CalendarMonth, "Simulador de competência", "Em qual mês a compra no cartão entra", onClick = onSimulador)
            MenuLinha(Icons.Filled.Archive, "Itens arquivados", arquivadosSub, onClick = onArquivados)
            MenuLinha(Icons.Filled.Science, "Dados de exemplo", "Preenche o orçamento com um mês de demonstração", onClick = onExemplo)
            MenuLinha(Icons.Filled.Delete, "Excluir conta", "Apaga a conta e todos os dados", perigo = true, onClick = onExcluir)
            }
        }
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
}

@Composable
private fun MenuLinha(
    icon: ImageVector,
    titulo: String,
    subtitulo: String,
    perigo: Boolean = false,
    chevron: Boolean = true,
    divisor: Boolean = true,
    onClick: () -> Unit,
    subtituloAcao: (@Composable () -> Unit)? = null,
) {
    val cor = if (perigo) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.primary
    Column {
        if (divisor) HorizontalDivider(color = corDivisor())
        Row(
            Modifier
                .fillMaxWidth()
                .clickable(enabled = chevron, onClick = onClick)
                .padding(horizontal = 14.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(icon, contentDescription = null, tint = cor, modifier = Modifier.size(24.dp))
            Column(Modifier.padding(start = 12.dp).weight(1f)) {
                Text(titulo, style = MaterialTheme.typography.titleMedium, color = if (perigo) cor else MaterialTheme.colorScheme.onSurface)
                if (subtituloAcao != null) {
                    Row(verticalAlignment = Alignment.CenterVertically) { subtituloAcao() }
                } else {
                    Text(subtitulo, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            }
            if (chevron) Text("›", color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}
