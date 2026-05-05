import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DailyRecordProvider } from '@/features/daily-record/context/DailyRecordContext';
import { LocationScreen } from '@/features/daily-record/screens/LocationScreen';
import { IntensityScreen } from '@/features/daily-record/screens/IntensityScreen';
import { QualityScreen } from '@/features/daily-record/screens/QualityScreen';
import { DurationScreen } from '@/features/daily-record/screens/DurationScreen';
import { FunctionalImpactScreen } from '@/features/daily-record/screens/FunctionalImpactScreen';
import { EmotionalStateScreen } from '@/features/daily-record/screens/EmotionalStateScreen';
import { MedicationScreen } from '@/features/daily-record/screens/MedicationScreen';
import { RecommendationScreen } from '@/features/daily-record/screens/RecommendationScreen';
import { SaveScreen } from '@/features/daily-record/screens/SaveScreen';
import { Colors } from '@/shared/theme/colors';
import type { DailyRecordStackParamList } from '@/shared/types/navigation';

const Stack = createNativeStackNavigator<DailyRecordStackParamList>();

export const DailyRecordStack: React.FC = () => (
  <DailyRecordProvider>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: Colors.background.base },
      }}
    >
      <Stack.Screen name="Location" component={LocationScreen} />
      <Stack.Screen name="Intensity" component={IntensityScreen} />
      <Stack.Screen name="Quality" component={QualityScreen} />
      <Stack.Screen name="Duration" component={DurationScreen} />
      <Stack.Screen name="FunctionalImpact" component={FunctionalImpactScreen} />
      <Stack.Screen name="EmotionalState" component={EmotionalStateScreen} />
      <Stack.Screen name="Medication" component={MedicationScreen} />
      <Stack.Screen name="Recommendation" component={RecommendationScreen} />
      <Stack.Screen name="Save" component={SaveScreen} />
    </Stack.Navigator>
  </DailyRecordProvider>
);
