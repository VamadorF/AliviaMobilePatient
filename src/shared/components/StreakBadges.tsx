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
    label: 'Primer paso',
    description: 'Tu primer registro',
    threshold: 1,
    icon: 'footsteps',
    colors: ['#fbbf24', '#d97706'],
  },
  {
    id: 'week-strong',
    label: 'Semana fuerte',
    description: '7 días seguidos',
    threshold: 7,
    icon: 'flame',
    colors: ['#fb7185', '#b91c1c'],
  },
  {
    id: 'commitment',
    label: 'Compromiso',
    description: '14 días seguidos',
    threshold: 14,
    icon: 'shield-checkmark',
    colors: ['#34d399', '#047857'],
  },
  {
    id: 'master',
    label: 'Maestría',
    description: '30 días seguidos',
    threshold: 30,
    icon: 'trophy',
    colors: ['#a78bfa', '#5b21b6'],
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
        colors={['#fb923c', '#f97316']}
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
                  earned
                    ? m.colors
                    : ['#e5e7eb', '#d1d5db']
                }
                style={[
                  styles.medalCircle,
                  !earned && styles.medalCircleLocked,
                ]}
              >
                <Ionicons
                  name={m.icon}
                  size={22}
                  color={earned ? Colors.text.white : '#9ca3af'}
                />
              </LinearGradient>
              <Text
                style={[
                  styles.medalLabel,
                  !earned && { color: Colors.text.muted },
                ]}
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
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 30,
  },
  streakLabel: {
    color: 'rgba(255,255,255,0.9)',
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
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  medalCircleLocked: { opacity: 0.7 },
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
