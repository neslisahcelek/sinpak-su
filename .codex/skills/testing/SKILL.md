# Testing Skill

## Layers

- Unit: pure business rules and utilities.
- Integration: database/server behavior.
- E2E: critical customer journeys.

Minimum critical journey: Product -> Cart -> Checkout -> Order confirmation.

Test failure paths, not only happy paths. Avoid brittle selectors. Prefer semantic/accessibility selectors in E2E. Keep test data deterministic. Never disable tests to make CI green.
