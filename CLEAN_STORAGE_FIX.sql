-- Clean Storage Policy Fix
-- This script drops ALL existing policies and creates fresh ones

-- Step 1: Drop ALL existing policies for vehicles bucket
DROP POLICY IF EXISTS "Admin upload access to vehicles" ON storage.objects;
DROP POLICY IF EXISTS "Public upload access to vehicles" ON storage.objects;
DROP POLICY IF EXISTS "Public update access to vehicles" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access to vehicles" ON storage.objects;
DROP POLICY IF EXISTS "Public select access to vehicles" ON storage.objects;

-- Step 2: Create fresh policies
CREATE POLICY "Public upload access to vehicles"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'vehicles'
);

CREATE POLICY "Public update access to vehicles"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'vehicles'
);

CREATE POLICY "Public delete access to vehicles"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'vehicles'
);

CREATE POLICY "Public select access to vehicles"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'vehicles'
);

-- Step 3: Verify all policies are created
SELECT 
  policyname,
  cmd,
  permissive
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%vehicles%'
ORDER BY policyname; 