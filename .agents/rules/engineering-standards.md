# Engineering Standards & Workflow

## Priority Order

1. Correctness
2. Security
3. Maintainability
4. Testability
5. Performance
6. Developer convenience

## Pre-Implementation Guidelines

- Inspect existing codebase patterns and structure before authoring code.
- Identify affected modules, data flows, and architectural boundaries.
- Define tests for non-trivial behavior prior to or alongside implementation.

## Implementation Principles

- Prefer small, composable, and focused changes.
- Reuse existing components, utilities, and abstractions.
- Adhere strictly to the global security, validation, pricing, and client/server boundaries specified in `AGENTS.md`.

## Change Boundaries & Decisions

- Do not silently change architecture, database semantics, authentication strategy, or public API contracts.
- Document significant architectural and design decisions in `docs/DECISIONS.md`.
