/**
 * Imágenes empaquetadas por Metro (origen en `assets/images`, sincronizadas desde `public/images`).
 * Usar siempre estos `require` para que funcionen en iOS, Android y web.
 */
export const AppImages = {
  aliviaLogo: require('../../../assets/images/alivia-logo.png'),
  aliviaLogoWordmark: require('../../../assets/images/alivia-logo-wordmark.png'),
  bodyFrontal: require('../../../assets/images/body/frontal.png'),
  bodyLateral: require('../../../assets/images/body/lateral.png'),
  bodyPosterior: require('../../../assets/images/body/posterior.png'),
} as const;
