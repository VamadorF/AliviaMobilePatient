/**
 * Genera icon.png, adaptive-icon.png, favicon.png y splash.png en assets/
 * a partir de assets/images/alivia-logo*.png (ejecutar tras actualizar el arte).
 */
import sharp from "sharp";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const logoPath = join(root, "assets/images/alivia-logo.png");
const wordmarkPath = join(root, "assets/images/alivia-logo-wordmark.png");

const BG = { r: 11, g: 15, b: 26, alpha: 1 }; // #0B0F1A
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };
const SIZE = 1024;
/** ~66 % del lado: zona segura típica del adaptive icon de Android */
const ADAPTIVE_LOGO = Math.round(SIZE * 0.62);
/** Icono de tienda: logo un poco más grande sobre fondo sólido */
const APP_ICON_LOGO = Math.round(SIZE * 0.72);

async function writeCenteredPng(
  sourcePath,
  outPath,
  canvasSize,
  logoMax,
  background,
) {
  const scaled = await sharp(sourcePath)
    .resize(logoMax, logoMax, {
      fit: "contain",
      background: TRANSPARENT,
    })
    .toBuffer();

  await sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background,
    },
  })
    .composite([{ input: scaled, gravity: "center" }])
    .png()
    .toFile(outPath);
}

async function main() {
  await writeCenteredPng(
    logoPath,
    join(root, "assets/icon.png"),
    SIZE,
    APP_ICON_LOGO,
    BG,
  );

  await writeCenteredPng(
    logoPath,
    join(root, "assets/adaptive-icon.png"),
    SIZE,
    ADAPTIVE_LOGO,
    TRANSPARENT,
  );

  const faviconCanvas = 48;
  const faviconLogo = 36;
  await writeCenteredPng(
    logoPath,
    join(root, "assets/favicon.png"),
    faviconCanvas,
    faviconLogo,
    BG,
  );

  const maxSplash = 1200;
  await sharp(wordmarkPath)
    .resize(maxSplash, maxSplash, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .png()
    .toFile(join(root, "assets/splash.png"));

  console.log("OK: assets/icon.png, adaptive-icon.png, favicon.png, splash.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
