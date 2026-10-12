import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sinpak Su | İzmit Abant Su Siparişi",
    short_name: "Sinpak Su",
    description:
      "İzmit Abant Su yetkili bayisi Sinpak Su. 19L damacana su, pet su ve soğuk içecek siparişi.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: siteConfig.themeColor,
    icons: [
      {
        src: "/icon.jpg",
        sizes: "any",
        type: "image/jpeg",
      },
      {
        src: "/images/pamukkale-badge-squircle.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/pamukkale-symbol.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
