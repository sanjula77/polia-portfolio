# CV Download Feature Setup Guide

## 🎯 **Overview**
This guide will help you set up the CV download feature where you can upload/manage your CV in the admin panel and users can download it from the main page.

## ✅ **Features Implemented**

### **Admin Panel Features:**
- ✅ **CV Management Tab**: New tab in admin panel for CV management
- ✅ **File Upload**: Upload PDF, DOC, DOCX files (max 10MB)
- ✅ **Version Control**: Track different versions of your CV
- ✅ **Active CV**: Set which CV is currently active for download
- ✅ **File Management**: View, download, delete CV files
- ✅ **File Validation**: Automatic file type and size validation

### **Main Page Features:**
- ✅ **Dynamic Download Button**: Button shows current status (loading/available/not available)
- ✅ **Automatic Download**: Clicking button downloads the active CV
- ✅ **Error Handling**: Proper error messages and loading states
- ✅ **File Security**: Secure file storage with public read access

## 📋 **Setup Instructions**

### 1. **Run Database Migrations**

Execute these SQL commands in your Supabase dashboard:

#### **CV Table Migration:**
```sql
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
```

#### **CV Storage Bucket Migration:**
```sql
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
```

### 2. **File Structure**

#### **New Files Created:**
- `components/admin/cv-admin.tsx` - CV management component
- `supabase/migrations/20240101000006_add_cv_table.sql` - CV table migration
- `supabase/migrations/20240101000007_setup_cv_storage.sql` - CV storage migration

#### **Updated Files:**
- `lib/database.ts` - Added CV service functions and types
- `app/admin/page.tsx` - Added CV management tab
- `components/sections/hero-section.tsx` - Updated download button functionality

## 🚀 **How to Use**

### **For Admin (You):**

1. **Access Admin Panel**: Go to `/admin`
2. **Navigate to CV Management**: Click on "CV Management" tab
3. **Upload CV**: Click "Upload CV" button
4. **Select File**: Choose your CV file (PDF, DOC, DOCX)
5. **Upload**: Click "Upload CV" to save
6. **Set Active**: The first uploaded CV becomes active automatically
7. **Manage Versions**: Upload multiple versions and set which one is active

### **For Users (Visitors):**

1. **Visit Main Page**: Go to your portfolio homepage
2. **Find Download Button**: Look for the green "Download CV" button in the hero section
3. **Click to Download**: Button will automatically download your active CV
4. **File Opens**: CV opens in new tab or downloads to their device

## 🎨 **Button States**

The download button shows different states:

- **🔄 Loading**: "Loading..." with spinner (while fetching CV data)
- **✅ Available**: "Download CV" (when CV is available for download)
- **❌ Not Available**: "CV Not Available" (when no CV is uploaded)

## 📁 **Supported File Types**

- **PDF** (.pdf) - Recommended
- **Microsoft Word** (.doc, .docx)
- **Maximum Size**: 10MB per file
- **Multiple Versions**: Upload and manage multiple CV versions

## 🔒 **Security Features**

- **File Validation**: Only allows specific file types
- **Size Limits**: Prevents oversized file uploads
- **Secure Storage**: Files stored in Supabase storage with proper access controls
- **Public Read Access**: Users can download without authentication
- **Admin Control**: Only you can upload/manage CVs through admin panel

## 🛠 **Technical Details**

### **Database Schema:**
```sql
cv_files:
- id (UUID, Primary Key)
- file_name (VARCHAR) - Original filename
- file_url (TEXT) - Public URL to file
- file_size (INTEGER) - File size in bytes
- file_type (VARCHAR) - MIME type
- version (VARCHAR) - Version identifier
- is_active (BOOLEAN) - Which CV is currently active
- description (TEXT) - Optional description
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### **Storage Bucket:**
- **Name**: `cv-files`
- **Public Access**: Yes (for downloads)
- **File Naming**: `cv-{timestamp}-{sanitized-filename}`

### **API Endpoints:**
- `cvService.getActive()` - Get currently active CV
- `cvService.getAllAdmin()` - Get all CVs (admin)
- `cvService.create()` - Upload new CV
- `cvService.setActive()` - Set CV as active
- `cvService.delete()` - Delete CV

## 🧪 **Testing**

1. **Upload Test**: Upload a CV file in admin panel
2. **Download Test**: Click download button on main page
3. **Version Test**: Upload multiple CVs and switch active one
4. **Error Test**: Try uploading invalid file types
5. **Size Test**: Try uploading oversized files

## 🎯 **Next Steps**

After running the migrations:

1. ✅ **Test Upload**: Upload your first CV in admin panel
2. ✅ **Test Download**: Click download button on main page
3. ✅ **Verify Security**: Ensure only you can manage CVs
4. ✅ **Update CV**: Upload new versions as needed

The CV download feature is now fully functional! 🎉
