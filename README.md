# Sinpak Su

Production-oriented foundation for a retail bottled-water ordering website. Business features are deliberately not included yet.

## Stack

- Next.js (App Router) and React with TypeScript
- Tailwind CSS
- Prisma configured for PostgreSQL
- ESLint and Prettier
- Vitest for unit tests and Playwright for end-to-end tests

## Getting started

1. Copy the environment template: `cp .env.example .env`
2. Set `DATABASE_URL` to your PostgreSQL database connection string.
3. Install dependencies: `npm install`
4. Generate Prisma Client: `npm run db:generate`
5. Start the app: `npm run dev`

To run E2E tests locally for the first time, install Chromium with `npx playwright install chromium`.

## Commands

| Command                | Purpose                                     |
| ---------------------- | ------------------------------------------- |
| `npm run dev`          | Start the local Next.js development server. |
| `npm run lint`         | Run ESLint.                                 |
| `npm run format:check` | Check formatting with Prettier.             |
| `npm run format`       | Format supported files with Prettier.       |
| `npm run typecheck`    | Run TypeScript without emitting files.      |
| `npm test`             | Run Vitest once.                            |
| `npm run test:watch`   | Run Vitest in watch mode.                   |
| `npm run test:e2e`     | Run Playwright end-to-end tests.            |
| `npm run db:generate`  | Generate Prisma Client.                     |
| `npm run db:migrate`   | Create and apply a development migration.   |
| `npm run build`        | Create a production build.                  |

## Project structure

```text
prisma/             Prisma schema and future migrations
src/app/            App Router routes, layouts, and global styles
src/components/     Reusable presentational UI components
src/features/       Feature-specific UI and application logic
src/lib/            Framework-agnostic shared utilities
src/server/         Server-only code, including database access
tests/e2e/          Playwright end-to-end tests
```

## Database

The Prisma schema currently contains only the PostgreSQL datasource and client generator. Add domain models and migrations when product, cart, ordering, authentication, or payment requirements are defined.

## Configuration and documentation

`.env.example` contains safe placeholders only. Keep real credentials in the untracked `.env` file; never expose a secret through a `NEXT_PUBLIC_` variable.

Project documentation is available in `docs/`: the [architecture](docs/ARCHITECTURE.md), [database design](docs/DATABASE.md), [API contract](docs/API.md), [development workflow](docs/DEVELOPMENT.md), [product requirements](docs/PRD.md), and [architecture decisions](docs/DECISIONS.md).
