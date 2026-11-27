package app.meuorcamento.ui.theme

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp
import androidx.compose.foundation.isSystemInDarkTheme
import app.meuorcamento.R

val AzulAcao = Color(0xFF0058BE)
val MarcaAmarela = Color(0xFFFFE600)
val AvisoClaro = Color(0xFF8A7000)
val AvisoEscuro = Color(0xFFD7B07A)

val Manrope = FontFamily(
    Font(R.font.manrope_medium, FontWeight.Medium),
    Font(R.font.manrope_medium, FontWeight.Normal),
    Font(R.font.manrope_bold, FontWeight.Bold),
    Font(R.font.manrope_extrabold, FontWeight.ExtraBold),
)

private fun estilo(peso: FontWeight, tamanho: Int, altura: Int) = TextStyle(
    fontFamily = Manrope,
    fontWeight = peso,
    fontSize = tamanho.sp,
    lineHeight = altura.sp,
)

private val Tipo = Typography(
    displayLarge = estilo(FontWeight.ExtraBold, 40, 44),
    headlineSmall = estilo(FontWeight.Bold, 28, 34),
    titleLarge = estilo(FontWeight.Bold, 22, 28),
    titleMedium = estilo(FontWeight.Bold, 16, 22),
    bodyLarge = estilo(FontWeight.Medium, 16, 22),
    bodyMedium = estilo(FontWeight.Medium, 14, 20),
    bodySmall = estilo(FontWeight.Medium, 12, 16),
    labelLarge = estilo(FontWeight.Bold, 14, 20),
)

val ValorDisplay = TextStyle(
    fontFamily = Manrope,
    fontSize = 40.sp,
    lineHeight = 44.sp,
    fontWeight = FontWeight.ExtraBold,
    letterSpacing = (-0.04).em,
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
        typography = Tipo,
        content = content,
    )
}

fun corMedidor(plano: Long, realizado: Long, escuro: Boolean): Color {
    if (plano <= 0) return aviso(escuro)
    val pct = realizado.toDouble() / plano.toDouble()
    return when {
        pct > 1.0 -> if (escuro) Color(0xFFFFB4AB) else Color(0xFFBA1A1A)
        pct >= 0.8 -> aviso(escuro)
        else -> AzulAcao
    }
}

/**
 * Marca: carteira em quadrado amarelo (DS: DECISOES_identidade_visual.md).
 * Usa o VectorDrawable ic_marca_carteira.
 */
@Composable
fun Marca(modifier: Modifier = Modifier, tamanho: Dp = 32.dp) {
    val canto = if (tamanho >= 48.dp) 16.dp else 10.dp
    Image(
        painter = painterResource(R.drawable.ic_marca_carteira),
        contentDescription = "Marca Meu Orçamento",
        modifier = modifier
            .size(tamanho)
            .clip(RoundedCornerShape(canto)),
    )
}
