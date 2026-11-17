package app.meuorcamento.ui.theme

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.isSystemInDarkTheme

val AzulAcao = Color(0xFF0058BE)
val MarcaAmarela = Color(0xFFFFE600)
val AvisoClaro = Color(0xFF8A7000)
val AvisoEscuro = Color(0xFFD7B07A)

val ValorDisplay = TextStyle(
    fontSize = 45.sp,
    lineHeight = 52.sp,
    fontWeight = FontWeight.Normal,
    letterSpacing = (-0.02).em,
)

fun aviso(escuro: Boolean): Color = if (escuro) AvisoEscuro else AvisoClaro

private val claro = lightColorScheme(
    primary = AzulAcao,
    onPrimary = Color.White,
    primaryContainer = Color(0xFFD7E3FF),
    onPrimaryContainer = Color(0xFF001B3F),
    secondary = Color(0xFF545F73),
    onSecondary = Color.White,
    secondaryContainer = Color(0xFFDAE2F9),
    onSecondaryContainer = Color(0xFF131B2C),
    background = Color(0xFFF8F9FF),
    onBackground = Color(0xFF191C20),
    surface = Color(0xFFF8F9FF),
    onSurface = Color(0xFF191C20),
    surfaceVariant = Color(0xFFE6E8F0),
    onSurfaceVariant = Color(0xFF43474E),
    surfaceContainer = Color(0xFFECEEF6),
    error = Color(0xFFBA1A1A),
    onError = Color.White,
)

private val escuro = darkColorScheme(
    primary = Color(0xFFABC7FF),
    onPrimary = Color(0xFF002F67),
    primaryContainer = Color(0xFF004493),
    onPrimaryContainer = Color(0xFFD7E3FF),
    secondary = Color(0xFFBEC6DC),
    onSecondary = Color(0xFF283041),
    secondaryContainer = Color(0xFF3E4759),
    onSecondaryContainer = Color(0xFFDAE2F9),
    background = Color(0xFF111318),
    onBackground = Color(0xFFE1E2EA),
    surface = Color(0xFF111318),
    onSurface = Color(0xFFE1E2EA),
    surfaceVariant = Color(0xFF272A2F),
    onSurfaceVariant = Color(0xFFC3C6D0),
    surfaceContainer = Color(0xFF1D2024),
    error = Color(0xFFFFB4AB),
    onError = Color(0xFF690005),
)

@Composable
fun MeuOrcamentoTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = if (isSystemInDarkTheme()) escuro else claro,
        content = content,
    )
}

/** Marca amarela com a inicial. Não colore barra, chip, pílula nem aviso. */
@Composable
fun Marca(modifier: Modifier = Modifier) {
    Box(
        modifier
            .size(32.dp)
            .clip(RoundedCornerShape(10.dp))
            .background(MarcaAmarela),
        contentAlignment = Alignment.Center,
    ) {
        Text("M", color = Color(0xFF221B00), fontWeight = FontWeight.Bold, fontSize = 16.sp)
    }
}
