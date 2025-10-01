import { supabase, createSupabaseAdmin } from './supabaseClient';

// Types
export interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  tags: string[];
  category: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image_url?: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  read_time: number;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectData {
  title: string;
  description: string;
  image_url?: string;
  demo_url?: string;
  github_url?: string;
  tags: string[];
  category: string;
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
}

export interface CreateBlogData {
  title: string;
  excerpt: string;
  content: string;
  image_url?: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  read_time: number;
  slug: string;
}

export interface CVFile {
  id: string;
  file_name: string;
  file_url: string;
  file_size?: number;
  file_type?: string;
  version: string;
  is_active: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCVData {
  file_name: string;
  file_url: string;
  file_size?: number;
  file_type?: string;
  version?: string;
  is_active?: boolean;
  description?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  replied: boolean;
  created_at: string;
}

export interface CreateMessageData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

// Project operations
export const projectService = {
  // Get all projects (public)
  async getAll(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get all projects (admin) - using regular client for client-side operations
  async getAllAdmin(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get project by ID
  async getById(id: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create project - using regular client for client-side operations
  async create(projectData: CreateProjectData): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update project - using regular client for client-side operations
  async update(id: string, projectData: Partial<CreateProjectData>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete project - using regular client for client-side operations
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Blog operations
export const blogService = {
  // Get all blogs (public)
  async getAll(): Promise<Blog[]> {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get all blogs (admin) - using regular client for client-side operations
  async getAllAdmin(): Promise<Blog[]> {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get blog by ID
  async getById(id: string): Promise<Blog | null> {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get blog by slug
  async getBySlug(slug: string): Promise<Blog | null> {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create blog - using regular client for client-side operations
  async create(blogData: CreateBlogData): Promise<Blog> {
    const { data, error } = await supabase
      .from('blogs')
      .insert([blogData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update blog - using regular client for client-side operations
  async update(id: string, blogData: Partial<CreateBlogData>): Promise<Blog> {
    const { data, error } = await supabase
      .from('blogs')
      .update(blogData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete blog - using regular client for client-side operations
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// CV operations
export const cvService = {
  // Get active CV file (public)
  async getActive(): Promise<CVFile | null> {
    const { data, error } = await supabase
      .from('cv_files')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows found
        return null;
      }
      throw error;
    }
    return data;
  },

  // Get all CV files (admin)
  async getAllAdmin(): Promise<CVFile[]> {
    const { data, error } = await supabase
      .from('cv_files')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Create CV file
  async create(cvData: CreateCVData): Promise<CVFile> {
    const { data, error } = await supabase
      .from('cv_files')
      .insert([cvData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update CV file
  async update(id: string, cvData: Partial<CreateCVData>): Promise<CVFile> {
    const { data, error } = await supabase
      .from('cv_files')
      .update(cvData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete CV file
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('cv_files')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Set CV as active (deactivates others)
  async setActive(id: string): Promise<void> {
    // First, deactivate all CVs
    await supabase
      .from('cv_files')
      .update({ is_active: false });
    
    // Then activate the selected one
    const { error } = await supabase
      .from('cv_files')
      .update({ is_active: true })
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Message operations
export const messageService = {
  // Create message (public) - use admin client to bypass RLS
  async create(messageData: CreateMessageData): Promise<Message> {
    const supabaseAdmin = createSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert([messageData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get all messages (admin)
  async getAllAdmin(): Promise<Message[]> {
    const supabaseAdmin = createSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // Get message by ID (admin)
  async getById(id: string): Promise<Message | null> {
    const supabaseAdmin = createSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Mark message as read (admin)
  async markAsRead(id: string): Promise<Message> {
    const supabaseAdmin = createSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('messages')
      .update({ read: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Mark message as replied (admin)
  async markAsReplied(id: string): Promise<Message> {
    const supabaseAdmin = createSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from('messages')
      .update({ replied: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete message (admin)
  async delete(id: string): Promise<void> {
    const supabaseAdmin = createSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from('messages')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Storage operations
export const storageService = {
  // Upload image to project-images bucket
  async uploadProjectImage(file: File, fileName: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(data.path);
    
    return publicUrl;
  },

  // Upload image to blog-images bucket
  async uploadBlogImage(file: File, fileName: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('blog-images')
      .getPublicUrl(data.path);
    
    return publicUrl;
  },

  // Delete image from storage
  async deleteImage(bucket: string, fileName: string): Promise<void> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);
    
    if (error) throw error;
  },

  // Upload CV file to cv-files bucket
  async uploadCVFile(file: File, fileName: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('cv-files')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('cv-files')
      .getPublicUrl(data.path);
    
    return publicUrl;
  },

  // Delete CV file from storage
  async deleteCVFile(fileName: string): Promise<void> {
    const { error } = await supabase.storage
      .from('cv-files')
      .remove([fileName]);
    
    if (error) throw error;
  }
};

// Utility functions
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const calculateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};
