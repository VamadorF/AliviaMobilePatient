import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ChatChannel, ChatMessage } from '@/shared/types/domain';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useChatStore } from '@/features/chat/store/chat.store';
import { Colors } from '@/shared/theme/colors';
import { Radius, Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';

const channels: {
  id: ChatChannel;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}[] = [
  { id: 'ai', label: 'AlivIA IA', icon: 'sparkles' },
  { id: 'team', label: 'Equipo Médico', icon: 'medkit' },
];

export const ChatScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ChatChannel>('ai');
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);

  const user = useAuthStore((s) => s.user);
  const messages = useChatStore((s) => s.messages);
  const hydrated = useChatStore((s) => s.hydrated);
  const hydrate = useChatStore((s) => s.hydrate);
  const send = useChatStore((s) => s.send);

  useEffect(() => {
    if (!hydrated) hydrate().catch(() => {});
  }, [hydrate, hydrated]);

  const filtered = messages.filter((m) => m.channel === activeTab);

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email ?? 'Paciente';

  const handleSend = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    setSending(true);
    try {
      await send(activeTab, text, { name: displayName, isPro: false });
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.headerAvatar}>
          <Ionicons name="sparkles" size={22} color={Colors.text.onAccent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>AlivIA</Text>
          <Text style={styles.subtitle}>
            Chat demo local: la IA responde con plantillas; el equipo médico es simulado.
          </Text>
        </View>
      </View>

      <View style={styles.tabs}>
        {channels.map((c) => {
          const active = activeTab === c.id;
          return (
            <Pressable
              key={c.id}
              onPress={() => setActiveTab(c.id)}
              style={[styles.tab, active && styles.tabActive]}
            >
              <Ionicons
                name={c.icon}
                size={16}
                color={active ? Colors.text.onAccent : Colors.text.primary}
              />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{c.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        {!hydrated ? (
          <View style={styles.center}>
            <ActivityIndicator color={Colors.primary.base} />
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => <ChatBubble message={item} />}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>
                  {activeTab === 'ai'
                    ? 'Hola, soy AlivIA. Cuéntame qué te pasa hoy.'
                    : 'Aún no tienes mensajes con tu equipo médico.'}
                </Text>
              </View>
            }
          />
        )}

        <View style={styles.composer}>
          <TextInput
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            placeholder={
              activeTab === 'ai'
                ? 'Escríbele a AlivIA...'
                : 'Escríbele a tu equipo médico...'
            }
            placeholderTextColor={Colors.text.muted}
            multiline
          />
          <Pressable
            onPress={handleSend}
            style={[styles.sendBtn, !draft.trim() && styles.sendBtnDisabled]}
            disabled={!draft.trim() || sending}
          >
            <Ionicons name="send" size={18} color={Colors.text.onAccent} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isMe = message.authorRole === 'PATIENT';
  return (
    <View style={[styles.bubbleRow, isMe && styles.bubbleRowMe]}>
      <View
        style={[
          styles.bubble,
          isMe ? styles.bubbleMe : styles.bubbleOther,
          message.channel === 'ai' && !isMe && styles.bubbleAi,
        ]}
      >
        {!isMe ? <Text style={styles.author}>{message.authorName}</Text> : null}
        <Text style={[styles.body, isMe && styles.bodyMe]}>{message.body}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background.base },
  flex: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary.soft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...Typography.styles.h2, color: Colors.text.primary },
  subtitle: { color: Colors.text.muted, marginBottom: Spacing.sm },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: 8,
    marginBottom: Spacing.sm,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    backgroundColor: Colors.background.surface,
  },
  tabActive: {
    backgroundColor: Colors.primary.base,
    borderColor: Colors.primary.base,
  },
  tabLabel: { color: Colors.text.primary, fontWeight: '700' },
  tabLabelActive: { color: Colors.text.onAccent },
  list: { padding: Spacing.base, gap: Spacing.sm, flexGrow: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { padding: Spacing.lg, alignItems: 'center' },
  emptyText: { color: Colors.text.muted, textAlign: 'center' },
  bubbleRow: { flexDirection: 'row', marginBottom: Spacing.sm },
  bubbleRowMe: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '80%',
    padding: Spacing.sm,
    borderRadius: Radius.lg,
  },
  bubbleMe: { backgroundColor: Colors.primary.deep },
  bubbleOther: { backgroundColor: Colors.background.surfaceElevated },
  bubbleAi: { backgroundColor: Colors.accentSoft },
  author: {
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 2,
    color: Colors.text.secondary,
  },
  body: { color: Colors.text.primary, fontSize: 14, lineHeight: 19 },
  bodyMe: { color: Colors.text.onAccent },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    padding: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.border.subtle,
    backgroundColor: Colors.background.surface,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    color: Colors.text.primary,
    backgroundColor: Colors.background.surfaceHigh,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.base,
  },
  sendBtnDisabled: { opacity: 0.5 },
});

export default ChatScreen;
