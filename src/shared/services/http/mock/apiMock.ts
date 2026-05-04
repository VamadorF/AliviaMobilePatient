import { STORAGE_KEYS } from '@/app/config/constants';
import { localStorage } from '@/shared/services/storage/asyncStorage';
import {
  mockChatMessages,
  mockCommunities,
  mockCommunityPosts,
  mockDashboard,
  mockHealthPro,
  mockIndications,
  mockMedicationsCatalog,
  mockUser,
  mockVoiceSpaces,
} from './mockData';

const COMMUNITY_POSTS_KEY = 'alivia.community.posts';
const CHAT_MESSAGES_KEY = 'alivia.chat.messages';

const ensureChatStore = async () => {
  const existing = await localStorage.getJSON<any[]>(CHAT_MESSAGES_KEY);
  if (existing && existing.length) return existing;
  await localStorage.setJSON(CHAT_MESSAGES_KEY, mockChatMessages);
  return mockChatMessages.slice();
};

const ensurePostsStore = async () => {
  const existing = await localStorage.getJSON<any[]>(COMMUNITY_POSTS_KEY);
  if (existing && existing.length) return existing;
  await localStorage.setJSON(COMMUNITY_POSTS_KEY, mockCommunityPosts);
  return mockCommunityPosts.slice();
};

