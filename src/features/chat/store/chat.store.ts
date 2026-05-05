import { create } from 'zustand';
import { localStorage } from '@/shared/services/storage/asyncStorage';
import { mockChatMessages } from '@/shared/services/demo';
import type { ChatChannel, ChatMessage } from '@/shared/types/domain';

const KEY = 'alivia.chat.messages';

const aiAutoReply = (body: string, name: string): string => {
  const lower = body.toLowerCase();
  if (/dolor|duele/.test(lower) && /(8|9|10|fuerte|insoport)/.test(lower)) {
    return `Lamento que estés pasando por esto, ${name}. Si el dolor es muy intenso o no cede, considera contactar a urgencia (131) o ir a tu SAPU. Mientras tanto, prueba la respiración 4-7-8.`;
  }
  if (/sue[ñn]o|dormir/.test(lower)) {
    return 'El sueño y el dolor están muy ligados. Intenta una rutina de relajación 30 minutos antes de acostarte y registra cómo te sientes mañana.';
  }
  if (/medic|pastilla|remedio/.test(lower)) {
    return 'Recuerda registrar la medicación que tomaste en la app. Así tu equipo médico podrá ajustar tu tratamiento mejor.';
  }
  if (/conexi[oó]n|inestable/.test(lower)) {
    return `Lo siento mucho, ${name}, parece que mi conexión está un poco inestable. ¿Podrías repetirme eso?`;
  }
  return `Gracias por contarme, ${name}. Estoy aquí para acompañarte. ¿Quieres que te sugiera un ejercicio breve para sentirte mejor?`;
};

interface ChatState {
  messages: ChatMessage[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  send: (
    channel: ChatChannel,
    body: string,
    user: { name: string; isPro: boolean },
  ) => Promise<void>;
  clear: () => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: mockChatMessages,
  hydrated: false,

  async hydrate() {
    const stored = await localStorage.getJSON<ChatMessage[]>(KEY);
    if (stored && stored.length) set({ messages: stored, hydrated: true });
    else {
      await localStorage.setJSON(KEY, mockChatMessages);
      set({ hydrated: true });
    }
  },

  async send(channel, body, user) {
    const trimmed = body.trim();
    if (!trimmed) return;
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      channel,
      authorName: user.name,
      authorRole: 'PATIENT',
      body: trimmed,
      createdAt: new Date().toISOString(),
    };
    const nextWithUser = [...get().messages, userMessage];
    set({ messages: nextWithUser });
    await localStorage.setJSON(KEY, nextWithUser);

    if (channel === 'ai') {
      await new Promise((r) => setTimeout(r, 700));
      const reply: ChatMessage = {
        id: `ai-${Date.now()}`,
        channel: 'ai',
        authorName: 'AlivIA IA',
        authorRole: 'AlivIA',
        body: aiAutoReply(trimmed, user.name.split(' ')[0] ?? 'amigo/a'),
        createdAt: new Date(Date.now() + 1).toISOString(),
      };
      const finalList = [...nextWithUser, reply];
      set({ messages: finalList });
      await localStorage.setJSON(KEY, finalList);
    }
  },

  async clear() {
    await localStorage.setJSON(KEY, mockChatMessages);
    set({ messages: mockChatMessages });
  },
}));
