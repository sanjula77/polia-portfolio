-- Setup storage buckets for project and blog images
-- Run with: npx supabase db push

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('project-images', 'project-images', true),
  ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for project-images bucket
CREATE POLICY "Public read access for project images" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can upload project images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update project images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'project-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete project images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'project-images' 
    AND auth.role() = 'authenticated'
  );

-- Set up RLS policies for blog-images bucket
CREATE POLICY "Public read access for blog images" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'blog-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update blog images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'blog-images' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete blog images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'blog-images' 
    AND auth.role() = 'authenticated'
  );

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
