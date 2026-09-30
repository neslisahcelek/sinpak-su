---
name: frontend
description: Frontend UI best practices, mobile-first responsive styling, Server/Client component boundaries, accessibility, state handling, and client/server validation boundaries. Use when building or modifying UI components, forms, and pages.
---

# Frontend Skill

- Mobile-first responsive design.
- Prefer server components unless client interactivity requires otherwise.
- Keep client components small.
- Reuse shared UI primitives.
- Use semantic HTML and keyboard-accessible interactions.
- Provide visible focus states.
- Handle loading, empty, error, and success states.
- Avoid unnecessary client-side state.
- **Fixed & Floating Element Clearance**: When using fixed bottom mobile bars (e.g. sticky checkout/order bar), ensure floating buttons are offset vertically (`bottom-24 lg:bottom-6`) or hidden to prevent UI overlap and blocked tap targets.
- **Vector-First Brand Marks**: Prefer pure SVGs for logos and icons over raster images (`.png`/`.jpg`) to eliminate network waterfalls, layout shift, and DPI degradation on Retina/4K displays.
- **SEO & Sitemap Completeness**:
  1. Every new public, indexable App Router route MUST define comprehensive metadata (`title`, `description`, `alternates.canonical`).
  2. Every new public route MUST be immediately registered in `src/app/sitemap.ts` (with appropriate `lastModified`, `changeFrequency`, and `priority`).
  3. Conversely, every URL in `sitemap.ts` must map to an existing, valid Next.js App Router page (no 404 crawler traps).

Client validation is UX only; server validation is authoritative.
Never use browser-calculated totals as authoritative order values.
