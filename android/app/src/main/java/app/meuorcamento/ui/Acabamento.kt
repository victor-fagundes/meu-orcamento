package app.meuorcamento.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.meuorcamento.ui.theme.AzulAcao
import app.meuorcamento.ui.theme.Manrope

private val CantoCartao = RoundedCornerShape(16.dp)
private val CantoCampo = RoundedCornerShape(14.dp)

@Composable
fun corCartao(): Color = if (isSystemInDarkTheme()) Color(0xFF1D2024) else Color.White

@Composable
fun corCampo(): Color = if (isSystemInDarkTheme()) Color(0xFF272A2F) else Color(0xFFECEEF6)

@Composable
fun corTrilha(): Color = if (isSystemInDarkTheme()) Color(0xFF3A3D44) else Color(0xFFE6E8F0)

@Composable
fun corDivisor(): Color = if (isSystemInDarkTheme()) Color(0xFF3A3D44) else Color(0xFFE3E6EF)

@Composable
fun Modifier.cartao(): Modifier = this
    .shadow(elevation = 1.dp, shape = CantoCartao, ambientColor = Color(0x0F191C20), spotColor = Color(0x0F191C20))
    .clip(CantoCartao)
    .background(corCartao())

@Composable
fun Rotulo(texto: String, modifier: Modifier = Modifier) {
    Text(
        texto,
        modifier = modifier,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        fontFamily = Manrope,
        fontWeight = FontWeight.Bold,
        fontSize = 13.sp,
        lineHeight = 18.sp,
    )
}

@Composable
fun Campo(
    rotulo: String,
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
) {
    Text(
        rotulo,
        modifier = Modifier.padding(top = 12.dp, bottom = 6.dp),
        fontFamily = Manrope,
        fontWeight = FontWeight.Bold,
        fontSize = 12.sp,
        color = MaterialTheme.colorScheme.onSurface,
    )
    TextField(
        value = value,
        onValueChange = onValueChange,
        modifier = modifier.fillMaxWidth().heightIn(min = 52.dp),
        singleLine = true,
        shape = CantoCampo,
        textStyle = MaterialTheme.typography.bodyLarge,
        visualTransformation = visualTransformation,
        keyboardOptions = keyboardOptions,
        colors = TextFieldDefaults.colors(
            focusedContainerColor = corCampo(),
            unfocusedContainerColor = corCampo(),
            disabledContainerColor = corCampo(),
            focusedIndicatorColor = Color.Transparent,
            unfocusedIndicatorColor = Color.Transparent,
            cursorColor = AzulAcao,
            focusedTextColor = MaterialTheme.colorScheme.onSurface,
            unfocusedTextColor = MaterialTheme.colorScheme.onSurface,
        ),
    )
}

@Composable
fun BotaoCheio(
    texto: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    Button(
        onClick = onClick,
        enabled = enabled,
        modifier = modifier.fillMaxWidth().heightIn(min = 52.dp),
        shape = CantoCampo,
        colors = ButtonDefaults.buttonColors(
            containerColor = AzulAcao,
            contentColor = Color.White,
            disabledContainerColor = AzulAcao.copy(alpha = 0.38f),
            disabledContentColor = Color.White,
        ),
    ) {
        Text(texto, fontFamily = Manrope, fontWeight = FontWeight.ExtraBold, fontSize = 16.sp)
    }
}

@Composable
fun ListaCartao(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(modifier.cartao(), content = content)
}
