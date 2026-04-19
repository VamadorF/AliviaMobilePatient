import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '@/shared/theme/colors';
import { Radius } from '@/shared/theme/spacing';

interface ProgressBarProps {
  progress: number;
  color?: string;
  trackColor?: string;
  height?: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = Colors.medical.blue,
  trackColor = Colors.background.gray,
  height = 8,
  style,
}) => {
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <View style={[styles.track, { height, backgroundColor: trackColor }, style]}>
      <View
        style={[
          styles.fill,
          {
            width: `${clamped * 100}%`,
            backgroundColor: color,
            height,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: Radius.full,
  },
});
