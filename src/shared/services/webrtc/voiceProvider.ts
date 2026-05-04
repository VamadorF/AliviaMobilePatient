/**
 * Capa de abstracción para integrar proveedores WebRTC sincrónicos
 * (Agora, LiveKit, etc.) con la app. La implementación real se inyecta
 * desde la plataforma usando `setVoiceProvider`. Por defecto, en modo mock,
 * registra eventos en consola y emula entrar/salir de un canal.
 *
 * Uso:
 *   import { voiceProvider } from '@/shared/services/webrtc/voiceProvider';
 *   await voiceProvider.join({ channelName, displayName });
 *   await voiceProvider.leave();
 */

export type VoiceProviderName = 'agora' | 'livekit' | 'mock';

export interface JoinOptions {
  channelName: string;
  displayName: string;
  /** Token corto generado por el backend. Opcional en mock. */
  token?: string;
  /** Si el usuario debe entrar como oyente (sin micrófono). */
  listenerOnly?: boolean;
}

export interface VoiceParticipant {
  id: string;
  displayName: string;
  isSpeaking: boolean;
  isMuted: boolean;
}

export interface VoiceProvider {
  name: VoiceProviderName;
  join(opts: JoinOptions): Promise<void>;
  leave(): Promise<void>;
  toggleMute(): Promise<boolean>;
  /** Consulta los participantes actuales del canal. */
  listParticipants(): Promise<VoiceParticipant[]>;
}

/**
 * Implementación mock por defecto. NO realiza conexiones reales; sirve para
 * desarrollar la UI y validar el flujo end-to-end. Para producción, sustituir
 * por una implementación que envuelva el SDK nativo de Agora / LiveKit.
 */
const mockProvider: VoiceProvider = {
  name: 'mock',
  async join(opts) {
    if (typeof console !== 'undefined') {
      console.info('[voiceProvider:mock] join', opts);
    }
  },
  async leave() {
    if (typeof console !== 'undefined') {
      console.info('[voiceProvider:mock] leave');
    }
  },
  async toggleMute() {
    return false;
  },
  async listParticipants() {
    return [];
  },
};

let activeProvider: VoiceProvider = mockProvider;

export const voiceProvider = {
  get name(): VoiceProviderName {
    return activeProvider.name;
  },
  join(opts: JoinOptions) {
    return activeProvider.join(opts);
  },
  leave() {
    return activeProvider.leave();
  },
  toggleMute() {
    return activeProvider.toggleMute();
  },
  listParticipants() {
    return activeProvider.listParticipants();
  },
};

/** Permite a la capa nativa registrar la implementación real de Agora/LiveKit. */
export const setVoiceProvider = (provider: VoiceProvider): void => {
  activeProvider = provider;
};

export const resetVoiceProvider = (): void => {
  activeProvider = mockProvider;
};
