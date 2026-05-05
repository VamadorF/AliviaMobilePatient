import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/shared/theme/colors';
import { Radius, Spacing, Shadow } from '@/shared/theme/spacing';
import { Typography } from '@/shared/theme/typography';
import { Button } from '@/shared/components/Button';

interface HealthAssistanceProps {
  moodPattern?: 'positive' | 'neutral' | 'negative';
  painLevel?: number;
}

const phrases = {
  positive: [
    'Cada día es una oportunidad de mejorar',
    'Estás haciendo un gran trabajo cuidándote',
    'Tu bienestar es importante, sigue así',
    'Pequeños pasos llevan a grandes cambios',
  ],
  neutral: [
    'Recuerda que el autocuidado es fundamental',
    'Tu salud es una prioridad, tómate tu tiempo',
    'Cada registro te acerca a entender mejor tu dolor',
    'Estás en el camino correcto',
  ],
  negative: [
    'Es válido sentirte así, no estás solo',
    'Los días difíciles también pasan',
    'Tu fortaleza es admirable, sigue adelante',
    'Recuerda que hay ayuda disponible cuando la necesites',
  ],
};

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const centers: {
  name: string;
  description: string;
  phone: string;
  when: string;
  icon: IconName;
  colors: [string, string];
}[] = [
  {
    name: 'SAR (Servicio de Atención Remota)',
    description: 'Atención telefónica 24/7 para consultas no urgentes',
    phone: '600 360 7777',
    when: 'Consultas médicas generales, dudas sobre medicamentos',
    icon: 'call',
    colors: Colors.gradient.sky,
  },
  {
    name: 'SAPU (Servicio de Atención Primaria de Urgencia)',
    description: 'Atención de urgencia ambulatoria',
    phone: 'Consultar en tu comuna',
    when: 'Urgencias que no requieren hospitalización',
    icon: 'medkit',
    colors: Colors.gradient.gold,
  },
  {
    name: 'URGENCIA Hospitalaria',
    description: 'Atención de emergencias graves',
    phone: '131',
    when: 'Emergencias graves, dolor intenso, síntomas severos',
    icon: 'warning',
    colors: Colors.gradient.coral,
  },
  {
    name: 'CESFAM (Centro de Salud Familiar)',
    description: 'Atención primaria programada',
    phone: 'Consultar en tu comuna',
    when: 'Controles, seguimiento, recetas',
    icon: 'business',
    colors: Colors.gradient.primary,
  },
];

