-- Setup storage bucket for CV files
-- This allows secure storage and download of CV files

-- Create CV storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('cv-files', 'cv-files', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for cv-files bucket
CREATE POLICY "Public read access for CV files" ON storage.objects
  FOR SELECT USING (bucket_id = 'cv-files');

CREATE POLICY "Allow anonymous uploads to CV files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cv-files');

CREATE POLICY "Allow anonymous updates to CV files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'cv-files');

CREATE POLICY "Allow anonymous deletes from CV files" ON storage.objects
  FOR DELETE USING (bucket_id = 'cv-files');
