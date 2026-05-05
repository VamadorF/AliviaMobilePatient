# Alivia Mobile

App móvil de **Alivia** — apoyo para personas con dolor crónico — construida
con **Expo SDK 54 + React Native 0.81 + TypeScript**.

> Esta versión del repositorio es **frontend-only**: no contiene capa HTTP ni
> dependencias de backend. Sirve como demo visualizable y showcase del diseño.
> El backend real vivirá en un repositorio aparte y se integrará más adelante.

---

## Funciona sin backend

Toda la información (dashboard, historial, comunidad, chat AlivIA IA,
medicamentos, espacios de voz) se mantiene en **stores Zustand** con
persistencia local (`AsyncStorage`). No se hace ninguna petición de red.

## Requisitos previos

- **Node.js 20.x** o superior
- **npm 10.x** o superior
- (Android nativo) **Android Studio** + **JDK 17**
- (iOS nativo) **Xcode 15+**

## Instalación

```bash
npm install
```

## Ejecutar

| Plataforma | Comando                          |
| ---------- | -------------------------------- |
| Web (demo) | `npx expo start --web`           |
| Android    | `npx expo run:android`           |
| iOS        | `npx expo run:ios`               |

> En modo web la app bundle-a en la primera petición; la primera carga puede
> tomar 10–20 s.

## Estructura

```
src/
├─ app/
│  ├─ index.tsx            ← root del componente App
│  ├─ navigation/          ← Stack/Tabs (RootNavigator, MainTabs, etc.)
│  ├─ providers/           ← ThemeProvider, QueryProvider, AuthProvider
│  └─ config/              ← constants (storage keys)
├─ features/
│  ├─ auth/                ← Login/Register + store + servicio mock
│  ├─ dashboard/           ← Pantalla de inicio "Diario"
│  ├─ daily-record/        ← Wizard de 9 pasos + store de registros
│  ├─ medications/         ← CRUD de medicamentos
│  ├─ history/             ← Historial con gráficos
│  ├─ community/           ← Comunidad + posts
│  ├─ voice-spaces/        ← Salas de voz (UI mockeada)
│  ├─ chat/                ← Chat AlivIA IA / Equipo médico
│  └─ profile/             ← Perfil de usuario, medallas, settings
└─ shared/
   ├─ components/          ← Button, Input, Screen, Card, ...
   ├─ services/
   │  ├─ demo/             ← Datos mock (catálogo, comunidades, etc.)
   │  └─ storage/          ← AsyncStorage + SecureStore helpers
   ├─ theme/               ← colors, typography, spacing, radius, shadow
   └─ types/               ← navigation.ts y domain.ts
```

## Tech stack

- Navigation · `@react-navigation/native`, native-stack, bottom-tabs
- State · `zustand` (auth, medications, dailyRecords, community, chat, voice)
- Forms · `react-hook-form` + `zod`
- UI · `react-native-svg`, `expo-linear-gradient`, `@expo/vector-icons`
- Persistencia · `expo-secure-store` (token) + `@react-native-async-storage/async-storage`
- Animaciones · `react-native-reanimated` 4
- Fechas · `date-fns` (locale español)

## Tema

La app usa un **dark mode profundo** (fondo casi negro con matiz azul) y un
acento verde menta eléctrico para acciones primarias, complementado por
violeta, coral, oro y celeste para enriquecer cada sección. Definido en
`src/shared/theme/colors.ts`.

## Demo / login

En la pantalla de login puedes usar **cualquier email y contraseña**: la app
te dejará entrar como paciente. Si tu email contiene `doctor`,
`profesional` o `health`, entras como profesional.
