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

const qualities = [
  { id: 'stabbing', label: 'Punzante' },
  { id: 'burning', label: 'Ardor' },
  { id: 'throbbing', label: 'Pulsátil' },
  { id: 'aching', label: 'Sordo' },
  { id: 'shooting', label: 'Eléctrico' },
  { id: 'cramping', label: 'Calambre' },
  { id: 'pressing', label: 'Opresivo' },
  { id: 'tingling', label: 'Hormigueo' },
];

export const QualityScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DailyRecordStackParamList>>();
  const { data, updateData } = useDailyRecordData();

  const toggle = (id: string) => {
    const exists = data.painQualities.includes(id);
    updateData({
      painQualities: exists
        ? data.painQualities.filter((q) => q !== id)
        : [...data.painQualities, id],
    });
  };

  return (
    <WizardLayout
      step={3}
      totalSteps={9}
      title="¿Cómo es el dolor?"
      subtitle="Selecciona todas las cualidades que apliquen"
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('Duration')}
      nextDisabled={data.painQualities.length === 0}
    >
      <View style={styles.grid}>
        {qualities.map((q) => (
          <OptionPill
            key={q.id}
            label={q.label}
            selected={data.painQualities.includes(q.id)}
            onPress={() => toggle(q.id)}
          />
        ))}
      </View>

      <Text style={styles.helper}>Otra (opcional)</Text>
      <Input
        placeholder="Describe cómo se siente"
        value={data.painQualityOther}
        onChangeText={(text) => updateData({ painQualityOther: text })}
      />
    </WizardLayout>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.base,
  },
  helper: {
    ...Typography.styles.label,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
});

export default QualityScreen;
