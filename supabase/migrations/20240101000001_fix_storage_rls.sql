-- Fix Row Level Security policies for storage buckets
-- Run this after the initial schema migration

-- Disable RLS for storage.objects table (allows public uploads)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Alternative: If you want to keep RLS enabled, create permissive policies instead
-- Uncomment the following lines if you prefer to keep RLS enabled:

-- -- Create policy to allow public uploads to project-images bucket
-- CREATE POLICY "Allow public uploads to project-images" ON storage.objects
-- FOR INSERT WITH CHECK (bucket_id = 'project-images');

-- -- Create policy to allow public uploads to blog-images bucket  
-- CREATE POLICY "Allow public uploads to blog-images" ON storage.objects
-- FOR INSERT WITH CHECK (bucket_id = 'blog-images');

-- -- Create policy to allow public uploads to avatars bucket
-- CREATE POLICY "Allow public uploads to avatars" ON storage.objects
-- FOR INSERT WITH CHECK (bucket_id = 'avatars');

-- -- Create policy to allow public reads from all buckets
-- CREATE POLICY "Allow public reads" ON storage.objects
-- FOR SELECT USING (true);

-- -- Create policy to allow public deletes (optional)
-- CREATE POLICY "Allow public deletes" ON storage.objects
-- FOR DELETE USING (true);

-- Ensure storage buckets are public
UPDATE storage.buckets SET public = true WHERE name IN ('project-images', 'blog-images', 'avatars');

-- If buckets don't exist, create them
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('project-images', 'project-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'text/plain']),
  ('blog-images', 'blog-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
