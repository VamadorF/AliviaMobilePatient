import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
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
import httpClient from '@/shared/services/http/apiClient';
import type { DashboardData } from '@/shared/types/domain';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { Colors } from '@/shared/theme/colors';
import { Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';

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
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const { data, isLoading, refetch } = useQuery<DashboardData>({
    queryKey: ['patient-dashboard'],
    queryFn: async () => {
      const res = await httpClient.get('/patient/dashboard');
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <Screen edges={['top', 'left', 'right']}>
        <ActivityIndicator size="large" color={Colors.medical.blue} />
      </Screen>
    );
  }

  const stats = data?.stats;
  const chartData = data?.chartData ?? [];

  const streak: StreakInfo = (() => {
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
      totalRecords: stats?.totalRecords ?? sorted.length,
    };
  })();

  const aiSuggestion = (() => {
    const avg = stats?.averagePain ?? 0;
    if (avg >= 7) {
      return 'Tu dolor ha estado alto. Intenta un descanso pautado y consulta a tu equipo de salud si no cede.';
    }
    if (avg >= 4) {
      return 'Sugerencia: prueba 10 minutos de respiración 4-7-8 y registra cómo te sientes después.';
    }
    return 'Vas bien. Mantén tus rutinas y recuerda hidratarte y moverte un poco cada día.';
  })();

  return (
    <Screen scroll edges={['top', 'left', 'right']}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greeting}>{getGreeting(new Date(), user?.firstName)}</Text>
          <Text style={styles.subtitle}>¿Cómo te sientes hoy?</Text>
        </View>
        <Pressable onPress={logout} hitSlop={12} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={22} color={Colors.text.primary} />
        </Pressable>
      </View>

      <LinearGradient
        colors={['#a78bfa', '#7c3aed']}
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

      <Pressable
        onPress={() =>
          navigation.navigate('DailyRecord', { screen: 'Location' })
        }
      >
        <LinearGradient
          colors={[Colors.medical.blue, Colors.medical.purple]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>¿Cómo te sientes hoy?</Text>
            <Text style={styles.heroSubtitle}>Toca aquí para contarnos</Text>
          </View>
          <View style={styles.heroIconBox}>
            <Ionicons name="add-circle" size={36} color={Colors.text.white} />
          </View>
        </LinearGradient>
      </Pressable>

      <View style={styles.statsGrid}>
        <StatCard
          icon="trending-up"
          label="¿Cómo va tu dolor?"
          value={`${stats?.averagePain.toFixed(1) ?? '0'} / 10`}
          colors={['#60a5fa', '#1d4ed8']}
        />
        <StatCard
          icon="happy"
          label="Días que te sentiste bien"
          value={`${stats?.goodDays ?? 0}`}
          colors={['#34d399', '#047857']}
        />
        <StatCard
          icon="checkmark-done"
          label="¿Sigues tu plan?"
          value={`${(stats?.adherence ?? 0).toFixed(0)}%`}
          colors={['#a78bfa', '#5b21b6']}
        />
      </View>

      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>¿Cómo ha cambiado tu dolor esta semana?</Text>
          <Pressable onPress={() => refetch()}>
            <Ionicons name="refresh" size={18} color={Colors.medical.blue} />
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
          <Text style={styles.cardTitle}>¿Qué cuidados tienes activos?</Text>
        </View>
        <Text style={styles.cardBody}>
          Tienes {data?.activeIndications ?? 0} cuidados activos. Recuerda seguir las
          recomendaciones de tu equipo de salud.
        </Text>
        <Pressable
          style={styles.medsLink}
          onPress={() => navigation.getParent()?.navigate('Medications')}
        >
          <Ionicons name="medkit" size={18} color={Colors.medical.blue} />
          <Text style={styles.medsLinkText}>Ver mis medicamentos</Text>
          <Ionicons name="chevron-forward" size={16} color={Colors.medical.blue} />
        </Pressable>
      </Card>
    </Screen>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.base },
  greeting: { ...Typography.styles.h2, color: Colors.text.primary },
  subtitle: { color: Colors.text.muted },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.gray,
  },
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: 20,
    marginBottom: Spacing.base,
  },
  heroTitle: {
    color: Colors.text.white,
    fontSize: Typography.fontSize.xl,
    fontWeight: '800',
  },
  heroSubtitle: { color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  heroIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
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
    borderTopColor: Colors.border.light,
  },
  medsLinkText: {
    flex: 1,
    color: Colors.medical.blue,
    fontWeight: '700',
  },
});

export default DashboardScreen;
