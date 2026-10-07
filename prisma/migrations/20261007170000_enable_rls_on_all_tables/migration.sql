-- Enable Row Level Security on all public domain tables to prevent unauthorized PostgREST API access
ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SupplyCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SupplyProduct" ENABLE ROW LEVEL SECURITY;

-- Revoke direct PostgREST access from anonymous and authenticated public roles
REVOKE ALL ON "Product" FROM anon, authenticated;
REVOKE ALL ON "Order" FROM anon, authenticated;
REVOKE ALL ON "OrderItem" FROM anon, authenticated;
REVOKE ALL ON "SupplyCategory" FROM anon, authenticated;
REVOKE ALL ON "SupplyProduct" FROM anon, authenticated;
