import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { differenceInHours, differenceInMinutes } from 'date-fns';
import { Colors } from '@/shared/theme/colors';
import { Radius, Spacing, Shadow } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';
import { EmptyState } from '@/shared/components/EmptyState';
import type { Medication, MedicationType } from '@/shared/types/domain';

interface MedicationWheelProps {
  medications: Medication[];
  onRemove: (id: string) => void;
  onTake: (id: string) => void;
}

const typeColors: Record<MedicationType, [string, string]> = {
  analgesic: ['#3b82f6', '#1e3a8a'],
  antiinflammatory: ['#10b981', '#065f46'],
  'muscle-relaxant': ['#8b5cf6', '#5b21b6'],
  other: ['#64748b', '#1e293b'],
};

const typeLabels: Record<MedicationType, string> = {
  analgesic: 'Analgésico',
  antiinflammatory: 'Antiinflamatorio',
  'muscle-relaxant': 'Relajante Muscular',
  other: 'Otro',
};

const computeNextDose = (med: Medication) => {
  if (!med.nextDose) return null;
  const now = new Date();
  const next = new Date(med.nextDose);
  if (next <= now) return { overdue: true, hours: 0, minutes: 0 };
  return {
    overdue: false,
    hours: differenceInHours(next, now),
    minutes: differenceInMinutes(next, now) % 60,
  };
};

export const MedicationWheel: React.FC<MedicationWheelProps> = ({
  medications,
  onRemove,
  onTake,
}) => {
  const grouped = useMemo(() => {
    return medications.reduce<Record<MedicationType, Medication[]>>(
      (acc, med) => {
        const key = med.type;
        if (!acc[key]) acc[key] = [];
        acc[key].push(med);
        return acc;
      },
      { analgesic: [], antiinflammatory: [], 'muscle-relaxant': [], other: [] },
    );
  }, [medications]);

  if (medications.length === 0) {
    return (
      <EmptyState
        icon={<Ionicons name="medkit-outline" size={48} color={Colors.text.light} />}
        title="No hay medicamentos registrados"
        description="Agrega tu primer medicamento para empezar a hacer seguimiento."
      />
    );
  }

  return (
    <View style={{ gap: Spacing.lg }}>
      {(Object.entries(grouped) as [MedicationType, Medication[]][]).map(
        ([type, meds]) => {
          if (meds.length === 0) return null;
          const colors = typeColors[type];
          return (
            <View key={type} style={{ gap: Spacing.sm }}>
              <View style={styles.sectionHeader}>
                <View style={[styles.dot, { backgroundColor: colors[0] }]} />
                <Text style={styles.sectionTitle}>{typeLabels[type]}</Text>
              </View>
              {meds.map((med) => {
                const time = computeNextDose(med);
                return (
                  <LinearGradient
                    key={med.id}
                    colors={colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                  >
                    <Pressable
                      onPress={() => onRemove(med.id)}
                      hitSlop={10}
                      style={styles.removeBtn}
                    >
                      <Ionicons name="close" size={18} color={Colors.text.white} />
                    </Pressable>
                    <Text style={styles.medName}>{med.name}</Text>
                    <Text style={styles.medMeta}>Dosis: {med.dose}</Text>
                    <Text style={styles.medMetaSm}>Cada {med.frequency} horas</Text>

                    {time ? (
                      <View
                        style={[
                          styles.timeBox,
                          time.overdue
                            ? styles.timeBoxOverdue
                            : time.hours < 2
                              ? styles.timeBoxWarn
                              : styles.timeBoxOk,
                        ]}
                      >
                        <Ionicons name="time-outline" size={16} color={Colors.text.white} />
                        {time.overdue ? (
                          <Text style={styles.timeText}>¡Debes tomarlo ya!</Text>
                        ) : (
                          <View>
                            <Text style={styles.timeText}>
                              {time.hours > 0 ? `${time.hours}h ` : ''}
                              {time.minutes > 0 ? `${time.minutes}m` : 'Pronto'}
                            </Text>
                            <Text style={styles.timeSub}>Próxima dosis</Text>
                          </View>
                        )}
                      </View>
                    ) : null}

                    <Pressable
                      onPress={() => onTake(med.id)}
                      style={({ pressed }) => [styles.takeBtn, pressed && { opacity: 0.85 }]}
                    >
                      <Text style={styles.takeText}>Marcar como tomado</Text>
                    </Pressable>
                  </LinearGradient>
                );
              })}
            </View>
          );
        },
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  sectionTitle: {
    ...Typography.styles.h4,
    color: Colors.text.primary,
  },
  card: {
    padding: Spacing.base,
    borderRadius: Radius.xl,
    ...Shadow.lg,
  },
  removeBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  medName: {
    color: Colors.text.white,
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
  },
  medMeta: { color: 'rgba(255,255,255,0.95)', fontSize: 14, marginTop: 2 },
  medMetaSm: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  timeBox: {
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
  },
  timeBoxOk: { backgroundColor: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.3)' },
  timeBoxWarn: { backgroundColor: 'rgba(245,158,11,0.3)', borderColor: 'rgba(254,215,170,1)' },
  timeBoxOverdue: { backgroundColor: 'rgba(239,68,68,0.35)', borderColor: 'rgba(252,165,165,1)' },
  timeText: { color: Colors.text.white, fontWeight: '700' },
  timeSub: { color: 'rgba(255,255,255,0.85)', fontSize: 11 },
  takeBtn: {
    marginTop: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.lg,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  takeText: { color: Colors.text.white, fontWeight: '700' },
});

export default MedicationWheel;
