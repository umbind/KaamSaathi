export const colors = {
    // Brand colors (High contrast, trusted blue and saffron/orange)
    primary: '#1E3A8A', // Dark Blue - WCAG AAA against white
    primaryDark: '#172554',
    primaryLight: '#3B82F6',
    secondary: '#D97706', // Saffron / Warm Amber - Indian heritage accent
    secondaryDark: '#B45309',
    secondaryLight: '#FBBF24',
    // Semantic feedback colors
    success: '#15803D', // Forest green
    successBackground: '#F0FDF4',
    warning: '#B45309', // Amber
    warningBackground: '#FFFBEB',
    error: '#B91C1C', // Strong crimson red
    errorBackground: '#FEF2F2',
    // Neutral surfaces
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceBorder: '#CBD5E1',
    textPrimary: '#0F172A', // 16:1 contrast against white
    textSecondary: '#475569', // 7:1 contrast against white
    textDisabled: '#94A3B8',
};
export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};
export const touchTargets = {
    minTouchTargetDp: 48, // Non-negotiable accessible tap area for low-cost Android & elderly users
    buttonHeightDp: 52,
    iconSizeDp: 24,
};
export const typography = {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: {
        xs: 12,
        sm: 14,
        md: 16, // Base body text
        lg: 18,
        xl: 22,
        xxl: 28,
    },
    lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
    },
    maxScaleFactor: 2.0, // Layouts must remain responsive up to 200% font scaling
};
//# sourceMappingURL=index.js.map