import { STORAGE_KEYS } from '@/app/config/constants';
import { localStorage } from '@/shared/services/storage/asyncStorage';
import {
  mockCommunities,
  mockDashboard,
  mockHealthPro,
  mockIndications,
  mockUser,
} from './mockData';

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

    if (url.includes('/community')) {
      return { data: mockCommunities };
    }

    return { data: [] };
  },

  async patch(_url: string, data?: any) {
    await delay(300);
    return {
      data: { ...(data ?? {}), isResolved: true, resolvedAt: new Date().toISOString() },
    };
  },

  async put(url: string, data?: any) {
    return apiMock.patch(url, data);
  },

  async delete(_url: string) {
    await delay(300);
    return { data: { success: true } };
  },
};

export default apiMock;
