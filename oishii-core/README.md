# Oishii

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

Your personal recipe collection app. Organize, discover, and share recipes with AI-powered imports.

---

## Features

- **AI Recipe Import** — Paste any URL or text, AI extracts the recipe
- **Multilingual** — Tags auto-translate across languages (EN, NL)
- **Smart Organization** — 370+ official tags across 15 categories
- **Social** — Follow friends and discover what they're cooking
- **PWA Ready** — Install on mobile for an app-like experience

## Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env

# Run database migrations
pnpm db:migrate

# Start development server
pnpm dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm lint` | Run ESLint |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Push database schema |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Database | PostgreSQL + Drizzle ORM |
| Auth | Custom JWT implementation |
| i18n | next-intl |
| AI | OpenAI API |

## Project Structure

```
app/                 # Next.js pages and API routes
components/          # React components
  ├── form/          # Form inputs
  ├── specific/      # Feature components
  └── ui/            # Generic UI components
db/                  # Database schema
features/            # Business logic (commands/queries)
i18n/                # Internationalization
lib/                 # Utilities and services
```

---

<p align="center">
  <sub>Made with love for home cooks everywhere</sub>
</p>
