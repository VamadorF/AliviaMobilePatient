import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WizardLayout } from '@/shared/components';
import { useDailyRecordData } from '@/features/daily-record/context/DailyRecordContext';
import { useMedicationsStore } from '@/features/medications/store/medications.store';
import { Colors } from '@/shared/theme/colors';
import { Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';
import type { DailyRecordStackParamList } from '@/shared/types/navigation';

export const MedicationScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DailyRecordStackParamList>>();
  const { data, updateData } = useDailyRecordData();
  const meds = useMedicationsStore((s) => s.medications);

  return (
    <WizardLayout
      step={7}
      totalSteps={9}
      title="¿Tomaste algún medicamento?"
      subtitle="Indica si tomaste medicamento para este episodio"
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('Recommendation')}
      nextDisabled={data.tookMedication === null}
    >
      <View style={styles.row}>
        <Pressable
          style={[styles.bigBtn, data.tookMedication === true && styles.bigBtnActive]}
          onPress={() => updateData({ tookMedication: true })}
        >
          <Text
            style={[styles.bigText, data.tookMedication === true && styles.bigTextActive]}
          >
            Sí, tomé
          </Text>
        </Pressable>
        <Pressable
          style={[styles.bigBtn, data.tookMedication === false && styles.bigBtnActive]}
          onPress={() =>
            updateData({ tookMedication: false, medicationId: null, medicationRelief: null })
          }
        >
          <Text
            style={[styles.bigText, data.tookMedication === false && styles.bigTextActive]}
          >
            No tomé
          </Text>
        </Pressable>
      </View>

      {data.tookMedication ? (
        <>
          <Text style={styles.label}>Medicamento</Text>
          {meds.length === 0 ? (
            <Text style={styles.empty}>
              Aún no tienes medicamentos registrados. Puedes continuar y agregarlos luego desde
              la pestaña Medicamentos.
            </Text>
          ) : (
            <View style={{ gap: 6 }}>
              {meds.map((m) => (
                <Pressable
                  key={m.id}
                  onPress={() => updateData({ medicationId: m.id })}
                  style={[
                    styles.medItem,
                    data.medicationId === m.id && styles.medItemActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.medName,
                      data.medicationId === m.id && { color: Colors.text.white },
                    ]}
                  >
                    {m.name}
                  </Text>
                  <Text
                    style={[
                      styles.medMeta,
                      data.medicationId === m.id && { color: 'rgba(255,255,255,0.85)' },
                    ]}
                  >
                    {m.dose} · cada {m.frequency}h
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          <Text style={styles.label}>Alivio percibido (0-10)</Text>
          <View style={styles.scaleRow}>
            {Array.from({ length: 11 }).map((_, n) => {
              const selected = data.medicationRelief === n;
              return (
                <Pressable
                  key={n}
                  onPress={() => updateData({ medicationRelief: n })}
                  style={[styles.dot, selected && styles.dotSelected]}
                >
                  <Text style={[styles.dotText, selected && styles.dotTextSelected]}>
                    {n}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : null}
    </WizardLayout>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, marginBottom: Spacing.base },
  bigBtn: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border.light,
    backgroundColor: Colors.background.white,
    alignItems: 'center',
  },
  bigBtnActive: { backgroundColor: Colors.medical.blue, borderColor: Colors.medical.blue },
  bigText: { fontWeight: '700', color: Colors.text.primary, fontSize: 16 },
  bigTextActive: { color: Colors.text.white },
  label: {
    ...Typography.styles.label,
    color: Colors.text.primary,
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
  },
  empty: {
    color: Colors.text.muted,
    fontStyle: 'italic',
  },
  medItem: {
    padding: Spacing.sm,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border.light,
    backgroundColor: Colors.background.white,
  },
  medItemActive: { backgroundColor: Colors.medical.blue, borderColor: Colors.medical.blue },
  medName: { fontWeight: '700', color: Colors.text.primary },
  medMeta: { color: Colors.text.muted, fontSize: 12 },
  scaleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border.light,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.white,
  },
  dotSelected: { backgroundColor: Colors.medical.blue, borderColor: Colors.medical.blue },
  dotText: { fontSize: 12, color: Colors.text.primary, fontWeight: '600' },
  dotTextSelected: { color: Colors.text.white },
});

export default MedicationScreen;
