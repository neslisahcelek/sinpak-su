import sharp from "sharp";
async function main() {
  // Let's create an ultra-crisp circular/squircle Pamukkale travertine logo medallion from the pristine photo!
  // In the photo media_1790264871443.jpg:
  // The left half (0 to 600 width, out of 1024) is the magnificent Pamukkale travertines!
  const image = sharp("C:/Users/Nesli/.gemini/antigravity-ide/brain/4d03d991-a962-4ef1-9f7a-fb4711fc9966/.user_uploaded/media_1790264871443.jpg");
  const metadata = await image.metadata();
  console.log("Metadata:", metadata);

  // Crop the focal point of the Pamukkale terraces (tiered pools with turquoise water and white cliffs)
  // Let's extract a square 400x400 around the best travertine terrace cascade
  const cropped = await sharp("C:/Users/Nesli/.gemini/antigravity-ide/brain/4d03d991-a962-4ef1-9f7a-fb4711fc9966/.user_uploaded/media_1790264871443.jpg")
    .extract({ left: 80, top: 10, width: 420, height: 420 })
    .resize(256, 256, { fit: "cover" })
    .toBuffer();

  // Create a rounded badge / circular emblem with high-end border
  const roundedCorners = Buffer.from(
    `<svg width="256" height="256">
      <defs>
        <clipPath id="squircle">
          <rect x="0" y="0" width="256" height="256" rx="64" ry="64" />
        </clipPath>
      </defs>
      <rect x="0" y="0" width="256" height="256" rx="64" ry="64" fill="#fff" />
    </svg>`
  );

  const masked = await sharp(cropped)
    .composite([{ input: roundedCorners, blend: "dest-in" }])
    .png()
    .toFile("public/images/pamukkale-badge-squircle.png");

  console.log("Badge created:", masked);
}

main().catch(console.error);
