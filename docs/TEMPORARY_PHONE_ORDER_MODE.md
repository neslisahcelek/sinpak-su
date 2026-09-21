# Geçici Telefonla Sipariş Modu ve Geri Alma Rehberi

Bu doküman, sitede sipariş verme sürecinin geçici olarak **yalnızca telefonla arayarak** (`tel:05513634141`) gerçekleştirilmesi amacıyla yapılan değişiklikleri ve ileride online sepet/sipariş ile WhatsApp butonlarını **tekrar aktif hale getirmek için yapılması gereken adımları** açıklar.

Hiçbir geliştirme veya dosya silinmemiştir; tüm kodlar ilgili dosyalarda açıklayıcı yorum blokları (`/* ... */` veya `{/* ... */}`) içine alınarak korunmuştur.

---

## 1. Değişiklik Yapılan Dosyaların Özeti

| Dosya Yolu                                                                                                                                                  | Geçici Olarak Yapılan İşlem                                                                                                                                                      | Geri Alma Durumu                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| [`src/components/floating-contact-buttons.tsx`](file:///c:/Users/Nesli/Belgeler/Clones/sinpak-su/src/components/floating-contact-buttons.tsx)               | Sağ alttaki WhatsApp butonu `{/* ... */}` içine alındı. Sadece "Hemen Ara" butonu aktif.                                                                                         | Yorum bloğu kaldırılarak geri getirilir.      |
| [`src/features/products/product-card.tsx`](file:///c:/Users/Nesli/Belgeler/Clones/sinpak-su/src/features/products/product-card.tsx)                         | Sağ üstteki hızlı sepete ekle `(+)` butonu ve alt kısımdaki `AddToCartButton` yorum satırına alındı. Yerine doğrudan arama yapan `Telefonla Sipariş` (`tel:...`) butonu eklendi. | Yorum satırı açılıp telefon linki kaldırılır. |
| [`src/features/products/product-detail-order-box.tsx`](file:///c:/Users/Nesli/Belgeler/Clones/sinpak-su/src/features/products/product-detail-order-box.tsx) | Masaüstü ve mobil sticky barda yer alan `AddToCartButton` blokları yorum satırına alındı. Yerlerine doğrudan `Telefonla Sipariş Ver` butonları eklendi.                          | Yorum satırı açılıp telefon linki kaldırılır. |
| [`src/components/header.tsx`](file:///c:/Users/Nesli/Belgeler/Clones/sinpak-su/src/components/header.tsx)                                                   | Üst bardaki sepet ikonu ve sayaç rozeti yorum satırına alındı. Telefonla arama butonu mobilde de görünecek şekilde ayarlandı.                                                    | Sepet butonu yorum bloğundan çıkarılır.       |
| [`src/app/page.tsx`](file:///c:/Users/Nesli/Belgeler/Clones/sinpak-su/src/app/page.tsx)                                                                     | Ürünler alt başlığındaki "sepetinize ekleyin" ifadesi telefon siparişine uyarlandı, orijinal metin yorumda saklandı.                                                             | Orijinal metin satırı geri alınır.            |
| [`src/features/products/product-catalog.test.tsx`](file:///c:/Users/Nesli/Belgeler/Clones/sinpak-su/src/features/products/product-catalog.test.tsx)         | Testlerdeki WhatsApp ve Sepete Ekle assertion'ları telefon moduna uyarlandı; orijinalleri yorumda saklandı.                                                                      | Yorum satırları açılır.                       |
| [`src/components/storefront-layout.test.tsx`](file:///c:/Users/Nesli/Belgeler/Clones/sinpak-su/src/components/storefront-layout.test.tsx)                   | Header içindeki sepet açma butonu kontrolü yerine telefon/takip kontrolleri yapıldı; orijinalleri yorumda saklandı.                                                              | Yorum satırları açılır.                       |

---

## 2. Sistemi Eski Haline (Online Sepet & WhatsApp) Geri Döndürme Adımları

İleride normal online sipariş ve WhatsApp sistemine dönmek istediğinizde aşağıdaki 5 basit adımı takip etmeniz yeterlidir:

### Adım 1: WhatsApp Kayan Butonunu Geri Açma

**Dosya:** `src/components/floating-contact-buttons.tsx`

- Dosyadaki `[GEÇİCİ OLARAK GİZLENDİ - YALNIZCA TELEFONLA SİPARİŞ MODU]` yorum bloğu altındaki `{/*` ve `*/}` etiketlerini kaldırın.
- WhatsApp ikonu ve linki tekrar görünür olacaktır.

### Adım 2: Ürün Kartlarında Sepete Ekle Butonlarını Geri Açma

**Dosya:** `src/features/products/product-card.tsx`

- Üstteki hızlı ekle `(+)` butonunu çevreleyen `{/*` ve `*/}` etiketlerini kaldırın.
- Alttaki `Telefonla Sipariş` `<a>` etiketini kaldırıp, hemen altındaki `{/* <AddToCartButton product={product} disabled={isOutOfStock} /> */}` satırını yorumdan çıkarın.

### Adım 3: Ürün Detay Sayfasında Sepete Ekle Butonunu Geri Açma

**Dosya:** `src/features/products/product-detail-order-box.tsx`

- Masaüstü bölümündeki geçici `<a>` etiketini kaldırıp alttaki `<AddToCartButton product={product} />` bloğunun etrafındaki yorum işaretlerini kaldırın.
- Mobil sticky bardaki geçici `<a>` etiketini kaldırıp alttaki `<AddToCartButton product={product} />` bloğunun yorum işaretlerini kaldırın.

### Adım 4: Header'da Sepet İkonunu Geri Açma

**Dosya:** `src/components/header.tsx`

- `<button onClick={() => setIsCartOpen(true)} ...>` butonunu çevreleyen `{/*` ve `*/}` etiketlerini kaldırın.
- Sepet çekmecesi ve ürün sayısı rozeti tekrar çalışır hale gelecektir.

### Adım 5: Testleri Güncelleme

**Dosya:** `src/features/products/product-catalog.test.tsx`

- `ProductCard` ve `FloatingContactButtons` testlerindeki `[ORİJİNAL ...]` satırlarını açıp `npm test` çalıştırın.

---

## 3. Notlar ve Güvenceler

- Sepet altyapısı (`CartProvider`, `cart-context`, `cart-drawer`), sipariş oluşturma servisi (`order.service.ts`), Meta WhatsApp bildirim entegrasyonu (`whatsapp-meta.service.ts`) ve checkout sayfaları tamamen sağlamdır ve çalışır durumdadır.
- Yalnızca son kullanıcı arayüzü doğrudan telefon aramasına odaklanmıştır.
