-- Final Storage Policy Fix
-- Run these commands in your Supabase SQL Editor

-- Step 1: Drop the existing restrictive policy
DROP POLICY IF EXISTS "Admin upload access to vehicles" ON storage.objects;

-- Step 2: Create public upload policy
CREATE POLICY "Public upload access to vehicles"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'vehicles'
);

-- Step 3: Create public update policy
CREATE POLICY "Public update access to vehicles"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'vehicles'
);

-- Step 4: Create public delete policy
CREATE POLICY "Public delete access to vehicles"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'vehicles'
);

-- Step 5: Verify all policies are created
SELECT 
  policyname,
  cmd,
  permissive
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%vehicles%'
ORDER BY policyname; 