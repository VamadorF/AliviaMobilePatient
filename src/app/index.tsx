import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

import { navigationRef } from '@/app/navigation/navigationRef';
import { RootNavigator } from '@/app/navigation/RootNavigator';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { ThemeProvider } from '@/app/providers/ThemeProvider';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <QueryProvider>
            <AuthProvider>
              <NavigationContainer ref={navigationRef}>
                <StatusBar style="dark" />
                <RootNavigator />
              </NavigationContainer>
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
