-- Enable Row Level Security on AdminUser
ALTER TABLE "AdminUser" ENABLE ROW LEVEL SECURITY;

-- Revoke direct PostgREST access from anonymous and authenticated public roles
REVOKE ALL ON "AdminUser" FROM anon, authenticated;