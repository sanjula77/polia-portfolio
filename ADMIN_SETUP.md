# Admin Panel Setup Instructions

## Overview
This document provides instructions for setting up the admin panel with full CRUD operations for projects and blog posts, including image upload functionality.

## Features Implemented

### ✅ Admin Panel Features
- **Projects Management**: Create, read, update, delete projects with image upload
- **Blog Management**: Create, read, update, delete blog posts with image upload
- **Image Upload**: Support for project and blog images with preview
- **Database Integration**: Full Supabase integration with proper schemas
- **Real-time Updates**: Main page automatically fetches and displays data from database

### ✅ Database Schema
- **Projects Table**: Complete with image_url, tags, categories, featured status
- **Blogs Table**: Complete with image_url, slug, read_time calculation
- **Storage Buckets**: project-images and blog-images buckets configured
- **RLS Policies**: Proper security policies for public read access

## Setup Instructions

### 1. Database Setup
Run the following SQL migrations in your Supabase dashboard:

#### Initial Schema (supabase/migrations/20240101000000_init_schema.sql)
```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    demo_url TEXT,
    github_url TEXT,
    tags TEXT[] DEFAULT '{}',
    category VARCHAR(100),
    featured BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content TEXT,
    image_url TEXT,
    category VARCHAR(100),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    read_time INTEGER DEFAULT 5,
    slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table (contact form submissions)
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    replied BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (for admin authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'editor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON blogs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO projects (title, description, category, tags, featured, status) VALUES
('Sample Project 1', 'This is a sample project description', 'Web', ARRAY['React', 'Next.js'], true, 'published'),
('Sample Project 2', 'Another sample project for testing', 'AI', ARRAY['Python', 'Machine Learning'], false, 'draft')
ON CONFLICT DO NOTHING;

INSERT INTO blogs (title, excerpt, content, category, status) VALUES
('Welcome to My Blog', 'This is a sample blog post', '# Welcome\n\nThis is the content of the blog post.', 'General', 'published')
ON CONFLICT DO NOTHING;
```

#### Storage Setup (supabase/migrations/20240101000002_setup_storage.sql)
```sql
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
```

### 2. Environment Variables
Create a `.env.local` file in your project root with:
```env
NEXT_PUBLIC_SUPABASE_URL=https://fqzfhiybsyoalbhinegt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxemZoaXlic3lvYWxiaGluZWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMzU5MzMsImV4cCI6MjA3NDcxMTkzM30.AxFpQUj-Dnr0vzhqwXZRhMs1pihPIgGo7UPwx25D6fA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxemZoaXlic3lvYWxiaGluZWd0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTEzNTkzMywiZXhwIjoyMDc0NzExOTMzfQ.H-k7j3Yl-JVFm_IYmaqwDZAuRwQoA0GgMwTLOEVkTJI
```

### 3. Storage Buckets
The storage buckets are already configured:
- `project-images`: For project screenshots and images
- `blog-images`: For blog post featured images

Both buckets are public for read access and allow authenticated users to upload.

## Usage

### Admin Panel Access
Navigate to `/admin` to access the admin panel with three tabs:
1. **Projects**: Manage your portfolio projects
2. **Blog Posts**: Manage your blog content
3. **Messages**: View contact form submissions

### Adding Projects
1. Click "Add Project" in the Projects tab
2. Fill in project details (title, description, category, tags)
3. Upload a project image (optional but recommended)
4. Set demo and GitHub URLs
5. Choose status (draft/published/archived)
6. Mark as featured to show on homepage
7. Save the project

### Adding Blog Posts
1. Click "Add Post" in the Blog Posts tab
2. Fill in post details (title, excerpt, content)
3. Upload a featured image (optional but recommended)
4. Select category and status
5. Content supports Markdown formatting
6. Read time is automatically calculated
7. Slug is automatically generated from title
8. Save the post

### Main Page Integration
- Projects section automatically fetches published projects from database
- Blog section automatically fetches published blog posts from database
- Loading states and error handling included
- Responsive design maintained

## File Structure

### New Files Created
- `lib/database.ts`: Database service functions and types
- `components/admin/projects-admin.tsx`: Updated with full CRUD operations
- `components/admin/blog-admin.tsx`: Updated with full CRUD operations
- `supabase/migrations/20240101000002_setup_storage.sql`: Storage configuration

### Updated Files
- `components/sections/projects-section.tsx`: Now fetches from database
- `components/sections/blog-section.tsx`: Now fetches from database
- `supabase/migrations/20240101000000_init_schema.sql`: Enhanced schema

## Features

### Project Management
- ✅ Create, edit, delete projects
- ✅ Image upload with preview
- ✅ Category filtering
- ✅ Featured project toggle
- ✅ Status management (draft/published/archived)
- ✅ Tags support
- ✅ Demo and GitHub URL links

### Blog Management
- ✅ Create, edit, delete blog posts
- ✅ Image upload with preview
- ✅ Markdown content support
- ✅ Automatic slug generation
- ✅ Read time calculation
- ✅ Category organization
- ✅ Status management

### Database Integration
- ✅ Real-time data fetching
- ✅ Proper error handling
- ✅ Loading states
- ✅ Type safety with TypeScript
- ✅ Optimized queries with indexes

### Storage Integration
- ✅ Image upload to Supabase Storage
- ✅ Public read access for images
- ✅ File type validation
- ✅ Size limits (5MB)
- ✅ Automatic URL generation

## Next Steps

1. Run the SQL migrations in your Supabase dashboard
2. Test the admin panel functionality
3. Add some sample projects and blog posts
4. Verify the main page displays the data correctly
5. Customize categories and styling as needed

The admin panel is now fully functional with database integration and image upload capabilities!
