-- Fix table policies to allow anonymous CRUD operations
-- This is needed for client-side admin operations

-- Enable RLS on tables if not already enabled
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous read access to projects" ON projects;
DROP POLICY IF EXISTS "Allow anonymous insert to projects" ON projects;
DROP POLICY IF EXISTS "Allow anonymous update to projects" ON projects;
DROP POLICY IF EXISTS "Allow anonymous delete to projects" ON projects;

DROP POLICY IF EXISTS "Allow anonymous read access to blogs" ON blogs;
DROP POLICY IF EXISTS "Allow anonymous insert to blogs" ON blogs;
DROP POLICY IF EXISTS "Allow anonymous update to blogs" ON blogs;
DROP POLICY IF EXISTS "Allow anonymous delete to blogs" ON blogs;

DROP POLICY IF EXISTS "Allow anonymous read access to messages" ON messages;
DROP POLICY IF EXISTS "Allow anonymous insert to messages" ON messages;

-- Create policies for projects table
CREATE POLICY "Allow anonymous read access to projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert to projects" ON projects
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update to projects" ON projects
  FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous delete to projects" ON projects
  FOR DELETE USING (true);

-- Create policies for blogs table
CREATE POLICY "Allow anonymous read access to blogs" ON blogs
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert to blogs" ON blogs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous update to blogs" ON blogs
  FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous delete to blogs" ON blogs
  FOR DELETE USING (true);

-- Create policies for messages table
CREATE POLICY "Allow anonymous read access to messages" ON messages
  FOR SELECT USING (true);

CREATE POLICY "Allow anonymous insert to messages" ON messages
  FOR INSERT WITH CHECK (true);
