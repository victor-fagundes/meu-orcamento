package app.meuorcamento.ui

/**
 * Converts a reais string such as "10,50" or "1.024,00" into integer centavos.
 * Blank, negative, and illegible text return null. Zero returns null unless [permitirZero].
 */
fun reaisParaCentavos(text: String, permitirZero: Boolean = false): Long? {
    val cleaned = text.trim().replace("R$", "", ignoreCase = true).replace(" ", "").replace(".", "")
    if (cleaned.isEmpty() || cleaned.startsWith("-")) return null
    val parts = cleaned.split(",")
    if (parts.size > 2) return null
    val reais = parts[0].ifEmpty { "0" }
    if (reais.any { !it.isDigit() }) return null
    val centsPart = if (parts.size == 2) parts[1] else "00"
    if (centsPart.length > 2 || centsPart.any { !it.isDigit() }) return null
    val reaisLong = reais.toLongOrNull() ?: return null
    val cents = centsPart.padEnd(2, '0').toLongOrNull() ?: return null
    val value = reaisLong * 100 + cents
    if (value < 0) return null
    if (value == 0L && !permitirZero) return null
    return value
}
