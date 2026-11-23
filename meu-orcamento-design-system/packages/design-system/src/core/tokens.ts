export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ColorTokens {
  readonly bg: string;
  readonly surface: string;
  readonly surfaceMuted: string;
  readonly surfaceElevated: string;
  readonly border: string;
  readonly borderStrong: string;
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly textMuted: string;
  readonly textInverse: string;
  readonly action: string;
  readonly actionHover: string;
  readonly onAction: string;
  readonly selected: string;
  readonly onSelected: string;
  readonly success: string;
  readonly successBg: string;
  readonly onSuccessBg: string;
  readonly warn: string;
  readonly warnText: string;
  readonly warnBg: string;
  readonly onWarnBg: string;
  readonly error: string;
  readonly errorBg: string;
  readonly onErrorBg: string;
  readonly info: string;
  readonly infoBg: string;
  readonly onInfoBg: string;
  readonly overlay: string;
}

export const lightColors: ColorTokens = {
  bg: '#f7f8fa',
  surface: '#ffffff',
  surfaceMuted: '#eef1f6',
  surfaceElevated: '#ffffff',
  border: '#d8dee9',
  borderStrong: '#8b95a5',
  textPrimary: '#111827',
  textSecondary: '#4b5563',
  textMuted: '#596273',
  textInverse: '#ffffff',
  action: '#0056d2',
  actionHover: '#00419e',
  onAction: '#ffffff',
  selected: '#d7e3ff',
  onSelected: '#001b3f',
  success: '#2e7d32',
  successBg: '#e8f5e9',
  onSuccessBg: '#1b5e20',
  warn: '#b45309',
  warnText: '#6b4b00',
  warnBg: '#fef3c7',
  onWarnBg: '#6b4b00',
  error: '#b91c1c',
  errorBg: '#fee2e2',
  onErrorBg: '#7f1d1d',
  info: '#0369a1',
  infoBg: '#e0f2fe',
  onInfoBg: '#0c4a6e',
  overlay: 'rgba(17, 24, 39, 0.48)',
} as const;

export const darkColors: ColorTokens = {
  bg: '#0f131a',
  surface: '#171c26',
  surfaceMuted: '#202736',
  surfaceElevated: '#252d3d',
  border: '#2e3748',
  borderStrong: '#64748b',
  textPrimary: '#f1f5f9',
  textSecondary: '#cbd5e1',
  textMuted: '#94a3b8',
  textInverse: '#0f131a',
  action: '#7aa7ff',
  actionHover: '#a3c2ff',
  onAction: '#001b3f',
  selected: '#1e3a6e',
  onSelected: '#dbeafe',
  success: '#66bb6a',
  successBg: '#132a1c',
  onSuccessBg: '#a7f3d0',
  warn: '#fbbf24',
  warnText: '#fde68a',
  warnBg: '#2e2108',
  onWarnBg: '#fde68a',
  error: '#f87171',
  errorBg: '#321619',
  onErrorBg: '#fecaca',
  info: '#38bdf8',
  infoBg: '#0e283a',
  onInfoBg: '#bae6fd',
  overlay: 'rgba(0, 0, 0, 0.68)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export type SpacingKey = keyof typeof spacing;

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  sheet: 28,
  full: 9999,
} as const;

export type RadiusKey = keyof typeof radius;

export interface TypographyScaleToken {
  readonly fontSize: number;
  readonly lineHeight: number;
  readonly fontWeight: '400' | '500' | '600' | '700';
  readonly fontFamilyNative: string;
  readonly letterSpacing: number;
  readonly tabularNums?: boolean;
}

export const typography = {
  fontFamilyWeb: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontFamilyNative: {
    regular: 'Manrope-Regular',
    medium: 'Manrope-Medium',
    semiBold: 'Manrope-SemiBold',
    bold: 'Manrope-Bold',
  },
  scale: {
    displayLg: {
      fontSize: 36,
      lineHeight: 44,
      fontWeight: '700',
      fontFamilyNative: 'Manrope-Bold',
      letterSpacing: -0.72,
      tabularNums: true,
    },
    displayMd: {
      fontSize: 28,
      lineHeight: 36,
      fontWeight: '700',
      fontFamilyNative: 'Manrope-Bold',
      letterSpacing: -0.56,
      tabularNums: true,
    },
    titleLg: {
      fontSize: 20,
      lineHeight: 28,
      fontWeight: '700',
      fontFamilyNative: 'Manrope-Bold',
      letterSpacing: -0.2,
    },
    titleMd: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
      fontFamilyNative: 'Manrope-SemiBold',
      letterSpacing: 0,
    },
    bodyMd: {
      fontSize: 15,
      lineHeight: 22,
      fontWeight: '400',
      fontFamilyNative: 'Manrope-Regular',
      letterSpacing: 0,
    },
    bodySm: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '400',
      fontFamilyNative: 'Manrope-Regular',
      letterSpacing: 0,
    },
    labelMd: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '600',
      fontFamilyNative: 'Manrope-SemiBold',
      letterSpacing: 0,
    },
    labelSm: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '600',
      fontFamilyNative: 'Manrope-SemiBold',
      letterSpacing: 0.2,
    },
    valorTabular: {
      fontSize: 15,
      lineHeight: 22,
      fontWeight: '600',
      fontFamilyNative: 'Manrope-SemiBold',
      letterSpacing: 0,
      tabularNums: true,
    },
  } satisfies Record<string, TypographyScaleToken>,
} as const;

export type TypographyVariant = keyof typeof typography.scale;

export interface ElevationToken {
  readonly cssBoxShadow: string;
  readonly shadowColor: string;
  readonly shadowOffset: { readonly width: number; readonly height: number };
  readonly shadowOpacity: number;
  readonly shadowRadius: number;
  readonly elevation: number;
}

export const elevation = {
  none: {
    cssBoxShadow: 'none',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    cssBoxShadow: '0 1px 2px rgba(17, 24, 39, 0.06)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    cssBoxShadow: '0 4px 12px rgba(17, 24, 39, 0.12)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    cssBoxShadow: '0 12px 28px rgba(17, 24, 39, 0.20)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
} as const satisfies Record<string, ElevationToken>;

export type ElevationKey = keyof typeof elevation;

export const motion = {
  duration: {
    instant: 0,
    fast: 150,
    normal: 220,
    slow: 300,
  },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    enter: 'cubic-bezier(0, 0, 0.2, 1)',
    exit: 'cubic-bezier(0.4, 0, 1, 1)',
  },
} as const;

export const grid = {
  breakpointDesktop: 720,
  mobileColumns: 4,
  desktopColumns: 12,
  gutterMobile: spacing.md,
  gutterDesktop: spacing.lg,
  marginMobile: spacing.lg,
  marginDesktop: spacing.xl,
  sidebarWidth: 240,
  drawerWidth: 460,
  headerHeight: 56,
  touchTargetMin: 48,
} as const;

export const tokens = {
  lightColors,
  darkColors,
  spacing,
  radius,
  typography,
  elevation,
  motion,
  grid,
} as const;
