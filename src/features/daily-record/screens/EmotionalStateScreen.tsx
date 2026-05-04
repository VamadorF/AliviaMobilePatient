import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Card, WizardLayout } from '@/shared/components';
import { useDailyRecordData } from '@/features/daily-record/context/DailyRecordContext';
import { Colors } from '@/shared/theme/colors';
import { Radius, Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';
import type { DailyRecordStackParamList } from '@/shared/types/navigation';

const options = [
  { value: 0, label: 'Nada' },
  { value: 1, label: 'Algunos días' },
  { value: 2, label: 'Más de la mitad' },
  { value: 3, label: 'Casi todos los días' },
];

interface QuestionProps {
  question: string;
  value: number | null;
  onChange: (v: number) => void;
}

const Question: React.FC<QuestionProps> = ({ question, value, onChange }) => (
  <View style={styles.questionBlock}>
    <Text style={styles.question}>{question}</Text>
    <View style={styles.optionsCol}>
      {options.map((o) => (
        <Pressable
          key={o.value}
          onPress={() => onChange(o.value)}
          style={[styles.option, value === o.value && styles.optionActive]}
        >
          <View style={[styles.radio, value === o.value && styles.radioActive]} />
          <Text style={styles.optionText}>{o.label}</Text>
        </Pressable>
      ))}
    </View>
  </View>
);

export const EmotionalStateScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DailyRecordStackParamList>>();
  const { data, updateData } = useDailyRecordData();

  const phq2Score = (data.phq2Answer1 ?? 0) + (data.phq2Answer2 ?? 0);
  const gad2Score = (data.gad2Answer1 ?? 0) + (data.gad2Answer2 ?? 0);

  const allAnswered =
    data.phq2Answer1 !== null &&
    data.phq2Answer2 !== null &&
    data.gad2Answer1 !== null &&
    data.gad2Answer2 !== null;

  const showEmpathy = allAnswered && (phq2Score >= 3 || gad2Score >= 3);

  return (
    <WizardLayout
      step={6}
      totalSteps={9}
      stepLabel="Cómo te sientes"
      title="¿Cómo está tu ánimo?"
      subtitle="Durante las últimas 2 semanas, ¿con qué frecuencia te has sentido así?"
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('Medication')}
      nextDisabled={!allAnswered}
      nextLabel="Continuar"
    >
      <Card style={styles.intro} background="#eef2ff">
        <View style={styles.introHeader}>
          <Ionicons name="information-circle" size={20} color={Colors.medical.blue} />
          <Text style={styles.introTitle}>Cuéntanos cómo te has sentido</Text>
        </View>
        <Text style={styles.introText}>
          Son unas pocas preguntas cortas para entender cómo está tu ánimo y nivel de
          ansiedad. No es un diagnóstico, es una forma cuidadosa de escucharte.
        </Text>
      </Card>

      <Text style={styles.section}>Estado de ánimo</Text>
      <Question
        question="Poco interés o placer en hacer cosas"
        value={data.phq2Answer1}
        onChange={(v) => updateData({ phq2Answer1: v })}
      />
      <Question
        question="Sentirse decaído(a), deprimido(a) o sin esperanza"
        value={data.phq2Answer2}
        onChange={(v) => updateData({ phq2Answer2: v })}
      />

      <Text style={styles.section}>Ansiedad</Text>
      <Question
        question="Sentirse nervioso(a), ansioso(a) o muy alterado(a)"
        value={data.gad2Answer1}
        onChange={(v) => updateData({ gad2Answer1: v })}
      />
      <Question
        question="No poder dejar de preocuparse o controlar la preocupación"
        value={data.gad2Answer2}
        onChange={(v) => updateData({ gad2Answer2: v })}
      />

      {showEmpathy ? (
        <View style={styles.empathy}>
          <Ionicons name="heart" size={18} color="#9d174d" />
          <Text style={styles.empathyText}>
            Lo que sientes importa. Compartir esto ya es un acto de cuidado. Considera
            comentarlo con tu equipo de salud para acompañarte mejor.
          </Text>
        </View>
      ) : null}
    </WizardLayout>
  );
};

const styles = StyleSheet.create({
  intro: { marginBottom: Spacing.base },
  introHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.xs },
  introTitle: { ...Typography.styles.label, color: Colors.medical.blue, flex: 1 },
  introText: { color: Colors.text.secondary, fontSize: 13, lineHeight: 18 },
  section: {
    ...Typography.styles.h4,
    color: Colors.medical.blue,
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
  },
  questionBlock: { marginBottom: Spacing.base },
  question: {
    ...Typography.styles.body,
    color: Colors.text.primary,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  optionsCol: { gap: 6 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border.light,
    backgroundColor: Colors.background.white,
  },
  optionActive: {
    borderColor: Colors.medical.blue,
    backgroundColor: '#eff6ff',
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.border.medium,
  },
  radioActive: {
    backgroundColor: Colors.medical.blue,
    borderColor: Colors.medical.blue,
  },
  optionText: { color: Colors.text.primary, fontWeight: '500' },
  empathy: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: Spacing.base,
    padding: Spacing.base,
    borderRadius: Radius.lg,
    backgroundColor: '#fdf2f8',
    borderWidth: 1,
    borderColor: '#fbcfe8',
  },
  empathyText: { color: '#831843', flex: 1, fontSize: 13, lineHeight: 19 },
});

export default EmotionalStateScreen;
