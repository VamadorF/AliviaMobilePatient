import axios, { AxiosInstance } from 'axios';
import { Env } from '@/app/config/env';
import { STORAGE_KEYS } from '@/app/config/constants';
import { secureStorage } from '@/shared/services/storage/secureStore';
import { apiMock } from './mock/apiMock';

export interface HttpClient {
  get: (url: string) => Promise<{ data: any }>;
  post: (url: string, data?: any) => Promise<{ data: any }>;
  put: (url: string, data?: any) => Promise<{ data: any }>;
  patch: (url: string, data?: any) => Promise<{ data: any }>;
  delete: (url: string) => Promise<{ data: any }>;
}

const buildAxiosClient = (): HttpClient => {
  const instance: AxiosInstance = axios.create({
    baseURL: Env.apiUrl,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
  });

  instance.interceptors.request.use(async (config) => {
    const token = await secureStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error?.response?.status === 401) {
        await secureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      }
      return Promise.reject(error);
    },
  );

  return {
    get: (url) => instance.get(url),
    post: (url, data) => instance.post(url, data),
    put: (url, data) => instance.put(url, data),
    patch: (url, data) => instance.patch(url, data),
    delete: (url) => instance.delete(url),
  };
};

const httpClient: HttpClient = Env.useMock ? apiMock : buildAxiosClient();

if (Env.useMock) {
  // eslint-disable-next-line no-console
  console.log('Modo MOCK activado: la app funciona sin backend real');
}

export default httpClient;
