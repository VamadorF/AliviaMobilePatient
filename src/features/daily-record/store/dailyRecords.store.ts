import { create } from 'zustand';
import { STORAGE_KEYS } from '@/app/config/constants';
import { localStorage } from '@/shared/services/storage/asyncStorage';
import { mockDashboard } from '@/shared/services/demo';
import type {
  DailyRecord,
  DailyRecordStats,
  Recommendation,
} from '@/shared/types/domain';

interface DailyRecordsState {
  records: DailyRecord[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  add: (input: Omit<DailyRecord, 'id' | 'date'> & { date?: string }) => Promise<DailyRecord>;
  computeRecommendation: (
    painIntensity: number,
    functionalImpactPhysical: number,
  ) => Recommendation;
  getStats: () => DailyRecordStats;
  reset: () => Promise<void>;
}

const baseline: DailyRecord[] = mockDashboard.chartData.map((point, idx) => ({
  id: `seed-${idx}`,
  date: point.date,
  painIntensity: point.painIntensity,
  dayType: point.dayType,
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

const computeDayType = (intensity: number): 'good' | 'neutral' | 'bad' => {
  if (intensity <= 3) return 'good';
  if (intensity <= 6) return 'neutral';
  return 'bad';
};

const computeStats = (records: DailyRecord[]): DailyRecordStats => {
  if (records.length === 0) return mockDashboard.stats;
  const total = records.length;
  const sum = records.reduce((acc, r) => acc + r.painIntensity, 0);
  const goodDays = records.filter((r) => r.dayType === 'good').length;
  const badDays = records.filter((r) => r.dayType === 'bad').length;
  return {
    averagePain: sum / total,
    goodDays,
    badDays,
    totalRecords: total,
    adherence: Math.round((goodDays / total) * 1000) / 10,
  };
};

export const useDailyRecordsStore = create<DailyRecordsState>((set, get) => ({
  records: baseline,
  hydrated: false,

  async hydrate() {
    const stored =
      (await localStorage.getJSON<DailyRecord[]>(STORAGE_KEYS.DAILY_RECORDS)) ?? [];
    set({
      records: [...stored, ...baseline],
      hydrated: true,
    });
  },

  async add(input) {
    const record: DailyRecord = {
      id: `record-${Date.now()}`,
      date: input.date ?? new Date().toISOString(),
      ...input,
      dayType: input.dayType ?? computeDayType(input.painIntensity ?? 0),
    } as DailyRecord;

    const stored =
      (await localStorage.getJSON<DailyRecord[]>(STORAGE_KEYS.DAILY_RECORDS)) ?? [];
    const nextStored = [record, ...stored];
    await localStorage.setJSON(STORAGE_KEYS.DAILY_RECORDS, nextStored);
    set({ records: [...nextStored, ...baseline] });
    return record;
  },

  computeRecommendation(painIntensity, functionalImpactPhysical) {
    if (painIntensity >= 8) {
      return {
        category: 'urgencia',
        message:
          'El dolor es muy intenso. Te sugerimos acudir a urgencia hospitalaria para evaluación inmediata.',
      };
    }
    if (painIntensity >= 6) {
      return {
        category: 'sapu-sar',
        message:
          'Dolor moderado a severo. Consulta SAPU o llama al SAR (600 360 7777) para una evaluación rápida.',
      };
    }
    if (painIntensity >= 4 || functionalImpactPhysical >= 6) {
      return {
        category: 'cesfam-ccr',
        message:
          'Programa una consulta en CESFAM o tu CCR para hacer seguimiento y ajustar el plan.',
      };
    }
    return {
      category: 'autocuidado',
      message:
        'El dolor es leve. Puedes manejarlo con autocuidado y registrar cómo evoluciona.',
    };
  },

  getStats() {
    return computeStats(get().records);
  },

  async reset() {
    await localStorage.remove(STORAGE_KEYS.DAILY_RECORDS);
    set({ records: baseline });
  },
}));
