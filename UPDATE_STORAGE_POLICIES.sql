-- Update Storage Policies to Allow Anonymous Uploads (For Testing)
-- Run these commands in your Supabase SQL Editor

-- ✅ Step 1: Drop the existing restrictive policy
DROP POLICY IF EXISTS "Admin upload access to vehicles" ON storage.objects;

-- ✅ Step 2: Create a more permissive policy for testing
CREATE POLICY "Public upload access to vehicles"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'vehicles'
);

-- ✅ Step 3: Create public update policy
CREATE POLICY "Public update access to vehicles"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'vehicles'
);

-- ✅ Step 4: Create public delete policy
CREATE POLICY "Public delete access to vehicles"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'vehicles'
);

-- ✅ Step 5: Verify the new policies
SELECT 
  policyname,
  cmd,
  permissive,
  roles
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%vehicles%'
ORDER BY policyname;

-- ✅ Step 6: Test the policies (optional)
-- This should now work for anonymous users:
-- INSERT INTO storage.objects (bucket_id, name, owner, metadata) 
-- VALUES ('vehicles', 'test.txt', gen_random_uuid(), '{"mimetype": "text/plain"}'); 