import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { WizardLayout, Card } from '@/shared/components';
import { useDailyRecordData } from '@/features/daily-record/context/DailyRecordContext';
import httpClient from '@/shared/services/http/apiClient';
import { Colors } from '@/shared/theme/colors';
import { Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';

export const SaveScreen: React.FC = () => {
  const navigation = useNavigation();
  const { data, resetData } = useDailyRecordData();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const queryClient = useQueryClient();

  const handleSave = async () => {
    setSaving(true);
    try {
      await httpClient.post('/patient/daily-records', {
        painAreas: [
          ...(data.primaryPainArea ? [data.primaryPainArea] : []),
          ...data.secondaryPainAreas,
        ],
        painIntensity: data.painIntensity,
        painTypes: data.painQualities,
        painDurationUnit: data.durationUnit,
        painDurationValue: data.durationValue,
        functionalImpactPhysical: data.functionalImpactPhysical,
        functionalImpactWork: data.functionalImpactWork,
        functionalImpactSocial: data.functionalImpactSocial,
        phq2Answer1: data.phq2Answer1,
        phq2Answer2: data.phq2Answer2,
        gad2Answer1: data.gad2Answer1,
        gad2Answer2: data.gad2Answer2,
        tookMedication: data.tookMedication,
        medicationId: data.medicationId,
        medicationRelief: data.medicationRelief,
        recommendation: data.recommendation,
      });
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ['patient-daily-records'] });
      queryClient.invalidateQueries({ queryKey: ['patient-dashboard'] });
    } finally {
      setSaving(false);
    }
  };

  const handleFinish = () => {
    resetData();
    navigation.getParent()?.navigate('Dashboard' as never);
  };

  return (
    <WizardLayout
      step={9}
      totalSteps={9}
      title="Guardar registro"
      subtitle="Revisa y confirma tu registro de hoy"
      onBack={saved ? undefined : () => navigation.goBack()}
      onNext={saved ? handleFinish : handleSave}
      nextLabel={saved ? 'Ir al Inicio' : 'Guardar registro'}
      loading={saving}
    >
      <Card style={{ marginBottom: Spacing.base }}>
        <Text style={styles.summaryTitle}>Resumen</Text>
        <SummaryRow label="Áreas con dolor">
          {[data.primaryPainArea, ...data.secondaryPainAreas].filter(Boolean).join(', ') ||
            'No especificado'}
        </SummaryRow>
        <SummaryRow label="Intensidad">{data.painIntensity}/10</SummaryRow>
        <SummaryRow label="Cualidades">
          {data.painQualities.length > 0 ? data.painQualities.join(', ') : 'Ninguna'}
        </SummaryRow>
        <SummaryRow label="Duración">
          {data.durationValue} {data.durationUnit}
        </SummaryRow>
        <SummaryRow label="Impacto físico">{data.functionalImpactPhysical}/10</SummaryRow>
        <SummaryRow label="PHQ-2 + GAD-2">
          {((data.phq2Answer1 ?? 0) +
            (data.phq2Answer2 ?? 0) +
            (data.gad2Answer1 ?? 0) +
            (data.gad2Answer2 ?? 0))}{' '}
          / 12
        </SummaryRow>
        <SummaryRow label="Recomendación">
          {data.recommendation?.category ?? 'Pendiente'}
        </SummaryRow>
      </Card>

      {saved ? (
        <Card background="#ecfdf5">
          <View style={styles.savedRow}>
            <Ionicons name="checkmark-circle" size={28} color={Colors.medical.green} />
            <Text style={styles.savedText}>¡Registro guardado!</Text>
          </View>
          <Text style={styles.savedHint}>
            Puedes verlo en tu Historial. Cuídate, mañana es otro día.
          </Text>
        </Card>
      ) : null}
    </WizardLayout>
  );
};

const SummaryRow: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue} numberOfLines={2}>
      {children as any}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  summaryTitle: {
    ...Typography.styles.h4,
    marginBottom: Spacing.sm,
    color: Colors.text.primary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  rowLabel: { color: Colors.text.muted, flex: 1 },
  rowValue: {
    color: Colors.text.primary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  savedRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  savedText: {
    ...Typography.styles.h4,
    color: Colors.medical.green,
  },
  savedHint: { color: Colors.text.muted, marginTop: 4 },
});

export default SaveScreen;
