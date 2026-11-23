import type { ReactNode } from 'react';
import type { IconName } from '../core/icons-paths.ts';
import type { EstadoConsumo } from '../core/types.ts';

/** Contratos únicos: web e React Native implementam exatamente estas props. */

export type VarianteBotao = 'primario' | 'secundario' | 'texto' | 'destrutivo';

export interface BotaoProps {
  readonly variante: VarianteBotao;
  readonly children: string;
  readonly onPress: () => void;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly largura?: 'total' | 'conteudo';
  /** Nome acessível. Obrigatório quando o botão não tem texto visível (ícone). */
  readonly acessibilidade?: string;
}

export interface CampoProps {
  readonly id: string;
  readonly rotulo: string;
  readonly valor: string;
  readonly onMudar: (valor: string) => void;
  readonly erro?: string;
  readonly desabilitado?: boolean;
  readonly placeholder?: string;
  readonly teclado?: 'texto' | 'decimal' | 'numerico';
}

export interface MedidorProps {
  readonly rotulo: string;
  /** Percentual inteiro. Acima de 100 a barra fica cheia, mas a frase mostra o valor real. */
  readonly valor: number;
  readonly estado: EstadoConsumo;
  /** Frase de estado: obrigatória. A cor nunca é o único sinal. */
  readonly frase: string;
}

export type TipoBanner = 'info' | 'atencao' | 'erro';

export interface BannerProps {
  readonly tipo: TipoBanner;
  readonly children: string;
}

export interface SnackbarProps {
  readonly mensagem: string;
  readonly onDesfazer?: () => void;
  readonly rotuloDesfazer?: string;
}

export interface CampoMoedaProps {
  readonly id: string;
  readonly rotulo: string;
  /** Valor atual em centavos. null quando o campo está vazio ou inválido. */
  readonly valor: number | null;
  readonly onMudar: (centavos: number | null) => void;
  readonly erro?: string;
  readonly desabilitado?: boolean;
}

export interface OpcaoChip<T extends string> {
  readonly valor: T;
  readonly rotulo: string;
}

export interface ChipsProps<T extends string> {
  /** Nome do grupo, lido por leitores de tela. */
  readonly rotuloGrupo: string;
  readonly opcoes: ReadonlyArray<OpcaoChip<T>>;
  readonly selecionado: T;
  readonly onSelecionar: (valor: T) => void;
}

export interface CheckboxProps {
  readonly id: string;
  readonly rotulo: string;
  readonly marcado: boolean;
  readonly onMudar: (marcado: boolean) => void;
  readonly desabilitado?: boolean;
}

export interface DialogoProps {
  readonly aberto: boolean;
  readonly titulo: string;
  readonly descricao: string;
  readonly textoCancelar?: string;
  readonly textoConfirmar: string;
  /** destrutivo usa o vermelho de erro e fica à direita, como na ficha de componentes. */
  readonly tipoConfirmar: 'primario' | 'destrutivo';
  readonly onCancelar: () => void;
  readonly onConfirmar: () => void;
}

export interface FabProps {
  readonly rotulo: string;
  readonly onPress: () => void;
}

export interface OpcaoSelect {
  readonly valor: string;
  readonly rotulo: string;
}

export interface GrupoSelect {
  /** Ex.: "Despesas fixas". Vira <optgroup> no web e seção no celular. */
  readonly rotulo: string;
  readonly opcoes: ReadonlyArray<OpcaoSelect>;
}

export interface SelectProps {
  readonly id: string;
  readonly rotulo: string;
  readonly valor: string | null;
  readonly grupos: ReadonlyArray<GrupoSelect>;
  readonly onMudar: (valor: string) => void;
  readonly placeholder?: string;
  readonly erro?: string;
  readonly desabilitado?: boolean;
}

export interface FormularioContainerProps {
  readonly aberto: boolean;
  readonly titulo: string;
  readonly children: ReactNode;
  readonly textoCancelar?: string;
  readonly textoSalvar: string;
  readonly salvarDesabilitado?: boolean;
  readonly onCancelar: () => void;
  readonly onSalvar: () => void;
}

export interface AbaNavegacao {
  readonly id: string;
  readonly rotulo: string;
  readonly icone: IconName;
}

export interface NavegacaoPrincipalProps {
  readonly abas: ReadonlyArray<AbaNavegacao>;
  readonly ativa: string;
  readonly onNavegar: (id: string) => void;
}

export type ModoTema = 'light' | 'dark' | 'system';

export interface IconeProps {
  readonly nome: IconName;
  readonly tamanho?: 20 | 24;
  /** Nome acessível. Sem ele o ícone é decorativo (aria-hidden). */
  readonly rotulo?: string;
}

export interface SkeletonProps {
  readonly altura: number;
  readonly largura?: number | `${number}%`;
  readonly forma?: 'bloco' | 'linha' | 'cartao';
}

export interface EstadoErroProps {
  readonly mensagem: string;
  readonly onTentarNovamente: () => void;
  readonly textoAcao?: string;
}

export interface CabecalhoTelaProps {
  readonly titulo: string;
  /** Mostra ‹ e ›, para navegar por mês. */
  readonly navegacaoMes?: { readonly rotulo: string; readonly onAnterior: () => void; readonly onProximo: () => void };
  /** Mostra ‹ para voltar, em subtelas. */
  readonly onVoltar?: () => void;
}

