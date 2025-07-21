-- Simple Storage Policies for Vehicles Bucket (For Testing)
-- Run these commands in your Supabase SQL Editor

-- ✅ Step 1: Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ✅ Step 2: Create simple public access policy for vehicles bucket
CREATE POLICY "Public access for vehicles bucket" ON storage.objects
FOR ALL USING (
  bucket_id = 'vehicles'
);

-- ✅ Step 3: Alternative - If the above doesn't work, try this more permissive policy
-- DROP POLICY IF EXISTS "Public access for vehicles bucket" ON storage.objects;
-- CREATE POLICY "Public access for vehicles bucket" ON storage.objects
-- FOR ALL USING (true);

-- ✅ Step 4: Verify the policy was created
SELECT 
  policyname,
  cmd,
  permissive
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%vehicles%';

-- ✅ Step 5: Test upload (run this after creating the policy)
-- This should work now:
-- INSERT INTO storage.objects (bucket_id, name, owner, metadata) 
-- VALUES ('vehicles', 'test.txt', gen_random_uuid(), '{"mimetype": "text/plain"}'); 