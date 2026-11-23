import type { ReactNode } from 'react';
import type { IconName } from './icons-paths';
import type { ColorTokens, ResolvedTheme, ThemeMode } from './tokens';

export interface ThemeContextValue {
  readonly mode: ThemeMode;
  readonly resolvedTheme: ResolvedTheme;
  readonly colors: ColorTokens;
  readonly setMode: (mode: ThemeMode) => void;
}

export interface ThemeProviderProps {
  readonly children: ReactNode;
  readonly initialMode?: ThemeMode;
}

export type IconeProps =
  | {
      readonly nome: IconName;
      readonly tamanho?: number;
      readonly cor?: string;
      readonly decorativo: true;
      readonly accessibilityLabel?: string;
    }
  | {
      readonly nome: IconName;
      readonly tamanho?: number;
      readonly cor?: string;
      readonly decorativo?: false;
      readonly accessibilityLabel: string;
    };

export type BotaoVariante = 'primario' | 'secundario' | 'texto' | 'destrutivo';

export interface BotaoProps {
  readonly children: ReactNode;
  readonly variante?: BotaoVariante;
  readonly onPress?: () => void;
  readonly type?: 'button' | 'submit' | 'reset';
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly icone?: IconName;
  readonly larguraTotal?: boolean;
  readonly accessibilityLabel?: string;
}

export interface FABProps {
  readonly rotulo: string;
  readonly onPress: () => void;
  readonly icone?: IconName;
  readonly disabled?: boolean;
  readonly accessibilityLabel?: string;
}

export interface CampoProps {
  readonly id?: string;
  readonly rotulo: string;
  readonly valor: string;
  readonly onChangeValor: (novoValor: string) => void;
  readonly placeholder?: string;
  readonly erro?: string;
  readonly ajuda?: string;
  readonly obrigatorio?: boolean;
  readonly disabled?: boolean;
  readonly tipo?: 'text' | 'email' | 'number' | 'date';
  readonly autoFocus?: boolean;
}

export interface CampoMoedaProps {
  readonly id?: string;
  readonly rotulo: string;
  readonly valorCentavos: number;
  readonly onChangeCentavos: (novoValorCentavos: number) => void;
  readonly placeholder?: string;
  readonly erro?: string;
  readonly ajuda?: string;
  readonly obrigatorio?: boolean;
  readonly disabled?: boolean;
  readonly permitirNegativo?: boolean;
}

export type GrupoOrcamentoTipo = 'Receitas' | 'Fixas' | 'Variáveis' | 'Anuais';

export interface SelectOpcao {
  readonly valor: string;
  readonly rotulo: string;
  readonly grupo?: GrupoOrcamentoTipo | string;
  readonly disabled?: boolean;
}

export interface SelectProps {
  readonly id?: string;
  readonly rotulo: string;
  readonly valor: string;
  readonly onChangeValor: (novoValor: string) => void;
  readonly opcoes: readonly SelectOpcao[];
  readonly placeholder?: string;
  readonly erro?: string;
  readonly obrigatorio?: boolean;
  readonly disabled?: boolean;
}

export interface CheckboxProps {
  readonly id?: string;
  readonly rotulo: string;
  readonly descricao?: string;
  readonly marcado: boolean;
  readonly onChangeMarcado: (marcado: boolean) => void;
  readonly disabled?: boolean;
}

export interface ChipOpcao {
  readonly id: string;
  readonly rotulo: string;
  readonly contador?: number;
}

export interface ChipsProps {
  readonly opcoes: readonly ChipOpcao[];
  readonly selecionadoId: string;
  readonly onSelecionar: (id: string) => void;
  readonly accessibilityLabel: string;
}

export type MedidorStatus = 'normal' | 'atencao' | 'excedido' | 'positivo';

export interface MedidorProps {
  readonly realizadoCentavos: number;
  readonly previstoCentavos: number;
  readonly fraseEstado: string;
  readonly status?: MedidorStatus;
  readonly accessibilityLabel?: string;
}

export type BannerVariante = 'info' | 'atencao' | 'erro';

export interface BannerProps {
  readonly variante: BannerVariante;
  readonly titulo?: string;
  readonly mensagem: string;
  readonly acao?: {
    readonly rotulo: string;
    readonly onPress: () => void;
  };
}

export interface SnackbarProps {
  readonly visivel: boolean;
  readonly mensagem: string;
  readonly onFechar: () => void;
  readonly onDesfazer?: () => void;
  readonly rotuloDesfazer?: string;
  readonly duracaoMs?: number;
}

export interface SkeletonProps {
  readonly largura?: number | string;
  readonly altura?: number;
  readonly arredondado?: boolean;
}

