import { expect, test } from "@playwright/test";

test.describe("Customer Checkout Flow", () => {
  test("shows empty cart state when visiting checkout with no items", async ({
    page,
  }) => {
    await page.goto("/checkout");
    await expect(
      page.getByRole("heading", { name: "Sepetiniz Boş" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Ürünleri İncele" })
    ).toBeVisible();
  });

  test("adds product to cart and adjusts empty damacana return with deposit calculation", async ({
    page,
  }) => {
    await page.goto("/");

    // Find and add Damacana product to cart
    const damacanaCard = page.locator("article", { hasText: "19L Damacana" });
    await expect(damacanaCard).toBeVisible();
    await damacanaCard.getByRole("button", { name: "Sepete Ekle" }).click();

    // Open Cart Drawer
    await page.getByRole("button", { name: "Sepeti aç" }).click();
    await expect(page.getByRole("dialog", { name: "Sepetiniz" })).toBeVisible();

    // With 1 damacana and 0 empty returned, deposit notice is shown
    await expect(page.getByText("depozito")).toBeVisible();

    // Select 1 empty bottle returned (depozitosuz)
    const select = page.getByLabel("İade Boş Damacana:");
    await select.selectOption("1");
    await expect(
      page.getByText("Depozitosuz (Tüm boş damacanalar iade edilecek)")
    ).toBeVisible();

    // Click Siparişi Tamamla
    await page.getByRole("link", { name: "Siparişi Tamamla" }).click();
    await expect(page).toHaveURL("/checkout");
    await expect(
      page.getByRole("heading", { name: "Siparişi Tamamla" })
    ).toBeVisible();
  });

  test("validates form fields and handles checkout submission", async ({
    page,
  }) => {
    await page.goto("/");

    // Add a product to cart
    const addBtn = page
      .locator("article")
      .first()
      .getByRole("button", { name: "Sepete Ekle" });
    await addBtn.click();

    // Navigate to checkout
    await page.goto("/checkout");
    await expect(
      page.getByRole("heading", { name: "Siparişi Tamamla" })
    ).toBeVisible();

    // Submit without filling required fields
    await page.getByRole("button", { name: "Siparişi Ver" }).click();

    // Should show validation errors
    await expect(
      page.getByText("Ad soyad en az 2 karakter olmalıdır.")
    ).toBeVisible();
    await expect(page.getByText("Telefon numarası zorunludur.")).toBeVisible();
    await expect(
      page.getByText("Teslimat adresi en az 5 karakter olmalıdır.")
    ).toBeVisible();

    // Fill valid data
    await page.getByPlaceholder("Adınız ve Soyadınız").fill("Deneme Müşteri");
    await page.getByPlaceholder("05XX XXX XX XX").fill("0532 123 45 67");
    await page
      .getByPlaceholder("Mahalle, sokak/cadde, bina no, daire no, kat...")
      .fill("Kocaeli İzmit Yahya Kaptan Mah. No:1 D:2");
    await page
      .getByPlaceholder("Varsa kapı zili, daire tarifi veya kuryeye notunuz...")
      .fill("Zile basabilirsiniz.");

    // Select POS payment method
    await page.getByLabel("Kapıda Kredi / Banka Kartı (POS)").check();

    // Submit order
    await page.getByRole("button", { name: "Siparişi Ver" }).click();

    // Either confirmation page or operating hours error depending on time of test run
    const confirmationHeading = page.getByRole("heading", {
      name: "Teşekkürler, Siparişiniz Alındı!",
    });
    const operatingHoursNotice = page.getByText(
      "Siparişler yalnızca 09:00 - 19:00 saatleri arasında kabul edilmektedir."
    );

    await expect(confirmationHeading.or(operatingHoursNotice)).toBeVisible({
      timeout: 10000,
    });
  });
});
