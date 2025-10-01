-- Safe migration to add missing columns to existing tables
-- This will NOT replace existing data, only add missing columns

-- Add missing columns to projects table (if they don't exist)
DO $$ 
BEGIN
    -- Add image_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'image_url') THEN
        ALTER TABLE projects ADD COLUMN image_url TEXT;
    END IF;
    
    -- Add demo_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'demo_url') THEN
        ALTER TABLE projects ADD COLUMN demo_url TEXT;
    END IF;
    
    -- Add github_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'github_url') THEN
        ALTER TABLE projects ADD COLUMN github_url TEXT;
    END IF;
    
    -- Add tags column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'tags') THEN
        ALTER TABLE projects ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;
    
    -- Add category column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'category') THEN
        ALTER TABLE projects ADD COLUMN category VARCHAR(100);
    END IF;
    
    -- Add featured column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'featured') THEN
        ALTER TABLE projects ADD COLUMN featured BOOLEAN DEFAULT false;
    END IF;
    
    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'status') THEN
        ALTER TABLE projects ADD COLUMN status VARCHAR(20) DEFAULT 'draft' 
        CHECK (status IN ('draft', 'published', 'archived'));
    END IF;
    
    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'created_at') THEN
        ALTER TABLE projects ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'projects' AND column_name = 'updated_at') THEN
        ALTER TABLE projects ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Add missing columns to blogs table (if they don't exist)
DO $$ 
BEGIN
    -- Add excerpt column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'excerpt') THEN
        ALTER TABLE blogs ADD COLUMN excerpt TEXT;
    END IF;
    
    -- Add content column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'content') THEN
        ALTER TABLE blogs ADD COLUMN content TEXT;
    END IF;
    
    -- Add image_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'image_url') THEN
        ALTER TABLE blogs ADD COLUMN image_url TEXT;
    END IF;
    
    -- Add category column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'category') THEN
        ALTER TABLE blogs ADD COLUMN category VARCHAR(100);
    END IF;
    
    -- Add status column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'status') THEN
        ALTER TABLE blogs ADD COLUMN status VARCHAR(20) DEFAULT 'draft' 
        CHECK (status IN ('draft', 'published', 'archived'));
    END IF;
    
    -- Add read_time column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'read_time') THEN
        ALTER TABLE blogs ADD COLUMN read_time INTEGER DEFAULT 5;
    END IF;
    
    -- Add slug column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'slug') THEN
        ALTER TABLE blogs ADD COLUMN slug VARCHAR(255) UNIQUE;
    END IF;
    
    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'created_at') THEN
        ALTER TABLE blogs ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'blogs' AND column_name = 'updated_at') THEN
        ALTER TABLE blogs ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_projects_updated_at') THEN
        CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_blogs_updated_at') THEN
        CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;
