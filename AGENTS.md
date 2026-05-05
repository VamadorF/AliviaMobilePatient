# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Alivia Mobile es una app React Native / Expo SDK 54 (TypeScript) de manejo de
dolor crónico. Funciona **100 % en frontend**: no hay backend, no hay red. Todo
está mockeado con stores Zustand + AsyncStorage para que sirva como demo
visualizable. El backend real vivirá en otro repo y se integrará después.

### Running the app

- **Web mode (recomendado en Cloud Agents):** `npx expo start --web --port 8081`
- No hay variables de entorno requeridas. La app arranca sola.

### Lint and type checks

- Lint: `npm run lint` (ejecuta `expo lint`)
- TypeScript: `npx tsc --noEmit`

### Gotchas

- Node.js 20.x es requerido. En Cloud Agents primero
  `source "$HOME/.nvm/nvm.sh"`.
- No hay tests automatizados configurados. Validación = lint + typecheck +
  prueba manual.
- No hay capa HTTP. Cualquier `import httpClient ...` es un error: usa los
  stores en `src/features/*/store` o servicios locales en
  `src/shared/services/demo`.
- Build nativo Android requiere JDK 17 + Android SDK; usa el modo web en
  entornos sin SDK.
