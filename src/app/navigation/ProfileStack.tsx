import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from '@/features/profile/screens/ProfileScreen';
import { Colors } from '@/shared/theme/colors';
import type { ProfileStackParamList } from '@/shared/types/navigation';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStack: React.FC = () => (
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
      name="ProfileHome"
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default ProfileStack;
