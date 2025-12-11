-- COMPREHENSIVE FIX FOR VAULT UPLOADS
-- Run this in the Supabase Dashboard SQL Editor or via CLI

-- 1. Ensure 'resources' table has all required columns
ALTER TABLE public.resources 
ADD COLUMN IF NOT EXISTS tags text[],
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS embedding_status text DEFAULT 'pending';

-- 2. Ensure 'vault_files' bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('vault_files', 'vault_files', false)
ON CONFLICT (id) DO NOTHING;

-- 3. Reset and Apply Robust Storage Policies
-- Allows authenticated users to upload/view/delete their own files
DROP POLICY IF EXISTS "Users can upload vault files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own vault files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own vault files" ON storage.objects;

CREATE POLICY "Users can upload vault files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'vault_files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view own vault files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'vault_files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own vault files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'vault_files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