export interface BlocoSaldoProps {
  readonly rotulo: string;
  /** Valor principal em centavos. */
  readonly valorCentavos: number;
  /** Percentual usado do planejado (inteiro). */
  readonly percentualUsado: number;
  readonly fraseApoio: string;
  readonly ocultado: boolean;
  readonly onAlternarOcultar: () => void;
}

export interface ItemTotal {
  readonly rotulo: string;
  readonly realizadoCentavos: number;
  readonly planejadoCentavos: number;
}

export interface GradeTotaisProps {
  readonly itens: ReadonlyArray<ItemTotal>;
}

export interface GrupoComMedidorProps {
  readonly rotulo: string;
  readonly realizadoCentavos: number;
  readonly planejadoCentavos: number;
  readonly aberto: boolean;
  readonly onAlternar: () => void;
  readonly children?: ReactNode;
}

export interface LinhaLancamentoProps {
  readonly descricao: string;
  readonly valorCentavos: number;
  /** Data ISO: 2026-11-15. */
  readonly dataIso: string;
  readonly item: string;
  readonly meio: string;
  /** Ex.: "Fatura 12/2026", quando a compra cai numa fatura de cartão. */
  readonly badgeFatura?: string;
  readonly onAbrir: () => void;
}

export interface CartaoVazioProps {
  readonly titulo: string;
  readonly frase: string;
  readonly acao?: { readonly rotulo: string; readonly onPress: () => void };
}

export interface LinhaItemProps {
  readonly nome: string;
  readonly realizadoCentavos: number;
  readonly planejadoCentavos: number;
  readonly onAbrir: () => void;
}

export interface LinhaAjusteProps {
  readonly icone: IconName;
  readonly rotulo: string;
  readonly apoio?: string;
  readonly onAbrir: () => void;
  readonly destrutivo?: boolean;
}

export interface RodapeAcoesProps {
  readonly textoPrincipal: string;
  readonly onPrincipal: () => void;
  readonly textoCancelar?: string;
  readonly onCancelar: () => void;
  readonly principalDestrutivo?: boolean;
  readonly principalDesabilitado?: boolean;
}

export interface CabecalhoSheetProps {
  readonly titulo: string;
  readonly subtitulo?: string;
}

export interface LinhaTabelaMeses {
  readonly rotulo: string;
  /** 12 valores, Jan a Dez, em centavos. null = sem movimento. */
  readonly valoresPorMes: ReadonlyArray<number | null>;
  /** Destaca a linha (ex.: "Sobra no ano"). */
  readonly destaque?: boolean;
}

export interface TabelaMesesProps {
  readonly linhas: ReadonlyArray<LinhaTabelaMeses>;
  /** Índice do mês ativo, 0 = janeiro. */
  readonly mesAtivo: number;
}

export interface ShellAppProps {
  readonly abas: ReadonlyArray<AbaNavegacao>;
  readonly ativa: string;
  readonly onNavegar: (id: string) => void;
  readonly cabecalho: ReactNode;
  readonly children: ReactNode;
}

export interface ColunaTabela {
  readonly id: string;
  readonly rotulo: string;
  readonly tipo: 'texto' | 'numero';
}

export interface LinhaTabela {
  readonly id: string;
  readonly celulas: Readonly<Record<string, string>>;
}

export interface TabelaProps {
  /** String obrigatória. Vira `<caption>`. */
  readonly caption: string;
  readonly colunas: ReadonlyArray<ColunaTabela>;
  readonly linhas: ReadonlyArray<LinhaTabela>;
  /** A linha correspondente leva `aria-selected="true"`. */
  readonly selecionadaId?: string;
  /** Sem este callback, a linha não é botão de seleção. */
  readonly onSelecionar?: (id: string) => void;
}

export interface CampoBuscaProps {
  readonly id: string;
  readonly rotulo: string;
  readonly valor: string;
  readonly onMudar: (valor: string) => void;
  /** Id do resultado apontado por `aria-controls`. */
  readonly controlesId: string;
  /** Nome acessível do botão limpar. Padrão "Limpar". */
  readonly rotuloLimpar?: string;
}

export interface CampoDataProps {
  readonly id: string;
  readonly rotulo: string;
  /** `AAAA-MM-DD` ou vazio. */
  readonly valor: string;
  readonly onMudar: (valor: string) => void;
  readonly erro?: string;
  readonly desabilitado?: boolean;
}

export interface SwitchProps {
  readonly id: string;
  readonly rotulo: string;
  readonly marcado: boolean;
  readonly onMudar: (marcado: boolean) => void;
  readonly desabilitado?: boolean;
}

export interface AcaoMenu {
  readonly id: string;
  readonly rotulo: string;
  readonly destrutivo?: boolean;
  readonly onEscolher: () => void;
}

export interface MenuAcoesProps {
  readonly rotulo: string;
  readonly acoes: ReadonlyArray<AcaoMenu>;
}

export interface BotaoIconeProps {
  readonly nome: IconName;
  readonly rotulo: string;
  readonly onPress: () => void;
  readonly desabilitado?: boolean;
}

export interface AvatarProps {
  /** Até duas letras. */
  readonly iniciais: string;
  readonly nome?: string;
  /** Com o nome ao lado, o círculo é `aria-hidden` e o nome é texto. */
  readonly comNome?: boolean;
}
