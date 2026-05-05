import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button, Card, EmptyState, Screen } from '@/shared/components';
import { useVoiceSpacesStore } from '@/features/voice-spaces/store/voiceSpaces.store';
import type { CommunityStackParamList } from '@/shared/types/navigation';
import type { VoiceSpace } from '@/shared/types/domain';
import { Colors } from '@/shared/theme/colors';
import { Radius, Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';

export const VoiceSpacesScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<CommunityStackParamList>>();
  const spaces = useVoiceSpacesStore((s) => s.spaces);

  const renderItem = (space: VoiceSpace) => (
    <Card key={space.id} style={{ marginBottom: Spacing.sm }}>
      <View style={styles.headerRow}>
        <View style={styles.iconBox}>
          <Ionicons name="mic" size={18} color={Colors.text.onAccent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{space.title}</Text>
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
        <Text style={styles.meta}>{space.participants} participantes</Text>
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
        <Button
          label={space.isLive ? 'Entrar a la sala' : 'Próximamente'}
          size="sm"
          disabled={!space.isLive}
          leftIcon={
            <Ionicons
              name={space.isLive ? 'enter-outline' : 'time-outline'}
              size={16}
              color={Colors.text.onAccent}
            />
          }
          onPress={() => {
            if (space.isLive) {
              navigation.navigate('VoiceSession', { spaceId: space.id });
            }
          }}
        />
      </View>
    </Card>
  );

  return (
    <Screen scroll edges={['top', 'left', 'right']}>
      <View style={styles.heading}>
        <Text style={styles.heading1}>Espacios de voz</Text>
        <Pressable hitSlop={8}>
          <Ionicons name="information-circle-outline" size={22} color={Colors.primary.base} />
        </Pressable>
      </View>
      <Text style={styles.subtitle}>
        Salas demo sin conexión real: simulamos participantes y el canal solo para la
        experiencia visual.
      </Text>

      {spaces.length === 0 ? (
        <Card>
          <EmptyState
            title="Aún no hay espacios"
            description="Pronto tendremos sesiones en vivo. Vuelve más tarde."
          />
        </Card>
      ) : (
        spaces.map(renderItem)
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
    backgroundColor: Colors.primary.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { ...Typography.styles.h4, color: Colors.text.primary },
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
    backgroundColor: Colors.status.error + '22',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.lg,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.status.error,
  },
  liveText: { color: Colors.status.error, fontWeight: '800', fontSize: 11 },
});

export default VoiceSpacesScreen;
