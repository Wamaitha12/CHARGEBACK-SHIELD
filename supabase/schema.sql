-- ============================================================
-- CHARGEBACK SHIELD — Supabase Database Schema
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. USER PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name        TEXT,
  currency             TEXT DEFAULT 'USD',
  email_notifications  BOOLEAN DEFAULT TRUE,
  dispute_reminders    BOOLEAN DEFAULT TRUE,
  monthly_reports      BOOLEAN DEFAULT FALSE,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- 2. CHARGEBACKS
-- ============================================================
CREATE TABLE IF NOT EXISTS chargebacks (
  id               UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name    TEXT NOT NULL,
  customer_email   TEXT NOT NULL,
  amount           NUMERIC(10, 2) NOT NULL,
  currency         TEXT DEFAULT 'USD',
  transaction_date DATE NOT NULL,
  reason           TEXT NOT NULL,
  reason_custom    TEXT,
  status           TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'won', 'lost')),
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chargebacks_user_id ON chargebacks(user_id);
CREATE INDEX idx_chargebacks_status ON chargebacks(status);
CREATE INDEX idx_chargebacks_created_at ON chargebacks(created_at);

-- ============================================================
-- 3. TIMELINE EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS timeline_events (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  chargeback_id   UUID NOT NULL REFERENCES chargebacks(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type      TEXT NOT NULL CHECK (event_type IN (
    'created', 'evidence_added', 'submitted', 'bank_response',
    'won', 'lost', 'status_changed', 'note_added'
  )),
  description     TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_timeline_chargeback_id ON timeline_events(chargeback_id);

-- ============================================================
-- 4. EVIDENCE FILES
-- ============================================================
CREATE TABLE IF NOT EXISTS evidence_files (
  id             UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  chargeback_id  UUID NOT NULL REFERENCES chargebacks(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name      TEXT NOT NULL,
  file_type      TEXT,
  file_size      BIGINT DEFAULT 0,
  storage_path   TEXT NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_evidence_chargeback_id ON evidence_files(chargeback_id);

-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS) — CRITICAL FOR MULTI-TENANT
-- ============================================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chargebacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence_files ENABLE ROW LEVEL SECURITY;

-- User profiles: users can only access their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Chargebacks: users can only access their own
CREATE POLICY "Users can view own chargebacks"
  ON chargebacks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chargebacks"
  ON chargebacks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chargebacks"
  ON chargebacks FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chargebacks"
  ON chargebacks FOR DELETE USING (auth.uid() = user_id);

-- Timeline events
CREATE POLICY "Users can view own timeline events"
  ON timeline_events FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own timeline events"
  ON timeline_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Evidence files
CREATE POLICY "Users can view own evidence"
  ON evidence_files FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own evidence"
  ON evidence_files FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own evidence"
  ON evidence_files FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 6. STORAGE BUCKET — Run in Supabase Storage settings
-- ============================================================
-- Create a bucket named 'evidence' with the following policy:
-- In Supabase Dashboard > Storage > evidence > Policies:

-- Policy: Allow authenticated users to upload to their folder
-- (replace via Storage bucket settings UI or use SQL below)

INSERT INTO storage.buckets (id, name, public) VALUES ('evidence', 'evidence', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload own evidence"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'evidence' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can read own evidence"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'evidence' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own evidence"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'evidence' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================
-- 7. HELPER FUNCTION: Updated at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chargebacks_updated_at
  BEFORE UPDATE ON chargebacks
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
