import sharp from "sharp";

async function createSimplifiedLogo() {
  const inputPath = "C:/Users/Nesli/.gemini/antigravity-ide/brain/4d03d991-a962-4ef1-9f7a-fb4711fc9966/.user_uploaded/media_1790264871443.jpg";
  
  // 1. Remove address and phone from the photo:
  // In the photo (1024x433):
  // "Sinpak Tedarik" is at y: 60-155, x: 580-980
  // "Yenişehir Mah..." is at y: 220-300, x: 690-980
  // "Osman Çelek..." is at y: 350-420, x: 800-980
  
  // Sample the natural background color around the text area (which is soft pale sky #f2f7fb to white)
  // Let's create patches to seamlessly cover the address and phone with the exact background color gradient
  const bgPatch = Buffer.from(
    `<svg width="1024" height="433">
      <defs>
        <linearGradient id="sky-clean" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="50%" stop-color="#f8fafc" />
          <stop offset="100%" stop-color="#f1f5f9" />
        </linearGradient>
      </defs>
      <!-- Cover address area -->
      <rect x="680" y="210" width="340" height="110" fill="url(#sky-clean)" />
      <!-- Cover phone & leaf area -->
      <rect x="750" y="340" width="270" height="90" fill="url(#sky-clean)" />
    </svg>`
  );

  const cleanPhoto = await sharp(inputPath)
    .composite([{ input: bgPatch, blend: "over" }])
    .toBuffer();

  await sharp(cleanPhoto).jpeg({ quality: 95 }).toFile("public/images/sinpak-tedarik-pamukkale-clean.jpg");

  // 2. Create the Pamukkale Travertine Symbol (Squircle / Rounded Icon)
  // Extracting the most scenic travertine terrace cascade from the photo (width: 360, height: 360)
  const travertineCrop = await sharp(inputPath)
    .extract({ left: 110, top: 40, width: 360, height: 360 })
    .resize(180, 180, { fit: "cover" })
    .toBuffer();

  const squircleMask = Buffer.from(
    `<svg width="180" height="180">
      <rect x="0" y="0" width="180" height="180" rx="44" ry="44" fill="#fff" />
    </svg>`
  );

  await sharp(travertineCrop)
    .composite([{ input: squircleMask, blend: "dest-in" }])
    .png()
    .toFile("public/images/pamukkale-symbol.png");

  // 3. Also create a compact horizontal navbar logo banner (Height 80px)
  // Showing the Pamukkale travertines with "Sinpak Tedarik" in high contrast
  await sharp(cleanPhoto)
    .extract({ left: 0, top: 15, width: 1024, height: 215 })
    .resize(400, 84, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile("public/images/sinpak-tedarik-pamukkale-nav.png");

  console.log("Assets created successfully!");
}

createSimplifiedLogo().catch(console.error);
