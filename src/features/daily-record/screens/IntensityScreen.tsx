import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { WizardLayout } from '@/shared/components';
import { useDailyRecordData } from '@/features/daily-record/context/DailyRecordContext';
import { FacesPainScale } from '@/features/daily-record/components/FacesPainScale';
import { CRITICAL_PAIN_THRESHOLD } from '@/app/config/constants';
import { Colors } from '@/shared/theme/colors';
import { Radius, Spacing } from '@/shared/theme/spacing';
import type { DailyRecordStackParamList } from '@/shared/types/navigation';

const empathyMessage = (value: number): { text: string; color: string } => {
  if (value <= 0) {
    return {
      text: 'Que bien que hoy no sientas dolor. Sigue cuidándote igual.',
      color: '#3b82f6',
    };
  }
  if (value <= 3) {
    return {
      text: 'Aunque sea leve, cuenta. Gracias por escuchar a tu cuerpo.',
      color: '#22c55e',
    };
  }
  if (value <= 6) {
    return {
      text: 'Un dolor moderado es agotador. Estamos contigo en este registro.',
      color: '#f59e0b',
    };
  }
  if (value <= 9) {
    return {
      text: 'Un dolor así es muy duro. Reconocerlo ya es un paso importante.',
      color: '#ef4444',
    };
  }
  return {
    text: 'Estamos contigo. Si el dolor es insoportable, busca ayuda médica ahora.',
    color: '#7f1d1d',
  };
};

export const IntensityScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DailyRecordStackParamList>>();
  const { data, updateData } = useDailyRecordData();
  const message = empathyMessage(data.painIntensity);

  const isCritical = data.painIntensity >= CRITICAL_PAIN_THRESHOLD;

  const handleNext = () => {
    if (isCritical) {
      navigation.navigate('Save');
    } else {
      navigation.navigate('Quality');
    }
  };

  return (
    <WizardLayout
      step={2}
      totalSteps={9}
      stepLabel="¿Cuánto duele?"
      title="¿Qué tan intenso es tu dolor hoy?"
      subtitle="Tu respuesta nos ayuda a entender lo que estás viviendo"
      onBack={() => navigation.goBack()}
      onNext={handleNext}
      nextLabel={isCritical ? 'Guardar y pedir ayuda' : 'Continuar'}
    >
      <FacesPainScale
        value={data.painIntensity}
        onChange={(v) => updateData({ painIntensity: v })}
        size="lg"
      />

      <View
        style={[
          styles.empathyBox,
          { borderColor: message.color, backgroundColor: `${message.color}14` },
        ]}
      >
        <Text style={[styles.empathyText, { color: message.color }]}>{message.text}</Text>
      </View>

      {isCritical ? (
        <View style={styles.criticalBox}>
          <View style={styles.criticalRow}>
            <Ionicons name="alert-circle" size={20} color="#7f1d1d" />
            <Text style={styles.criticalTitle}>Detectamos dolor muy alto</Text>
          </View>
          <Text style={styles.criticalText}>
            Para no agotarte con más preguntas, vamos a guardar este registro y mostrarte
            ayuda inmediata. Si necesitas atención urgente, llama al 131 o acude al servicio
            de urgencia más cercano.
          </Text>
        </View>
      ) : null}
    </WizardLayout>
  );
};

const styles = StyleSheet.create({
  empathyBox: {
    marginTop: Spacing.base,
    padding: Spacing.base,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  empathyText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'center',
    color: Colors.text.primary,
  },
  criticalBox: {
    marginTop: Spacing.base,
    padding: Spacing.base,
    borderRadius: Radius.lg,
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  criticalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  criticalTitle: {
    color: '#7f1d1d',
    fontWeight: '800',
    fontSize: 15,
  },
  criticalText: { color: '#7f1d1d', fontSize: 13, lineHeight: 18 },
});

export default IntensityScreen;
