import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Screen } from '@/shared/components';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useVoiceSpacesStore } from '@/features/voice-spaces/store/voiceSpaces.store';
import type { CommunityStackParamList } from '@/shared/types/navigation';
import { Colors } from '@/shared/theme/colors';
import { Radius, Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';

export const VoiceSessionScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const route = useRoute<RouteProp<CommunityStackParamList, 'VoiceSession'>>();
  const { spaceId } = route.params;

  const user = useAuthStore((s) => s.user);
  const spaces = useVoiceSpacesStore((s) => s.spaces);
  const active = useVoiceSpacesStore((s) => s.active);
  const join = useVoiceSpacesStore((s) => s.join);
  const leave = useVoiceSpacesStore((s) => s.leave);
  const toggleMute = useVoiceSpacesStore((s) => s.toggleMute);

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email ?? 'Participante';

  const space = useMemo(
    () => spaces.find((s) => s.id === spaceId),
    [spaces, spaceId],
  );

  useFocusEffect(
    useCallback(() => {
      void join(spaceId, { name: displayName });
      return () => {
        void leave();
      };
    }, [spaceId, displayName, join, leave]),
  );

  const handleLeave = () => {
    navigation.goBack();
  };

  const hostParticipant = active?.participants.find((p) => p.isHost);
  const gridParticipants = active?.participants.filter((p) => !p.isHost) ?? [];

  return (
    <Screen edges={['top', 'left', 'right']}>
      <View style={styles.topBar}>
        <Pressable onPress={handleLeave} hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="chevron-down" size={28} color={Colors.text.primary} />
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.liveLabel}>EN VIVO</Text>
          <Text style={styles.title} numberOfLines={1}>
            {space?.title ?? 'Espacio de voz'}
          </Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      <LinearGradient
        colors={Colors.gradient.violet}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hostCard}
      >
        <Text style={styles.hostEmoji}>{hostParticipant?.emoji ?? '🩺'}</Text>
        <Text style={styles.hostName}>{hostParticipant?.name ?? space?.hostName}</Text>
        <Text style={styles.hostHint}>Anfitrión · facilita la sesión</Text>
      </LinearGradient>

      <Text style={styles.section}>Participantes</Text>
      <FlatList
        data={gridParticipants}
        keyExtractor={(item) => item.id}
        numColumns={3}
        scrollEnabled={false}
        columnWrapperStyle={styles.rowWrap}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <View style={styles.participant}>
            <View
              style={[
                styles.avatar,
                item.isYou && { borderColor: Colors.primary.base, borderWidth: 2 },
              ]}
            >
              <Text style={styles.avatarEmoji}>{item.emoji ?? '👤'}</Text>
            </View>
            <Text style={styles.participantName} numberOfLines={2}>
              {item.name}
            </Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.channelMeta}>
          Canal demo · {active?.channelName ?? space?.channelName ?? '—'}
        </Text>
        <View style={styles.controls}>
          <Button
            label={active?.muted ? 'Activar mic' : 'Silenciar'}
            variant="outline"
            size="sm"
            leftIcon={
              <Ionicons
                name={active?.muted ? 'mic-off' : 'mic'}
                size={18}
                color={Colors.primary.base}
              />
            }
            onPress={() => toggleMute()}
          />
          <Button
            label="Salir"
            variant="danger"
            size="sm"
            leftIcon={
              <Ionicons name="exit-outline" size={18} color={Colors.text.white} />
            }
            onPress={handleLeave}
          />
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.surface,
  },
  liveLabel: {
    color: Colors.status.error,
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
  },
  title: {
    ...Typography.styles.h4,
    color: Colors.text.primary,
    marginTop: 2,
    maxWidth: '85%',
  },
  hostCard: {
    borderRadius: Radius['2xl'],
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  hostEmoji: { fontSize: 56, marginBottom: Spacing.sm },
  hostName: {
    ...Typography.styles.h3,
    color: Colors.text.white,
    textAlign: 'center',
  },
  hostHint: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
  },
  section: {
    ...Typography.styles.label,
    color: Colors.text.muted,
    marginBottom: Spacing.sm,
  },
  grid: { paddingBottom: Spacing.md },
  rowWrap: { gap: Spacing.sm, marginBottom: Spacing.sm },
  participant: {
    flex: 1,
    alignItems: 'center',
    minWidth: '28%',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.background.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  avatarEmoji: { fontSize: 26 },
  participantName: {
    fontSize: 11,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontWeight: '600',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
  },
  channelMeta: {
    color: Colors.text.muted,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  controls: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
});

export default VoiceSessionScreen;
