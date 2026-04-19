import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { WizardLayout } from '@/shared/components';
import { useDailyRecordData } from '@/features/daily-record/context/DailyRecordContext';
import { BodyMap, BodyViewMode } from '@/features/daily-record/components/BodyMap';
import { Colors } from '@/shared/theme/colors';
import { Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';
import type { DailyRecordStackParamList } from '@/shared/types/navigation';

export const LocationScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<DailyRecordStackParamList>>();
  const { data, updateData } = useDailyRecordData();
  const [view, setView] = useState<BodyViewMode>('frontal');

  const selected = [
    ...(data.primaryPainArea ? [data.primaryPainArea] : []),
    ...data.secondaryPainAreas,
  ];

  const onArea = (area: string) => {
    if (data.primaryPainArea === area) {
      updateData({ primaryPainArea: '' });
      return;
    }
    if (data.secondaryPainAreas.includes(area)) {
      updateData({
        secondaryPainAreas: data.secondaryPainAreas.filter((a) => a !== area),
      });
      return;
    }
    if (!data.primaryPainArea) {
      updateData({ primaryPainArea: area });
    } else {
      updateData({ secondaryPainAreas: [...data.secondaryPainAreas, area] });
    }
  };

  return (
    <WizardLayout
      step={1}
      totalSteps={9}
      title="¿Dónde sientes el dolor?"
      subtitle="Toca las áreas del cuerpo donde sientes dolor"
      onNext={() => navigation.navigate('Intensity')}
      nextDisabled={!data.primaryPainArea}
    >
      <View style={styles.toggleRow}>
        {(['frontal', 'posterior'] as BodyViewMode[]).map((mode) => (
          <Pressable
            key={mode}
            onPress={() => setView(mode)}
            style={[styles.toggleBtn, view === mode && styles.toggleBtnActive]}
          >
            <Text
              style={[styles.toggleText, view === mode && styles.toggleTextActive]}
            >
              {mode === 'frontal' ? 'Vista frontal' : 'Vista posterior'}
            </Text>
          </Pressable>
        ))}
      </View>

      <BodyMap selectedAreas={selected} onAreaClick={onArea} viewMode={view} />

      <View style={styles.usualBox}>
        <Text style={styles.usualLabel}>¿Es el lugar habitual?</Text>
        <View style={styles.usualOptions}>
          {[
            { label: 'Sí', value: true },
            { label: 'No', value: false },
          ].map((opt) => (
            <Pressable
              key={String(opt.value)}
              onPress={() => updateData({ isUsualPlace: opt.value })}
              style={[
                styles.usualOpt,
                data.isUsualPlace === opt.value && styles.usualOptActive,
              ]}
            >
              <Text
                style={[
                  styles.usualOptText,
                  data.isUsualPlace === opt.value && styles.usualOptTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </WizardLayout>
  );
};

const styles = StyleSheet.create({
  toggleRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing.sm },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: Colors.border.light,
    alignItems: 'center',
    backgroundColor: Colors.background.white,
  },
  toggleBtnActive: {
    backgroundColor: Colors.medical.blue,
    borderColor: Colors.medical.blue,
  },
  toggleText: { color: Colors.text.primary, fontWeight: '600' },
  toggleTextActive: { color: Colors.text.white },
  usualBox: { marginTop: Spacing.lg },
  usualLabel: {
    ...Typography.styles.label,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  usualOptions: { flexDirection: 'row', gap: Spacing.sm },
  usualOpt: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border.light,
    alignItems: 'center',
    backgroundColor: Colors.background.white,
  },
  usualOptActive: {
    backgroundColor: Colors.medical.blue,
    borderColor: Colors.medical.blue,
  },
  usualOptText: { color: Colors.text.primary, fontWeight: '700' },
  usualOptTextActive: { color: Colors.text.white },
});

export default LocationScreen;
