import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Button, Input, Screen } from '@/shared/components';
import { Colors } from '@/shared/theme/colors';
import { Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { AppImages } from '@/shared/assets/images';
import type { AuthStackParamList } from '@/shared/types/navigation';

const schema = z.object({
  email: z.string().email('Ingresa un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type FormValues = z.infer<typeof schema>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await login(values);
    } catch (err: any) {
      setServerError(err?.message ?? 'Error al iniciar sesión');
    }
  };

  return (
    <Screen scroll padded={false} keyboardAware background={Colors.medical.blue}>
      <LinearGradient
        colors={[Colors.medical.blue, Colors.medical.purple, Colors.medical.pink]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <Image
              source={AppImages.aliviaLogoWordmark}
              style={styles.logoImage}
              resizeMode="contain"
              accessibilityLabel="Alivia"
            />
          </View>
          <Text style={styles.welcome}>Bienvenido a Alivia</Text>
          <Text style={styles.subtitle}>Tu plataforma de manejo de dolor crónico</Text>
        </View>

        <View style={styles.card}>
          {serverError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{serverError}</Text>
            </View>
          ) : null}

          <Controller
            control={control}
            name="email"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Email"
                placeholder="tu@email.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                leftIcon={<Ionicons name="mail" size={18} color={Colors.primary.base} />}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Contraseña"
                placeholder="••••••••"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                leftIcon={<Ionicons name="lock-closed" size={18} color={Colors.primary.base} />}
              />
            )}
          />

          <Button
            label="Iniciar sesión"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            leftIcon={<Ionicons name="heart" size={18} color={Colors.text.onAccent} />}
          />

          <Pressable onPress={() => navigation.navigate('Register')} style={styles.linkRow}>
            <Text style={styles.linkText}>¿No tienes cuenta? </Text>
            <Text style={[styles.linkText, styles.linkBold]}>Regístrate</Text>
          </Pressable>

          <Text style={styles.tip}>
            Tip: usa cualquier email y contraseña (modo mock). Si el email contiene
            &quot;doctor&quot; o &quot;profesional&quot; se iniciará como profesional.
          </Text>
        </View>
      </LinearGradient>
    </Screen>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing['2xl'],
    justifyContent: 'center',
  },
  header: { alignItems: 'center', marginBottom: Spacing.xl },
  logoBox: {
    width: 200,
    maxWidth: '100%',
    height: 72,
    borderRadius: 16,
    backgroundColor: Colors.background.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.base,
    paddingHorizontal: Spacing.sm,
  },
  logoImage: { width: '100%', height: '100%' },
  welcome: {
    ...Typography.styles.h1,
    color: Colors.text.white,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.styles.body,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.background.surfaceElevated,
    borderRadius: 24,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  errorBox: {
    backgroundColor: 'rgba(255, 100, 121, 0.12)',
    borderLeftWidth: 4,
    borderLeftColor: Colors.status.error,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.base,
  },
  errorText: { color: Colors.status.error, fontWeight: '600' },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  linkText: { color: Colors.primary.base, fontSize: 14 },
  linkBold: { fontWeight: '700' },
  tip: {
    marginTop: Spacing.lg,
    textAlign: 'center',
    color: Colors.text.muted,
    fontSize: 12,
    fontStyle: 'italic',
  },
});
