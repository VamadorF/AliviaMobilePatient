import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/shared/theme/colors';
import { Radius, Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';

interface FacesPainScaleProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readOnly?: boolean;
}

type IconName = React.ComponentProps<typeof MaterialIcons>['name'];

const faces: {
  value: number;
  label: string;
  description: string;
  color: string;
  icon: IconName;
}[] = [
  {
    value: 0,
    label: 'Sin dolor',
    description: 'Sin dolor',
    color: '#87CEEB',
    icon: 'sentiment-very-satisfied',
  },
  {
    value: 2,
    label: 'Dolor leve',
    description: 'Duele un poco',
    color: '#90EE90',
    icon: 'sentiment-satisfied',
  },
  {
    value: 4,
    label: 'Dolor moderado',
    description: 'Duele un poco más',
    color: '#FFD700',
    icon: 'sentiment-neutral',
  },
  {
    value: 6,
    label: 'Dolor severo',
    description: 'Duele aún más',
    color: '#FF8C00',
    icon: 'sentiment-dissatisfied',
  },
  {
    value: 8,
    label: 'Dolor muy severo',
    description: 'Duele mucho',
    color: '#FF6347',
    icon: 'sentiment-very-dissatisfied',
  },
  {
    value: 10,
    label: 'Peor dolor',
    description: 'Duele lo peor',
    color: '#DC143C',
    icon: 'sick',
  },
];

const getClosestFace = (val: number) =>
  faces.reduce((prev, curr) =>
    Math.abs(curr.value - val) < Math.abs(prev.value - val) ? curr : prev,
  );

const getScaleColor = (num: number): string => {
  const normalized = Math.max(1, Math.min(10, num));
  const t = (normalized - 1) / 9;
  if (t <= 0.2) return '#87CEEB';
  if (t <= 0.4) return '#90EE90';
  if (t <= 0.6) return '#FFD700';
  if (t <= 0.8) return '#FF8C00';
  return '#DC143C';
};

export const FacesPainScale: React.FC<FacesPainScaleProps> = ({
  value,
  onChange,
  size = 'md',
  readOnly = false,
}) => {
  const normalized = Math.max(1, Math.min(10, value || 1));
  const closest = getClosestFace(normalized);

  const faceSize = size === 'lg' ? 60 : size === 'md' ? 52 : 44;

  const handleSelect = (faceValue: number) => {
    if (readOnly || !onChange) return;
    onChange(faceValue === 0 ? 1 : faceValue);
  };

  const stepDown = () => onChange?.(Math.max(1, +(normalized - 1).toFixed(1)));
  const stepUp = () => onChange?.(Math.min(10, +(normalized + 1).toFixed(1)));

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Escala de medición del dolor</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.facesRow}
      >
        {faces.map((face) => {
          const selected = closest.value === face.value;
          return (
            <Pressable
              key={face.value}
              onPress={() => handleSelect(face.value)}
              disabled={readOnly}
              style={[
                styles.faceCard,
                {
                  width: faceSize + 16,
                  backgroundColor: selected ? face.color : Colors.background.white,
                  borderColor: selected ? face.color : Colors.border.light,
                },
              ]}
            >
              <View
                style={[
                  styles.faceCircle,
                  {
                    width: faceSize,
                    height: faceSize,
                    borderRadius: faceSize / 2,
                    backgroundColor: selected ? Colors.background.white : face.color,
                  },
                ]}
              >
                <MaterialIcons
                  name={face.icon}
                  size={faceSize * 0.7}
                  color={selected ? face.color : '#1f2937'}
                />
              </View>
              <Text
                style={[
                  styles.faceValue,
                  { color: selected ? Colors.text.white : Colors.text.primary },
                ]}
              >
                {face.value}
              </Text>
              <Text
                style={[
                  styles.faceLabel,
                  { color: selected ? 'rgba(255,255,255,0.9)' : Colors.text.muted },
                ]}
                numberOfLines={2}
              >
                {face.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.gradientBox}>
        <LinearGradient
          colors={['#87CEEB', '#90EE90', '#FFD700', '#FF8C00', '#FF6347', '#DC143C']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBar}
        />
        <View style={styles.gradientLabels}>
          {[1, 2.5, 4, 5.5, 7, 8.5, 10].map((n) => (
            <Text key={n} style={styles.gradientLabel}>
              {n}
            </Text>
          ))}
        </View>
      </View>

      {!readOnly && onChange ? (
        <View style={styles.fineTune}>
          <View style={styles.fineTuneRow}>
            <Text style={styles.fineLabel}>Ajuste fino:</Text>
            <Text style={[styles.fineValue, { color: getScaleColor(normalized) }]}>
              {normalized.toFixed(1)} / 10.0
            </Text>
          </View>
          <View style={styles.stepperRow}>
            <Pressable onPress={stepDown} style={styles.stepperBtn}>
              <MaterialIcons name="remove" size={22} color={Colors.text.white} />
            </Pressable>
            <View style={styles.intensityBar}>
              <View
                style={[
                  styles.intensityFill,
                  {
                    width: `${((normalized - 1) / 9) * 100}%`,
                    backgroundColor: getScaleColor(normalized),
                  },
                ]}
              />
            </View>
            <Pressable onPress={stepUp} style={styles.stepperBtn}>
              <MaterialIcons name="add" size={22} color={Colors.text.white} />
            </Pressable>
          </View>
          <Text style={styles.fineHint}>{closest.description}</Text>
        </View>
      ) : (
        <View style={{ marginTop: Spacing.base, alignItems: 'center' }}>
          <Text style={[styles.fineValue, { color: getScaleColor(normalized) }]}>
            {normalized.toFixed(1)} / 10.0
          </Text>
          <Text style={styles.fineHint}>{closest.description}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { padding: Spacing.sm },
  title: {
    ...Typography.styles.h4,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  facesRow: { gap: 8, paddingVertical: 4 },
  faceCard: {
    alignItems: 'center',
    padding: 6,
    borderRadius: Radius.lg,
    borderWidth: 2,
    marginRight: 6,
  },
  faceCircle: { alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  faceValue: { fontSize: 13, fontWeight: '700' },
  faceLabel: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
    minHeight: 24,
  },
  gradientBox: { marginTop: Spacing.base },
  gradientBar: { width: '100%', height: 12, borderRadius: 6 },
  gradientLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  gradientLabel: { fontSize: 10, color: Colors.text.muted, fontWeight: '600' },
  fineTune: { marginTop: Spacing.base },
  fineTuneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  fineLabel: { fontWeight: '600', color: Colors.text.primary },
  fineValue: { fontSize: Typography.fontSize.xl, fontWeight: '800' },
  fineHint: {
    textAlign: 'center',
    color: Colors.text.muted,
    fontSize: 12,
    marginTop: 6,
  },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepperBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.medical.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intensityBar: {
    flex: 1,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.background.gray,
    overflow: 'hidden',
  },
  intensityFill: { height: '100%' },
});

export default FacesPainScale;
