import { Platform, TextStyle } from 'react-native';

const systemFont = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
}) as string;

const systemFontMedium = Platform.select({
  ios: 'System',
  android: 'sans-serif-medium',
  default: 'System',
}) as string;

export const Typography = {
  fontFamily: {
    regular: systemFont,
    medium: systemFontMedium,
    bold: systemFont,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeight: {
    light: '300' as TextStyle['fontWeight'],
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
    extraBold: '800' as TextStyle['fontWeight'],
  },
  styles: {
    h1: {
      fontSize: 32,
      fontWeight: '800' as TextStyle['fontWeight'],
      lineHeight: 40,
    },
    h2: {
      fontSize: 28,
      fontWeight: '700' as TextStyle['fontWeight'],
      lineHeight: 36,
    },
    h3: {
      fontSize: 22,
      fontWeight: '700' as TextStyle['fontWeight'],
      lineHeight: 28,
    },
    h4: {
      fontSize: 18,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 24,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 16,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 24,
    },
    label: {
      fontSize: 14,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 20,
    },
  },
} as const;

export type TypographyKey = keyof typeof Typography.styles;