const aiAutoReply = (body: string): string => {
  const lower = body.toLowerCase();
  if (/dolor|duele/.test(lower) && /(8|9|10|fuerte|insoport)/.test(lower)) {
    return 'Lamento que estés pasando por esto. Si el dolor es muy intenso o no cede, considera contactar a urgencia (131) o ir a tu SAPU. Mientras tanto, prueba la respiración 4-7-8.';
  }
  if (/sue[ñn]o|dormir/.test(lower)) {
    return 'El sueño y el dolor están muy ligados. Intenta una rutina de relajación 30 minutos antes de acostarte y registra cómo te sientes mañana.';
  }
  if (/medic|pastilla|remedio/.test(lower)) {
    return 'Recuerda registrar la medicación que tomaste en la app. Así tu equipo médico podrá ajustar tu tratamiento mejor.';
  }
  return 'Gracias por contarme. Estoy aquí para acompañarte. ¿Quieres que te sugiera un ejercicio breve para sentirte mejor?';
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiMock = {
  async post(url: string, data: any) {
    await delay(400);

    if (url.includes('/auth/login')) {
      const isProfessional =
        data?.email?.toLowerCase().includes('profesional') ||
        data?.email?.toLowerCase().includes('health') ||
        data?.email?.toLowerCase().includes('doctor');

      const user = isProfessional
        ? { ...mockHealthPro, email: data.email, hasProfile: true }
        : { ...mockUser, email: data.email, hasProfile: true };

      return {
        data: {
          user,
          token: `mock-token-${Date.now()}`,
        },
      };
    }

    if (url.includes('/auth/register')) {
      const role =
        data?.role === 'DOCTOR' ||
        data?.role === 'PSYCHOLOGIST' ||
        data?.role === 'PHYSIOTHERAPIST'
          ? 'HEALTH_PRO'
          : data?.role ?? 'PATIENT';

      return {
        data: {
          user: {
            id: `${Date.now()}`,
            ...data,
            role,
            hasProfile: true,
          },
          token: `mock-token-${Date.now()}`,
        },
      };
    }

    if (url.includes('/patient/daily-records')) {
      const record = {
        id: `record-${Date.now()}`,
        ...data,
        functionalImpactSleep: data?.functionalImpactSleep ?? 0,
        takenMedications: data?.takenMedications ?? [],
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      const existing =
        (await localStorage.getJSON<any[]>(STORAGE_KEYS.DAILY_RECORDS)) ?? [];
      await localStorage.setJSON(STORAGE_KEYS.DAILY_RECORDS, [record, ...existing]);
      return { data: record };
    }

    if (url.includes('/patient/pain-record/recommendation')) {
      let category: 'autocuidado' | 'cesfam-ccr' | 'sapu-sar' | 'urgencia' = 'autocuidado';
      let message = 'Consulta con tu médico si el dolor persiste o empeora.';
      const painIntensity = data?.painIntensity ?? 5;
      const functionalImpact = data?.functionalImpactPhysical ?? 0;

      if (painIntensity >= 8) {
        category = 'urgencia';
        message =
          'El dolor es muy intenso. Se recomienda acudir a urgencia hospitalaria para evaluación inmediata.';
      } else if (painIntensity >= 6) {
        category = 'sapu-sar';
        message =
          'El dolor es moderado a severo. Se recomienda consultar en SAPU o llamar al SAR (600 360 7777) para evaluación.';
      } else if (painIntensity >= 4 || functionalImpact >= 6) {
        category = 'cesfam-ccr';
        message =
          'Se recomienda programar una consulta en CESFAM o CCR para evaluación y seguimiento.';
      } else {
        category = 'autocuidado';
        message =
          'El dolor es leve. Puedes manejarlo con autocuidado, pero si persiste o empeora, consulta con tu médico.';
      }

      return { data: { category, message } };
    }

    if (url.includes('/chat/messages')) {
      const messages = await ensureChatStore();
      const channel = data?.channel === 'team' ? 'team' : 'ai';
      const userMessage = {
        id: `msg-${Date.now()}`,
        channel,
        authorName: 'Tú',
        authorRole: 'PATIENT',
        body: data?.body ?? '',
        createdAt: new Date().toISOString(),
      };
      messages.push(userMessage);
      let reply: any = null;
      if (channel === 'ai') {
        reply = {
          id: `ai-${Date.now()}`,
          channel: 'ai',
          authorName: 'AlivIA IA',
          authorRole: 'AlivIA',
          body: aiAutoReply(userMessage.body),
          createdAt: new Date(Date.now() + 1).toISOString(),
        };
        messages.push(reply);
      }
      await localStorage.setJSON(CHAT_MESSAGES_KEY, messages);
      return { data: { message: userMessage, reply } };
    }

    if (url.match(/\/community\/[^/]+\/posts$/)) {
      const posts = await ensurePostsStore();
      const communityId = url.split('/')[2];
      const post = {
        id: `post-${Date.now()}`,
        communityId,
        authorId: 'u-1',
        authorName: data?.authorName ?? 'Tú',
        category: data?.category ?? 'experiencias',
        title: data?.title ?? '',
        body: data?.body ?? '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
      };
      posts.unshift(post);
      await localStorage.setJSON(COMMUNITY_POSTS_KEY, posts);
      return { data: post };
    }

    if (url.includes('/voice-spaces/') && url.endsWith('/join')) {
      const id = url.split('/')[2];
      const space = mockVoiceSpaces.find((s) => s.id === id);
      return {
        data: {
          space,
          token: `mock-voice-token-${Date.now()}`,
          provider: space?.provider ?? 'livekit',
        },
      };
    }

    return { data: {} };
  },

  async get(url: string) {
    await delay(300);

    if (url.includes('/auth/me')) {
      const savedUser = await localStorage.getJSON(STORAGE_KEYS.AUTH_USER);
      if (savedUser) return { data: savedUser };
      return { data: null };
    }

    if (url.includes('/patient/dashboard')) {
      return { data: mockDashboard };
    }

    if (url.includes('/patient/daily-records')) {
      const stored = (await localStorage.getJSON<any[]>(STORAGE_KEYS.DAILY_RECORDS)) ?? [];
      const baseline = mockDashboard.chartData.map((item, idx) => ({
        id: `seed-${idx}`,
        date: item.date,
        painIntensity: item.painIntensity,
        dayType: item.dayType,
        symptoms: ['Fatiga', 'Náuseas'],
        triggers: ['Estrés', 'Clima frío'],
        medications: [{ name: 'Ibuprofeno', dose: '400mg', effects: 'Alivio moderado' }],
        notes: 'Día difícil, dolor más intenso por la mañana',
        painAreas: ['head', 'neck', 'back-upper'],
        painDurationUnit: idx % 3 === 0 ? 'chronic' : 'hours',
        painDurationValue: idx % 3 === 0 ? null : (idx % 24) + 1,
        painTypes: ['stabbing', 'burning'],
        activities: ['Trabajo', 'Lectura', 'Caminata'],
        phq2Answer1: 1,
        phq2Answer2: 1,
        gad2Answer1: 0,
        gad2Answer2: 1,
      }));
      return {
        data: {
          records: [...stored, ...baseline],
          stats: mockDashboard.stats,
        },
      };
    }

    if (url.includes('/patient/medical-indications')) {
      return { data: mockIndications };
    }

    if (url.includes('/community/my-communities')) {
      return { data: [mockCommunities[0]] };
    }

    if (url.match(/\/community\/[^/]+\/posts$/)) {
      const communityId = url.split('/')[2];
      const posts = await ensurePostsStore();
      const queryString = url.includes('?') ? url.split('?')[1] ?? '' : '';
      const params = new URLSearchParams(queryString);
      const cat = params.get('category');
      const filtered = posts.filter((p: any) => p.communityId === communityId);
      const result = cat ? filtered.filter((p: any) => p.category === cat) : filtered;
      return { data: result };
    }

    if (url.includes('/community')) {
      return { data: mockCommunities };
    }

    if (url.includes('/chat/messages')) {
      const messages = await ensureChatStore();
      return { data: messages };
    }

    if (url.includes('/voice-spaces')) {
      return { data: mockVoiceSpaces };
    }

    if (url.includes('/medications/search')) {
      const queryString = url.split('?')[1] ?? '';
      const params = new URLSearchParams(queryString);
      const q = (params.get('q') ?? '').toLowerCase().trim();
      if (!q) return { data: mockMedicationsCatalog };
      return {
        data: mockMedicationsCatalog.filter(
          (m) =>
            m.name.toLowerCase().includes(q) ||
            m.substance.toLowerCase().includes(q),
        ),
      };
    }

    return { data: [] };
  },

  async patch(url: string, data?: any) {
    await delay(300);

    if (url.includes('/community/posts/')) {
      const id = url.split('/').pop();
      const posts = await ensurePostsStore();
      const idx = posts.findIndex((p: any) => p.id === id);
      if (idx >= 0) {
        posts[idx] = {
          ...posts[idx],
          ...(data ?? {}),
          updatedAt: new Date().toISOString(),
        };
        await localStorage.setJSON(COMMUNITY_POSTS_KEY, posts);
        return { data: posts[idx] };
      }
    }

    return {
      data: { ...(data ?? {}), isResolved: true, resolvedAt: new Date().toISOString() },
    };
  },

  async put(url: string, data?: any) {
    return apiMock.patch(url, data);
  },

  async delete(url: string) {
    await delay(300);

    if (url.includes('/community/posts/')) {
      const id = url.split('/').pop();
      const posts = await ensurePostsStore();
      const filtered = posts.filter((p: any) => p.id !== id);
      await localStorage.setJSON(COMMUNITY_POSTS_KEY, filtered);
      return { data: { success: true, id } };
    }

    return { data: { success: true } };
  },
};

export default apiMock;
