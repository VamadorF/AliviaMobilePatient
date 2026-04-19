import { create } from 'zustand';
import { STORAGE_KEYS } from '@/app/config/constants';
import { localStorage } from '@/shared/services/storage/asyncStorage';
import type { Medication } from '@/shared/types/domain';

interface MedicationsState {
  medications: Medication[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  add: (input: Omit<Medication, 'id'>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  take: (id: string) => Promise<void>;
}

const computeNext = (frequencyHours: number): string => {
  const next = new Date(Date.now() + frequencyHours * 60 * 60 * 1000);
  return next.toISOString();
};

const persist = async (medications: Medication[]) => {
  await localStorage.setJSON(STORAGE_KEYS.MEDICATIONS, medications);
};

export const useMedicationsStore = create<MedicationsState>((set, get) => ({
  medications: [],
  hydrated: false,

  async hydrate() {
    const stored = await localStorage.getJSON<Medication[]>(STORAGE_KEYS.MEDICATIONS);
    set({ medications: stored ?? [], hydrated: true });
  },

  async add(input) {
    const med: Medication = {
      id: `med-${Date.now()}`,
      ...input,
      nextDose: input.nextDose ?? computeNext(input.frequency),
    };
    const next = [med, ...get().medications];
    set({ medications: next });
    await persist(next);
  },

  async remove(id) {
    const next = get().medications.filter((m) => m.id !== id);
    set({ medications: next });
    await persist(next);
  },

  async take(id) {
    const now = new Date().toISOString();
    const next = get().medications.map((m) =>
      m.id === id ? { ...m, lastTaken: now, nextDose: computeNext(m.frequency) } : m,
    );
    set({ medications: next });
    await persist(next);
  },
}));
