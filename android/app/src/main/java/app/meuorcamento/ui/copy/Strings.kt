package app.meuorcamento.ui.copy

/**
 * Copy centralizado do app Meu Orçamento.
 * Nunca mais hardcode string de UI — sempre use Strings.xxx
 */
object Strings {

    // ========== App / Geral ==========
    const val appNome = "Meu Orçamento"
    const val voltar = "Voltar"
    const val cancelar = "Cancelar"
    const val salvar = "Salvar"
    const val confirmar = "Confirmar"
    const val excluir = "Excluir"
    const val registrar = "Registrar"
    const val corrigir = "Corrigir"
    const val sair = "Sair"
    const val sairDaConta = "Sair da conta"
    const val semConexao = "Sem conexão."
    const val erroGenerico = "Algo deu errado. Tente novamente."

    // ========== Auth ==========
    const val email = "E-mail"
    const val senha = "Senha"
    const val criarConta = "Criar conta"
    const val jaTenhoConta = "Já tenho conta"
    const val useContaProducao = "Use sua conta de produção."

    // ========== Resumo ==========
    const val disponivelNesteMes = "Disponível neste mês"
    const val passouDoOrcado = "Passou do orçado"
    const val receitas = "Receitas"
    const val despesasFixas = "Despesas fixas"
    const val despesasVariaveis = "Despesas variáveis"
    const val anuaisEventuais = "Anuais e eventuais"
    const val fixas = "Fixas"
    const val variaveis = "Variáveis"
    const val anuais = "Anuais"
    const val gastou = "Gastou"
    const val faltam = "Faltam"
    const val diasNesteMes = "dias neste mês, incluindo hoje"
    const val oQueAindaCabe = "O que ainda cabe neste mês."
    const val erroCarregarOrcamento = "Não foi possível carregar o orçamento."

    // ========== Orçamento ==========
    const val novoItem = "Novo item"
    const val nomeDoItem = "Nome do item"
    const val grupo = "Grupo"
    const val arquivar = "Arquivar"
    const val confirmarArquivar = "Arquivar item?"
    const val mensagemArquivar = "Arquivados não entram em novos lançamentos nem na lista ativa do Orçamento."
    const val aindaCabeEm = "Ainda cabe em"
    const val plano = "Plano"
    const val realizado = "Realizado"

    // ========== Lançamentos ==========
    const val nenhumLancamento = "Não há lançamentos neste mês."
    const val valorReais = "Valor (R$)"
    const val descricao = "Descrição"
    const val pagamento = "Pagamento"
    const val parcelasOpcional = "Parcelas (opcional)"
    const val data = "Data"
    const val item = "Item"
    const val excluirLancamento = "Excluir lançamento"
    const val confirmarExcluirLancamento = "Excluir lançamento?"
    const val escopoCorrecao = "Escopo da correção"
    const val soEstaParcela = "Só esta parcela"
    const val estaEAsProximas = "Esta e as próximas"
    const val informeValorMaiorZero = "Informe um valor maior que zero, como 10,50."

    // Meios de pagamento
    const val dinheiro = "Dinheiro"
    const val debito = "Débito"
    const val pix = "Pix"
    const val cartao = "Cartão"

    // ========== Cartões ==========
    const val cartoes = "Cartões"
    const val nenhumCartao = "Nenhum cartão ativo."
    const val adicionarCartao = "Adicionar cartão"
    const val novoApelido = "Novo apelido"
    const val diaFechamento = "Dia de fechamento"
    const val diaVencimento = "Dia de vencimento"
    const val desativar = "Desativar"
    const val confirmarDesativar = "Desativar cartão?"
    const val mensagemDesativar = "O cartão sai dos pagamentos novos. Lançamentos antigos permanecem."
    const val informeApelido = "Informe o apelido do cartão."
    const val fechaDia = "Fecha dia"

    // ========== Limites ==========
    const val limitesAlerta = "Limites de alerta"
    const val limiteGlobal = "Limite global, de 1 a 100"
    const val salvarLimites = "Salvar limites"
    const val informeInteiro1a100 = "Informe um inteiro de 1 a 100."

    // ========== Arquivados ==========
    const val itensArquivados = "Itens arquivados"
    const val nenhumArquivado = "Nenhum item arquivado."

    // ========== Excluir conta ==========
    const val excluirConta = "Excluir conta"
    const val queroExcluirMinhaConta = "Quero excluir minha conta…"
    const val digiteExcluir = "Digite EXCLUIR para confirmar"
    const val excluirDefinitivamente = "Excluir definitivamente"
    const val removePermanentemente = "Remove permanentemente a conta, o orçamento, lançamentos, cartões e limites."
    const val sessaoEncerrada = "A sessão desta conta será encerrada neste aparelho."

    // ========== Exemplo ==========
    const val dadosExemplo = "Dados de exemplo"
    const val carregarExemplo = "Carregar exemplo"
    const val confirmarExemplo = "Confirmar exemplo?"
    const val mensagemExemplo = "Preenche o planejamento de alguns itens com valores ilustrativos. Não cria lançamentos. Só roda se você confirmar."
    const val toqueDeNovo = "Toque de novo para confirmar."

    // ========== Ano ==========
    const val anoAnterior = "Ano anterior"
    const val proximoAno = "Próximo ano"
    const val erroCarregarAno = "Não foi possível carregar o ano."

    // ========== Importação / Exportação ==========
    const val exportarCsv = "Exportar CSV"
    const val exportarJson = "Exportar JSON"
    const val escolherArquivo = "Escolher arquivo"
    const val escolherPdf = "Escolher PDF"
    const val confirmarImportacao = "Confirmar importação"
    const val confirmarPdf = "Confirmar PDF"
    const val cartaoDestino = "Cartão destino"
    const val dataDaCompra = "Data da compra"
    const val parcelas = "Parcelas"
    const val verCompetencia = "Ver competência"

    // ========== Meses ==========
    val mesesAbreviados = listOf(
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    )
}
