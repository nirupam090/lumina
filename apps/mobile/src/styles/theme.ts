export const theme = {
  colors: {
    background: '#0B0B0F',
    backgroundElevated: '#121218',
    
    surface: 'rgba(255, 255, 255, 0.04)',
    surfaceHover: 'rgba(255, 255, 255, 0.08)',
    surfaceActive: 'rgba(255, 255, 255, 0.12)',
    
    border: 'rgba(255, 255, 255, 0.06)',
    borderLight: 'rgba(255, 255, 255, 0.10)',
    
    accentBlue: '#5B8DEF',
    accentViolet: '#9D6BFF',
    accentCyan: '#4ECDC4',
    accentGreen: '#34D399',
    accentOrange: '#F59E0B',
    accentRed: '#EF4444',
    accentPink: '#EC4899',
    
    textPrimary: '#F0F0F5',
    textSecondary: 'rgba(240, 240, 245, 0.55)',
    textMuted: 'rgba(240, 240, 245, 0.30)',
    
    white: '#FFFFFF',
  },
  
  radius: {
    sm: 10,
    md: 14,
    lg: 20,
    xl: 28,
    full: 999,
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  shadow: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 8,
    },
    glow: (color: string) => ({
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 6,
    }),
  },
};
