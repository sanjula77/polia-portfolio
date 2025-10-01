-- Fix storage policies to allow anonymous uploads
-- This is needed for client-side image uploads

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can upload project images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update project images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete project images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;

-- Create new policies that allow anonymous uploads
CREATE POLICY "Allow anonymous uploads to project images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Allow anonymous updates to project images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'project-images');

CREATE POLICY "Allow anonymous deletes from project images" ON storage.objects
  FOR DELETE USING (bucket_id = 'project-images');

CREATE POLICY "Allow anonymous uploads to blog images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Allow anonymous updates to blog images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'blog-images');

CREATE POLICY "Allow anonymous deletes from blog images" ON storage.objects
  FOR DELETE USING (bucket_id = 'blog-images');
