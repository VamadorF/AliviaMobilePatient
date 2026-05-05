import { mockHealthPro, mockUser } from '@/shared/services/demo';
import type { AuthResponse, LoginPayload, RegisterPayload, AuthUser } from '../types';

/**
 * Auth "service" 100% local. Simula la latencia de un login real para que la
 * UI muestre estados de carga, pero nunca habla con un backend. Cuando el
 * backend real esté listo se podrá reemplazar este archivo.
 */

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const isProfessionalEmail = (email?: string): boolean => {
  const e = (email ?? '').toLowerCase();
  return e.includes('doctor') || e.includes('health') || e.includes('profesional');
};

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    await delay(450);
    const isPro = isProfessionalEmail(payload.email);
    const base = isPro ? mockHealthPro : mockUser;
    const user: AuthUser = {
      ...base,
      email: payload.email || base.email,
      hasProfile: true,
    };
    return { user, token: `demo-token-${Date.now()}` };
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    await delay(550);
    const role =
      payload.role === 'DOCTOR' ||
      payload.role === 'PSYCHOLOGIST' ||
      payload.role === 'PHYSIOTHERAPIST'
        ? 'HEALTH_PRO'
        : payload.role ?? 'PATIENT';
    const user: AuthUser = {
      id: `${Date.now()}`,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role,
      specialty: payload.specialty,
      hasProfile: true,
    };
    return { user, token: `demo-token-${Date.now()}` };
  },
};
