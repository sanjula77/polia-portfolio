import { supabase, createSupabaseAdmin } from './supabaseClient'

// Storage bucket names
export const STORAGE_BUCKETS = {
  PROJECT_IMAGES: 'project-images',
  BLOG_IMAGES: 'blog-images',
  AVATARS: 'avatars'
} as const

// Initialize storage buckets (run this once)
export async function initializeStorageBuckets() {
  try {
    const supabaseAdmin = createSupabaseAdmin();
    
    // Check if buckets already exist
    const { data: existingBuckets } = await supabaseAdmin.storage.listBuckets()
    const bucketNames = existingBuckets?.map(b => b.name) || []

    // Create project images bucket if it doesn't exist
    if (!bucketNames.includes(STORAGE_BUCKETS.PROJECT_IMAGES)) {
      const { error } = await supabaseAdmin.storage.createBucket(STORAGE_BUCKETS.PROJECT_IMAGES, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'text/plain'],
        fileSizeLimit: 5 * 1024 * 1024 // 5MB limit
      })
      if (error) {
        console.warn(`Failed to create bucket ${STORAGE_BUCKETS.PROJECT_IMAGES}:`, error.message)
      } else {
        console.log(`Created bucket: ${STORAGE_BUCKETS.PROJECT_IMAGES}`)
      }
    }

    // Create blog images bucket if it doesn't exist
    if (!bucketNames.includes(STORAGE_BUCKETS.BLOG_IMAGES)) {
      const { error } = await supabaseAdmin.storage.createBucket(STORAGE_BUCKETS.BLOG_IMAGES, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 5 * 1024 * 1024 // 5MB limit
      })
      if (error) {
        console.warn(`Failed to create bucket ${STORAGE_BUCKETS.BLOG_IMAGES}:`, error.message)
      } else {
        console.log(`Created bucket: ${STORAGE_BUCKETS.BLOG_IMAGES}`)
      }
    }

    // Create avatars bucket if it doesn't exist
    if (!bucketNames.includes(STORAGE_BUCKETS.AVATARS)) {
      const { error } = await supabaseAdmin.storage.createBucket(STORAGE_BUCKETS.AVATARS, {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 2 * 1024 * 1024 // 2MB limit
      })
      if (error) {
        console.warn(`Failed to create bucket ${STORAGE_BUCKETS.AVATARS}:`, error.message)
      } else {
        console.log(`Created bucket: ${STORAGE_BUCKETS.AVATARS}`)
      }
    }

    console.log('Storage buckets initialization completed')
    return { success: true }
  } catch (error) {
    console.error('Error initializing storage buckets:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Upload file to storage
export async function uploadFile(
  bucket: string,
  path: string,
  file: File,
  options?: { upsert?: boolean }
) {
  try {
    // Use admin client for uploads to bypass RLS
    const supabaseAdmin = createSupabaseAdmin();
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: options?.upsert || false
      })

    if (error) throw error

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)

    return {
      success: true,
      path: data.path,
      url: urlData.publicUrl
    }
  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

// Delete file from storage
export async function deleteFile(bucket: string, path: string) {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    }
  }
}

// Get file URL
export function getFileUrl(bucket: string, path: string) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}

// List files in bucket
export async function listFiles(bucket: string, folder?: string) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder)

    if (error) throw error

    return {
      success: true,
      files: data
    }
  } catch (error) {
    console.error('List files error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'List files failed'
    }
  }
}
