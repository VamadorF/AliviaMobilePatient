import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/shared/theme/colors';
import { Radius, Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';

export interface StreakInfo {
  /** Días consecutivos con registro hasta hoy */
  current: number;
  /** Mejor racha histórica */
  best: number;
  /** Total de registros completados */
  totalRecords: number;
}

interface MedalDef {
  id: string;
  label: string;
  description: string;
  threshold: number;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  colors: [string, string];
}

const medals: MedalDef[] = [
  {
    id: 'first-step',
    label: 'Primer Paso',
    description: 'Tu primer registro',
    threshold: 1,
    icon: 'footsteps',
    colors: Colors.gradient.gold,
  },
  {
    id: 'week-strong',
    label: 'Semana Fuerte',
    description: '7 días seguidos',
    threshold: 7,
    icon: 'flame',
    colors: Colors.gradient.coral,
  },
  {
    id: 'commitment',
    label: 'Quincena Imparable',
    description: '14 días seguidos',
    threshold: 14,
    icon: 'shield-checkmark',
    colors: Colors.gradient.primary,
  },
  {
    id: 'master',
    label: 'Mes de Oro',
    description: '30 días seguidos',
    threshold: 30,
    icon: 'trophy',
    colors: Colors.gradient.violet,
  },
];

interface Props {
  streak: StreakInfo;
}

export const StreakBadges: React.FC<Props> = ({ streak }) => {
  const reference = Math.max(streak.current, streak.best);

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={Colors.gradient.streak}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.streakCard}
      >
        <View style={styles.streakLeft}>
          <Ionicons name="flame" size={28} color={Colors.text.white} />
          <View>
            <Text style={styles.streakValue}>{streak.current}</Text>
            <Text style={styles.streakLabel}>
              {streak.current === 1 ? 'día seguido' : 'días seguidos'}
            </Text>
          </View>
        </View>
        <View style={styles.streakRight}>
          <Text style={styles.streakBestLabel}>Mejor racha</Text>
          <Text style={styles.streakBestValue}>{streak.best}</Text>
        </View>
      </LinearGradient>

      <Text style={styles.medalsTitle}>Tus medallas</Text>
      <View style={styles.medalsRow}>
        {medals.map((m) => {
          const earned = reference >= m.threshold;
          return (
            <View key={m.id} style={styles.medalWrap}>
              <LinearGradient
                colors={
                  earned ? m.colors : [Colors.background.surfaceHigh, Colors.background.surface]
                }
                style={[styles.medalCircle, !earned && styles.medalCircleLocked]}
              >
                <Ionicons
                  name={m.icon}
                  size={22}
                  color={earned ? Colors.text.white : Colors.text.light}
                />
              </LinearGradient>
              <Text
                style={[styles.medalLabel, !earned && { color: Colors.text.muted }]}
                numberOfLines={1}
              >
                {m.label}
              </Text>
              <Text style={styles.medalDesc} numberOfLines={2}>
                {m.description}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { gap: Spacing.sm },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.base,
    borderRadius: Radius.xl,
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakValue: {
    color: Colors.text.white,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 32,
  },
  streakLabel: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 13,
  },
  streakRight: { alignItems: 'flex-end' },
  streakBestLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 11 },
  streakBestValue: {
    color: Colors.text.white,
    fontSize: 22,
    fontWeight: '800',
  },
  medalsTitle: {
    ...Typography.styles.h4,
    color: Colors.text.primary,
    marginTop: Spacing.xs,
  },
  medalsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  medalWrap: {
    width: '23%',
    alignItems: 'center',
  },
  medalCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  medalCircleLocked: { opacity: 0.65 },
  medalLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  medalDesc: {
    fontSize: 9,
    color: Colors.text.muted,
    textAlign: 'center',
  },
});

export default StreakBadges;
