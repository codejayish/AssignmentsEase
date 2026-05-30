-- =====================================================
-- Run this entire script in Supabase SQL Editor
-- Project: wghchidyrpolghlitdgv.supabase.co
-- =====================================================

-- 1. Create the requests table
CREATE TABLE IF NOT EXISTS public.requests (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email       TEXT NOT NULL,
  description TEXT NOT NULL,
  deadline    DATE NOT NULL,
  invite      TEXT,
  auto_match  TEXT NOT NULL DEFAULT 'yes',
  file_url    TEXT,
  form        TEXT NOT NULL DEFAULT 'details',
  type        TEXT,
  project_title TEXT
);

-- 2. Enable Row Level Security
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- 3. Allow anonymous users to INSERT (website visitors submitting forms)
CREATE POLICY "anon_insert"
  ON public.requests
  FOR INSERT
  TO anon
  WITH CHECK (true);


-- 4. Allow service_role to read everything (for your admin use)
CREATE POLICY "service_role_all"
  ON public.requests
  FOR ALL
  TO service_role
  USING (true);

-- =====================================================
-- Storage bucket setup (run after creating the bucket
-- in Storage > New bucket > name: "assignments", Public: OFF)
-- =====================================================

-- Allow anonymous uploads to assignments bucket
CREATE POLICY "anon_upload"
  ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'assignments');

-- Allow public read of uploaded files
CREATE POLICY "public_read"
  ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'assignments');
