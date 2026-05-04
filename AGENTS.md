# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Alivia Mobile is a React Native / Expo SDK 54 pain management app (TypeScript). It works **fully in mock mode** by default — no backend required. See `README.md` for full architecture and scripts.

### Running the app

- **Web mode (recommended for Cloud Agents):** `npx expo start --web --port 8081` — no Android SDK/emulator needed.
- The `.env` file should have `EXPO_PUBLIC_USE_MOCK=true` (copy from `.env.example` if missing).
- The web server bundles on first request; initial page load may take 10-20 seconds.

### Lint and type checks

- Lint: `npm run lint` (runs `expo lint`)
- TypeScript: `npx tsc --noEmit`
- Both pass cleanly (lint has only warnings, no errors).

### Gotchas

- Node.js 20.x is required. The environment needs nvm configured: `source "$HOME/.nvm/nvm.sh"` before using `node`/`npm`/`npx`.
- There are no automated tests (no test runner configured). Validation is via lint + type checking + manual testing.
- The app has no backend dependency in mock mode. If `EXPO_PUBLIC_USE_MOCK=false`, it expects a REST API at `EXPO_PUBLIC_API_URL`.
- Android native build (`expo run:android`) requires JDK 17 + Android SDK — not available in Cloud Agent VMs. Use web mode instead.
