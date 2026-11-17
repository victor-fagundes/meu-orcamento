package app.meuorcamento.ui.importacao

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
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
import app.meuorcamento.domain.formatCentavos
import app.meuorcamento.ui.OfflineBanner
import app.meuorcamento.ui.lancamentos.CartaoDto
import app.meuorcamento.ui.lancamentos.CartoesResponse
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonElement
import kotlinx.serialization.json.contentOrNull
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import kotlinx.serialization.json.longOrNull
import java.io.IOException

@Serializable
data class ParsePdfResponse(
    val issuer: String? = null,
    val pages: Int = 0,
    val preview: JsonArray? = null,
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PdfImportScreen(api: ApiClient, onUnauthorized: () -> Unit) {
    var status by remember { mutableStateOf<String?>(null) }
    var offline by remember { mutableStateOf(false) }
    var preview by remember { mutableStateOf<JsonElement?>(null) }
    var cartaoId by remember { mutableStateOf("") }
    var cartoes by remember { mutableStateOf<List<CartaoDto>>(emptyList()) }
    var cartaoAberto by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val context = LocalContext.current

    val picker = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
        if (uri == null) return@rememberLauncherForActivityResult
        scope.launch {
            offline = false
            try {
                val bytes = context.contentResolver.openInputStream(uri)?.use { it.readBytes() }
                    ?: throw IOException("Não foi possível ler o PDF")
                if (bytes.size > 4 * 1024 * 1024) throw IOException("PDF maior que 4 MB")
                val name = uri.lastPathSegment ?: "fatura.pdf"
                val body = api.postMultipart("/api/v1/import/pdf/parse", name, bytes, "application/pdf")
                val parsed = api.json.decodeFromString(ParsePdfResponse.serializer(), body)
                preview = parsed.preview
                status = "PDF ${parsed.issuer ?: ""} · ${parsed.pages} pág · ${parsed.preview?.size ?: 0} linhas"
                cartoes = runCatching {
                    api.json.decodeFromString(CartoesResponse.serializer(), api.get("/api/v1/cartoes")).cartoes.filter { it.ativo }
                }.getOrDefault(emptyList())
            } catch (e: ApiException) {
                if (e.status == 401) onUnauthorized() else status = e.message
            } catch (e: IOException) {
                offline = true
                status = e.message
            }
        }
    }

    Column(
        Modifier
            .fillMaxSize()
            .padding(16.dp)
            .verticalScroll(rememberScrollState()),
    ) {
        Text("Importar PDF", style = MaterialTheme.typography.headlineSmall)
        OfflineBanner(offline, status)
        Button(onClick = { picker.launch("application/pdf") }) { Text("Escolher PDF") }
        val apelido = cartoes.find { it.id == cartaoId }?.apelido ?: "Cartão destino"
        ExposedDropdownMenuBox(expanded = cartaoAberto, onExpandedChange = { cartaoAberto = it }) {
            OutlinedTextField(
                value = apelido,
                onValueChange = {},
                readOnly = true,
                label = { Text("Cartão destino") },
                modifier = Modifier.menuAnchor().fillMaxWidth().padding(vertical = 8.dp),
                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(cartaoAberto) },
            )
            ExposedDropdownMenu(expanded = cartaoAberto, onDismissRequest = { cartaoAberto = false }) {
                cartoes.forEach { card ->
                    DropdownMenuItem(text = { Text(card.apelido) }, onClick = {
                        cartaoId = card.id
                        cartaoAberto = false
                    })
                }
            }
        }
        status?.let { Text(it) }
        (preview as? JsonArray)?.forEach { linha ->
            val obj = linha.jsonObject
            val desc = obj["desc"]?.jsonPrimitive?.contentOrNull ?: "Linha"
            val cents = obj["valCents"]?.jsonPrimitive?.longOrNull ?: 0L
            Text("$desc · ${formatCentavos(cents)}", modifier = Modifier.padding(top = 4.dp))
        }
        if (preview != null) {
            TextButton(onClick = { preview = null; status = "Prévia descartada" }) { Text("Cancelar") }
        }
        Button(
            enabled = preview != null && cartaoId.isNotBlank(),
            onClick = {
                scope.launch {
                    try {
                        @Serializable
                        data class Confirm(
                            val cartaoId: String,
                            val preview: JsonElement,
                            val estornoMode: String = "ignore",
                        )
                        val result = api.postJson(
                            "/api/v1/import/pdf/confirm",
                            api.json.encodeToString(Confirm(cartaoId, preview!!)),
                        )
                        status = "Confirmado: $result"
                    } catch (e: Exception) {
                        status = e.message
                        offline = e is IOException
                    }
                }
            },
        ) { Text("Confirmar PDF") }
    }
}
