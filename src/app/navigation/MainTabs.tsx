import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { DashboardScreen } from '@/features/dashboard/screens/DashboardScreen';
import { MedicationsScreen } from '@/features/medications/screens/MedicationsScreen';
import { HistoryScreen } from '@/features/history/screens/HistoryScreen';
import { DailyRecordStack } from './DailyRecordStack';
import { Colors } from '@/shared/theme/colors';
import type { MainTabsParamList } from '@/shared/types/navigation';

const Tab = createBottomTabNavigator<MainTabsParamList>();

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const iconForRoute: Record<keyof MainTabsParamList, IconName> = {
  Dashboard: 'home',
  DailyRecord: 'add-circle',
  Medications: 'medkit',
  History: 'time',
};

export const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.medical.blue,
        tabBarInactiveTintColor: Colors.text.muted,
        tabBarStyle: {
          backgroundColor: Colors.background.white,
          borderTopColor: Colors.border.light,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            name={iconForRoute[route.name as keyof MainTabsParamList]}
            size={route.name === 'DailyRecord' ? 32 : 24}
            color={color}
            style={{ opacity: focused ? 1 : 0.85 }}
          />
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen
        name="DailyRecord"
        component={DailyRecordStack}
        options={{ title: 'Registrar' }}
      />
      <Tab.Screen
        name="Medications"
        component={MedicationsScreen}
        options={{ title: 'Medicamentos' }}
      />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'Historial' }} />
    </Tab.Navigator>
  );
};
