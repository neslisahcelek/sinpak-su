# Verification and Review Workflow

Execute the standard project verification and reviewer approval process before committing changes.

## Steps

1. **Static Analysis & Typecheck**
   - Run formatting check: `npm run format:check`
   - Run linter: `npm run lint`
   - Run typecheck: `npm run typecheck`

2. **Automated Testing & Build**
   - Run unit tests: `npm test`
   - Run end-to-end tests: `npm run test:e2e`
   - Run production build: `npm run build`

3. **Inspect Changes**
   - Inspect the working tree status: `git status`
   - Review the complete git diff: `git diff`

4. **Reviewer Evaluation**
   - Perform a strict code review following the criteria in `.agents/agents/reviewer.md` and `.agents/skills/code-review/SKILL.md`.
   - Ensure there are no `BLOCKER` or `HIGH` severity findings.
   - If findings are reported, resolve them and re-run verification until verdict is `APPROVED`.
