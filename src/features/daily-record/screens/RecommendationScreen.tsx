import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { WizardLayout } from '@/shared/components';
import { HealthAssistance } from '@/features/daily-record/components/HealthAssistance';
import { useDailyRecordData } from '@/features/daily-record/context/DailyRecordContext';
import { useDailyRecordsStore } from '@/features/daily-record/store/dailyRecords.store';
import { Colors } from '@/shared/theme/colors';
import { Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';
import type { DailyRecordStackParamList } from '@/shared/types/navigation';

const categoryColors: Record<string, [string, string]> = {
  autocuidado: Colors.gradient.primary,
  'cesfam-ccr': Colors.gradient.sky,
  'sapu-sar': Colors.gradient.gold,
  urgencia: Colors.gradient.coral,
};

const categoryLabels: Record<string, string> = {
  autocuidado: 'Autocuidado',
  'cesfam-ccr': 'CESFAM / CCR',
  'sapu-sar': 'SAPU / SAR',
  urgencia: 'Urgencia',
};

export const RecommendationScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DailyRecordStackParamList>>();
  const { data, updateData } = useDailyRecordData();
  const computeRecommendation = useDailyRecordsStore((s) => s.computeRecommendation);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 400));
      if (cancelled) return;
      const rec = computeRecommendation(
        data.painIntensity,
        data.functionalImpactPhysical,
      );
      updateData({ recommendation: rec });
      setLoading(false);
    };
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- valores del wizard al montar este paso
  }, []);

  const moodPattern: 'positive' | 'neutral' | 'negative' =
    (data.phq2Answer1 ?? 0) + (data.phq2Answer2 ?? 0) >= 4
      ? 'negative'
      : data.painIntensity <= 3
        ? 'positive'
        : 'neutral';

  return (
    <WizardLayout
      step={8}
      totalSteps={9}
      stepLabel="Tu recomendación"
      title="Lo que te sugerimos"
      subtitle="Según tu registro de hoy"
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('Save')}
      nextLabel="Revisar y guardar"
    >
      {loading || !data.recommendation ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={Colors.primary.base} />
          <Text style={styles.loadingText}>Calculando recomendación...</Text>
        </View>
      ) : (
        <LinearGradient
          colors={categoryColors[data.recommendation.category] ?? categoryColors.autocuidado}
          style={styles.recommendCard}
        >
          <View style={styles.headerRow}>
            <Ionicons name="medical" size={26} color={Colors.text.onAccent} />
            <Text style={[styles.recommendTitle, { color: Colors.text.onAccent }]}>
              {categoryLabels[data.recommendation.category] ?? 'Recomendación'}
            </Text>
          </View>
          <Text style={[styles.recommendMessage, { color: 'rgba(11,15,26,0.88)' }]}>
            {data.recommendation.message}
          </Text>
        </LinearGradient>
      )}

      <View style={{ marginTop: Spacing.base }}>
        <HealthAssistance moodPattern={moodPattern} painLevel={data.painIntensity} />
      </View>
    </WizardLayout>
  );
};

const styles = StyleSheet.create({
  loading: { alignItems: 'center', padding: Spacing.xl },
  loadingText: { marginTop: Spacing.sm, color: Colors.text.muted },
  recommendCard: {
    padding: Spacing.lg,
    borderRadius: 20,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.sm },
  recommendTitle: {
    ...Typography.styles.h3,
  },
  recommendMessage: { fontSize: 16, lineHeight: 22 },
});

export default RecommendationScreen;
