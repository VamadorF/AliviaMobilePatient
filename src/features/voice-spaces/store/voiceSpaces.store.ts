import { create } from 'zustand';
import { mockVoiceSpaces } from '@/shared/services/demo';

export interface VoiceSpace {
  id: string;
  title: string;
  hostName: string;
  description: string;
  scheduledFor: string | null;
  isLive: boolean;
  participants: number;
  channelName: string;
}

export interface VoiceParticipant {
  id: string;
  name: string;
  isHost?: boolean;
  isYou?: boolean;
  /** Avatar pseudo-aleatorio en base a un emoji o color. */
  emoji?: string;
}

interface ActiveSession {
  spaceId: string;
  channelName: string;
  muted: boolean;
  participants: VoiceParticipant[];
}

const baseParticipants: VoiceParticipant[] = [
  { id: 'p-1', name: 'Usuario 1', emoji: '🧑‍💼' },
  { id: 'p-2', name: 'Usuario 2', emoji: '👩‍🦱' },
  { id: 'p-3', name: 'Usuario 3', emoji: '🧑' },
  { id: 'p-4', name: 'Usuario 4', emoji: '👨' },
  { id: 'p-5', name: 'Usuario 5', emoji: '👩‍🦰' },
];

interface VoiceSpacesState {
  spaces: VoiceSpace[];
  active: ActiveSession | null;
  join: (spaceId: string, you: { name: string }) => Promise<void>;
  leave: () => Promise<void>;
  toggleMute: () => Promise<boolean>;
}

export const useVoiceSpacesStore = create<VoiceSpacesState>((set, get) => ({
  spaces: mockVoiceSpaces,
  active: null,

  async join(spaceId, you) {
    const space = get().spaces.find((s) => s.id === spaceId);
    if (!space) return;
    const host: VoiceParticipant = {
      id: 'host',
      name: space.hostName,
      isHost: true,
      emoji: '🩺',
    };
    const me: VoiceParticipant = {
      id: 'me',
      name: `${you.name} (Tú)`,
      isYou: true,
      emoji: '🙂',
    };
    const participants = [host, me, ...baseParticipants];
    set({
      active: {
        spaceId,
        channelName: space.channelName,
        muted: false,
        participants,
      },
    });
  },

  async leave() {
    set({ active: null });
  },

  async toggleMute() {
    const a = get().active;
    if (!a) return false;
    const next = !a.muted;
    set({ active: { ...a, muted: next } });
    return next;
  },
}));
