---
name: code-review
description: Guidelines and procedure for performing production-grade read-only code reviews based on git diffs, severity levels, and strict approval criteria. Use when conducting a code review or preparing for reviewer agent approval.
---

# Code Review Skill

Perform a production-grade, read-only review. Start with the actual git diff.

Prioritize: security, data integrity, business correctness, authorization, regression risk, test adequacy, architecture, performance, accessibility.

BLOCKER and HIGH findings require changes.

Final verdict must be exactly APPROVED or CHANGES_REQUIRED.
