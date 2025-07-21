-- Storage Policies Setup for Vehicles Bucket
-- Run these commands in your Supabase SQL Editor

-- ✅ Step 1: Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ✅ Step 2: Create policy for public read access to vehicles bucket
CREATE POLICY "Public read access for vehicles bucket" ON storage.objects
FOR SELECT USING (
  bucket_id = 'vehicles' AND 
  (storage.foldername(name))[1] = 'public'
);

-- ✅ Step 3: Create policy for authenticated users to upload to vehicles bucket
CREATE POLICY "Authenticated users can upload to vehicles bucket" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'vehicles' AND 
  auth.role() = 'authenticated'
);

-- ✅ Step 4: Create policy for users to update their own uploads
CREATE POLICY "Users can update their own uploads in vehicles bucket" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'vehicles' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- ✅ Step 5: Create policy for users to delete their own uploads
CREATE POLICY "Users can delete their own uploads in vehicles bucket" ON storage.objects
FOR DELETE USING (
  bucket_id = 'vehicles' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- ✅ Step 6: Create policy for admin users to manage all files
CREATE POLICY "Admin users can manage all files in vehicles bucket" ON storage.objects
FOR ALL USING (
  bucket_id = 'vehicles' AND 
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- ✅ Step 7: Alternative - Simple public upload policy (if you want anyone to upload)
-- Uncomment the lines below if you want to allow public uploads (less secure)
/*
CREATE POLICY "Public upload access for vehicles bucket" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'vehicles'
);

CREATE POLICY "Public update access for vehicles bucket" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'vehicles'
);

CREATE POLICY "Public delete access for vehicles bucket" ON storage.objects
FOR DELETE USING (
  bucket_id = 'vehicles'
);
*/

-- ✅ Step 8: Verify policies are created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;

-- ✅ Step 9: Test the policies
-- You can test by running these queries:
-- SELECT * FROM storage.objects WHERE bucket_id = 'vehicles' LIMIT 1;
-- INSERT INTO storage.objects (bucket_id, name, owner, metadata) VALUES ('vehicles', 'test.txt', auth.uid(), '{"mimetype": "text/plain"}'); 