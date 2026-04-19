import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Input, OptionPill, WizardLayout } from '@/shared/components';
import { useDailyRecordData } from '@/features/daily-record/context/DailyRecordContext';
import { Colors } from '@/shared/theme/colors';
import { Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';
import type { DailyRecordStackParamList } from '@/shared/types/navigation';

const units: { id: 'hours' | 'days' | 'weeks' | 'months'; label: string }[] = [
  { id: 'hours', label: 'Horas' },
  { id: 'days', label: 'Días' },
  { id: 'weeks', label: 'Semanas' },
  { id: 'months', label: 'Meses' },
];

export const DurationScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DailyRecordStackParamList>>();
  const { data, updateData } = useDailyRecordData();

  return (
    <WizardLayout
      step={4}
      totalSteps={9}
      title="¿Hace cuánto tiempo lo sientes?"
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('FunctionalImpact')}
      nextDisabled={data.durationValue <= 0}
    >
      <Text style={styles.label}>Cantidad</Text>
      <Input
        keyboardType="number-pad"
        value={String(data.durationValue)}
        onChangeText={(t) => {
          const n = parseInt(t || '0', 10);
          updateData({ durationValue: Number.isFinite(n) ? n : 0 });
        }}
      />

      <Text style={styles.label}>Unidad</Text>
      <View style={styles.row}>
        {units.map((u) => (
          <OptionPill
            key={u.id}
            label={u.label}
            selected={data.durationUnit === u.id}
            onPress={() => updateData({ durationUnit: u.id })}
          />
        ))}
      </View>

      <Text style={styles.label}>¿Lo habías tenido antes?</Text>
      <View style={styles.row}>
        <OptionPill
          label="Sí"
          selected={data.hasHadBefore === true}
          onPress={() => updateData({ hasHadBefore: true })}
        />
        <OptionPill
          label="No"
          selected={data.hasHadBefore === false}
          onPress={() => updateData({ hasHadBefore: false, weeklyFrequency: null })}
        />
      </View>

      {data.hasHadBefore ? (
        <>
          <Text style={styles.label}>Frecuencia semanal (días en que duele)</Text>
          <View style={styles.row}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
              <OptionPill
                key={n}
                label={`${n}`}
                selected={data.weeklyFrequency === n}
                onPress={() => updateData({ weeklyFrequency: n })}
              />
            ))}
          </View>
        </>
      ) : null}
    </WizardLayout>
  );
};

const styles = StyleSheet.create({
  label: {
    ...Typography.styles.label,
    color: Colors.text.primary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap' },
});

export default DurationScreen;
