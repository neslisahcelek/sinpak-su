# Backend Skill

- Validate all untrusted input.
- Authorize every protected operation.
- Keep business rules in server-side services/modules.
- Return safe, intentional errors.
- Do not expose stack traces or database details.
- Use transactions for logically atomic multi-step writes.
- Prefer idempotent operations where retries are possible.

Order creation must validate identifiers/quantities, load authoritative product state, verify active/availability, calculate prices server-side, and persist atomically where appropriate.
