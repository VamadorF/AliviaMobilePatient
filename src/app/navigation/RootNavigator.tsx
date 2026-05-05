import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthContext } from '@/app/providers/AuthProvider';
import { AuthNavigator } from './AuthNavigator';
import { MainTabs } from './MainTabs';
import { DailyRecordStack } from './DailyRecordStack';
import { Colors } from '@/shared/theme/colors';
import type {
  RootMainStackParamList,
  RootStackParamList,
} from '@/shared/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const MainStack = createNativeStackNavigator<RootMainStackParamList>();

const MainNavigator: React.FC = () => (
  <MainStack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: Colors.background.base },
    }}
  >
    <MainStack.Screen name="Tabs" component={MainTabs} />
    <MainStack.Screen
      name="DailyRecord"
      component={DailyRecordStack}
      options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
    />
  </MainStack.Navigator>
);

export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={Colors.primary.base} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: Colors.background.base },
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.base,
  },
});
