import { Colors } from '@/shared/theme/colors';

/**
 * Escala de dolor alineada con `Colors.pain` / `status` para modo oscuro.
 */
export const PainScale = {
  none: Colors.pain.none,
  mild: Colors.pain.mild,
  moderate: Colors.pain.moderate,
  severe: Colors.pain.severe,
  verySevere: Colors.pain.verySevere,
  worst: Colors.pain.worst,
  /** Barra tipo arcoíris NRS / caras. */
  gradient: [
    Colors.pain.none,
    Colors.pain.mild,
    Colors.status.warning,
    Colors.pain.severe,
    Colors.status.error,
    Colors.pain.worst,
  ] as const,
  cellIdle: Colors.background.surfaceHigh,
  cellBorderIdle: Colors.border.subtle,
  faceIconIdle: Colors.text.primary,
} as const;

export type IaspBand = { label: string; color: string };

export const iaspBandForValue = (val: number): IaspBand => {
  if (val <= 0) return { label: 'Sin dolor', color: PainScale.none };
  if (val <= 3) return { label: 'Dolor leve', color: PainScale.mild };
  if (val <= 6) return { label: 'Dolor moderado', color: PainScale.moderate };
  if (val <= 9) return { label: 'Dolor severo', color: PainScale.severe };
  return { label: 'El peor dolor imaginable', color: PainScale.worst };
};
