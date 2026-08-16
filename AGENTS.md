# AGENTS.md

## Project

Production-oriented retail bottled water ordering website.

Customers can browse products, manage a cart, submit delivery information, and create orders.
Administrators can manage products and orders.

## Technology

- Next.js
- TypeScript
- React
- Tailwind CSS
- Prisma
- PostgreSQL
- Vitest
- Playwright

## Core rules

1. Correctness and security take priority over speed.
2. Read relevant documentation and inspect existing code before changing code.
3. Keep changes focused; do not refactor unrelated code.
4. Do not introduce dependencies without justification.
5. Avoid `any`; if unavoidable, document why.
6. Never expose secrets to the client.
7. Never trust client-provided prices or totals.
8. Calculate order pricing on the server from database state.
9. Validate all external input on the server.
10. Database changes require Prisma migrations.
11. Business logic must not be hidden inside UI components.
12. Preserve loading, empty, success, and error states.
13. Do not claim completion without running the required checks.

## Documentation

Architecture: `docs/ARCHITECTURE.md`
Database: `docs/DATABASE.md`
API: `docs/API.md`
Development workflow: `docs/DEVELOPMENT.md`
Product requirements: `docs/PRD.md`
Architecture decisions: `docs/DECISIONS.md`

## Agent coordination

Agent execution procedures and role-specific responsibilities are defined in `.agents/rules/` and `.agents/agents/`.

The reviewer must approve changes before a commit is created.

## Definition of done

Before a feature is considered complete:

- lint passes
- typecheck passes
- relevant unit/integration tests pass
- relevant E2E tests pass
- production build passes
- git diff has been inspected
- reviewer verdict is `APPROVED`

Do not commit when the reviewer reports a `BLOCKER` or `HIGH` issue.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
