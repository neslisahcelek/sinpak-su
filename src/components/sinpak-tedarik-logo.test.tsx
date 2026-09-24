import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { SinpakTedarikLogo, SinpakTedarikIcon } from "./sinpak-tedarik-logo";

describe("SinpakTedarikLogo", () => {
  it("renders brand name and pure vector travertine icon by default", () => {
    const html = renderToString(<SinpakTedarikLogo size="md" />);

    expect(html).toContain("Sinpak");
    expect(html).toContain("Tedarik");
    expect(html).toContain("Kurumsal Temizlik Hizmetleri");
    expect(html).toContain("<svg");
    expect(html).toContain("p-water-top");
  });

  it("renders raster symbol when useVector is false", () => {
    const html = renderToString(<SinpakTedarikLogo size="sm" useVector={false} />);

    expect(html).toContain("Sinpak");
    expect(html).toContain("Tedarik");
    expect(html).toContain("Pamukkale Travertenleri Simgesi");
  });

  it("renders standalone SinpakTedarikIcon with custom size", () => {
    const html = renderToString(<SinpakTedarikIcon size={32} />);

    expect(html).toContain("<svg");
    expect(html).toContain('width="32"');
    expect(html).toContain('height="32"');
  });
});
