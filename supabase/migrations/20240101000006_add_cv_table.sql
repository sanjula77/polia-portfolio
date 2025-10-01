-- Add CV table for managing CV files
-- This allows admin to upload/update CV and users to download it

-- Create CV table
CREATE TABLE IF NOT EXISTS cv_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(100),
    version VARCHAR(50) DEFAULT '1.0',
    is_active BOOLEAN DEFAULT true,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for active CV
CREATE INDEX IF NOT EXISTS idx_cv_files_active ON cv_files(is_active);

-- Create updated_at trigger for CV table
CREATE TRIGGER update_cv_files_updated_at BEFORE UPDATE ON cv_files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on CV table
ALTER TABLE cv_files ENABLE ROW LEVEL SECURITY;

-- Create policies for CV table
CREATE POLICY "Allow anonymous read access to active CV" ON cv_files
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow anonymous insert to CV files" ON cv_files
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update to CV files" ON cv_files
  FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous delete to CV files" ON cv_files
  FOR DELETE USING (true);
