export const APP_NAME = 'Alivia';
export const APP_VERSION = '1.0.0';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'alivia.auth.token',
  AUTH_USER: 'alivia.auth.user',
  MEDICATIONS: 'alivia.medications',
  DAILY_RECORDS: 'alivia.daily.records',
} as const;

/**
 * Umbral de dolor crítico. Si el nivel registrado es mayor o igual a este valor,
 * el flujo de registro diario salta los pasos no esenciales (Quality, Duration,
 * FunctionalImpact) y redirige directamente a la pantalla de guardado para
 * desplegar mitigación pasiva.
 */
export const CRITICAL_PAIN_THRESHOLD = 8;
