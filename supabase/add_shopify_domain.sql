-- ============================================================
-- MIGRATION: Add Shopify domain to user_profiles
-- Run in: Supabase Dashboard > SQL Editor
-- ============================================================

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS shopify_domain TEXT;

-- Index for fast lookup when webhooks arrive
CREATE INDEX IF NOT EXISTS idx_user_profiles_shopify_domain
  ON user_profiles (shopify_domain)
  WHERE shopify_domain IS NOT NULL;
