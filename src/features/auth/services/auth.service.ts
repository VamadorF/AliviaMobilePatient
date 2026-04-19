import httpClient from '@/shared/services/http/apiClient';
import type { AuthResponse, LoginPayload, RegisterPayload, AuthUser } from '../types';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await httpClient.post('/auth/login', payload);
    return res.data as AuthResponse;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const res = await httpClient.post('/auth/register', payload);
    return res.data as AuthResponse;
  },

  async me(): Promise<AuthUser | null> {
    const res = await httpClient.get('/auth/me');
    return (res.data as AuthUser) ?? null;
  },
};
