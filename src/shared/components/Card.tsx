import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '@/shared/theme/colors';
import { Radius, Spacing } from '@/shared/theme/spacing';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padded?: boolean;
  background?: string;
  /** Si true (default), agrega un borde sutil para separar del fondo. */
  bordered?: boolean;
  /** Variante visual. `elevated` usa surfaceElevated. */
  variant?: 'flat' | 'elevated' | 'high';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  padded = true,
  background,
  bordered = true,
  variant = 'flat',
}) => {
  const bg =
    background ??
    (variant === 'elevated'
      ? Colors.background.surfaceElevated
      : variant === 'high'
        ? Colors.background.surfaceHigh
        : Colors.background.surface);

  const inner: ViewStyle = {
    backgroundColor: bg,
    padding: padded ? Spacing.base : 0,
    borderRadius: Radius.xl,
    borderWidth: bordered ? StyleSheet.hairlineWidth : 0,
    borderColor: Colors.border.subtle,
    ...style,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [inner, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={inner}>{children}</View>;
};

const styles = StyleSheet.create({
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
});
