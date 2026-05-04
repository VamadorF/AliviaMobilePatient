import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button, Card, EmptyState, Screen } from '@/shared/components';
import httpClient from '@/shared/services/http/apiClient';
import { voiceProvider } from '@/shared/services/webrtc/voiceProvider';
import type { VoiceSpace } from '@/shared/types/domain';
import { Colors } from '@/shared/theme/colors';
import { Radius, Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';

interface ActiveSession {
  spaceId: string;
  channelName: string;
  provider: 'agora' | 'livekit';
  muted: boolean;
}

export const VoiceSpacesScreen: React.FC = () => {
  const [active, setActive] = useState<ActiveSession | null>(null);

  const { data, isLoading, refetch } = useQuery<VoiceSpace[]>({
    queryKey: ['voice-spaces'],
    queryFn: async () => {
      const res = await httpClient.get('/voice-spaces');
      return res.data;
    },
  });

  const joinMutation = useMutation({
    mutationFn: async (space: VoiceSpace) => {
      const res = await httpClient.post(`/voice-spaces/${space.id}/join`, {});
      const token = res.data?.token as string | undefined;
      const provider = (res.data?.provider ?? space.provider) as
        | 'agora'
        | 'livekit';
      await voiceProvider.join({
        channelName: space.channelName,
        displayName: 'Tú',
        token,
      });
      return { space, token, provider };
    },
    onSuccess: ({ space, provider }) => {
      setActive({
        spaceId: space.id,
        channelName: space.channelName,
        provider,
        muted: false,
      });
    },
  });

  const leaveMutation = useMutation({
    mutationFn: async () => {
      await voiceProvider.leave();
    },
    onSuccess: () => {
      setActive(null);
    },
  });

  const handleToggleMute = async () => {
    if (!active) return;
    const muted = await voiceProvider.toggleMute();
    setActive({ ...active, muted });
  };

  const renderItem = (space: VoiceSpace) => {
    const isActive = active?.spaceId === space.id;
    return (
      <Card key={space.id} style={{ marginBottom: Spacing.sm }}>
        <View style={styles.headerRow}>
          <View style={styles.iconBox}>
            <Ionicons name="mic" size={18} color={Colors.text.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{space.title}</Text>
            <Text style={styles.host}>Anfitrión: {space.hostName}</Text>
          </View>
          {space.isLive ? (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>EN VIVO</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.body}>{space.description}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="people" size={14} color={Colors.text.muted} />
          <Text style={styles.meta}>
            {space.participants} participantes
          </Text>
          <Ionicons
            name="cloud-outline"
            size={14}
            color={Colors.text.muted}
            style={{ marginLeft: 8 }}
          />
          <Text style={styles.meta}>{space.provider}</Text>
        </View>
        {space.scheduledFor ? (
          <Text style={styles.scheduled}>
            Programado:{' '}
            {format(parseISO(space.scheduledFor), "EEEE d 'a las' HH:mm", {
              locale: es,
            })}
          </Text>
        ) : null}

        <View style={styles.actions}>
          {isActive ? (
            <>
              <Button
                label={active?.muted ? 'Activar mic' : 'Silenciar'}
                variant="outline"
                size="sm"
                leftIcon={
                  <Ionicons
                    name={active?.muted ? 'mic-off' : 'mic'}
                    size={16}
                    color={Colors.medical.blue}
                  />
                }
                onPress={handleToggleMute}
              />
              <Button
                label="Salir"
                variant="danger"
                size="sm"
                leftIcon={
                  <Ionicons
                    name="exit-outline"
                    size={16}
                    color={Colors.text.white}
                  />
                }
                loading={leaveMutation.isPending}
                onPress={() => leaveMutation.mutate()}
              />
            </>
          ) : (
            <Button
              label={space.isLive ? 'Entrar a la sala' : 'Recordarme'}
              size="sm"
              leftIcon={
                <Ionicons
                  name={space.isLive ? 'enter-outline' : 'notifications'}
                  size={16}
                  color={Colors.text.white}
                />
              }
              loading={joinMutation.isPending}
              onPress={() => {
                if (space.isLive) {
                  joinMutation.mutate(space);
                }
              }}
              disabled={!space.isLive}
            />
          )}
        </View>
      </Card>
    );
  };

  return (
    <Screen scroll edges={['top', 'left', 'right']}>
      <View style={styles.heading}>
        <Text style={styles.heading1}>Espacios de voz</Text>
        <Pressable onPress={() => refetch()} hitSlop={8}>
          <Ionicons name="refresh" size={20} color={Colors.medical.blue} />
        </Pressable>
      </View>
      <Text style={styles.subtitle}>
        Salas en vivo facilitadas por tu equipo médico y la comunidad.
      </Text>

      {active ? (
        <Card background="#dcfce7" style={{ marginBottom: Spacing.base }}>
          <View style={styles.activeRow}>
            <Ionicons name="radio" size={20} color="#047857" />
            <Text style={styles.activeText}>
              Estás conectado · canal {active.channelName} · proveedor{' '}
              {active.provider}
            </Text>
          </View>
        </Card>
      ) : null}

      {isLoading ? (
        <ActivityIndicator color={Colors.medical.blue} />
      ) : (data ?? []).length === 0 ? (
        <Card>
          <EmptyState
            title="Aún no hay espacios"
            description="Pronto tendremos sesiones en vivo. Vuelve más tarde."
          />
        </Card>
      ) : (
        (data ?? []).map(renderItem)
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading1: { ...Typography.styles.h2, color: Colors.text.primary },
  subtitle: { color: Colors.text.muted, marginBottom: Spacing.base },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.xs,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.medical.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...Typography.styles.h4, color: Colors.text.primary },
  host: { color: Colors.text.muted, fontSize: 12 },
  body: { color: Colors.text.secondary, fontSize: 14 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.xs,
  },
  meta: { color: Colors.text.muted, fontSize: 12 },
  scheduled: {
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
    fontSize: 12,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: Spacing.sm,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.lg,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#dc2626',
  },
  liveText: { color: '#b91c1c', fontWeight: '800', fontSize: 11 },
  activeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  activeText: { color: '#065f46', flex: 1, fontWeight: '600' },
});

export default VoiceSpacesScreen;
