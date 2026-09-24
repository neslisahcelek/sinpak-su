import fs from "fs";

// Modern corporate vector mark for Pamukkale travertines:
// Cascading crescent pools with bright turquoise waters and pristine white calcite ridges.
const pamukkaleVectorSvg = `
<svg width="64" height="64" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="p-sky" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="50%" stop-color="#0891b2" />
      <stop offset="100%" stop-color="#0d9488" />
    </linearGradient>
    <linearGradient id="p-water-1" x1="16" y1="12" x2="36" y2="24" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#67e8f9" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
    <linearGradient id="p-water-2" x1="8" y1="20" x2="28" y2="34" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#a5f3fc" />
      <stop offset="100%" stop-color="#0891b2" />
    </linearGradient>
    <linearGradient id="p-water-3" x1="18" y1="30" x2="42" y2="44" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
  </defs>

  <!-- Circular container with soft cyan ambient background -->
  <rect width="48" height="48" rx="14" fill="#f0fdfa" stroke="#ccfbf1" stroke-width="1.2" />

  <!-- Travertine Pool 1 (Top Tier) -->
  <path d="M19 14C25 11 35 11 41 16C41 21 32 24 23 22C19 19 18 16 19 14Z" fill="url(#p-water-1)" />
  <path d="M19 14C25 11 35 11 41 16C41 21 32 24 23 22" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
  <path d="M19 14C25 11 35 11 41 16C41 21 32 24 23 22" stroke="#f8fafc" stroke-width="1.5" stroke-linecap="round" />

  <!-- Travertine Pool 2 (Middle Left Tier) -->
  <path d="M7 23C13 18 25 18 31 24C31 30 19 33 9 31C6 28 6 25 7 23Z" fill="url(#p-water-2)" />
  <path d="M7 23C13 18 25 18 31 24C31 30 19 33 9 31" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" />
  <path d="M7 23C13 18 25 18 31 24C31 30 19 33 9 31" stroke="#e2e8f0" stroke-width="1.8" stroke-linecap="round" />

  <!-- Travertine Pool 3 (Lower Front Tier) -->
  <path d="M14 31C22 26 37 26 43 32C43 40 27 44 15 41C12 37 12 33 14 31Z" fill="url(#p-water-3)" />
  <path d="M14 31C22 26 37 26 43 32C43 40 27 44 15 41" stroke="#ffffff" stroke-width="4" stroke-linecap="round" />
  <path d="M14 31C22 26 37 26 43 32C43 40 27 44 15 41" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" />

  <!-- Water sparkle / thermal ripple -->
  <circle cx="28" cy="18" r="1" fill="#ffffff" opacity="0.9" />
  <circle cx="17" cy="27" r="1.2" fill="#ffffff" opacity="0.9" />
  <circle cx="27" cy="36" r="1.4" fill="#ffffff" opacity="0.9" />
</svg>
`;

fs.writeFileSync("public/images/pamukkale-icon-vector.svg", pamukkaleVectorSvg);
console.log("Vector icon generated");
