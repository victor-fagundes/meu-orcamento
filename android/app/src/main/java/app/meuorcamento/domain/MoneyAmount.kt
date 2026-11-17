package app.meuorcamento.domain

/**
 * Monetary amount in integer centavos only. Never use Double/Float for stored money.
 */
@JvmInline
value class MoneyAmount(val centavos: Long) {
    init {
        require(centavos >= 0) { "centavos must be >= 0" }
    }

    fun formatBrl(): String {
        val reais = centavos / 100
        val cents = (centavos % 100).toString().padStart(2, '0')
        return "R$ $reais,$cents"
    }

    companion object {
        fun fromCentavos(value: Long) = MoneyAmount(value)
    }
}

/** Display-only. Totals may be negative when the month is over plan. */
fun formatCentavos(centavos: Long): String {
    val negative = centavos < 0
    val abs = if (negative) -centavos else centavos
    val reais = abs / 100
    val cents = (abs % 100).toString().padStart(2, '0')
    val grouped = reais.toString().reversed().chunked(3).joinToString(".").reversed()
    return if (negative) "-R$ $grouped,$cents" else "R$ $grouped,$cents"
}
