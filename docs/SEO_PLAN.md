# Sinpak Su & Tedarik - SEO Stratejisi ve Eylem Planı

Bu belge, Sinpak Su (B2C perakende su dağıtımı) ve Sinpak Tedarik (B2B kurumsal sarf malzeme tedariki) için arama motoru optimizasyonu (SEO), teknik altyapı ve operasyonel yol haritasını özetler.

---

## 1. Temel Hedefler ve Kitle Ayrımı

| Marka | Hedef Kitle | Hizmet Bölgesi | Odak Arama Niyeti |
| :--- | :--- | :--- | :--- |
| **Sinpak Su** | Ev ve küçük ofis müşterileri | İzmit (Merkez, Yahyakaptan, Alikahya, Bekirdere vb.) | Yerel su siparişi, damacana su bayisi, telefonla hızlı sipariş |
| **Sinpak Tedarik** | Fabrikalar, okullar, ofisler, kafe ve restoranlar | İzmit & Kocaeli geneli | Toptan kağıt grubu, kurumsal temizlik sarf malzemeleri, periyodik teslimat |

---

## 2. Hedef Anahtar Kelimeler

### Sinpak Su (Yerel Su Dağıtımı):
- `İzmit su siparişi`
- `damacana su İzmit`
- `Abant Su yetkili bayii İzmit`
- `Sinpak Su`
- `Yahyakaptan damacana su`
- `İzmit en yakın su bayisi`
- `19L damacana su siparişi`

### Sinpak Tedarik (Kurumsal Sarf Malzeme):
- `kurumsal temizlik tedariki İzmit`
- `ofis sarf malzeme Kocaeli`
- `fabrika temizlik ürünleri İzmit`
- `toptan havlu kağıt İzmit`
- `kurumsal su siparişi Kocaeli`
- `toptan damacana su İzmit`

---

## 3. Teknik SEO Altyapısı

### 3.1. Sitemap ve Robots.txt
- **Sitemap URL:** `https://sinpaktedarik.com/sitemap.xml`
  - Kaynak: [src/app/sitemap.ts](file:///c:/Users/Nesli/Belgeler/Clones/sinpak-su/src/app/sitemap.ts)
  - Otomatik olarak ana sayfa (`/`), kurumsal sayfa (`/kurumsal-tedarik`) ve veritabanındaki tüm aktif ürünleri (`/urunler/[slug]`) içerir.
- **Robots.txt:** `https://sinpaktedarik.com/robots.txt`
  - Kaynak: [src/app/robots.ts](file:///c:/Users/Nesli/Belgeler/Clones/sinpak-su/src/app/robots.ts)
  - Gizli sayfaları (`/admin/`, `/checkout`, `/siparis-onay/`, `/siparis-takip`) taramaya kapatır, Googlebot'u doğrudan `sitemap.xml` adresine yönlendirir.

### 3.2. Google Search Console Doğrulaması
- **HTML Doğrulama Dosyası:** `public/google2246d9a51b58da92.html`
- **Meta Tag Doğrulaması:** [src/app/layout.tsx](file:///c:/Users/Nesli/Belgeler/Clones/sinpak-su/src/app/layout.tsx) içinde `google-site-verification` meta etiketi eklendi.
- **Mülk Türü:** Alan adı mülkü (`sinpaktedarik.com`).

### 3.3. Yapılandırılmış Veri (Schema.org JSON-LD)
Arama motorlarının zengin sonuçlar (Rich Snippets) sunabilmesi için uygulanan standartlar:
1. **LocalBusiness & OpeningHours:** Ana sayfada onaylı şirket adı, İzmit adresi, +905513634141 telefon numarası, coğrafi koordinatlar ve 09:00-19:00 çalışma saatleri.
2. **FAQPage:** Ana sayfada sık sorulan sorular (bölge, ödeme yöntemleri, kurumsal cari hesap).
3. **Product & Offer:** Ürün detay sayfalarında (`/urunler/[slug]`) dinamik ürün adı, fiyat, TL para birimi, stok durumu (`InStock`) ve geçerlilik tarihi.
4. **Service:** `/kurumsal-tedarik` sayfasında B2B kurumsal hizmet ve tedarik kategorileri şeması.

### 3.4. Sosyal Medya ve Paylaşım (OpenGraph & Twitter Cards)
- [src/app/layout.tsx](file:///c:/Users/Nesli/Belgeler/Clones/sinpak-su/src/app/layout.tsx) içerisinde WhatsApp ve sosyal ağ paylaşımları için 1200x630 banner görseli (`/images/sinpak-tedarik-banner-clean.jpg`), başlık ve açıklamalar tanımlandı.

### 3.5. Google Analytics 4 (GA4) Desteği
- [src/components/google-analytics.tsx](file:///c:/Users/Nesli/Belgeler/Clones/sinpak-su/src/components/google-analytics.tsx) bileşeni hazırlandı.
- Ortam değişkenine (`.env.local` veya Vercel Settings) `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` eklendiğinde Google Analytics otomatik olarak aktif olur.

---

## 4. Yerel SEO (Local SEO) ve Google İşletme Profili Eylemleri

Organik siparişlerin en büyük kaynağı Google Haritalar'dır. Aşağıdaki bilgilerin birebir Google İşletme Profilinde tutulması zorunludur (NAP Tutarlılığı - Name, Address, Phone):

- **İşletme Adı:** Sinpak Su - Abant Su Yetkili Bayisi (İkinci profil veya kategori: Sinpak Tedarik)
- **Adres:** Yenişehir mah. Asilkent sk. No: 6/A İzmit / Kocaeli
- **Telefon:** 0 551 363 41 41
- **Web Sitesi:** https://sinpaktedarik.com
- **Hizmet Verilen Yerler:** İzmit ve çevre sanayi siteleri
- **Aksiyon:** Müşterilerden Google Haritalar üzerinden yıldızlı yorum ve değerlendirme toplanmalıdır.

---

## 5. Rutin Takip ve Kontrol Listesi

- [ ] **Haftalık:** Google Search Console üzerinden "Performans" sekmesinden hangi arama terimlerinden tık alındığının incelenmesi.
- [ ] **Aylık:** "Sayfalar" sekmesinden dizine eklenmeyen (Noindex, 404, yönlendirme vb.) sayfa olup olmadığının kontrolü.
- [ ] **Ürün Değişikliği:** Yeni ürün eklendiğinde veya fiyat güncellendiğinde `sitemap.xml` ve `Product` Schema'nın doğrulanması.
