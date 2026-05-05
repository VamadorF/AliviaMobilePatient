import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/shared/theme/colors';
import { Radius, Spacing } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';

interface PainGuidelinesProps {
  /** Listado de intensidades registradas (0-10), del más antiguo al más reciente */
  values: number[];
}

interface Guideline {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  body: string;
  color: string;
  background: string;
}

const buildGuidelines = (values: number[]): Guideline[] => {
  if (!values.length) {
    return [
      {
        icon: 'create',
        title: 'Empieza tu primer registro',
        body: 'Cuéntanos cómo te sientes hoy para empezar a entender tu dolor.',
        color: Colors.medical.blue,
        background: Colors.raw.sky + '22',
      },
    ];
  }

  const last = values[values.length - 1] ?? 0;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const trendingUp =
    values.length >= 3 &&
    last > (values[values.length - 2] ?? 0) &&
    last > (values[values.length - 3] ?? 0);

  const list: Guideline[] = [];

  if (last >= 8) {
    list.push({
      icon: 'warning',
      title: 'Tu dolor está muy alto',
      body: 'Si no cede, contacta urgencia o llama al SAR (600 360 7777). No estás solo.',
      color: Colors.raw.red,
      background: Colors.raw.red + '22',
    });
  } else if (last >= 6) {
    list.push({
      icon: 'medkit',
      title: 'Dolor importante hoy',
      body: 'Descansa, hidrátate y considera consultar SAPU o tu CESFAM si persiste.',
      color: Colors.raw.coral,
      background: Colors.raw.coral + '22',
    });
  } else if (last >= 4) {
    list.push({
      icon: 'leaf',
      title: 'Dolor moderado',
      body: 'Prueba respiración 4-7-8 y movimiento suave. Registra cómo te sientes después.',
      color: Colors.raw.sky,
      background: Colors.raw.sky + '22',
    });
  } else {
    list.push({
      icon: 'sunny',
      title: 'Hoy estás mejor',
      body: 'Mantén tus rutinas: hidratación, movimiento suave y sueño reparador.',
      color: Colors.raw.mint,
      background: Colors.raw.mint + '22',
    });
  }

  if (trendingUp) {
    list.push({
      icon: 'trending-up',
      title: 'Tu dolor viene subiendo',
      body: 'Revisa qué cambió: sueño, estrés, esfuerzo. Anótalo en tu próximo registro.',
      color: Colors.raw.gold,
      background: Colors.raw.gold + '22',
    });
  } else if (avg <= 3 && values.length >= 4) {
    list.push({
      icon: 'star',
      title: 'Vas estable y bajo',
      body: 'Tu promedio es bajo. Sigue con lo que estás haciendo, te funciona.',
      color: Colors.raw.violet,
      background: Colors.raw.violet + '22',
    });
  }

  return list;
};

export const PainGuidelines: React.FC<PainGuidelinesProps> = ({ values }) => {
  const guidelines = buildGuidelines(values);

  return (
    <View style={styles.wrapper}>
      {guidelines.map((g) => (
        <View
          key={g.title}
          style={[
            styles.row,
            { backgroundColor: g.background, borderColor: `${g.color}55` },
          ]}
        >
          <Ionicons name={g.icon} size={18} color={g.color} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: g.color }]}>{g.title}</Text>
            <Text style={styles.body}>{g.body}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginTop: Spacing.sm, gap: Spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  title: {
    ...Typography.styles.label,
    fontWeight: '700',
    marginBottom: 2,
  },
  body: { color: Colors.text.secondary, fontSize: 12, lineHeight: 16 },
});

export default PainGuidelines;
