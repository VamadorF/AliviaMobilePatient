import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, EmptyState, PainChart, Screen } from '@/shared/components';
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
            <Text style={styles.heroTitle}>Registrar dolor</Text>
            <Text style={styles.heroSubtitle}>Cuéntanos cómo te sientes hoy</Text>
          </View>
          <View style={styles.heroIconBox}>
            <Ionicons name="add-circle" size={36} color={Colors.text.white} />
          </View>
        </LinearGradient>
      </Pressable>

      <View style={styles.statsGrid}>
        <StatCard
          icon="trending-up"
          label="Dolor promedio"
          value={`${stats?.averagePain.toFixed(1) ?? '0'} / 10`}
          colors={['#60a5fa', '#1d4ed8']}
        />
        <StatCard
          icon="happy"
          label="Días buenos"
          value={`${stats?.goodDays ?? 0}`}
          colors={['#34d399', '#047857']}
        />
        <StatCard
          icon="sad"
          label="Días malos"
          value={`${stats?.badDays ?? 0}`}
          colors={['#fb7185', '#b91c1c']}
        />
        <StatCard
          icon="checkmark-done"
          label="Adherencia"
          value={`${(stats?.adherence ?? 0).toFixed(0)}%`}
          colors={['#a78bfa', '#5b21b6']}
        />
      </View>

      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Evolución (7 días)</Text>
          <Pressable onPress={() => refetch()}>
            <Ionicons name="refresh" size={18} color={Colors.medical.blue} />
          </Pressable>
        </View>
        {chartData.length > 0 ? (
          <PainChart
            data={chartData.map((c) => ({ date: c.date, value: c.painIntensity }))}
            type="line"
            height={220}
            color={Colors.medical.blue}
          />
        ) : (
          <EmptyState title="Sin datos" description="Registra tu dolor para ver tu evolución" />
        )}
      </Card>

      <Card style={{ marginTop: Spacing.base }}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Indicaciones activas</Text>
        </View>
        <Text style={styles.cardBody}>
          Tienes {data?.activeIndications ?? 0} indicaciones activas. Recuerda seguir las
          recomendaciones de tu equipo de salud.
        </Text>
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
});

export default DashboardScreen;
