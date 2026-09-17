import crypto from "node:crypto";
import { promisify } from "node:util";
import { PrismaClient, ProductType } from "@prisma/client";

const prisma = new PrismaClient();
const scryptAsync = promisify(crypto.scrypt);

async function hashSeedPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

const MVP_PRODUCTS = [
  {
    slug: "damacana-su-19l",
    name: "19L Damacana Su",
    description: "19 Litre doğal kaynak damacana su.",
    type: ProductType.DAMACANA_WATER,
    price: "180.00",
    depositAmount: "180.00",
    displayOrder: 1,
    isActive: true,
  },
  {
    slug: "coca-cola-1-5l",
    name: "1.5L Coca-Cola",
    description: "1.5 Litre Coca-Cola.",
    type: ProductType.BEVERAGE,
    price: "60.00",
    depositAmount: "0.00",
    displayOrder: 2,
    isActive: true,
  },
  {
    slug: "pepsi-1-5l",
    name: "1.5L Pepsi",
    description: "1.5 Litre Pepsi.",
    type: ProductType.BEVERAGE,
    price: "60.00",
    depositAmount: "0.00",
    displayOrder: 3,
    isActive: true,
  },
  {
    slug: "fanta-1-5l",
    name: "1.5L Fanta",
    description: "1.5 Litre Fanta.",
    type: ProductType.BEVERAGE,
    price: "60.00",
    depositAmount: "0.00",
    displayOrder: 4,
    isActive: true,
  },
] as const;

export async function seed() {
  console.log("Seeding MVP products...");

  for (const product of MVP_PRODUCTS) {
    const upserted = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        type: product.type,
        price: product.price,
        depositAmount: product.depositAmount,
        displayOrder: product.displayOrder,
        isActive: product.isActive,
      },
      create: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        type: product.type,
        price: product.price,
        depositAmount: product.depositAmount,
        displayOrder: product.displayOrder,
        isActive: product.isActive,
      },
    });

    console.log(`- Upserted: ${upserted.name} (${upserted.slug})`);
  }

  console.log("Seeding Admin users from environment variables...");
  const primaryUsername = (process.env.ADMIN_USERNAME || "admin").trim().toLowerCase();
  const primaryPassword = process.env.ADMIN_PASSWORD;

  const adminUsers: Array<{
    username: string;
    password?: string;
    name: string;
    isActive: boolean;
  }> = [];

  if (primaryPassword) {
    adminUsers.push({
      username: primaryUsername,
      password: primaryPassword,
      name: "Ana Yönetici",
      isActive: true,
    });
  } else if (process.env.NODE_ENV !== "production") {
    adminUsers.push({
      username: primaryUsername,
      password: "dev-password-change-me",
      name: "Geliştirici Admin",
      isActive: true,
    });
  }

  // Parse optional additional admins from ADMIN_USERS env variable (JSON array format)
  if (process.env.ADMIN_USERS) {
    try {
      const extraUsers = JSON.parse(process.env.ADMIN_USERS);
      if (Array.isArray(extraUsers)) {
        for (const u of extraUsers) {
          if (u.username && u.password) {
            adminUsers.push({
              username: String(u.username).trim().toLowerCase(),
              password: String(u.password),
              name: u.name ? String(u.name) : "Yönetici",
              isActive: u.isActive ?? true,
            });
          }
        }
      }
    } catch {
      console.warn("ADMIN_USERS ortam değişkeni JSON formatında ayrıştırılamadı.");
    }
  }

  for (const admin of adminUsers) {
    if (!admin.password) continue;
    const passwordHash = await hashSeedPassword(admin.password);
    const upserted = await prisma.adminUser.upsert({
      where: { username: admin.username },
      update: {
        passwordHash,
        name: admin.name,
        isActive: admin.isActive,
      },
      create: {
        username: admin.username,
        passwordHash,
        name: admin.name,
        isActive: admin.isActive,
      },
    });
    console.log(`- Upserted Admin: ${upserted.username} (${upserted.name})`);
  }

  console.log("Seeding completed successfully.");
}

async function main() {
  try {
    await seed();
  } catch (e) {
    console.error("Error while seeding database:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
