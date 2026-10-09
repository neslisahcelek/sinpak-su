# Sinpak Su - Siber Güvenlik ve Sistem Güçlendirme Rehberi (SECURITY.md)

Bu doküman, Sinpak Su e-ticaret platformunun siber saldırılara karşı koruma mimarisini, uygulanan aktif savunma mekanizmalarını ve canlıya alım (production) güvenlik adımlarını açıklamaktadır.

---

## 1. Uygulanan Savunma Mimarisi (Defense in Depth)

Sistem 5 bağımsız güvenlik katmanıyla korunmaktadır:

```
[İstemci / Ziyaretçi / Bot]
        │
        ▼
[1. Katman: Vercel Edge / Cloudflare WAF]
  - Otomatik DDoS koruması
  - TLS 1.3 ve HTTP/3 desteği
  - Vercel Firewall Attack Challenge
        │
        ▼
[2. Katman: Next.js Edge Middleware (`src/middleware.ts`)]
  - Tüm /admin rotalarında erken HMAC token denetimi
  - Yetkisiz isteklerin DB sorgusu dahi atılmadan anında reddedilmesi
  - Content Security Policy (CSP), HSTS ve güvenlik başlıkları enjeksiyonu
        │
        ▼
[3. Katman: Hız Sınırlandırması (Rate Limiting) & Bot Koruması]
  - IP ve kimlik bazlı sliding-window hız sınırlayıcı (`src/server/security/rate-limiter.ts`)
  - Admin login: 15 dakikada en fazla 5 deneme (Brute-force kalkanı)
  - Sipariş oluşturma: IP başına 10 dakikada en fazla 5 sipariş (Spam kalkanı)
  - Sipariş sorgulama: IP başına 1 dakikada en fazla 15 sorgu (Numara tarama kalkanı)
  - Pasif Bot Honeypot Form Koruması (`src/server/security/honeypot.ts`)
        │
        ▼
[4. Katman: Sunucu Yetkili İş Mantığı & Kriptografi]
  - İstemciden gelen hiçbir fiyat ve toplam tutar kabul edilmez; tüm hesaplama sunucuda DB fiyatlarıyla yapılır.
  - Çalışma saatleri (09:00 - 19:00 İstanbul) sunucuda zorunludur.
  - Şifreler `scrypt` + 16 byte rastgele tuz (salt) ile özetlenir.
  - Zamanlama analizi saldırılarına (timing attacks) karşı `timingSafeEqual` kullanılır.
  - Dosya yüklemelerinde uzantı değil, gerçek dosya içeriği (Magic Bytes: WebP, PNG, JPEG, GIF, AVIF) doğrulanır.
        │
        ▼
[5. Katman: Veritabanı ve Supabase RLS İzolasyonu]
  - Parametreli Prisma sorguları (SQL Injection imkansızdır).
  - Tahmin edilemez CUID (`publicId`) kullanımı (IDOR engelleme).
  - Sipariş takip ve onayında PII (Ad, telefon, adres) istemciye dönülmez.
  - Supabase PostgREST API anon rolüne karşı Row Level Security (RLS) kalkanı.
```

---

## 2. Supabase Veritabanı Sıkılaştırması (RLS Kapatma)

> [!IMPORTANT]
> Projemiz veritabanına doğrudan PostgreSQL protokolü (`DATABASE_URL`) ve Prisma ORM üzerinden bağlanmaktadır. Supabase'in varsayılan olarak internete açtığı genel REST API (`https://<proje-ref>.supabase.co/rest/v1/`) üzerinden yetkisiz veri okunmasını engellemek için Supabase SQL Editor panelinde aşağıdaki komutları bir defa çalıştırınız:

```sql
-- Tüm tablolarda Row Level Security (RLS) aktif et
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AdminUser" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SupplyCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SupplyProduct" ENABLE ROW LEVEL SECURITY;

-- PostgREST genel kullanıcılarının (anon / authenticated) doğrudan REST API üzerinden
-- okuma veya yazma yapmasını engelle:
REVOKE ALL ON "Order" FROM anon, authenticated;
REVOKE ALL ON "OrderItem" FROM anon, authenticated;
REVOKE ALL ON "AdminUser" FROM anon, authenticated;
REVOKE ALL ON "Product" FROM anon, authenticated;
REVOKE ALL ON "SupplyCategory" FROM anon, authenticated;
REVOKE ALL ON "SupplyProduct" FROM anon, authenticated;
```

Bu işlem web sitenizin çalışmasını **etkilemez**, çünkü Next.js sunucunuz `postgres://` TCP bağlantısı üzerinden yetkili veritabanı kullanıcısıyla çalışır. Ancak dışarıdan gelebilecek olası Supabase REST sızıntılarını tamamen imkansız hale getirir.

---

## 3. Vercel Canlı Ortam Yapılandırması

### A. Vercel Firewall & Attack Mode
1. Vercel kontrol panelinde projenizi açın.
2. **Settings** -> **Security** sekmesine gidin.
3. **Attack Challenge Mode** özelliğini açık tutun veya şüpheli bot trafiği algılandığında tek tıkla aktif edebilirsiniz.

### B. Ortam Değişkenleri (Environment Variables)
* `AUTH_SECRET`: Mutlaka en az 32 karakterlik güçlü bir rastgele dize olmalıdır. Terminalinizde şu komutla üretebilirsiniz:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
* `NEXT_PUBLIC_` önekine sahip değişkenlerin yalnızca istemciye açık olmasında sakınca olmayan bilgiler (örn. GA_ID veya genel alan adı) içerdiğinden emin olun. Asla `DATABASE_URL`, `AUTH_SECRET` veya `SUPABASE_SERVICE_ROLE_KEY` değişkenlerine `NEXT_PUBLIC_` öneki vermeyin.

---

## 4. Olay Müdahalesi (Incident Response)

1. **Yönetici Hesabını Sıfırlama / Yeni Yönetici Ekleme:**
   ```bash
   npm run admin:create
   ```
2. **Şüpheli Bir Yönetici Oturumunu Anında İptal Etme:**
   Veritabanında ilgili kullanıcının `isActive` değerini `false` yapmanız yeterlidir:
   ```sql
   UPDATE "AdminUser" SET "isActive" = false WHERE "username" = 'supheli_kullanici';
   ```
   HMAC çerezi henüz süresi dolmamış olsa dahi bir sonraki istekte oturum geçersiz kılınacaktır.
3. **Tüm Yönetici Oturumlarını Anında Geçersiz Kılma:**
   Vercel ortam değişkenlerinden `AUTH_SECRET` değerini değiştirip projeyi yeniden yayınlayın. Eski anahtarla imzalanmış tüm çerezler derhal geçersiz olacaktır.
