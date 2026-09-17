import crypto from "node:crypto";
import { promisify } from "node:util";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const scryptAsync = promisify(crypto.scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

async function main() {
  const args = process.argv.slice(2);
  const username = args[0]?.trim();
  const password = args[1]?.trim();
  const name = args.slice(2).join(" ").trim() || "Yönetici";

  if (!username || !password) {
    console.error(`
Kullanım:
  npm run admin:create <kullanıcı_adı> <şifre> [ad_soyad]

Örnek:
  npm run admin:create osman GucluSifre2026! "Osman Yılmaz"
`);
    process.exit(1);
  }

  if (username.length < 3) {
    console.error("Hata: Kullanıcı adı en az 3 karakter olmalıdır.");
    process.exit(1);
  }

  if (password.length < 6) {
    console.error("Hata: Şifre en az 6 karakter olmalıdır.");
    process.exit(1);
  }

  const normalizedUsername = username.toLowerCase();
  console.log(`'${normalizedUsername}' yöneticisi veritabanına ekleniyor...`);

  try {
    const passwordHash = await hashPassword(password);

    const user = await prisma.adminUser.upsert({
      where: { username: normalizedUsername },
      update: {
        passwordHash,
        name,
        isActive: true,
      },
      create: {
        username: normalizedUsername,
        passwordHash,
        name,
        isActive: true,
      },
    });

    console.log(`✅ Yönetici başarıyla oluşturuldu/güncellendi!`);
    console.log(`   Kullanıcı Adı : ${user.username}`);
    console.log(`   İsim          : ${user.name || "-"}`);
    console.log(`   Durum         : ${user.isActive ? "Aktif" : "Pasif"}`);
    console.log(`   (Şifre güvenli şekilde scrypt ile hash'lenerek kaydedildi.)\n`);
  } catch (error) {
    console.error("Yönetici oluşturulurken hata meydana geldi:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
