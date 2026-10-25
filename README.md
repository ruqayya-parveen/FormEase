# FormEase

**Fill once. Apply with confidence.**

FormEase is a hackathon demo of an AI-assisted smart form helper for banking, tax and government forms. You save a profile once, and FormEase pre-fills each form from it. You can edit every answer, review everything, and ask an AI to explain any confusing field.

> **This is a demo only.** There is no real authentication, no payments, and no connection to any bank, tax authority or government service. Nothing you enter leaves your device, except the field label sent to the AI server (see below). AI explanations are general information, not legal, tax or financial advice.

## Features

- **Profile:** name, date of birth, email, phone, address, city, postal code, plus optional employment status and income range. A "Load demo data" button fills in a fictional profile.
- **Three form templates** on one reusable form engine:
  - Bank account application (banking)
  - Tax preparation basics (tax)
  - Government ID application (government)
- **Profile-based auto-fill:** matching fields are filled when you start a form, marked "Pre-filled from your profile", and still editable.
- **Dynamic form:** step progress, Back/Next, answers saved between steps and across app restarts.
- **Validation:** required fields, email format, phone number and checkbox declarations. Errors show inline and block Next.
- **Review:** answers grouped by section, missing or invalid fields highlighted, per-section edit, and a confirmation checkbox. Completion is blocked while anything is invalid.
- **Completion:** a mock reference number, the form name and the count of profile-prefilled fields.
- **"Explain this field":** a Gemma-powered explanation and example, with loading, error and retry states. If the server is down or has no API key, the app says AI is unavailable. It never fakes an answer.

## Tech stack

- [Ignite](https://github.com/infinitered/ignite) boilerplate: Expo SDK 55, React Native 0.83, React 19, TypeScript
- React Navigation 7 (native stack)
- State: React Context persisted with `react-native-mmkv`
- AI: a small Express server in `server/` calling Gemma through the Gemini API (`@google/genai`)

## Getting started

Requirements: Node 22 and yarn.

```bash
yarn install
```

### 1. Start the AI server (optional but needed for "Explain this field")

```bash
cd server
npm install
cp .env.example .env     # then set GEMINI_API_KEY in .env
npm run models           # lists the Gemma models your key can use
npm start                # http://localhost:3000
```

Set `GEMMA_MODEL` in `server/.env` to one of the models printed by `npm run models`. Check `curl localhost:3000/health`: it should show `"aiConfigured":true`.

The API key lives only in `server/.env`, which is git-ignored. It is never put in the mobile app.

### 2. Run the app

On the web:

```bash
yarn web
```

On a device or simulator (a dev client is required because the app uses MMKV, so Expo Go does not work):

```bash
yarn ios       # or: yarn android
```

The app calls the AI server at `AI_API_URL` in `app/config/config.dev.ts` (default `http://localhost:3000`).

- Android emulator: use `http://10.0.2.2:3000`, or run `yarn adb`.
- Physical device: use your computer's LAN IP.

## AI endpoint

`POST /api/ai/explain-field`

```json
{ "formType": "banking", "fieldLabel": "Annual income", "fieldHelpText": "Before tax" }
```

Response:

```json
{ "explanation": "...", "example": "..." }
```

Only the form type, field label and help text are sent. The profile and the form answers are never sent. The server returns 503 when no API key is configured, 400 on invalid input and 502 if the model call fails.

## Project structure

```
app/
  components/     FormFieldInput, FieldExplainModal, ChipGroup, StatusPill, ...
  context/        FormEaseContext (profile + responses, MMKV-backed)
  data/           formTemplates.ts, demoProfile.ts
  navigators/     AppNavigator and route types
  screens/        Home, Profile, FormSelection, DynamicForm, Review, Completion
  services/api/   ai.ts (client for the AI server)
  types/          formease.ts (shared types)
  utils/          formValidation.ts
server/           Express + Gemma proxy
```

To add a form template, add an entry to `app/data/formTemplates.ts`. The form screen, validation, review and completion pick it up without other changes.

## Scripts

```bash
yarn compile      # TypeScript check
yarn lint:check   # ESLint
yarn test         # Jest
```

## Status

- Verified: TypeScript, lint, unit tests, the iOS JS bundle, and the AI server (real Gemma responses via `curl`).
- Not verified: the native iOS and Android builds. The app has been run on web only.

## License

Built on the Ignite boilerplate by Infinite Red. See the Ignite repository for its license.
