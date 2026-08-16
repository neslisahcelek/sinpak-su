---
name: database
description: Database design principles, Prisma schema guidelines, migration rules, invariant modeling, and historical pricing snapshot preservation. Use when designing models, writing migrations, or accessing PostgreSQL via Prisma.
---

# Database Skill

- Model business invariants explicitly where practical.
- Add indexes based on real query patterns.
- Use Prisma migrations for schema changes.
- Never edit production schema manually as a shortcut.
- Avoid destructive migrations unless explicitly approved.
- Preserve historical order pricing.
- OrderItem.unitPrice is a snapshot of the price at purchase time.

An order must remain historically correct after product name or price changes.