export const HealthAssistance: React.FC<HealthAssistanceProps> = ({
  moodPattern = 'neutral',
  painLevel = 5,
}) => {
  const randomPhrase = useMemo(() => {
    const list = phrases[moodPattern];
    return list[Math.floor(Math.random() * list.length)];
  }, [moodPattern]);

  const recommended =
    painLevel >= 8 ? centers[2] : painLevel >= 6 ? centers[1] : painLevel >= 4 ? centers[0] : centers[3];

  return (
    <View style={{ gap: Spacing.base }}>
      <View
        style={[
          styles.card,
          styles.cardBordered,
          { backgroundColor: Colors.accentSoft, borderColor: Colors.border.strong },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { backgroundColor: Colors.accentDeep }]}>
            <Ionicons name="heart" size={18} color={Colors.text.onAccent} />
          </View>
          <Text style={styles.cardTitle}>Mensaje del día</Text>
        </View>
        <Text style={styles.phrase}>&ldquo;{randomPhrase}&rdquo;</Text>
      </View>

      <View
        style={[
          styles.card,
          styles.cardBordered,
          { backgroundColor: Colors.primary.soft, borderColor: Colors.border.strong },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { backgroundColor: Colors.primary.deep }]}>
            <Ionicons name="leaf" size={18} color={Colors.text.onAccent} />
          </View>
          <Text style={styles.cardTitle}>Ejercicio respiratorio</Text>
        </View>
        <View style={styles.innerCard}>
          <Text style={styles.subTitle}>Respiración 4-7-8</Text>
          <Text style={styles.bullet}>1. Inhala por la nariz contando hasta 4</Text>
          <Text style={styles.bullet}>2. Mantén la respiración contando hasta 7</Text>
          <Text style={styles.bullet}>3. Exhala por la boca contando hasta 8</Text>
          <Text style={styles.bullet}>4. Repite 4 veces</Text>
        </View>
        <Button label="Iniciar ejercicio" variant="primary" />
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconBox, { backgroundColor: Colors.primary.base }]}>
            <Ionicons name="business" size={18} color={Colors.text.onAccent} />
          </View>
          <Text style={styles.cardTitle}>¿Dónde acudir?</Text>
        </View>

        <LinearGradient colors={recommended.colors} style={styles.recommendCard}>
          <View style={styles.cardHeader}>
            <Ionicons name={recommended.icon} size={22} color={Colors.text.onAccent} />
            <Text style={[styles.cardTitle, { color: Colors.text.onAccent }]}>
              Recomendación para ti
            </Text>
          </View>
          <Text style={styles.recommendName}>{recommended.name}</Text>
          <Text style={styles.recommendDesc}>{recommended.description}</Text>
          <Text style={styles.recommendMeta}>
            <Text style={styles.metaLabel}>Cuándo: </Text>
            {recommended.when}
          </Text>
          <Text style={styles.recommendMeta}>
            <Text style={styles.metaLabel}>Teléfono: </Text>
            {recommended.phone}
          </Text>
        </LinearGradient>

        <Text style={styles.allCenters}>Todos los centros disponibles:</Text>
        {centers.map((center) => {
          const isRecommended = center.name === recommended.name;
          return (
            <View
              key={center.name}
              style={[
                styles.centerRow,
                isRecommended && styles.centerRowActive,
              ]}
            >
              <Ionicons
                name={center.icon}
                size={22}
                color={isRecommended ? Colors.text.onAccent : center.colors[1]}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.centerName,
                    { color: isRecommended ? Colors.text.onAccent : Colors.text.primary },
                  ]}
                >
                  {center.name}
                </Text>
                <Text
                  style={[
                    styles.centerDesc,
                    { color: isRecommended ? 'rgba(11,15,26,0.78)' : Colors.text.muted },
                  ]}
                >
                  {center.description}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: Spacing.base,
    borderRadius: Radius.xl,
    backgroundColor: Colors.background.surfaceElevated,
    ...Shadow.md,
  },
  cardBordered: { borderWidth: 1 },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  iconBox: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  phrase: { fontStyle: 'italic', color: Colors.text.primary, fontSize: 16 },
  innerCard: {
    backgroundColor: Colors.background.surfaceHigh,
    padding: Spacing.sm,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
  },
  subTitle: { fontWeight: '700', marginBottom: 6, color: Colors.text.primary },
  bullet: { color: Colors.text.secondary, fontSize: 14, marginBottom: 2 },
  recommendCard: {
    padding: Spacing.base,
    borderRadius: Radius.lg,
    marginBottom: Spacing.base,
  },
  recommendName: { color: Colors.text.onAccent, fontWeight: '700', marginTop: 4 },
  recommendDesc: { color: 'rgba(11,15,26,0.82)', fontSize: 13 },
  recommendMeta: { color: 'rgba(11,15,26,0.82)', fontSize: 12, marginTop: 4 },
  metaLabel: { fontWeight: '700' },
  allCenters: {
    fontWeight: '600',
    marginBottom: Spacing.sm,
    color: Colors.text.secondary,
  },
  centerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.background.surfaceHigh,
  },
  centerRowActive: {
    backgroundColor: Colors.primary.soft,
    borderColor: Colors.primary.base,
  },
  centerName: { fontSize: 14, fontWeight: '700' },
  centerDesc: { fontSize: 12, marginTop: 2 },
});

export default HealthAssistance;
