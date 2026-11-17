package app.meuorcamento.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Assessment
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import app.meuorcamento.AppGraph
import app.meuorcamento.R
import app.meuorcamento.ui.ajustes.AjustesScreen
import app.meuorcamento.ui.ano.AnoScreen
import app.meuorcamento.ui.currentCompetencia
import app.meuorcamento.ui.exportacao.ExportScreen
import app.meuorcamento.ui.importacao.PdfImportScreen
import app.meuorcamento.ui.importacao.PlanilhaImportScreen
import app.meuorcamento.ui.lancamentos.LancamentosScreen
import app.meuorcamento.ui.orcamento.OrcamentoScreen
import app.meuorcamento.ui.resumo.ResumoScreen

private data class Tab(val route: String, val labelRes: Int, val icon: ImageVector)

@Composable
fun AppNav(
    graph: AppGraph,
    onUnauthorized: () -> Unit,
    onSignedOut: () -> Unit,
) {
    val nav = rememberNavController()
    var competencia by rememberSaveable { mutableStateOf(currentCompetencia()) }
    var tipo by rememberSaveable { mutableStateOf("F") }
    val tabs = listOf(
        Tab("resumo", R.string.nav_resumo, Icons.Default.Home),
        Tab("orcamento", R.string.nav_orcamento, Icons.Default.Assessment),
        Tab("lancamentos", R.string.nav_lancamentos, Icons.Default.List),
        Tab("ano", R.string.nav_ano, Icons.Default.CalendarMonth),
        Tab("ajustes", R.string.nav_ajustes, Icons.Default.Settings),
    )
    val backStack by nav.currentBackStackEntryAsState()
    val current = backStack?.destination?.route
    val ajustesSelected = current == "ajustes" ||
        current == "import_planilha" ||
        current == "import_pdf" ||
        current == "export"

    fun openTab(route: String) {
        nav.navigate(route) {
            popUpTo(nav.graph.findStartDestination().id) { saveState = true }
            launchSingleTop = true
            restoreState = true
        }
    }

    Scaffold(
        bottomBar = {
            NavigationBar(containerColor = MaterialTheme.colorScheme.surfaceContainer) {
                tabs.forEach { tab ->
                    val selected = if (tab.route == "ajustes") ajustesSelected else current == tab.route
                    NavigationBarItem(
                        selected = selected,
                        onClick = { openTab(tab.route) },
                        icon = { Icon(tab.icon, contentDescription = null) },
                        label = { Text(stringResource(tab.labelRes)) },
                        alwaysShowLabel = true,
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = MaterialTheme.colorScheme.onPrimaryContainer,
                            selectedTextColor = MaterialTheme.colorScheme.onSurface,
                            indicatorColor = MaterialTheme.colorScheme.primaryContainer,
                            unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                            unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant,
                        ),
                    )
                }
            }
        },
    ) { padding ->
        NavHost(
            navController = nav,
            startDestination = "resumo",
            modifier = Modifier.padding(padding),
        ) {
            composable("resumo") {
                ResumoScreen(
                    api = graph.api,
                    competencia = competencia,
                    onCompetencia = { competencia = it },
                    onOpenTipo = { next ->
                        tipo = next
                        openTab("orcamento")
                    },
                    onUnauthorized = onUnauthorized,
                )
            }
            composable("orcamento") {
                OrcamentoScreen(
                    api = graph.api,
                    competencia = competencia,
                    onCompetencia = { competencia = it },
                    tipo = tipo,
                    onTipo = { tipo = it },
                    onUnauthorized = onUnauthorized,
                )
            }
            composable("lancamentos") {
                LancamentosScreen(
                    api = graph.api,
                    competencia = competencia,
                    onCompetencia = { competencia = it },
                    onUnauthorized = onUnauthorized,
                )
            }
            composable("ano") { AnoScreen(graph.api, onUnauthorized) }
            composable("ajustes") {
                AjustesScreen(
                    api = graph.api,
                    auth = graph.auth,
                    onUnauthorized = onUnauthorized,
                    onSignedOut = onSignedOut,
                    onImportPlanilha = { nav.navigate("import_planilha") },
                    onImportPdf = { nav.navigate("import_pdf") },
                    onExport = { nav.navigate("export") },
                )
            }
            composable("import_planilha") {
                PlanilhaImportScreen(
                    api = graph.api,
                    onUnauthorized = onUnauthorized,
                    onOpenedMonth = { mes ->
                        competencia = mes
                        openTab("lancamentos")
                    },
                )
            }
            composable("import_pdf") { PdfImportScreen(graph.api, onUnauthorized) }
            composable("export") { ExportScreen(graph.api, onUnauthorized) }
        }
    }
}
