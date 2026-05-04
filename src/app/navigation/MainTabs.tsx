import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DashboardScreen } from '@/features/dashboard/screens/DashboardScreen';
import { MedicationsScreen } from '@/features/medications/screens/MedicationsScreen';
import { HistoryScreen } from '@/features/history/screens/HistoryScreen';
import { ChatScreen } from '@/features/chat/screens/ChatScreen';
import { DailyRecordStack } from './DailyRecordStack';
import { CommunityStack } from './CommunityStack';
import { Colors } from '@/shared/theme/colors';
import type {
  MainTabsParamList,
  RootMainStackParamList,
} from '@/shared/types/navigation';

const Tab = createBottomTabNavigator<MainTabsParamList>();
const RootStack = createNativeStackNavigator<RootMainStackParamList>();

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const iconForRoute: Record<keyof MainTabsParamList, IconName> = {
  Dashboard: 'home',
  Community: 'people',
  DailyRecord: 'add-circle',
  Chat: 'chatbubbles',
  History: 'time',
};

const TabsInner: React.FC = () => {
  const insets = useSafeAreaInsets();
  const tabBarBaseHeight = 64;
  const tabBarBasePaddingBottom = 8;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.medical.blue,
        tabBarInactiveTintColor: Colors.text.muted,
        tabBarStyle: {
          backgroundColor: Colors.background.white,
          borderTopColor: Colors.border.light,
          height: tabBarBaseHeight + insets.bottom,
          paddingBottom: tabBarBasePaddingBottom + insets.bottom,
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
        name="Community"
        component={CommunityStack}
        options={{ title: 'Comunidad' }}
      />
      <Tab.Screen
        name="DailyRecord"
        component={DailyRecordStack}
        options={{ title: 'Registrar' }}
      />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'Historial' }} />
    </Tab.Navigator>
  );
};

export const MainTabs: React.FC = () => (
  <RootStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: Colors.background.light },
      headerTintColor: Colors.text.primary,
      headerShadowVisible: false,
    }}
  >
    <RootStack.Screen
      name="Tabs"
      component={TabsInner}
      options={{ headerShown: false }}
    />
    <RootStack.Screen
      name="Medications"
      component={MedicationsScreen}
      options={{ title: 'Medicamentos' }}
    />
  </RootStack.Navigator>
);
