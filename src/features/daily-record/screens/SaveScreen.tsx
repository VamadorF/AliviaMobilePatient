import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { WizardLayout, Card } from '@/shared/components';
import { useDailyRecordData } from '@/features/daily-record/context/DailyRecordContext';
import { useMedicationsStore } from '@/features/medications/store/medications.store';
import { useDailyRecordsStore } from '@/features/daily-record/store/dailyRecords.store';
import { HealthAssistance } from '@/features/daily-record/components/HealthAssistance';
import { CRITICAL_PAIN_THRESHOLD } from '@/app/config/constants';
import { Colors } from '@/shared/theme/colors';
import { iaspBandForValue } from '@/shared/theme/painScale';
import { Radius, Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';

export const SaveScreen: React.FC = () => {
  const navigation = useNavigation();
  const { data, resetData } = useDailyRecordData();
  const meds = useMedicationsStore((s) => s.medications);
  const takeMed = useMedicationsStore((s) => s.take);
  const addRecord = useDailyRecordsStore((s) => s.add);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const phq2Score = (data.phq2Answer1 ?? 0) + (data.phq2Answer2 ?? 0);
  const gad2Score = (data.gad2Answer1 ?? 0) + (data.gad2Answer2 ?? 0);
  const band = iaspBandForValue(data.painIntensity);
  const isCritical = data.painIntensity >= CRITICAL_PAIN_THRESHOLD;
  const moodPattern: 'positive' | 'neutral' | 'negative' =
    phq2Score >= 4 ? 'negative' : data.painIntensity <= 3 ? 'positive' : 'neutral';

  const handleSave = async () => {
    setSaving(true);
    try {
      const takenMedications =
        data.takenMedications.length > 0
          ? data.takenMedications
          : data.medicationId
            ? [{ id: data.medicationId, relief: data.medicationRelief ?? 0 }]
            : [];

      const painAreas = [
        ...(data.primaryPainArea ? [data.primaryPainArea] : []),
        ...data.secondaryPainAreas,
      ];
      const recNote = data.recommendation
        ? `Recomendación (${data.recommendation.category}): ${data.recommendation.message}`
        : undefined;

      await addRecord({
        painIntensity: data.painIntensity,
        painAreas,
        painTypes: data.painQualities,
        painDurationUnit: data.durationUnit,
        painDurationValue: data.durationValue,
        functionalImpactPhysical: data.functionalImpactPhysical,
        functionalImpactWork: data.functionalImpactWork,
        functionalImpactSocial: data.functionalImpactSocial,
        functionalImpactSleep: data.functionalImpactSleep,
        phq2Answer1: data.phq2Answer1,
        phq2Answer2: data.phq2Answer2,
        gad2Answer1: data.gad2Answer1,
        gad2Answer2: data.gad2Answer2,
        takenMedications,
        notes: [recNote, data.painQualityOther ? `Otra cualidad: ${data.painQualityOther}` : '']
          .filter(Boolean)
          .join('\n') || undefined,
        activities: [],
        symptoms: [],
        triggers: [],
      });

      await Promise.all(takenMedications.map((tm) => takeMed(tm.id)));

      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const handleFinish = () => {
    resetData();
    navigation.getParent()?.getParent()?.goBack();
  };

  return (
    <WizardLayout
      step={9}
      totalSteps={9}
      stepLabel="Guardar tu día"
      title="Tu registro de hoy"
      subtitle="Revisa tu resumen y guárdalo cuando estés listo"
      onBack={saved ? undefined : () => navigation.goBack()}
      onNext={saved ? handleFinish : handleSave}
      nextLabel={saved ? 'Volver al inicio' : 'Guardar registro'}
      loading={saving}
    >
      <Card
        style={{ ...styles.profileCard, borderColor: band.color }}
        background={`${band.color}14`}
      >
        <Text style={[styles.profileTitle, { color: band.color }]}>Tu perfil de hoy</Text>
        <View style={styles.profileRow}>
          <Ionicons name="pulse" size={18} color={band.color} />
          <Text style={styles.profileText}>
            Dolor: <Text style={{ fontWeight: '800', color: band.color }}>{band.label}</Text>
          </Text>
        </View>
        {phq2Score >= 3 ? (
          <View style={styles.profileRow}>
            <Ionicons name="heart" size={18} color={Colors.raw.pink} />
            <Text style={styles.profileText}>
              Estado de ánimo: <Text style={styles.profileAttention}>puede requerir atención</Text>
            </Text>
          </View>
        ) : null}
        {gad2Score >= 3 ? (
          <View style={styles.profileRow}>
            <Ionicons name="alert-circle" size={18} color={Colors.raw.pink} />
            <Text style={styles.profileText}>
              Ansiedad: <Text style={styles.profileAttention}>puede requerir atención</Text>
            </Text>
          </View>
        ) : null}
        {phq2Score >= 3 || gad2Score >= 3 ? (
          <Text style={styles.profileHint}>
            Considera comentarlo con tu equipo de salud para acompañarte mejor.
          </Text>
        ) : null}
      </Card>

      <Card style={{ marginBottom: Spacing.base }}>
        <Text style={styles.summaryTitle}>Resumen</Text>
        <SummaryRow label="Áreas con dolor">
          {[data.primaryPainArea, ...data.secondaryPainAreas].filter(Boolean).join(', ') ||
            'No especificado'}
        </SummaryRow>
        <SummaryRow label="Intensidad">{data.painIntensity}/10 · {band.label}</SummaryRow>
        <SummaryRow label="Cualidades">
          {data.painQualities.length > 0 ? data.painQualities.join(', ') : 'Ninguna'}
        </SummaryRow>
        <SummaryRow label="Duración">
          {data.durationValue} {data.durationUnit}
        </SummaryRow>
        <SummaryRow label="Impacto físico">{data.functionalImpactPhysical}/10</SummaryRow>
        <SummaryRow label="Trabajo / estudio">{data.functionalImpactWork}/10</SummaryRow>
        <SummaryRow label="Vida social">{data.functionalImpactSocial}/10</SummaryRow>
        <SummaryRow label="Sueño">{data.functionalImpactSleep}/10</SummaryRow>
        <SummaryRow label="Medicación de hoy">
          {data.takenMedications.length === 0
            ? 'Ninguna'
            : data.takenMedications
                .map((tm) => {
                  const med = meds.find((m) => m.id === tm.id);
                  return `${med?.name ?? tm.id} (alivio ${tm.relief}/10)`;
                })
                .join(', ')}
        </SummaryRow>
        <SummaryRow label="Recomendación">
          {data.recommendation?.category ?? 'Pendiente'}
        </SummaryRow>
      </Card>

      {isCritical ? (
        <Card background="rgba(255, 100, 121, 0.12)" style={styles.criticalCard}>
          <View style={styles.savedRow}>
            <Ionicons name="alert-circle" size={24} color={Colors.status.error} />
            <Text style={styles.criticalTitle}>Mitigación pasiva activada</Text>
          </View>
          <Text style={styles.criticalText}>
            Detectamos un dolor muy alto. Saltamos pasos no esenciales para que puedas
            descansar. Aquí tienes apoyo inmediato:
          </Text>
          <View style={{ marginTop: Spacing.sm }}>
            <HealthAssistance moodPattern={moodPattern} painLevel={data.painIntensity} />
          </View>
        </Card>
      ) : null}

      {saved ? (
        <Card background={Colors.primary.soft}>
          <View style={styles.savedRow}>
            <Ionicons name="checkmark-circle" size={28} color={Colors.primary.base} />
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
    <Text style={styles.rowValue} numberOfLines={3}>
      {children as any}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  profileCard: {
    marginBottom: Spacing.base,
    borderWidth: 2,
    borderRadius: Radius.lg,
  },
  profileTitle: { ...Typography.styles.h4, marginBottom: Spacing.sm },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  profileText: { color: Colors.text.primary, fontSize: 14, flex: 1 },
  profileAttention: { color: Colors.raw.pink, fontWeight: '700' },
  profileHint: {
    marginTop: Spacing.xs,
    color: Colors.text.muted,
    fontStyle: 'italic',
    fontSize: 12,
  },
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
    color: Colors.primary.base,
  },
  savedHint: { color: Colors.text.muted, marginTop: 4 },
  criticalCard: { marginBottom: Spacing.base },
  criticalTitle: {
    ...Typography.styles.h4,
    color: Colors.status.error,
  },
  criticalText: { color: Colors.text.secondary, marginTop: 4, fontSize: 13 },
});

export default SaveScreen;
