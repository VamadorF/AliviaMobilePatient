import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommunityScreen } from '@/features/community/screens/CommunityScreen';
import { VoiceSpacesScreen } from '@/features/voice-spaces/screens/VoiceSpacesScreen';
import { Colors } from '@/shared/theme/colors';
import type { CommunityStackParamList } from '@/shared/types/navigation';

const Stack = createNativeStackNavigator<CommunityStackParamList>();

export const CommunityStack: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: Colors.background.light },
      headerTintColor: Colors.text.primary,
      headerShadowVisible: false,
    }}
  >
    <Stack.Screen
      name="CommunityHome"
      component={CommunityScreen}
      options={({ navigation }) => ({
        title: 'Comunidad',
        headerRight: () => (
          <Pressable
            onPress={() => navigation.navigate('VoiceSpaces')}
            hitSlop={8}
          >
            <Ionicons name="mic-circle" size={24} color={Colors.medical.purple} />
          </Pressable>
        ),
      })}
    />
    <Stack.Screen
      name="VoiceSpaces"
      component={VoiceSpacesScreen}
      options={{ title: 'Espacios de voz' }}
    />
  </Stack.Navigator>
);

export default CommunityStack;
