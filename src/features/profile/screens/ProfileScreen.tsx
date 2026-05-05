import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, Screen } from '@/shared/components';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useDailyRecordsStore } from '@/features/daily-record/store/dailyRecords.store';
import { Colors } from '@/shared/theme/colors';
import { Radius, Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';

const menuItems: {
  key: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  hint?: string;
}[] = [
  { key: 'profile', label: 'Mi perfil', icon: 'person-outline' },
  { key: 'notif', label: 'Notificaciones', icon: 'notifications-outline' },
  { key: 'sec', label: 'Seguridad', icon: 'shield-checkmark-outline' },
  { key: 'theme', label: 'Apariencia', icon: 'color-palette-outline', hint: 'Oscuro' },
];

export const ProfileScreen: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const records = useDailyRecordsStore((s) => s.records);

  const memberLabel = useMemo(() => {
    const raw = user?.memberSince;
    if (!raw) return 'Miembro desde la demo';
    try {
      return `Miembro desde ${format(new Date(raw), 'MMMM yyyy', { locale: es })}`;
    } catch {
      return 'Miembro desde la demo';
    }
  }, [user]);

  const streak = useMemo(() => {
    const sorted = [...records].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    let current = 0;
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i].dayType !== 'bad') current += 1;
      else break;
    }
    return current;
  }, [records]);

  const medalsEarned = streak >= 7 ? 2 : streak >= 1 ? 1 : 0;

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email ?? 'Usuario demo';

  return (
    <Screen scroll edges={['top', 'left', 'right']}>
      <View style={styles.topRow}>
        <Text style={styles.pageTitle}>Perfil</Text>
        <Pressable hitSlop={10} style={styles.iconBtn}>
          <Ionicons name="settings-outline" size={22} color={Colors.text.secondary} />
        </Pressable>
      </View>

      <View style={styles.avatarBlock}>
        <View style={styles.avatarRing}>
          <View style={styles.avatarInner}>
            <Ionicons name="person" size={48} color={Colors.text.muted} />
          </View>
          <View style={styles.verified}>
            <Ionicons name="checkmark" size={14} color={Colors.text.onAccent} />
          </View>
        </View>
        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.member}>{memberLabel}</Text>
      </View>

      <View style={styles.medalsHeader}>
        <View style={styles.medalsTitleRow}>
          <Ionicons name="shield-checkmark" size={18} color={Colors.primary.base} />
          <Text style={styles.sectionTitle}>Mis medallas</Text>
        </View>
        <View style={styles.pill}>
          <Text style={styles.pillText}>{medalsEarned} ganadas</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.medalsRow}
      >
        {[
          'Primer paso',
          'Semana de hierro',
          'Quincena imparable',
          'Mes de oro',
          'Héroe del dolor',
        ].map((label, i) => {
          const earned = i < medalsEarned;
          return (
            <View key={label} style={styles.medalItem}>
              <View style={[styles.medalCircle, earned && styles.medalCircleOn]}>
                <Ionicons
                  name={earned ? 'ribbon' : 'lock-closed'}
                  size={20}
                  color={earned ? Colors.text.onAccent : Colors.text.light}
                />
              </View>
              <Text style={styles.medalLabel} numberOfLines={2}>
                {label}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={{ marginTop: Spacing.lg, gap: Spacing.sm }}>
        {menuItems.map((item) => (
          <Card key={item.key} variant="elevated" padded>
            <Pressable style={styles.menuRow}>
              <View style={styles.menuIcon}>
                <Ionicons name={item.icon} size={22} color={Colors.text.secondary} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.hint ? (
                <Text style={styles.menuHint}>{item.hint}</Text>
              ) : (
                <View style={{ flex: 1 }} />
              )}
              <Ionicons name="chevron-forward" size={20} color={Colors.text.muted} />
            </Pressable>
          </Card>
        ))}
      </View>

      <Pressable onPress={() => logout()} style={styles.logout}>
        <Ionicons name="log-out-outline" size={22} color={Colors.status.error} />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>
    </Screen>
  );
};

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  pageTitle: { ...Typography.styles.h2, color: Colors.text.primary },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.surface,
  },
  avatarBlock: { alignItems: 'center', marginBottom: Spacing.xl },
  avatarRing: {
    padding: 3,
    borderRadius: 80,
    backgroundColor: Colors.gradient.aurora[0] + '55',
  },
  avatarInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.background.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verified: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary.base,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background.base,
  },
  name: {
    marginTop: Spacing.md,
    ...Typography.styles.h3,
    color: Colors.text.primary,
  },
  member: { marginTop: 4, color: Colors.text.muted, fontSize: 14 },
  medalsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  medalsTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { ...Typography.styles.h4, color: Colors.text.primary },
  pill: {
    backgroundColor: Colors.background.surfaceHigh,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  pillText: { color: Colors.text.muted, fontSize: 12, fontWeight: '700' },
  medalsRow: { gap: Spacing.md, paddingVertical: Spacing.xs },
  medalItem: { width: 88, alignItems: 'center' },
  medalCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.background.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  medalCircleOn: { backgroundColor: Colors.primary.base },
  medalLabel: {
    fontSize: 11,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.background.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    ...Typography.styles.body,
    color: Colors.text.primary,
    fontWeight: '600',
  },
  menuHint: { color: Colors.text.muted, marginRight: 4, fontSize: 13 },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: Spacing['2xl'],
    marginBottom: Spacing.xl,
  },
  logoutText: {
    color: Colors.status.error,
    fontWeight: '700',
    fontSize: Typography.fontSize.base,
  },
});

export default ProfileScreen;
