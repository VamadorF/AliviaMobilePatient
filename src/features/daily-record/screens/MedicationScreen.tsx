import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button, Card, WizardLayout } from '@/shared/components';
import { useDailyRecordData } from '@/features/daily-record/context/DailyRecordContext';
import { useMedicationsStore } from '@/features/medications/store/medications.store';
import { Colors } from '@/shared/theme/colors';
import { Radius, Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';
import type { DailyRecordStackParamList } from '@/shared/types/navigation';

export const MedicationScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DailyRecordStackParamList>>();
  const rootNavigation = navigation.getParent();
  const { data, updateData } = useDailyRecordData();
  const meds = useMedicationsStore((s) => s.medications);

  const isTaken = (id: string) => data.takenMedications.some((m) => m.id === id);
  const reliefFor = (id: string) =>
    data.takenMedications.find((m) => m.id === id)?.relief ?? 0;

  const toggleMed = (id: string) => {
    const exists = isTaken(id);
    const next = exists
      ? data.takenMedications.filter((m) => m.id !== id)
      : [...data.takenMedications, { id, relief: 0 }];
    updateData({
      takenMedications: next,
      tookMedication: next.length > 0,
    });
  };

  const setRelief = (id: string, value: number) => {
    const next = data.takenMedications.map((m) =>
      m.id === id ? { ...m, relief: value } : m,
    );
    updateData({ takenMedications: next });
  };

  return (
    <WizardLayout
      step={7}
      totalSteps={9}
      stepLabel="Medicación de hoy"
      title="¿Tomaste medicamento hoy?"
      subtitle="Marca los que tomaste y cuánto te aliviaron. No es obligatorio."
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('Recommendation')}
      nextLabel="Continuar"
    >
      {meds.length === 0 ? (
        <Card style={styles.emptyCard}>
          <View style={styles.emptyHeader}>
            <Ionicons name="medkit-outline" size={28} color={Colors.primary.base} />
            <Text style={styles.emptyTitle}>Aún no tienes medicamentos</Text>
          </View>
          <Text style={styles.emptyText}>
            Si quieres llevar registro de tus tomas, puedes agregar tus medicamentos desde la
            pestaña Medicamentos. Esto no detiene tu registro de hoy.
          </Text>
          <View style={{ marginTop: Spacing.sm }}>
            <Button
              label="Ir a Medicamentos"
              variant="outline"
              onPress={() =>
                rootNavigation?.getParent()?.navigate('Medications' as never)
              }
              leftIcon={<Ionicons name="add-circle" size={18} color={Colors.primary.base} />}
            />
          </View>
        </Card>
      ) : (
        <View style={{ gap: Spacing.sm }}>
          {meds.map((med) => {
            const taken = isTaken(med.id);
            const relief = reliefFor(med.id);
            return (
              <View
                key={med.id}
                style={[styles.medCard, taken && styles.medCardActive]}
              >
                <Pressable onPress={() => toggleMed(med.id)} style={styles.medHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.medName}>{med.name}</Text>
                    {med.substance ? (
                      <Text style={styles.medSubstance}>{med.substance}</Text>
                    ) : null}
                    <Text style={styles.medMeta}>
                      {med.dose} · cada {med.frequency}h
                    </Text>
                    {med.lastTaken ? (
                      <Text style={styles.lastTaken}>
                        Última toma:{' '}
                        {formatDistanceToNow(new Date(med.lastTaken), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </Text>
                    ) : null}
                  </View>
                  <View style={[styles.toggle, taken && styles.toggleOn]}>
                    {taken ? (
                      <Ionicons name="checkmark" size={18} color={Colors.text.onAccent} />
                    ) : (
                      <Text style={styles.toggleText}>Marcar</Text>
                    )}
                  </View>
                </Pressable>

                {taken ? (
                  <View style={styles.reliefBlock}>
                    <View style={styles.reliefHeader}>
                      <Text style={styles.reliefLabel}>Alivio percibido</Text>
                      <Text style={styles.reliefValue}>{relief}/10</Text>
                    </View>
                    <View style={styles.scaleRow}>
                      {Array.from({ length: 11 }).map((_, n) => {
                        const selected = relief === n;
                        return (
                          <Pressable
                            key={n}
                            onPress={() => setRelief(med.id, n)}
                            style={[styles.dot, selected && styles.dotSelected]}
                          >
                            <Text
                              style={[styles.dotText, selected && styles.dotTextSelected]}
                            >
                              {n}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                ) : null}
              </View>
            );
          })}

          <Pressable
            style={styles.noneRow}
            onPress={() =>
              updateData({
                takenMedications: [],
                tookMedication: false,
              })
            }
          >
            <Ionicons
              name={
                data.tookMedication === false && data.takenMedications.length === 0
                  ? 'radio-button-on'
                  : 'radio-button-off'
              }
              size={20}
              color={Colors.primary.base}
            />
            <Text style={styles.noneText}>Hoy no tomé ningún medicamento</Text>
          </Pressable>
        </View>
      )}
    </WizardLayout>
  );
};

const styles = StyleSheet.create({
  emptyCard: { backgroundColor: Colors.primary.soft },
  emptyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: Spacing.xs,
  },
  emptyTitle: { ...Typography.styles.h4, color: Colors.text.primary, flex: 1 },
  emptyText: { color: Colors.text.secondary, fontSize: 13, lineHeight: 19 },
  medCard: {
    padding: Spacing.base,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Colors.border.subtle,
    backgroundColor: Colors.background.surface,
  },
  medCardActive: { borderColor: Colors.primary.base, backgroundColor: Colors.primary.soft },
  medHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  medName: { ...Typography.styles.label, color: Colors.text.primary },
  medSubstance: { color: Colors.text.muted, fontSize: 12, fontStyle: 'italic' },
  medMeta: { color: Colors.text.secondary, fontSize: 12, marginTop: 2 },
  lastTaken: { color: Colors.text.muted, fontSize: 11, marginTop: 2 },
  toggle: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: Colors.primary.base,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleOn: { backgroundColor: Colors.primary.base },
  toggleText: { color: Colors.primary.base, fontWeight: '700', fontSize: 12 },
  reliefBlock: { marginTop: Spacing.sm },
  reliefHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  reliefLabel: { ...Typography.styles.label, color: Colors.text.primary },
  reliefValue: { color: Colors.primary.base, fontWeight: '800' },
  scaleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.surfaceHigh,
  },
  dotSelected: { backgroundColor: Colors.primary.base, borderColor: Colors.primary.base },
  dotText: { fontSize: 11, fontWeight: '600', color: Colors.text.primary },
  dotTextSelected: { color: Colors.text.onAccent },
  noneRow: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: Spacing.sm,
  },
  noneText: { color: Colors.text.primary, fontWeight: '600' },
});

export default MedicationScreen;
