import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Screen } from './Screen';
import { ProgressBar } from './ProgressBar';
import { Button } from './Button';
import { Colors } from '@/shared/theme/colors';
import { Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';

interface WizardLayoutProps {
  title: string;
  subtitle?: string;
  step: number;
  totalSteps: number;
  children: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  backLabel?: string;
  nextDisabled?: boolean;
  loading?: boolean;
  hideNext?: boolean;
  onClose?: () => void;
}

export const WizardLayout: React.FC<WizardLayoutProps> = ({
  title,
  subtitle,
  step,
  totalSteps,
  children,
  onBack,
  onNext,
  nextLabel = 'Siguiente',
  backLabel = 'Anterior',
  nextDisabled = false,
  loading = false,
  hideNext = false,
  onClose,
}) => {
  return (
    <Screen scroll padded background={Colors.background.light}>
      <View style={styles.headerRow}>
        <Pressable
          onPress={onBack}
          hitSlop={12}
          disabled={!onBack}
          style={[styles.iconBtn, !onBack && styles.iconBtnHidden]}
        >
          <Ionicons name="chevron-back" size={26} color={Colors.text.primary} />
        </Pressable>
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>
            Paso {step} de {totalSteps}
          </Text>
        </View>
        <Pressable
          onPress={onClose}
          hitSlop={12}
          disabled={!onClose}
          style={[styles.iconBtn, !onClose && styles.iconBtnHidden]}
        >
          <Ionicons name="close" size={24} color={Colors.text.muted} />
        </Pressable>
      </View>

      <ProgressBar progress={step / totalSteps} color={Colors.medical.blue} />

      <View style={styles.titleBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.content}>{children}</View>

      <View style={styles.footer}>
        {onBack ? (
          <View style={styles.btnHalf}>
            <Button
              label={backLabel}
              variant="outline"
              onPress={onBack}
              leftIcon={<Ionicons name="chevron-back" size={18} color={Colors.medical.blue} />}
            />
          </View>
        ) : null}
        {!hideNext && onNext ? (
          <View style={onBack ? styles.btnHalf : styles.btnFull}>
            <Button
              label={nextLabel}
              onPress={onNext}
              loading={loading}
              disabled={nextDisabled}
              rightIcon={<Ionicons name="chevron-forward" size={18} color={Colors.text.white} />}
            />
          </View>
        ) : null}
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnHidden: { opacity: 0 },
  stepBadge: {
    backgroundColor: Colors.medical.blue,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 999,
  },
  stepText: {
    color: Colors.text.white,
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
  },
  titleBlock: { marginVertical: Spacing.lg },
  title: { ...Typography.styles.h2, color: Colors.text.primary },
  subtitle: { ...Typography.styles.body, color: Colors.text.muted, marginTop: 4 },
  content: { flex: 1, marginBottom: Spacing.lg },
  footer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.base,
    marginBottom: Spacing.lg,
  },
  btnHalf: { flex: 1 },
  btnFull: { flex: 1 },
});
