import React, { useState } from 'react';
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import httpClient from '@/shared/services/http/apiClient';
import type { ChatChannel, ChatMessage } from '@/shared/types/domain';
import { Colors } from '@/shared/theme/colors';
import { Radius, Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';

const channels: { id: ChatChannel; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { id: 'ai', label: 'AlivIA IA', icon: 'sparkles' },
  { id: 'team', label: 'Equipo Médico', icon: 'medkit' },
];

export const ChatScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ChatChannel>('ai');
  const [draft, setDraft] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<ChatMessage[]>({
    queryKey: ['chat-messages'],
    queryFn: async () => {
      const res = await httpClient.get('/chat/messages');
      return res.data;
    },
  });

  const sendMutation = useMutation({
    mutationFn: async (body: string) => {
      const res = await httpClient.post('/chat/messages', {
        channel: activeTab,
        body,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
    },
  });

  const messages = (data ?? []).filter((m) => m.channel === activeTab);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    sendMutation.mutate(text);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat</Text>
        <Text style={styles.subtitle}>
          Conversa con la IA o con tu equipo médico de forma separada.
        </Text>
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
                color={active ? Colors.text.white : Colors.text.primary}
              />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {c.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator color={Colors.medical.blue} />
          </View>
        ) : (
          <FlatList
            data={messages}
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
            multiline
          />
          <Pressable
            onPress={handleSend}
            style={[styles.sendBtn, !draft.trim() && styles.sendBtnDisabled]}
            disabled={!draft.trim() || sendMutation.isPending}
          >
            <Ionicons name="send" size={18} color={Colors.text.white} />
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
        {!isMe ? (
          <Text style={styles.author}>{message.authorName}</Text>
        ) : null}
        <Text style={[styles.body, isMe && styles.bodyMe]}>{message.body}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background.light },
  flex: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
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
    borderColor: Colors.border.light,
    backgroundColor: Colors.background.white,
  },
  tabActive: {
    backgroundColor: Colors.medical.blue,
    borderColor: Colors.medical.blue,
  },
  tabLabel: { color: Colors.text.primary, fontWeight: '700' },
  tabLabelActive: { color: Colors.text.white },
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
  bubbleMe: { backgroundColor: Colors.medical.blue },
  bubbleOther: { backgroundColor: Colors.background.white },
  bubbleAi: { backgroundColor: '#ede9fe' },
  author: {
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 2,
    color: Colors.text.primary,
  },
  body: { color: Colors.text.primary, fontSize: 14, lineHeight: 19 },
  bodyMe: { color: Colors.text.white },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    padding: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    backgroundColor: Colors.background.white,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
    color: Colors.text.primary,
    backgroundColor: Colors.background.light,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.medical.blue,
  },
  sendBtnDisabled: { opacity: 0.5 },
});

export default ChatScreen;
