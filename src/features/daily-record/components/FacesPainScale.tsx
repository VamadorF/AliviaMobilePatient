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

interface FaceDef {
  value: number;
  label: string;
  color: string;
  icon: IconName;
}

const faces: FaceDef[] = [
  { value: 0, label: 'Sin dolor', color: '#3b82f6', icon: 'sentiment-very-satisfied' },
  { value: 2, label: 'Apenas duele', color: '#22c55e', icon: 'sentiment-satisfied' },
  { value: 4, label: 'Duele un poco más', color: '#facc15', icon: 'sentiment-neutral' },
  { value: 6, label: 'Duele bastante', color: '#fb923c', icon: 'sentiment-dissatisfied' },
  { value: 8, label: 'Duele mucho', color: '#f97316', icon: 'sentiment-very-dissatisfied' },
  { value: 10, label: 'Peor dolor imaginable', color: '#dc2626', icon: 'sick' },
];

interface IaspBand {
  range: [number, number];
  label: string;
  color: string;
  description: string;
}

const iaspBands: IaspBand[] = [
  { range: [0, 0], label: 'Sin dolor', color: '#3b82f6', description: 'No hay dolor presente' },
  { range: [1, 3], label: 'Dolor leve', color: '#22c55e', description: 'Es molesto, pero puedes continuar tu día' },
  { range: [4, 6], label: 'Dolor moderado', color: '#f59e0b', description: 'Interfiere con tus actividades habituales' },
  { range: [7, 9], label: 'Dolor severo', color: '#ef4444', description: 'Limita seriamente lo que puedes hacer' },
  { range: [10, 10], label: 'El peor dolor imaginable', color: '#7f1d1d', description: 'No puedes pensar en otra cosa' },
];

const getIaspBand = (val: number): IaspBand => {
  return iaspBands.find((b) => val >= b.range[0] && val <= b.range[1]) ?? iaspBands[0];
};

const getClosestFace = (val: number): FaceDef =>
  faces.reduce((prev, curr) =>
    Math.abs(curr.value - val) < Math.abs(prev.value - val) ? curr : prev,
  );

const clampInt = (n: number) => Math.max(0, Math.min(10, Math.round(n)));

export const FacesPainScale: React.FC<FacesPainScaleProps> = ({
  value,
  onChange,
  size = 'md',
  readOnly = false,
}) => {
  const intensity = clampInt(value);
  const closest = getClosestFace(intensity);
  const band = getIaspBand(intensity);
  const faceSize = size === 'lg' ? 56 : size === 'md' ? 48 : 40;

  const handleSelectFace = (faceValue: number) => {
    if (readOnly || !onChange) return;
    onChange(faceValue);
  };

  const handleSelectNrs = (n: number) => {
    if (readOnly || !onChange) return;
    onChange(n);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Escala numérica del dolor (NRS-11)</Text>
      <Text style={styles.subtitle}>Toca el número que mejor representa tu dolor de 0 a 10</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.nrsRow}
      >
        {Array.from({ length: 11 }, (_, i) => i).map((n) => {
          const selected = intensity === n;
          const cellBand = getIaspBand(n);
          return (
            <Pressable
              key={n}
              onPress={() => handleSelectNrs(n)}
              disabled={readOnly}
              style={[
                styles.nrsCell,
                {
                  backgroundColor: selected ? cellBand.color : Colors.background.white,
                  borderColor: selected ? cellBand.color : Colors.border.light,
                },
              ]}
            >
              <Text
                style={[
                  styles.nrsText,
                  { color: selected ? Colors.text.white : Colors.text.primary },
                ]}
              >
                {n}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={styles.refTitle}>Caras de referencia (FPS-R)</Text>
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
              onPress={() => handleSelectFace(face.value)}
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
                  { color: selected ? 'rgba(255,255,255,0.95)' : Colors.text.muted },
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
          colors={['#3b82f6', '#22c55e', '#facc15', '#f97316', '#ef4444', '#7f1d1d']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBar}
        />
        <View style={styles.gradientLabels}>
          {[0, 2, 4, 6, 8, 10].map((n) => (
            <Text key={n} style={styles.gradientLabel}>
              {n}
            </Text>
          ))}
        </View>
      </View>

      <View style={[styles.bandCard, { borderColor: band.color, backgroundColor: `${band.color}1A` }]}>
        <Text style={[styles.bandLabel, { color: band.color }]}>{band.label}</Text>
        <Text style={styles.bandDesc}>{band.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { padding: Spacing.sm },
  title: {
    ...Typography.styles.h4,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.text.muted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: Spacing.md,
  },
  nrsRow: { gap: 6, paddingVertical: 4 },
  nrsCell: {
    width: 44,
    height: 48,
    borderRadius: Radius.md,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  nrsText: { fontSize: 18, fontWeight: '800' },
  refTitle: {
    ...Typography.styles.label,
    color: Colors.text.muted,
    textAlign: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
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
  bandCard: {
    marginTop: Spacing.base,
    padding: Spacing.base,
    borderRadius: Radius.lg,
    borderWidth: 2,
    alignItems: 'center',
  },
  bandLabel: { fontSize: Typography.fontSize.lg, fontWeight: '800' },
  bandDesc: { color: Colors.text.secondary, marginTop: 4, textAlign: 'center', fontSize: 13 },
});

export default FacesPainScale;
