import { PrismaClient } from "@prisma/client";

const INDEXNOW_KEY =
  process.env.INDEXNOW_KEY || "5b4dd40b7c5541babe8307ca504528dd";
const envUrl = process.env.NEXT_PUBLIC_APP_URL;
const BASE_URL =
  envUrl && !envUrl.includes("localhost")
    ? envUrl
    : "https://sinpaktedarik.com";
const HOST = new URL(BASE_URL).host;

async function main() {
  console.log(`[IndexNow] Gönderim başlatılıyor...`);
  console.log(` - Host: ${HOST}`);
  console.log(` - Anahtar: ${INDEXNOW_KEY}`);
  console.log(` - Doğrulama Dosyası: ${BASE_URL}/${INDEXNOW_KEY}.txt`);

  const urls: string[] = [
    BASE_URL,
    `${BASE_URL}/kurumsal-tedarik`,
    `${BASE_URL}/kurumsal-tedarik/urunler`,
  ];

  const prisma = new PrismaClient();
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
    console.log(
      `[IndexNow] Veritabanından ${products.length} aktif ürün okundu.`
    );
    for (const p of products) {
      urls.push(`${BASE_URL}/urunler/${p.slug}`);
    }
  } catch (err) {
    console.warn(
      `[IndexNow] Veritabanı sorgulanamadı (çevrimdışı olabilir), sadece statik URL'ler gönderilecek:`,
      err
    );
  } finally {
    await prisma.$disconnect().catch(() => {});
  }

  console.log(`[IndexNow] Gönderilecek ${urls.length} URL listesi:`);
  urls.forEach((u) => console.log(`   * ${u}`));

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    console.log(
      `\n[IndexNow] API Yanıt Kodu: ${res.status} (${res.statusText})`
    );
    const text = await res.text();
    if (text) {
      console.log(`[IndexNow] Yanıt: ${text}`);
    }

    if (res.status === 200 || res.status === 202) {
      console.log(
        `\n[IndexNow] BAŞARILI! URL'ler Bing, Yandex, Seznam ve Naver arama motorlarına anında iletildi.`
      );
    } else {
      console.error(
        `\n[IndexNow] UYARI: Beklenmedik durum kodu (${res.status}).`
      );
    }
  } catch (err) {
    console.error(`\n[IndexNow] HATA: İstek gönderilemedi:`, err);
    process.exit(1);
  }
}

main();
