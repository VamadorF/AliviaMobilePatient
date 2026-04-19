import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isWeb = Platform.OS === 'web';

export const secureStorage = {
  async setItem(key: string, value: string): Promise<void> {
    if (isWeb) {
      await AsyncStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },

  async getItem(key: string): Promise<string | null> {
    if (isWeb) {
      return AsyncStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },

  async removeItem(key: string): Promise<void> {
    if (isWeb) {
      await AsyncStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};
