# Sinpak Su & Tedarik - Yerel SEO (Local SEO) Operasyon Rehberi

Bu rehber, Sinpak Su ve Sinpak Tedarik işletmelerinin İzmit ve Kocaeli bölgesindeki yerel aramalarda (Google Haritalar, Apple Haritalar, Yandex Haritalar ve Siri) en üst sırada çıkması için atılacak **tamamen ücretsiz** adımları açıklar.

---

## 1. Temel İlke: NAP Tutarlılığı (Name, Address, Phone)

Arama motorları (Google, Apple, Yandex), bir yerel işletmenin güvenilirliğini web sitesindeki bilgiler ile harita dizinlerindeki bilgilerin **birebir harfi harfine aynı** olmasıyla ölçer:

- **İşletme Adı:** Sinpak Su - Abant Su Yetkili Bayisi (Tedarik için: Sinpak Tedarik)
- **Adres:** Yenişehir mah. Asilkent sk. No: 6/A İzmit / Kocaeli
- **Telefon:** 0 545 454 34 77 (Sinpak Su & Tedarik Doğrudan Sipariş Hattı)
- **Web Sitesi:** https://sinpaktedarik.com
- **Çalışma Saatleri:** Pazartesi - Pazar: 09:00 - 19:00

---

## 2. Apple Business Connect (Apple Haritalar & Siri)

İzmit'teki iPhone kullanıcıları Haritalar uygulamasında su aradığında veya Siri'ye _"Bana en yakın su bayisini bul"_ dediğinde Sinpak Su'nun logonuz ve arama butonunuzla çıkmasını sağlar. **%100 ücretsizdir.**

### Adım Adım Kurulum:

1. **Giriş:** [businessconnect.apple.com](https://businessconnect.apple.com) adresine gidin ve Apple Kimliğinizle (Apple ID) giriş yapın.
2. **İşletme Ekleme:** "Add Location" (Konum Ekle) seçeneğine tıklayın.
3. **Bilgileri Girin:**
   - **İşletme Adı:** `Sinpak Su - Abant Su Yetkili Bayisi`
   - **Kategori:** `Su Dağıtım Hizmeti` (_Water Delivery Service_) veya `İçecek Mağazası` (_Beverage Store_).
   - **Adres:** `Yenişehir mah. Asilkent sk. No: 6/A İzmit, Kocaeli`
   - **Telefon:** `+90 545 454 34 77`
   - **Web Sitesi:** `https://sinpaktedarik.com`
4. **Görseller & Logo:**
   - Projedeki `public/images/logo.jpg` veya `public/images/sinpak-pamukkale-logo.jpg` logosunu yükleyin.
   - `public/images/sinpak-tedarik-banner-clean.jpg` kapak görselini ekleyin.
5. **Eylem Butonu (Action Button):**
   - Apple Haritalar kartınıza "Ara" (_Call_) butonu ekleyin (Doğrudan `tel:05454543477` ile bağlanır).
6. **Doğrulama:** Apple genellikle telefon araması (otomatik kod) veya resmi vergi levhası/fatura yüklemesi ile işletmeyi 24-48 saat içinde onaylar.

---

## 3. Yandex Business (Yandex Haritalar & Yandex Navigasyon)

Türkiye'de araç içi navigasyon ve haritada Yandex çok yaygın kullanılmaktadır. Yandex Haritalar'a eklenen işletmeler Yandex Navigasyon aramalarında da doğrudan görünür.

### Adım Adım Kurulum:

1. **Giriş:** [yandex.com.tr/business](https://yandex.com.tr/business) veya [yandex.com.tr/haritalar/sprav](https://yandex.com.tr/haritalar/sprav) adresine gidin.
2. **Yeni İşletme Ekle:**
   - **Ad:** `Sinpak Su - Abant Su Yetkili Bayisi İzmit`
   - **Faaliyet Alanı:** `Su Dağıtımı` / `Damacana Su Satışı`.
   - **Adres:** Haritada pini Yenişehir Mah. Asilkent Sk. No: 6/A konumuna bırakın.
   - **Telefon:** `0545 454 34 77`
   - **Web Sitesi:** `https://sinpaktedarik.com`
3. **Yandex Webmaster Doğrulaması:**
   - [webmaster.yandex.com](https://webmaster.yandex.com) adresine gidin ve sitenizi ekleyin.
   - Size verilen doğrulama kodunu `.env.local` veya Vercel ortam değişkenine `YANDEX_SITE_VERIFICATION=kod` olarak girin.
   - `src/app/layout.tsx` dosyamız bu meta etiketini otomatik olarak `<meta name="yandex-verification" content="..." />` şeklinde sunmaya hazırdır.
   - _Not:_ IndexNow entegrasyonumuz sayesinde sitede yayınlanan her sayfa zaten Yandex'e otomatik gitmektedir.

---

## 4. Google İşletme Profili (Google Haritalar & Local 3-Pack)

Yerel organik aramaların en büyük hacmi Google Haritalar'dan gelir. "İzmit su siparişi" dendiğinde harita kutusunda ilk 3'e (Local 3-Pack) girmek için taktikler:

1. **İkincil Kategori:**
   - Birincil Kategori: `Su Dağıtım Hizmeti`
   - İkincil Kategori: `Toptancı` veya `Temizlik Malzemeleri Satıcısı` (Sinpak Tedarik için).
2. **Hizmet Verilen Bölgeler:**
   - Profilde sadece İzmit değil, mahalleleri de tek tek ekleyin: _Yahyakaptan, Alikahya, Bekirdere, Yenişehir, Yeşilova, Plajyolu, Sanayi Sitesi, Kocaeli geneli_.
3. **Haftalık Fotoğraf Yükleme:**
   - Haftada 1 kez araç, depo veya ürün fotoğrafı yüklemek Google algoritmasına işletmenin "aktif ve açık" olduğunu gösterir.
4. **Yorum Toplama Rutini:**
   - Teslimat yapılan müşterilere WhatsApp üzerinden:
     _"Sinpak Su'yu tercih ettiğiniz için teşekkür ederiz! Deneyiminizi 1 dakikada Google Haritalar'da paylaşmak ister misiniz? [Yorum Linki]"_
     mesajı gönderilerek 5 yıldızlı yerel yorum sayısı artırılmalıdır.

---

## 5. Web Sitesi Tarafında Tamamlanan Teknik Altyapı

Web siteniz yerel arama botları için şu tekniklerle güçlendirilmiştir:

1. **Coğrafi Meta Etiketleri (`src/app/layout.tsx`):**
   - `<meta name="geo.region" content="TR-41" />`
   - `<meta name="geo.placename" content="İzmit, Kocaeli" />`
   - `<meta name="geo.position" content="40.7667;29.9500" />`
   - `<meta name="ICBM" content="40.7667, 29.9500" />`
2. **Genişletilmiş LocalBusiness Şeması (`src/app/(su)/page.tsx`):**
   - Mahalle bazlı `areaServed` listesi (Yahyakaptan, Alikahya, Bekirdere, vb.).
   - Google Haritalar koordinat ve yol tarifi bağlantısı (`hasMap`).
   - Çalışma saatleri (09:00 - 19:00) ve müşteri hizmetleri iletişim noktası.
3. **PWA & Hızlı Arama:**
   - Mobil kullanıcılar için "Uygulamayı Yükle" desteği.
   - Arama ve WhatsApp butonlarına basıldığında çalışan GA4 yerel dönüşüm takibi.
