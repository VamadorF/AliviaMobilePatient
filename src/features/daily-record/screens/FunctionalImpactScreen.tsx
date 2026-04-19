import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WizardLayout } from '@/shared/components';
import { useDailyRecordData } from '@/features/daily-record/context/DailyRecordContext';
import { Colors } from '@/shared/theme/colors';
import { Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';
import type { DailyRecordStackParamList } from '@/shared/types/navigation';

interface SliderRowProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
}

const SliderRow: React.FC<SliderRowProps> = ({ label, value, onChange }) => {
  return (
    <View style={{ marginBottom: Spacing.lg }}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}/10</Text>
      </View>
      <View style={styles.scaleRow}>
        {Array.from({ length: 11 }).map((_, n) => {
          const selected = value === n;
          return (
            <Pressable
              key={n}
              onPress={() => onChange(n)}
              style={[styles.dot, selected && styles.dotSelected]}
            >
              <Text style={[styles.dotText, selected && styles.dotTextSelected]}>
                {n}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.legendRow}>
        <Text style={styles.legend}>Sin impacto</Text>
        <Text style={styles.legend}>Imposible</Text>
      </View>
    </View>
  );
};

export const FunctionalImpactScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DailyRecordStackParamList>>();
  const { data, updateData } = useDailyRecordData();

  return (
    <WizardLayout
      step={5}
      totalSteps={9}
      title="Impacto funcional"
      subtitle="¿Cuánto te limita el dolor en cada área?"
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('EmotionalState')}
    >
      <SliderRow
        label="Actividad física"
        value={data.functionalImpactPhysical}
        onChange={(v) => updateData({ functionalImpactPhysical: v })}
      />
      <SliderRow
        label="Trabajo / estudio"
        value={data.functionalImpactWork}
        onChange={(v) => updateData({ functionalImpactWork: v })}
      />
      <SliderRow
        label="Vida social"
        value={data.functionalImpactSocial}
        onChange={(v) => updateData({ functionalImpactSocial: v })}
      />
    </WizardLayout>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  label: { ...Typography.styles.label, color: Colors.text.primary },
  value: {
    fontWeight: '800',
    color: Colors.medical.blue,
    fontSize: Typography.fontSize.lg,
  },
  scaleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background.white,
    borderWidth: 2,
    borderColor: Colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotSelected: { backgroundColor: Colors.medical.blue, borderColor: Colors.medical.blue },
  dotText: { fontSize: 12, color: Colors.text.primary, fontWeight: '600' },
  dotTextSelected: { color: Colors.text.white },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  legend: { fontSize: 11, color: Colors.text.muted },
});

export default FunctionalImpactScreen;
