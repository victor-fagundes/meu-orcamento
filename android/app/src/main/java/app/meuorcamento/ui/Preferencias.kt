package app.meuorcamento.ui

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore by preferencesDataStore(name = "preferencias")

private val KEY_VALORES_OCULTOS = booleanPreferencesKey("valores_ocultos")

/** Preferências do app (DS: botão de olho no Resumo). */
class Preferencias(private val context: Context) {

    val valoresOcultos: Flow<Boolean> = context.dataStore.data
        .map { it[KEY_VALORES_OCULTOS] ?: false }

    suspend fun setValoresOcultos(oculto: Boolean) {
        context.dataStore.edit { it[KEY_VALORES_OCULTOS] = oculto }
    }
}
