import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Button, Input, Screen, OptionPill } from '@/shared/components';
import { Colors } from '@/shared/theme/colors';
import { Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { AppImages } from '@/shared/assets/images';
import type { AuthStackParamList } from '@/shared/types/navigation';

const schema = z.object({
  firstName: z.string().min(2, 'Ingresa tu nombre'),
  lastName: z.string().min(2, 'Ingresa tu apellido'),
  email: z.string().email('Ingresa un email válido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  role: z.enum(['PATIENT', 'HEALTH_PRO']),
});

type FormValues = z.infer<typeof schema>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'PATIENT',
    },
  });

  const role = watch('role');

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await register(values);
    } catch (err: any) {
      setServerError(err?.message ?? 'Error al registrarse');
    }
  };

  return (
    <Screen scroll padded={false} keyboardAware background={Colors.medical.purple}>
      <LinearGradient
        colors={[Colors.medical.purple, Colors.medical.blue, Colors.medical.teal]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} color={Colors.text.white} />
          </Pressable>
          <View style={styles.registerLogoWrap}>
            <Image
              source={AppImages.aliviaLogo}
              style={styles.registerLogo}
              resizeMode="contain"
              accessibilityLabel="Alivia"
            />
          </View>
          <Text style={styles.title}>Crea tu cuenta</Text>
          <Text style={styles.subtitle}>Regístrate para comenzar a registrar tu dolor</Text>
        </View>

        <View style={styles.card}>
          {serverError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{serverError}</Text>
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>Tipo de cuenta</Text>
          <View style={styles.rolesRow}>
            <OptionPill
              label="Paciente"
              selected={role === 'PATIENT'}
              onPress={() => setValue('role', 'PATIENT')}
            />
            <OptionPill
              label="Profesional"
              selected={role === 'HEALTH_PRO'}
              onPress={() => setValue('role', 'HEALTH_PRO')}
            />
          </View>

          <Controller
            control={control}
            name="firstName"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Nombre"
                placeholder="Juan"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.firstName?.message}
                leftIcon={<Ionicons name="person" size={18} color={Colors.primary.base} />}
              />
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Apellido"
                placeholder="Pérez"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.lastName?.message}
                leftIcon={<Ionicons name="people" size={18} color={Colors.primary.base} />}
              />
            )}
          />

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
            label="Crear cuenta"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            leftIcon={<Ionicons name="person-add" size={18} color={Colors.text.onAccent} />}
          />

          <Pressable
            onPress={() => navigation.navigate('Login')}
            style={styles.linkRow}
          >
            <Text style={styles.linkText}>¿Ya tienes cuenta? </Text>
            <Text style={[styles.linkText, styles.linkBold]}>Inicia sesión</Text>
          </Pressable>
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
  header: { marginBottom: Spacing.lg },
  backBtn: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerLogoWrap: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  registerLogo: { width: '100%', height: '100%' },
  title: {
    ...Typography.styles.h2,
    color: Colors.text.white,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  subtitle: {
    ...Typography.styles.body,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
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
  sectionTitle: {
    ...Typography.styles.label,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  rolesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.base,
    flexWrap: 'wrap',
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  linkText: { color: Colors.primary.base, fontSize: 14 },
  linkBold: { fontWeight: '700' },
});
