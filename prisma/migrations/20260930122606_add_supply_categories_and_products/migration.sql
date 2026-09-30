-- CreateTable
CREATE TABLE "SupplyCategory" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplyCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplyProduct" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unit" TEXT,
    "price" DECIMAL(12,2),
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplyProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SupplyCategory_slug_key" ON "SupplyCategory"("slug");

-- CreateIndex
CREATE INDEX "SupplyCategory_isActive_displayOrder_name_idx" ON "SupplyCategory"("isActive", "displayOrder", "name");

-- CreateIndex
CREATE UNIQUE INDEX "SupplyProduct_slug_key" ON "SupplyProduct"("slug");

-- CreateIndex
CREATE INDEX "SupplyProduct_categoryId_isActive_displayOrder_idx" ON "SupplyProduct"("categoryId", "isActive", "displayOrder");

-- AddForeignKey
ALTER TABLE "SupplyProduct" ADD CONSTRAINT "SupplyProduct_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "SupplyCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
