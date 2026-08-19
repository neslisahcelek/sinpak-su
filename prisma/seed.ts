import { PrismaClient, ProductType } from "@prisma/client";

const prisma = new PrismaClient();

const MVP_PRODUCTS = [
  {
    slug: "damacana-su-19l",
    name: "19L Damacana Su",
    description: "19 Litre doğal kaynak damacana su.",
    type: ProductType.DAMACANA_WATER,
    price: "180.00",
    depositAmount: "180.00",
    isActive: true,
  },
  {
    slug: "coca-cola-1-5l",
    name: "1.5L Coca-Cola",
    description: "1.5 Litre Coca-Cola.",
    type: ProductType.BEVERAGE,
    price: "60.00",
    depositAmount: "0.00",
    isActive: true,
  },
  {
    slug: "pepsi-1-5l",
    name: "1.5L Pepsi",
    description: "1.5 Litre Pepsi.",
    type: ProductType.BEVERAGE,
    price: "60.00",
    depositAmount: "0.00",
    isActive: true,
  },
  {
    slug: "fanta-1-5l",
    name: "1.5L Fanta",
    description: "1.5 Litre Fanta.",
    type: ProductType.BEVERAGE,
    price: "60.00",
    depositAmount: "0.00",
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
        isActive: product.isActive,
      },
      create: {
        slug: product.slug,
        name: product.name,
        description: product.description,
        type: product.type,
        price: product.price,
        depositAmount: product.depositAmount,
        isActive: product.isActive,
      },
    });

    console.log(`- Upserted: ${upserted.name} (${upserted.slug})`);
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
