-- Migration: simplify_order_status_add_order_number
-- 1. Add orderNumber column with a temporary default so existing rows get values
-- 2. Remove CONFIRMED and PREPARING from OrderStatus (migrate any existing rows to PENDING)
-- 3. Add index for tracking lookups

-- Step 1: Add orderNumber as nullable first (to handle existing rows)
ALTER TABLE "Order" ADD COLUMN "orderNumber" TEXT;

-- Step 2: Back-fill orderNumber for any existing rows using their publicId prefix
-- Format: SP-YYMMDD-XXXX (uses first 4 chars of publicId uppercased as fallback)
UPDATE "Order"
SET "orderNumber" = CONCAT(
  'SP-',
  TO_CHAR("createdAt" AT TIME ZONE 'Europe/Istanbul', 'YYMMDD'),
  '-',
  UPPER(SUBSTRING("publicId" FROM 1 FOR 4))
)
WHERE "orderNumber" IS NULL;

-- Step 3: Make orderNumber NOT NULL and UNIQUE now that all rows have values
ALTER TABLE "Order" ALTER COLUMN "orderNumber" SET NOT NULL;
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- Step 4: Migrate any CONFIRMED or PREPARING orders back to PENDING
-- (they were not yet dispatched so PENDING is the correct simplified state)
UPDATE "Order" SET "status" = 'PENDING' WHERE "status"::text IN ('CONFIRMED', 'PREPARING');

-- Step 5: Remove CONFIRMED and PREPARING from the OrderStatus enum
-- PostgreSQL requires dropping default, renaming old type, creating new type, recasting column, and re-setting default
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus" USING "status"::text::"OrderStatus";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'PENDING';
DROP TYPE "OrderStatus_old";
