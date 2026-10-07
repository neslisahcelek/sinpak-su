-- Enable Row Level Security on _prisma_migrations internal table to secure Supabase Data API (PostgREST)
ALTER TABLE "public"."_prisma_migrations" ENABLE ROW LEVEL SECURITY;

-- Revoke direct PostgREST access from anonymous and authenticated public roles
REVOKE ALL ON "public"."_prisma_migrations" FROM anon, authenticated;
