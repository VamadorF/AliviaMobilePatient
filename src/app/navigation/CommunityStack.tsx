import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommunityScreen } from '@/features/community/screens/CommunityScreen';
import { CommunityDetailScreen } from '@/features/community/screens/CommunityDetailScreen';
import { VoiceSpacesScreen } from '@/features/voice-spaces/screens/VoiceSpacesScreen';
import { VoiceSessionScreen } from '@/features/voice-spaces/screens/VoiceSessionScreen';
import { Colors } from '@/shared/theme/colors';
import type { CommunityStackParamList } from '@/shared/types/navigation';

const Stack = createNativeStackNavigator<CommunityStackParamList>();

export const CommunityStack: React.FC = () => (
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
      name="CommunityHome"
      component={CommunityScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="CommunityDetail"
      component={CommunityDetailScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="VoiceSpaces"
      component={VoiceSpacesScreen}
      options={{ title: 'Espacios de voz' }}
    />
    <Stack.Screen
      name="VoiceSession"
      component={VoiceSessionScreen}
      options={{ headerShown: false, presentation: 'modal' }}
    />
  </Stack.Navigator>
);

export default CommunityStack;
