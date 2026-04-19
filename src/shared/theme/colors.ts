/**
 * Paleta de colores Alivia.
 * Mapea los tokens medical-* y primary-* del Next.js (tailwind.config.ts).
 */

export const Colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  medical: {
    blue: '#3b82f6',
    cyan: '#06b6d4',
    teal: '#14b8a6',
    green: '#10b981',
    purple: '#8b5cf6',
    pink: '#ec4899',
    orange: '#f97316',
    red: '#ef4444',
    yellow: '#f59e0b',
  },
  text: {
    primary: '#1f2937',
    secondary: '#4b5563',
    muted: '#6b7280',
    light: '#9ca3af',
    white: '#FFFFFF',
    link: '#3b82f6',
  },
  background: {
    white: '#FFFFFF',
    light: '#F9FAFB',
    gray: '#F3F4F6',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  },
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  pain: {
    none: '#87CEEB',
    mild: '#90EE90',
    moderate: '#FFD700',
    severe: '#FF8C00',
    verySevere: '#FF6347',
    worst: '#DC143C',
  },
} as const;

export type ColorKey = keyof typeof Colors;
