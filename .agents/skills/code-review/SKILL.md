---
name: code-review
description: Guidelines and procedure for performing production-grade read-only code reviews based on git diffs, severity levels, and strict approval criteria. Use when conducting a code review or preparing for reviewer agent approval.
---

# Code Review Skill

Perform a production-grade, read-only review. Start with the actual git diff.

Prioritize: security, data integrity, business correctness, authorization, regression risk, test adequacy, architecture, performance, accessibility.

## Critical Inspection Checklist

1. **Git & Asset Completeness**: Inspect `git status` for untracked files. Flag as HIGH/BLOCKER if tracked code references untracked components, scripts, or assets (`public/*`) that would break remote CI/CD or produce 404s.
2. **Mobile Overlay & Floating Collision**: Inspect pages pairing fixed bottom elements (e.g., mobile sticky order/checkout bar) with floating action buttons (`FloatingContactButtons`). Ensure adequate vertical offset (`bottom-24` vs `bottom-6`) or conditional rendering.
3. **Route & Sitemap Integrity**: Ensure every URL emitted by `sitemap.ts` or metadata alternates corresponds to an actual registered Next.js App Router route (preventing 404 crawler traps).
4. **Vector-First Assets**: Prefer vector SVGs for brand marks over raster images to eliminate layout shifts, DPI blur, and asset load latency.

BLOCKER and HIGH findings require changes.

Final verdict must be exactly APPROVED or CHANGES_REQUIRED.
