'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, CreditCard as Edit, Trash2, Eye, Calendar, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { blogService, storageService, generateSlug, calculateReadTime, type Blog, type CreateBlogData } from '@/lib/database';

export default function BlogAdmin() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Load posts on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await blogService.getAllAdmin();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = () => {
    setEditingPost(null);
    setSelectedImage(null);
    setImagePreview('');
    setIsDialogOpen(true);
  };

  const handleEditPost = (post: Blog) => {
    setEditingPost(post);
    setImagePreview(post.image_url || '');
    setSelectedImage(null);
    setIsDialogOpen(true);
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await blogService.delete(id);
      setPosts(posts.filter(p => p.id !== id));
      toast.success('Blog post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete blog post');
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview('');
  };

  const handleSavePost = async (formData: FormData) => {
    try {
      setSaving(true);

      const title = formData.get('title') as string;
      const content = formData.get('content') as string;

      const blogData: CreateBlogData = {
        title,
        excerpt: formData.get('excerpt') as string,
        content,
        category: formData.get('category') as string,
        status: formData.get('status') as 'draft' | 'published' | 'archived',
        read_time: calculateReadTime(content),
        slug: generateSlug(title),
      };

      // Upload image if selected
      if (selectedImage) {
        try {
          setUploadingImage(true);
          console.log('Uploading image:', selectedImage.name, 'Size:', selectedImage.size);

          // Validate file size (5MB limit)
          if (selectedImage.size > 5 * 1024 * 1024) {
            throw new Error('File size must be less than 5MB');
          }

          // Validate file type
          if (!selectedImage.type.startsWith('image/')) {
            throw new Error('File must be an image');
          }

          const fileName = `blog-${Date.now()}-${selectedImage.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          console.log('Uploading to filename:', fileName);

          const imageUrl = await storageService.uploadBlogImage(selectedImage, fileName);
          console.log('Image uploaded successfully:', imageUrl);

          blogData.image_url = imageUrl;
          setUploadingImage(false);
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          toast.error(`Image upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
          setUploadingImage(false);
          return;
        }
      } else if (editingPost && !imagePreview) {
        // If editing and no image preview, remove the image
        blogData.image_url = undefined;
      }

      console.log('Saving blog data:', blogData);

      if (editingPost) {
        console.log('Updating existing post:', editingPost.id);
        const updatedPost = await blogService.update(editingPost.id, blogData);
        console.log('Post updated successfully:', updatedPost);
        setPosts(posts.map(p => p.id === editingPost.id ? updatedPost : p));
        toast.success('Blog post updated successfully');
      } else {
        console.log('Creating new post');
        const newPost = await blogService.create(blogData);
        console.log('Post created successfully:', newPost);
        setPosts([newPost, ...posts]);
        toast.success('Blog post created successfully');
      }

      setIsDialogOpen(false);
      setSelectedImage(null);
      setImagePreview('');
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error(`Failed to save blog post: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading blog posts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Posts ({posts.length})</h2>
        <Button onClick={handleAddPost}>
          <Plus className="w-4 h-4 mr-2" />
          Add Post
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No blog posts found</p>
          <Button onClick={handleAddPost}>
            <Plus className="w-4 h-4 mr-2" />
            Create your first blog post
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                          {post.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <span>{post.read_time} min read</span>
                        <Badge variant="outline">{post.category}</Badge>
                        <span className="text-xs">/{post.slug}</span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button size="icon" variant="ghost" title="View Post">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleEditPost(post)} title="Edit Post">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDeletePost(post.id)} title="Delete Post">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  {post.image_url && (
                    <div className="mt-3">
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-20 h-12 object-cover rounded border"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSavePost(new FormData(e.currentTarget));
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={editingPost?.title} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue={editingPost?.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="React">React</SelectItem>
                    <SelectItem value="Next.js">Next.js</SelectItem>
                    <SelectItem value="AI">AI</SelectItem>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                    <SelectItem value="Tutorial">Tutorial</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" name="excerpt" defaultValue={editingPost?.excerpt} required rows={3} />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Featured Image</Label>
              <div className="space-y-2">
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="flex-1"
                  />
                  {uploadingImage && <Loader2 className="w-4 h-4 animate-spin" />}
                </div>
                <p className="text-xs text-muted-foreground">
                  Recommended: 1200x630px or larger, max 5MB
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown)</Label>
              <Textarea
                id="content"
                name="content"
                rows={12}
                placeholder="Write your blog post in Markdown..."
                className="font-mono"
                defaultValue={editingPost?.content}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={editingPost?.status || 'draft'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving || uploadingImage}>
                {saving || uploadingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {uploadingImage ? 'Uploading...' : 'Saving...'}
                  </>
                ) : (
                  `${editingPost ? 'Update' : 'Create'} Post`
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}