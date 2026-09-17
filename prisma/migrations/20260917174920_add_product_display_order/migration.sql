-- DropIndex
DROP INDEX "Product_isActive_name_idx";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Product_isActive_displayOrder_name_idx" ON "Product"("isActive", "displayOrder", "name");
