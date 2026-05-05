import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from '@/features/dashboard/screens/DashboardScreen';
import { HistoryScreen } from '@/features/history/screens/HistoryScreen';
import { MedicationsScreen } from '@/features/medications/screens/MedicationsScreen';
import { Colors } from '@/shared/theme/colors';
import type { DashboardStackParamList } from '@/shared/types/navigation';

const Stack = createNativeStackNavigator<DashboardStackParamList>();

export const DashboardStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: Colors.background.base },
      headerTitleStyle: { color: Colors.text.primary },
      headerTintColor: Colors.text.primary,
      headerShadowVisible: false,
      contentStyle: { backgroundColor: Colors.background.base },
    }}
  >
    <Stack.Screen
      name="DashboardHome"
      component={DashboardScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="History"
      component={HistoryScreen}
      options={{ title: 'Historial' }}
    />
    <Stack.Screen
      name="Medications"
      component={MedicationsScreen}
      options={{ title: 'Medicamentos' }}
    />
  </Stack.Navigator>
);

export default DashboardStack;
