export const theme = {
  colors: {
    // Deep Dark Background exact match
    background: '#0B0B0F',
    
    // Core structure
    surface: 'rgba(255, 255, 255, 0.05)', // base glass
    surfaceHighlight: 'rgba(255, 255, 255, 0.1)', // active glass
    border: 'rgba(255, 255, 255, 0.08)',
    
    // Accents mapped to Neon Blue & Violet visually
    accentPrimary: '#00D1FF',   // Neon Blue
    accentSecondary: '#B92BFF', // Neon Violet
    
    // Typography
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.6)',
    textMuted: 'rgba(255, 255, 255, 0.3)',
    
    // Status Contexts
    danger: '#FF3B30',
    success: '#34C759',
    warning: '#FFCC00',
  },
  glassmorphism: {
    // Standard frosted card CSS binding dynamically
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  }
};
