import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, EmptyState, OptionPill, PainChart, Screen } from '@/shared/components';
import httpClient from '@/shared/services/http/apiClient';
import { Colors } from '@/shared/theme/colors';
import { Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';
import type { DailyRecord, DailyRecordStats } from '@/shared/types/domain';

interface HistoryResponse {
  records: DailyRecord[];
  stats: DailyRecordStats;
}

type Range = '7d' | '30d' | 'all';

const dayTypeColor = (t?: 'good' | 'neutral' | 'bad') => {
  if (t === 'good') return '#10b981';
  if (t === 'bad') return '#ef4444';
  return '#f59e0b';
};

const dayTypeLabel = (t?: 'good' | 'neutral' | 'bad') => {
  if (t === 'good') return 'Bueno';
  if (t === 'bad') return 'Malo';
  return 'Regular';
};

export const HistoryScreen: React.FC = () => {
  const [range, setRange] = useState<Range>('7d');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  const { data, isLoading } = useQuery<HistoryResponse>({
    queryKey: ['patient-daily-records'],
    queryFn: async () => {
      const res = await httpClient.get('/patient/daily-records');
      return res.data;
    },
  });

  const records = data?.records ?? [];

  const filtered = useMemo(() => {
    if (range === 'all') return records;
    const days = range === '7d' ? 7 : 30;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return records.filter((r) => new Date(r.date).getTime() >= cutoff);
  }, [records, range]);

  const chartPoints = useMemo(
    () =>
      [...filtered]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((r) => ({ date: r.date, value: r.painIntensity })),
    [filtered],
  );

  if (isLoading) {
    return (
      <Screen edges={['top', 'left', 'right']}>
        <ActivityIndicator size="large" color={Colors.medical.blue} />
      </Screen>
    );
  }

  return (
    <Screen scroll edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial</Text>
        <Text style={styles.subtitle}>{filtered.length} registros</Text>
      </View>

      <View style={styles.filtersRow}>
        {(['7d', '30d', 'all'] as Range[]).map((r) => (
          <OptionPill
            key={r}
            label={r === '7d' ? '7 días' : r === '30d' ? '30 días' : 'Todos'}
            selected={range === r}
            onPress={() => setRange(r)}
          />
        ))}
      </View>

      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Evolución del dolor</Text>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <Pressable onPress={() => setChartType('line')} hitSlop={8}>
              <Ionicons
                name="trending-up"
                size={20}
                color={chartType === 'line' ? Colors.medical.blue : Colors.text.muted}
              />
            </Pressable>
            <Pressable onPress={() => setChartType('bar')} hitSlop={8}>
              <Ionicons
                name="bar-chart"
                size={20}
                color={chartType === 'bar' ? Colors.medical.blue : Colors.text.muted}
              />
            </Pressable>
          </View>
        </View>
        {chartPoints.length > 0 ? (
          <PainChart data={chartPoints} type={chartType} height={220} color={Colors.medical.blue} />
        ) : (
          <EmptyState title="Sin datos" description="No tienes registros en este rango." />
        )}
      </Card>

      <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Registros recientes</Text>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            title="Tu historia comienza aquí"
            description="Cada registro es un paso para conocer mejor tu dolor. Cuando completes el primero, lo verás reflejado en este espacio."
          />
        </Card>
      ) : (
        filtered.map((r) => (
          <Card key={r.id} style={{ marginBottom: Spacing.sm }}>
            <View style={styles.recordHeader}>
              <View style={styles.dateBox}>
                <Ionicons name="calendar" size={16} color={Colors.medical.blue} />
                <Text style={styles.dateText}>
                  {format(parseISO(r.date), "d 'de' MMM yyyy", { locale: es })}
                </Text>
              </View>
              <View
                style={[
                  styles.dayBadge,
                  { backgroundColor: `${dayTypeColor(r.dayType)}20` },
                ]}
              >
                <View
                  style={[styles.dayDot, { backgroundColor: dayTypeColor(r.dayType) }]}
                />
                <Text style={[styles.dayText, { color: dayTypeColor(r.dayType) }]}>
                  {dayTypeLabel(r.dayType)}
                </Text>
              </View>
            </View>

            <View style={styles.intensityRow}>
              <Text style={styles.intensityLabel}>Intensidad</Text>
              <View style={styles.intensityBarBg}>
                <View
                  style={[
                    styles.intensityBarFill,
                    {
                      width: `${(r.painIntensity / 10) * 100}%`,
                      backgroundColor: dayTypeColor(r.dayType),
                    },
                  ]}
                />
              </View>
              <Text style={styles.intensityValue}>{r.painIntensity}/10</Text>
            </View>

            {r.painAreas?.length ? (
              <Text style={styles.recordMeta}>
                Áreas: {r.painAreas.slice(0, 3).join(', ')}
                {r.painAreas.length > 3 ? '...' : ''}
              </Text>
            ) : null}
            {r.notes ? <Text style={styles.recordNote}>{r.notes}</Text> : null}
          </Card>
        ))
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: { marginBottom: Spacing.base },
  title: { ...Typography.styles.h2, color: Colors.text.primary },
  subtitle: { color: Colors.text.muted },
  filtersRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.base },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardTitle: { ...Typography.styles.h4, color: Colors.text.primary },
  sectionTitle: { ...Typography.styles.h3, color: Colors.text.primary, marginBottom: Spacing.sm },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  dateBox: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { color: Colors.text.primary, fontWeight: '600' },
  dayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  dayDot: { width: 8, height: 8, borderRadius: 4 },
  dayText: { fontSize: 12, fontWeight: '700' },
  intensityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.xs,
  },
  intensityLabel: { color: Colors.text.muted, fontSize: 12 },
  intensityBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.background.gray,
    overflow: 'hidden',
  },
  intensityBarFill: { height: '100%' },
  intensityValue: { color: Colors.text.primary, fontWeight: '700', fontSize: 12 },
  recordMeta: { color: Colors.text.secondary, fontSize: 13, marginTop: 4 },
  recordNote: {
    color: Colors.text.muted,
    fontStyle: 'italic',
    marginTop: 4,
    fontSize: 13,
  },
});

export default HistoryScreen;
