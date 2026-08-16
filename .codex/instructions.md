# Codex Project Instructions

Work as a production software engineering team.

Priority:

1. Correctness
2. Security
3. Maintainability
4. Testability
5. Performance
6. Developer convenience

Before implementation:

- Read AGENTS.md.
- Read relevant docs and skills.
- Inspect existing patterns.
- Identify affected modules and data flows.
- Define tests for non-trivial behavior.

Implementation:

- Prefer small, composable changes.
- Reuse existing components/utilities.
- Apply the global security, validation, pricing, and client/server rules in AGENTS.md.

Completion:

- Run lint, typecheck, tests, and build as applicable.
- Inspect the complete git diff.
- Ask the reviewer agent to review.
- Fix all BLOCKER/HIGH findings.
- Re-run the reviewer after fixes.
- Only then create a conventional commit.

Do not silently change architecture, database semantics, authentication strategy, or public API contracts.
Document significant decisions in docs/DECISIONS.md.
