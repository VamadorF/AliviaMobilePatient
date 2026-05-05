import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { Colors } from '@/shared/theme/colors';
import { Radius, Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';

interface OptionPillProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export const OptionPill: React.FC<OptionPillProps> = ({
  label,
  selected,
  onPress,
  style,
}) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.pill,
      selected ? styles.selected : styles.unselected,
      pressed && styles.pressed,
      style,
    ]}
  >
    <Text
      style={[styles.text, selected ? styles.textSelected : styles.textUnselected]}
    >
      {label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  pill: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderRadius: Radius.full,
    borderWidth: 1,
    margin: 4,
    minHeight: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: Colors.primary.base,
    borderColor: Colors.primary.base,
  },
  unselected: {
    backgroundColor: Colors.background.surfaceHigh,
    borderColor: Colors.border.subtle,
  },
  pressed: { opacity: 0.85 },
  text: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  textSelected: { color: Colors.text.onAccent },
  textUnselected: { color: Colors.text.secondary },
});
