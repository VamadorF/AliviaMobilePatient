import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { WizardLayout } from '@/shared/components';
import { HealthAssistance } from '@/features/daily-record/components/HealthAssistance';
import { useDailyRecordData } from '@/features/daily-record/context/DailyRecordContext';
import httpClient from '@/shared/services/http/apiClient';
import { Colors } from '@/shared/theme/colors';
import { Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';
import type { DailyRecordStackParamList } from '@/shared/types/navigation';

const categoryColors: Record<string, [string, string]> = {
  autocuidado: ['#34d399', '#047857'],
  'cesfam-ccr': ['#60a5fa', '#1d4ed8'],
  'sapu-sar': ['#fbbf24', '#d97706'],
  urgencia: ['#fb7185', '#b91c1c'],
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await httpClient.post('/patient/pain-record/recommendation', {
          painIntensity: data.painIntensity,
          functionalImpactPhysical: data.functionalImpactPhysical,
        });
        if (!cancelled) updateData({ recommendation: res.data });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetch();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      title="Recomendación"
      subtitle="Según tu registro, te sugerimos:"
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('Save')}
    >
      {loading || !data.recommendation ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={Colors.medical.blue} />
          <Text style={styles.loadingText}>Calculando recomendación...</Text>
        </View>
      ) : (
        <LinearGradient
          colors={categoryColors[data.recommendation.category] ?? categoryColors.autocuidado}
          style={styles.recommendCard}
        >
          <View style={styles.headerRow}>
            <Ionicons name="medical" size={26} color={Colors.text.white} />
            <Text style={styles.recommendTitle}>
              {categoryLabels[data.recommendation.category] ?? 'Recomendación'}
            </Text>
          </View>
          <Text style={styles.recommendMessage}>{data.recommendation.message}</Text>
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
    color: Colors.text.white,
  },
  recommendMessage: { color: Colors.text.white, fontSize: 16, lineHeight: 22 },
});

export default RecommendationScreen;
