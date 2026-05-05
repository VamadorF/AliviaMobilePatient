import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Card,
  EmptyState,
  PainChart,
  PainGuidelines,
  Screen,
  StreakBadges,
  type StreakInfo,
} from '@/shared/components';
import { mockDashboard } from '@/shared/services/demo';
import type { ChartDataPoint } from '@/shared/types/domain';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useDailyRecordsStore } from '@/features/daily-record/store/dailyRecords.store';
import { Colors } from '@/shared/theme/colors';
import { Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';
import type { MainTabsParamList, RootMainStackParamList } from '@/shared/types/navigation';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const getGreeting = (date: Date, name?: string): string => {
  const hour = date.getHours();
  const who = name ?? 'paciente';
  if (hour < 6) return `Buenas noches, ${who}`;
  if (hour < 13) return `Buenos días, ${who}`;
  if (hour < 20) return `Buenas tardes, ${who}`;
  return `Buenas noches, ${who}`;
};

const StatCard: React.FC<{
  icon: IconName;
  label: string;
  value: string;
  colors: [string, string];
}> = ({ icon, label, value, colors }) => (
  <LinearGradient colors={colors} style={styles.statCard}>
    <Ionicons name={icon} size={20} color={Colors.text.white} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </LinearGradient>
);

export const DashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const user = useAuthStore((s) => s.user);
  const records = useDailyRecordsStore((s) => s.records);
  const hydrated = useDailyRecordsStore((s) => s.hydrated);
  const hydrate = useDailyRecordsStore((s) => s.hydrate);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!hydrated) hydrate().catch(() => {});
  }, [hydrate, hydrated]);

  const stats = useDailyRecordsStore.getState().getStats();

  const chartData: ChartDataPoint[] = useMemo(() => {
    const sorted = [...records].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const points: ChartDataPoint[] = sorted.map((r) => ({
      date: r.date.slice(0, 10),
      painIntensity: r.painIntensity,
      dayType: r.dayType ?? 'neutral',
    }));
    return points.length >= 3 ? points : mockDashboard.chartData;
  }, [records]);

  const streak: StreakInfo = useMemo(() => {
    const sorted = [...chartData].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    let current = 0;
    let best = 0;
    let running = 0;
    for (const point of sorted) {
      if (point.dayType !== 'bad') {
        running += 1;
        best = Math.max(best, running);
      } else {
        running = 0;
      }
    }
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i].dayType !== 'bad') current += 1;
      else break;
    }
    return {
      current,
      best,
      totalRecords: stats.totalRecords,
    };
  }, [chartData, stats.totalRecords]);

  const aiSuggestion = (() => {
    const avg = stats.averagePain ?? 0;
    if (avg >= 7) {
      return 'Tu dolor ha estado alto. Intenta un descanso pautado y consulta a tu equipo de salud si no cede.';
    }
    if (avg >= 4) {
      return 'Sugerencia: prueba 10 minutos de respiración 4-7-8 y registra cómo te sientes después.';
    }
    return 'Vas bien. Mantén tus rutinas y recuerda hidratarte y moverte un poco cada día.';
  })();

  const openDailyRecord = () => {
    const tabNav = navigation.getParent() as BottomTabNavigationProp<MainTabsParamList> | undefined;
    const mainNav = tabNav?.getParent() as NativeStackNavigationProp<RootMainStackParamList> | undefined;
    mainNav?.navigate('DailyRecord', { screen: 'Location' });
  };

  const openMedications = () => {
    const tabNav = navigation.getParent() as BottomTabNavigationProp<MainTabsParamList> | undefined;
    tabNav?.navigate('Dashboard', { screen: 'Medications' });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await hydrate().catch(() => {});
    setRefreshing(false);
  };

  if (!hydrated) {
    return (
      <Screen edges={['top', 'left', 'right']}>
        <ActivityIndicator size="large" color={Colors.primary.base} />
      </Screen>
    );
  }

  return (
    <Screen scroll edges={['top', 'left', 'right']}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>{getGreeting(new Date(), user?.firstName)}</Text>
          <Text style={styles.subtitle}>¿Cómo te sientes hoy?</Text>
        </View>
        <Pressable onPress={() => onRefresh()} hitSlop={12} style={styles.refreshBtn}>
          <Ionicons name="refresh" size={22} color={Colors.text.primary} />
        </Pressable>
      </View>

      <LinearGradient
        colors={Colors.gradient.violet}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.aiCard}
      >
        <View style={styles.aiHeader}>
          <View style={styles.aiIconBox}>
            <Ionicons name="sparkles" size={18} color={Colors.text.white} />
          </View>
          <Text style={styles.aiTitle}>Sugerencias de AlivIA IA</Text>
        </View>
        <Text style={styles.aiBody}>{aiSuggestion}</Text>
      </LinearGradient>

      <Pressable onPress={openDailyRecord}>
        <LinearGradient
          colors={Colors.gradient.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>Actualizar tu bienestar</Text>
            <Text style={styles.heroSubtitle}>Toca aquí para registrar tu día</Text>
          </View>
          <View style={styles.heroIconBox}>
            <Ionicons name="add-circle" size={36} color={Colors.text.onAccent} />
          </View>
        </LinearGradient>
      </Pressable>

      <View style={styles.statsGrid}>
        <StatCard
          icon="trending-up"
          label="¿Cómo va tu dolor?"
          value={`${stats.averagePain.toFixed(1)} / 10`}
          colors={Colors.gradient.sky}
        />
        <StatCard
          icon="happy"
          label="Días que te sentiste bien"
          value={`${stats.goodDays}`}
          colors={Colors.gradient.primary}
        />
        <StatCard
          icon="checkmark-done"
          label="¿Sigues tu plan?"
          value={`${stats.adherence.toFixed(0)}%`}
          colors={Colors.gradient.violet}
        />
      </View>

      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Tu resumen · dolor esta semana</Text>
          <Pressable onPress={() => onRefresh()} disabled={refreshing}>
            <Ionicons name="refresh" size={18} color={Colors.primary.base} />
          </Pressable>
        </View>
        {chartData.length > 0 ? (
          <>
            <PainChart
              data={chartData.map((c) => ({ date: c.date, value: c.painIntensity }))}
              type="line"
              height={220}
              color={Colors.medical.blue}
            />
            <PainGuidelines values={chartData.map((c) => c.painIntensity)} />
          </>
        ) : (
          <EmptyState title="Sin datos" description="Registra tu dolor para ver cómo cambia día a día" />
        )}
      </Card>

      <Card style={{ marginTop: Spacing.base }}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Tu constancia</Text>
        </View>
        <StreakBadges streak={streak} />
      </Card>

      <Card style={{ marginTop: Spacing.base }}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Orientación y cuidados</Text>
        </View>
        <Text style={styles.cardBody}>
          Tienes {mockDashboard.activeIndications} cuidados activos en la demo. Recuerda seguir las
          recomendaciones de tu equipo de salud.
        </Text>
        <Pressable style={styles.medsLink} onPress={openMedications}>
          <Ionicons name="medkit" size={18} color={Colors.primary.base} />
          <Text style={styles.medsLinkText}>Ver mis medicamentos</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.primary.base} />
        </Pressable>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.base },
  greeting: { ...Typography.styles.h2, color: Colors.text.primary },
  subtitle: { color: Colors.text.muted },
  refreshBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.surface,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: 20,
    marginBottom: Spacing.base,
  },
  heroTitle: {
    color: Colors.text.onAccent,
    fontSize: Typography.fontSize.xl,
    fontWeight: '800',
  },
  heroSubtitle: { color: 'rgba(11,15,26,0.85)', marginTop: 2 },
  heroIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: Spacing.base,
  },
  statCard: {
    flexBasis: '48%',
    flexGrow: 1,
    padding: Spacing.base,
    borderRadius: 16,
  },
  statValue: {
    color: Colors.text.white,
    fontSize: Typography.fontSize.xl,
    fontWeight: '800',
    marginTop: 4,
  },
  statLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 12 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardTitle: { ...Typography.styles.h4, color: Colors.text.primary },
  cardBody: { color: Colors.text.secondary },
  aiCard: {
    padding: Spacing.lg,
    borderRadius: 20,
    marginBottom: Spacing.base,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.xs,
  },
  aiIconBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiTitle: {
    color: Colors.text.white,
    fontWeight: '800',
    fontSize: Typography.fontSize.lg,
  },
  aiBody: { color: 'rgba(255,255,255,0.95)', fontSize: 14, lineHeight: 20 },
  medsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
  },
  medsLinkText: {
    flex: 1,
    color: Colors.primary.base,
    fontWeight: '700',
  },
});

export default DashboardScreen;
