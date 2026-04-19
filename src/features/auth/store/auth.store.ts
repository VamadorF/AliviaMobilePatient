import { create } from 'zustand';
import { STORAGE_KEYS } from '@/app/config/constants';
import { localStorage } from '@/shared/services/storage/asyncStorage';
import { secureStorage } from '@/shared/services/storage/secureStore';
import { authService } from '../services/auth.service';
import type { AuthUser, LoginPayload, RegisterPayload } from '../types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  async login(payload) {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authService.login(payload);
      await secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await localStorage.setJSON(STORAGE_KEYS.AUTH_USER, user);
      set({ user, token, isAuthenticated: true, isLoading: false, error: null });
    } catch (err: any) {
      const message = err?.response?.data?.error ?? 'Error al iniciar sesión';
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  async register(payload) {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authService.register(payload);
      await secureStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      await localStorage.setJSON(STORAGE_KEYS.AUTH_USER, user);
      set({ user, token, isAuthenticated: true, isLoading: false, error: null });
    } catch (err: any) {
      const message = err?.response?.data?.error ?? 'Error al registrarse';
      set({ isLoading: false, error: message });
      throw new Error(message);
    }
  },

  async logout() {
    await secureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    await localStorage.remove(STORAGE_KEYS.AUTH_USER);
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  async checkAuth() {
    set({ isLoading: true });
    try {
      const token = await secureStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const savedUser = await localStorage.getJSON<AuthUser>(STORAGE_KEYS.AUTH_USER);
      if (token && savedUser) {
        set({ user: savedUser, token, isAuthenticated: true, isLoading: false });
        return;
      }
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      console.error('Error en checkAuth:', error);
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
