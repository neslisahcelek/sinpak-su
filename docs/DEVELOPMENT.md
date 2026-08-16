# Development Workflow

1. Define/confirm requirements.
2. Read relevant docs and skills.
3. Inspect existing implementation.
4. Implement the smallest complete change.
5. Add/update tests.
6. Run lint.
7. Run typecheck.
8. Run tests.
9. Run build.
10. Inspect git diff.
11. Run reviewer agent.
12. Fix BLOCKER/HIGH findings.
13. Run reviewer again.
14. Commit only after approval.

## Conventional Commits

feat:, fix:, refactor:, test:, docs:, chore:

No commit before reviewer verdict APPROVED.

CI independently runs formatting, lint, typecheck, unit tests, E2E tests, and production build. AI approval never replaces CI.
