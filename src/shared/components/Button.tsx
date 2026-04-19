import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors } from '@/shared/theme/colors';
import { Radius, Spacing, Shadow } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = true,
  style,
}) => {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textVariantColor[variant]} />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}
          <Text style={[styles.text, textSizeStyles[size], { color: textVariantColor[variant] }]}>
            {label}
          </Text>
          {rightIcon ? <View style={styles.iconRight}>{rightIcon}</View> : null}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...Shadow.md,
  },
  fullWidth: { width: '100%' },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.5 },
  contentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  iconLeft: { marginRight: Spacing.sm },
  iconRight: { marginLeft: Spacing.sm },
  text: { fontWeight: '700' as TextStyle['fontWeight'] },
});

const sizeStyles: Record<Size, ViewStyle> = {
  sm: { paddingVertical: 8, paddingHorizontal: 14, minHeight: 36 },
  md: { paddingVertical: 12, paddingHorizontal: 18, minHeight: 48 },
  lg: { paddingVertical: 16, paddingHorizontal: 24, minHeight: 56 },
};

const textSizeStyles: Record<Size, TextStyle> = {
  sm: { fontSize: Typography.fontSize.sm },
  md: { fontSize: Typography.fontSize.base },
  lg: { fontSize: Typography.fontSize.lg },
};

const variantStyles: Record<Variant, ViewStyle> = {
  primary: { backgroundColor: Colors.medical.blue },
  secondary: { backgroundColor: Colors.medical.purple },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.medical.blue,
    elevation: 0,
    shadowOpacity: 0,
  },
  ghost: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  danger: { backgroundColor: Colors.medical.red },
};

const textVariantColor: Record<Variant, string> = {
  primary: Colors.text.white,
  secondary: Colors.text.white,
  outline: Colors.medical.blue,
  ghost: Colors.medical.blue,
  danger: Colors.text.white,
};