export interface EstadoErroProps {
  readonly titulo?: string;
  readonly mensagem: string;
  readonly onTentarNovamente: () => void;
  readonly rotuloBotao?: string;
}

export interface FormularioContainerProps {
  readonly aberto: boolean;
  readonly titulo: string;
  readonly subtitulo?: string;
  readonly onFechar: () => void;
  readonly onConfirmar: () => void;
  readonly rotuloConfirmar?: string;
  readonly rotuloCancelar?: string;
  readonly carregando?: boolean;
  readonly confirmarDesabilitado?: boolean;
  readonly children: ReactNode;
}

export interface DialogoProps {
  readonly aberto: boolean;
  readonly titulo: string;
  readonly descricao: string;
  readonly rotuloConfirmar: string;
  readonly rotuloCancelar?: string;
  readonly destrutivo?: boolean;
  readonly carregando?: boolean;
  readonly onConfirmar: () => void;
  readonly onCancelar: () => void;
}

/* Módulos */

export interface CabecalhoTelaProps {
  readonly titulo: string;
  readonly modoNavegacao?: 'mes' | 'voltar' | 'nenhum';
  readonly onMesAnterior?: () => void;
  readonly onProximoMes?: () => void;
  readonly onVoltar?: () => void;
  readonly acaoDireita?: ReactNode;
}

export interface BlocoSaldoProps {
  readonly rotulo?: string;
  readonly saldoCentavos: number;
  readonly fraseApoio: string;
  readonly previstoDespesasCentavos: number;
  readonly realizadoDespesasCentavos: number;
  readonly fraseMedidor: string;
  readonly ocultoInicial?: boolean;
  readonly onToggleOculto?: (oculto: boolean) => void;
}

export interface TotalGrupoCard {
  readonly tipo: GrupoOrcamentoTipo;
  readonly previstoCentavos: number;
  readonly realizadoCentavos: number;
}

export interface GradeTotaisProps {
  readonly totais: readonly [TotalGrupoCard, TotalGrupoCard, TotalGrupoCard, TotalGrupoCard];
  readonly onSelecionarGrupo?: (tipo: GrupoOrcamentoTipo) => void;
}

export interface ItemOrcamentoResumo {
  readonly id: string;
  readonly nome: string;
  readonly previstoCentavos: number;
  readonly realizadoCentavos: number;
  readonly recorrente?: boolean;
}

export interface GrupoComMedidorProps {
  readonly titulo: string;
  readonly tipo: GrupoOrcamentoTipo;
  readonly previstoCentavos: number;
  readonly realizadoCentavos: number;
  readonly fraseEstado: string;
  readonly itens: readonly ItemOrcamentoResumo[];
  readonly expandidoInicial?: boolean;
  readonly onSelecionarItem: (item: ItemOrcamentoResumo) => void;
}

export interface LinhaItemProps {
  readonly item: ItemOrcamentoResumo;
  readonly onPress: (item: ItemOrcamentoResumo) => void;
}

export interface LinhaLancamentoProps {
  readonly id: string;
  readonly descricao: string;
  readonly valorCentavos: number;
  readonly tipo: 'receita' | 'despesa';
  readonly dataISO: string;
  readonly nomeItem: string;
  readonly meioPagamento: string;
  readonly faturaMesAno?: string;
  readonly onPress?: (id: string) => void;
}

export interface LinhaAjusteProps {
  readonly icone: IconName;
  readonly titulo: string;
  readonly subtitulo: string;
  readonly onPress: () => void;
  readonly badge?: string;
}

export type AbaPrincipalId = 'resumo' | 'orcamento' | 'lancamentos' | 'ano' | 'ajustes';

export interface AbaPrincipalItem {
  readonly id: AbaPrincipalId;
  readonly rotulo: string;
  readonly icone: IconName;
}

export interface NavegacaoPrincipalProps {
  readonly abaAtiva: AbaPrincipalId;
  readonly emSubtelaAjustes?: boolean;
  readonly onSelecionarAba: (aba: AbaPrincipalId) => void;
  readonly abas?: readonly AbaPrincipalItem[];
}

export interface LinhaTabelaMeses {
  readonly id: string;
  readonly rotulo: string;
  readonly tipo: GrupoOrcamentoTipo | 'subtotal' | 'sobra';
  readonly valoresCentavos: readonly [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];
  readonly totalAnoCentavos: number;
}

export interface TabelaMesesProps {
  readonly ano: number;
  readonly mesAtivo: number; // 1..12
  readonly linhas: readonly LinhaTabelaMeses[];
  readonly onSelecionarMes?: (mes: number) => void;
}

export interface CartaoVazioProps {
  readonly icone?: IconName;
  readonly titulo: string;
  readonly descricao: string;
  readonly rotuloAcao?: string;
  readonly onAcao?: () => void;
}
