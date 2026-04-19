import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '@/shared/theme/colors';
import { Radius, Shadow, Spacing } from '@/shared/theme/spacing';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  padded?: boolean;
  background?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  padded = true,
  background = Colors.background.white,
}) => {
  const inner: ViewStyle = {
    backgroundColor: background,
    padding: padded ? Spacing.base : 0,
    borderRadius: Radius.xl,
    ...Shadow.md,
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
  pressed: { opacity: 0.95, transform: [{ scale: 0.99 }] },
});
