import React, { ReactNode, createContext, useContext } from 'react';
import { Colors } from '@/shared/theme/colors';
import { Typography } from '@/shared/theme/typography';
import { Radius, Shadow, Spacing } from '@/shared/theme/spacing';

const theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  radius: Radius,
  shadow: Shadow,
};

type Theme = typeof theme;

const ThemeContext = createContext<Theme>(theme);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): Theme => useContext(ThemeContext);
