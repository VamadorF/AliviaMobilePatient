import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WizardLayout } from '@/shared/components';
import { useDailyRecordData } from '@/features/daily-record/context/DailyRecordContext';
import { FacesPainScale } from '@/features/daily-record/components/FacesPainScale';
import type { DailyRecordStackParamList } from '@/shared/types/navigation';

export const IntensityScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DailyRecordStackParamList>>();
  const { data, updateData } = useDailyRecordData();

  return (
    <WizardLayout
      step={2}
      totalSteps={9}
      title="¿Qué tan intenso es el dolor?"
      subtitle="Selecciona la cara que mejor represente tu dolor actual"
      onBack={() => navigation.goBack()}
      onNext={() => navigation.navigate('Quality')}
    >
      <FacesPainScale
        value={data.painIntensity}
        onChange={(v) => updateData({ painIntensity: v })}
        size="lg"
      />
    </WizardLayout>
  );
};

export default IntensityScreen;
