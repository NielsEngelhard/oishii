# Oishii Core - Developer Guide

## Project Overview

This is a Next.js 16 recipe-sharing application with React 19, using Drizzle ORM with PostgreSQL.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm lint         # Run ESLint
pnpm db:generate  # Generate Drizzle migrations
pnpm db:migrate   # Push database schema
```

---

## Internationalization (i18n)

This project uses **next-intl** for multi-language support with type-safe translations.

### Supported Languages
- **English (en)** - Default/fallback language
- **Dutch (nl)**

### File Structure

```
i18n/
  config.ts           # Locale configuration (locales, defaultLocale)
  request.ts          # next-intl server configuration
  types.ts            # TypeScript type augmentation for type-safety
  messages/
    en.json           # English translations (SOURCE OF TRUTH)
    nl.json           # Dutch translations
```

### Type-Safe Translations

All translation keys are type-checked at compile time. The `en.json` file is the source of truth - TypeScript types are derived from it.

```tsx
// Usage in client components
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('auth');  // namespace

  return <h1>{t('welcomeBack')}</h1>;  // type-checked key
}
```

### Adding New Labels

1. **Add to English first** - Add the new key to `i18n/messages/en.json`
2. **Add translations** - Add the corresponding key to `i18n/messages/nl.json`
3. **Use in component** - Import `useTranslations` and use the key

```json
// i18n/messages/en.json
{
  "recipe": {
    "myNewLabel": "My new label text"
  }
}
```

```tsx
// In your component
const t = useTranslations('recipe');
<span>{t('myNewLabel')}</span>
```

### Message Namespaces

Messages are organized by namespace:

| Namespace | Purpose |
|-----------|---------|
| `common` | Shared labels (loading, cancel, save, etc.) |
| `auth` | Authentication (login, signup, password, etc.) |
| `header` | Navigation labels |
| `recipe` | Recipe-related labels |
| `aiImport` | AI import feature |
| `profile` | Profile page labels |
| `languages` | Language names |
| `validation` | Form validation messages |

### Adding a New Language

1. Add the locale code to `i18n/config.ts`:
   ```typescript
   export const locales = ['en', 'nl', 'de'] as const;  // Add 'de'
   ```

2. Create the message file: `i18n/messages/de.json`
   - Copy the structure from `en.json`
   - Translate all values

3. Add the language name to all message files:
   ```json
   // In each messages/*.json
   "languages": {
     "en": "English",
     "nl": "Nederlands",
     "de": "Deutsch"
   }
   ```

### Fallback Behavior

- If a translation is missing, the English version is used
- If English is also missing, the key path is displayed (e.g., `auth.unknownKey`)
- The app never crashes due to missing translations

### Language Selection

- **Signup**: Users select their language during registration
- **Storage**: Language is stored in the `users.language` database column
- **Cookie**: The `NEXT_LOCALE` cookie syncs the language for SSR
- **Sync**: AuthContext automatically syncs user language to cookie on load

### API Endpoints

- `POST /api/user/language` - Update user's language preference
  - Body: `{ "language": "nl" }`
  - Updates database and sets cookie

---

## Database Schema

Using Drizzle ORM with PostgreSQL. Schema files are in `db/schemas/`.

### Users Table

```typescript
usersTable {
  id: serial
  name: text
  email: text (unique)
  password: text (hashed)
  language: text (default: 'en')
  createdAt: timestamp
}
```

---

## Project Structure

```
app/                    # Next.js App Router pages and API routes
components/
  form/                 # Form components (Input, Select, etc.)
  specific/             # Feature-specific components
  ui/                   # Generic UI components
contexts/               # React contexts (AuthContext)
db/                     # Database schema and config
features/               # Business logic commands/queries
i18n/                   # Internationalization
lib/                    # Utilities and services
models/                 # TypeScript interfaces
schemas/                # Zod validation schemas
```
