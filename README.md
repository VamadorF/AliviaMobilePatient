# Alivia Mobile

App móvil de Alivia construida con **Expo SDK 54 + React Native 0.81 + TypeScript**, basada en la plantilla `ejoi`. Es el equivalente móvil del frontend Next.js `phonealivia`: conserva el dashboard, el registro diario en 9 pasos, el control de medicamentos y el historial de dolor con gráficos.

Funciona **sin backend real**: incluye una capa de mock con `AsyncStorage` para persistir registros y medicamentos, y `expo-secure-store` para el token de sesión.

---

## Requisitos previos

- **Node.js 20.x** o superior
- **npm 10.x** o superior (o yarn / pnpm)
- **Android Studio** con un emulador configurado o un dispositivo Android conectado por USB con depuración habilitada
- **Java JDK 17** (lo usa Android)
- (opcional) Xcode 15+ para iOS

> Si nunca has corrido `expo run:android`, sigue la guía oficial: [Set up your environment](https://docs.expo.dev/get-started/set-up-your-environment/).

---

## Instalación

Desde la carpeta `alivia-mobile`:

```bash
npm install
```

---

## Ejecutar en Android

```bash
npx expo run:android
```

La primera vez compila la app nativa (puede tardar varios minutos). Luego:

- Para volver a abrir el dev server: `npx expo start`
- Para forzar limpieza de caché: `npx expo start -c`

---

## Variables de entorno

Copia `.env.example` a `.env` o `.env.local` si quieres cambiar la configuración:

```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:3001/api   # IP del emulador Android hacia tu host
EXPO_PUBLIC_USE_MOCK=true                       # true => usa apiMock; false => axios real
```

> En modo **mock** (por defecto) la app funciona sin backend.

---

## Estructura

```
src/
├─ app/
│  ├─ index.tsx                ← root del componente App
│  ├─ navigation/              ← Stack/Tabs (RootNavigator, AuthNavigator, MainTabs, DailyRecordStack)
│  ├─ providers/               ← ThemeProvider, QueryProvider, AuthProvider
│  └─ config/                  ← env y constants (storage keys, etc.)
├─ features/
│  ├─ auth/                    ← Login/Register, store y servicio
│  ├─ dashboard/               ← Pantalla principal con stats + gráfico
│  ├─ daily-record/            ← Wizard de 9 pasos + componentes (BodyMap, FacesPainScale,
│  │                              MedicationWheel, HealthAssistance) + DailyRecordContext
│  ├─ medications/             ← CRUD de medicamentos con AsyncStorage
│  └─ history/                 ← Listado, gráfico y filtros (7d, 30d, todos)
└─ shared/
   ├─ components/              ← Button, Input, Screen, Card, ProgressBar, EmptyState,
   │                              WizardLayout, OptionPill, PainChart
   ├─ services/
   │  ├─ http/                 ← apiClient (axios | mock)
   │  └─ storage/              ← secureStore + asyncStorage helpers
   ├─ theme/                   ← colors, typography, spacing, radius, shadow
   └─ types/                   ← navigation.ts y domain.ts
```

---

## Funcionalidades portadas desde Next.js

- Autenticación con email + contraseña (mock). Si el email contiene `doctor`, `health` o `profesional`, inicia sesión como profesional.
- Dashboard con saludo, KPI cards (dolor promedio, días buenos/malos, adherencia), CTA grande para registrar dolor y gráfico de evolución de 7 días.
- Wizard de **registro diario** (9 pasos) con barra de progreso:
  1. **Ubicación** del dolor con BodyMap SVG (vista frontal y posterior)
  2. **Intensidad** con escala de caras (FPS-R) + slider fino 1-10
  3. **Cualidad** del dolor (chips multi-selección + texto libre)
  4. **Duración** (cantidad + unidad + frecuencia semanal)
  5. **Impacto funcional** (físico, trabajo, social) en escalas 0-10
  6. **Estado emocional** PHQ-2 + GAD-2
  7. **Medicación** tomada + nivel de alivio
  8. **Recomendación** automática (autocuidado / CESFAM-CCR / SAPU-SAR / urgencia) con HealthAssistance
  9. **Resumen y guardado** en AsyncStorage
- **Medicamentos**: CRUD con tipo (analgésico, antiinflamatorio, relajante, otro), dosis, frecuencia y próxima dosis calculada automáticamente.
- **Historial**: filtros 7d/30d/todos, gráfico (líneas o barras), tarjetas con intensidad y áreas.
- Integración con **React Query** para invalidar y refrescar datos al guardar registros.

---

## Tecnologías

- **Navigation**: `@react-navigation/native`, `native-stack`, `bottom-tabs`
- **Estado**: `zustand` (auth, medications), `useReducer` (DailyRecordContext)
- **Datos**: `@tanstack/react-query`
- **Formularios**: `react-hook-form` + `zod` + `@hookform/resolvers`
- **UI**: `react-native-svg`, `expo-linear-gradient`, `@expo/vector-icons` (Ionicons + MaterialIcons)
- **Persistencia**: `expo-secure-store` (token) + `@react-native-async-storage/async-storage` (registros, medicamentos, usuario)
- **HTTP**: `axios` (modo real) | `apiMock.ts` (modo mock)
- **Animaciones**: `react-native-reanimated` 4 + `react-native-worklets` (configurado en `babel.config.js`)
- **Fechas**: `date-fns` (con locale español)

---

## Scripts disponibles

| Script              | Descripción                                  |
| ------------------- | -------------------------------------------- |
| `npm start`         | Inicia el dev server de Expo                 |
| `npm run android`   | `expo run:android` (compila y abre Android)  |
| `npm run ios`       | `expo run:ios` (requiere Xcode)              |
| `npm run web`       | Modo web                                     |
| `npm run lint`      | Linter de Expo                               |

---

## Notas

- El BodyMap está construido con `react-native-svg` (silueta + áreas pulsables superpuestas). 24 zonas anatómicas en cada vista.
- El gráfico (`PainChart`) está implementado en SVG puro para evitar la dependencia adicional de Skia. Soporta líneas y barras.
- El `apiMock` simula latencia de red (~300-400 ms) y persiste los registros del wizard en AsyncStorage para que aparezcan en el historial al instante.
- Para cambiar a un backend real, basta con poner `EXPO_PUBLIC_USE_MOCK=false` y apuntar `EXPO_PUBLIC_API_URL` a tu API.
