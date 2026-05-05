/**
 * Paleta Alivia · Modo oscuro vibrante.
 *
 * Filosofía: dark mode profundo con un verde menta eléctrico como acento
 * principal y acentos de violeta, coral y oro para enriquecer cada sección
 * sin caer en la monotonía. Está pensada para celulares, con suficiente
 * contraste para texto pequeño y leyendas.
 */

const DARK = {
  /** Fondo base de toda la app: casi negro con un matiz cool. */
  bg: '#0B0F1A',
  /** Superficie de tarjetas elevadas (level 1). */
  surface: '#161B26',
  /** Superficie elevada para modales / hover (level 2). */
  surfaceElevated: '#1E2433',
  /** Superficie alta para chips, inputs, etc. */
  surfaceHigh: '#252B38',
  /** Bordes sutiles entre superficies. */
  border: '#252B38',
  /** Bordes con un poco más de contraste. */
  borderStrong: '#323849',
  /** Overlay para modales (semi-transparente). */
  overlay: 'rgba(5, 8, 15, 0.78)',
};

const ACCENT = {
  /** Verde menta eléctrico - acción primaria y estado activo. */
  mint: '#22E5A0',
  mintDark: '#10C886',
  mintDeep: '#0E9F73',
  mintSoft: 'rgba(34, 229, 160, 0.16)',

  /** Violeta para AlivIA IA, comunidad y secundario. */
  violet: '#B58CFF',
  violetDeep: '#8B6BFF',
  violetSoft: 'rgba(181, 140, 255, 0.16)',

  /** Coral / naranja cálido para alertas suaves y rachas. */
  coral: '#FF8A75',
  coralDeep: '#FF6B5B',
  coralSoft: 'rgba(255, 138, 117, 0.16)',

  /** Oro suave para medallas y destacados positivos. */
  gold: '#FFCB47',
  goldDeep: '#F0A92B',
  goldSoft: 'rgba(255, 203, 71, 0.16)',

  /** Cielo eléctrico para info / equipo médico. */
  sky: '#5AC8FF',
  skyDeep: '#3BA8E0',
  skySoft: 'rgba(90, 200, 255, 0.16)',

  /** Rosa para cuidado emocional. */
  pink: '#FF7AC1',
  pinkSoft: 'rgba(255, 122, 193, 0.18)',

  /** Rojo - únicamente errores serios y dolor extremo. */
  red: '#FF6479',
  redDeep: '#E5435C',
  redSoft: 'rgba(255, 100, 121, 0.18)',
};

export const Colors = {
  /** Fondos / superficies (modo oscuro). */
  background: {
    base: DARK.bg,
    surface: DARK.surface,
    surfaceElevated: DARK.surfaceElevated,
    surfaceHigh: DARK.surfaceHigh,
    overlay: DARK.overlay,

    // Aliases legacy para compatibilidad con código existente.
    white: DARK.surface,
    light: DARK.bg,
    gray: DARK.surfaceHigh,
  },

  border: {
    subtle: DARK.border,
    strong: DARK.borderStrong,

    // Aliases legacy.
    light: DARK.border,
    medium: DARK.borderStrong,
    dark: DARK.borderStrong,
  },

  text: {
    primary: '#F5F7FB',
    secondary: '#C4CADB',
    muted: '#8A92A8',
    light: '#5A627A',
    white: '#FFFFFF',
    onAccent: '#0B0F1A',
    link: ACCENT.mint,
  },

  /** Acción primaria (verde menta). */
  primary: {
    base: ACCENT.mint,
    hover: ACCENT.mintDark,
    deep: ACCENT.mintDeep,
    soft: ACCENT.mintSoft,
  },

  /** Acento secundario (violeta). */
  accent: ACCENT.violet,
  accentSoft: ACCENT.violetSoft,
  accentDeep: ACCENT.violetDeep,

  /** Tokens semánticos por dominio. */
  medical: {
    blue: ACCENT.sky,
    cyan: ACCENT.sky,
    teal: ACCENT.mint,
    green: ACCENT.mint,
    purple: ACCENT.violet,
    pink: ACCENT.pink,
    orange: ACCENT.coral,
    red: ACCENT.red,
    yellow: ACCENT.gold,
  },

  status: {
    success: ACCENT.mint,
    warning: ACCENT.gold,
    error: ACCENT.red,
    info: ACCENT.sky,
  },

  /** Escala de dolor (suave-mínimo a severo). */
  pain: {
    none: ACCENT.sky,
    mild: ACCENT.mint,
    moderate: ACCENT.gold,
    severe: ACCENT.coral,
    verySevere: ACCENT.coralDeep,
    worst: ACCENT.redDeep,
  },

  /** Acentos crudos (para gradientes / iconografía decorativa). */
  raw: {
    mint: ACCENT.mint,
    mintDark: ACCENT.mintDark,
    violet: ACCENT.violet,
    violetDeep: ACCENT.violetDeep,
    coral: ACCENT.coral,
    coralDeep: ACCENT.coralDeep,
    gold: ACCENT.gold,
    goldDeep: ACCENT.goldDeep,
    sky: ACCENT.sky,
    skyDeep: ACCENT.skyDeep,
    pink: ACCENT.pink,
    red: ACCENT.red,
    redDeep: ACCENT.redDeep,
  },

  /** Pares de gradientes listos para usar. */
  gradient: {
    primary: [ACCENT.mint, ACCENT.mintDeep] as [string, string],
    violet: [ACCENT.violet, ACCENT.violetDeep] as [string, string],
    coral: [ACCENT.coral, ACCENT.coralDeep] as [string, string],
    gold: [ACCENT.gold, ACCENT.goldDeep] as [string, string],
    sky: [ACCENT.sky, ACCENT.skyDeep] as [string, string],
    aurora: [ACCENT.violet, ACCENT.mint] as [string, string],
    sunset: [ACCENT.coral, ACCENT.violet] as [string, string],
    streak: [ACCENT.coral, ACCENT.gold] as [string, string],
    surface: [DARK.surfaceElevated, DARK.surface] as [string, string],
  },
} as const;

export type ColorKey = keyof typeof Colors;
