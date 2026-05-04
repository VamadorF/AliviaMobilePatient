import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Input, OptionPill, WizardLayout } from '@/shared/components';
import { useDailyRecordData } from '@/features/daily-record/context/DailyRecordContext';
import { CRITICAL_PAIN_THRESHOLD } from '@/app/config/constants';
import { Colors } from '@/shared/theme/colors';
import { Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';
import type { DailyRecordStackParamList } from '@/shared/types/navigation';

const sensationOptions = [
  { id: 'stabbing', label: 'Punzante' },
  { id: 'burning', label: 'Ardor' },
  { id: 'throbbing', label: 'Pulsátil' },
  { id: 'aching', label: 'Sordo' },
  { id: 'shooting', label: 'Eléctrico' },
  { id: 'cramping', label: 'Calambre' },
  { id: 'pressing', label: 'Opresivo' },
  { id: 'tingling', label: 'Hormigueo' },
  { id: 'deep', label: 'Profundo' },
  { id: 'superficial', label: 'Superficial' },
];

const patternOptions = [
  { id: 'continuous', label: 'Continuo' },
  { id: 'intermittent', label: 'Intermitente' },
  { id: 'radiating', label: 'Irradia' },
  { id: 'worse-movement', label: 'Empeora con el movimiento' },
  { id: 'worse-rest', label: 'Empeora en reposo' },
];

export const QualityScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DailyRecordStackParamList>>();
  const { data, updateData } = useDailyRecordData();

  useEffect(() => {
    if (data.painIntensity >= CRITICAL_PAIN_THRESHOLD) {
      navigation.replace('Save');
    }
  }, [data.painIntensity, navigation]);

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
      stepLabel="Cómo se siente"
      title="¿Cómo es el dolor?"
      subtitle="Marca cómo se siente y cómo se comporta a lo largo del día"
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('Duration')}
      nextDisabled={data.painQualities.length === 0}
      nextLabel="Continuar a duración"
    >
      <Text style={styles.section}>Tipo de sensación</Text>
      <Text style={styles.help}>Elige una o varias palabras que describan cómo se siente</Text>
      <View style={styles.grid}>
        {sensationOptions.map((q) => (
          <OptionPill
            key={q.id}
            label={q.label}
            selected={data.painQualities.includes(q.id)}
            onPress={() => toggle(q.id)}
          />
        ))}
      </View>

      <Text style={styles.section}>Patrón temporal y funcional</Text>
      <Text style={styles.help}>¿Cómo cambia el dolor con el paso del tiempo o las actividades?</Text>
      <View style={styles.grid}>
        {patternOptions.map((q) => (
          <OptionPill
            key={q.id}
            label={q.label}
            selected={data.painQualities.includes(q.id)}
            onPress={() => toggle(q.id)}
          />
        ))}
      </View>

      <Text style={styles.section}>Otra (opcional)</Text>
      <Input
        placeholder="Describe cómo se siente con tus palabras"
        value={data.painQualityOther}
        onChangeText={(text) => updateData({ painQualityOther: text })}
      />
    </WizardLayout>
  );
};

const styles = StyleSheet.create({
  section: {
    ...Typography.styles.h4,
    color: Colors.text.primary,
    marginTop: Spacing.base,
    marginBottom: Spacing.xs,
  },
  help: {
    color: Colors.text.muted,
    fontSize: 12,
    marginBottom: Spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.sm,
  },
});

export default QualityScreen;
