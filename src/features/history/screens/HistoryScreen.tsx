import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Card,
  EmptyState,
  OptionPill,
  PainChart,
  PainGuidelines,
  Screen,
  StreakBadges,
  type StreakInfo,
} from '@/shared/components';
import { useDailyRecordsStore } from '@/features/daily-record/store/dailyRecords.store';
import { Colors } from '@/shared/theme/colors';
import { Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';

type Range = '7d' | '30d' | 'all';

const dayTypeColor = (t?: 'good' | 'neutral' | 'bad') => {
  if (t === 'good') return Colors.status.success;
  if (t === 'bad') return Colors.status.error;
  return Colors.status.warning;
};

const dayTypeLabel = (t?: 'good' | 'neutral' | 'bad') => {
  if (t === 'good') return 'Te sentiste bien';
  if (t === 'bad') return 'Día difícil';
  return 'Día normal';
};

export const HistoryScreen: React.FC = () => {
  const [range, setRange] = useState<Range>('7d');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  const records = useDailyRecordsStore((s) => s.records);
  const hydrated = useDailyRecordsStore((s) => s.hydrated);
  const hydrate = useDailyRecordsStore((s) => s.hydrate);

  useEffect(() => {
    if (!hydrated) hydrate().catch(() => {});
  }, [hydrate, hydrated]);

  const stats = useDailyRecordsStore.getState().getStats();

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

  const historyStreak = useMemo<StreakInfo>(() => {
    const sorted = [...records].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    let current = 0;
    let best = 0;
    let running = 0;
    for (const r of sorted) {
      if (r.dayType !== 'bad') {
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
      totalRecords: stats.totalRecords ?? records.length,
    };
  }, [records, stats.totalRecords]);

  if (!hydrated) {
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

      <Card style={{ marginBottom: Spacing.base }}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Tu constancia</Text>
        </View>
        <StreakBadges streak={historyStreak} />
      </Card>

      <Card>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>¿Cómo ha cambiado tu dolor?</Text>
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
          <>
            <PainChart data={chartPoints} type={chartType} height={220} color={Colors.medical.blue} />
            <PainGuidelines values={chartPoints.map((p) => p.value)} />
          </>
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
