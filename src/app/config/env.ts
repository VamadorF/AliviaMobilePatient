import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;

const useMockFromEnv = process.env.EXPO_PUBLIC_USE_MOCK;
const apiUrlFromEnv = process.env.EXPO_PUBLIC_API_URL;

export const Env = {
  apiUrl:
    apiUrlFromEnv && apiUrlFromEnv.length > 0
      ? apiUrlFromEnv
      : 'http://localhost:3001/api',
  useMock:
    typeof useMockFromEnv === 'string'
      ? useMockFromEnv !== 'false'
      : (extra.useMock as boolean | undefined) ?? true,
} as const;
