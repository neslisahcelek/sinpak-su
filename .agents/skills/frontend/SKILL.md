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
- **Sitemap & Route Parity**: Every URL included in `sitemap.ts` must map to an existing, valid Next.js App Router page.

Client validation is UX only; server validation is authoritative.
Never use browser-calculated totals as authoritative order values.
