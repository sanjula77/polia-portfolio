'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, CreditCard as Edit, Trash2, ExternalLink, Github, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { projectService, storageService, type Project, type CreateProjectData } from '@/lib/database';

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAllAdmin();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setSelectedImage(null);
    setImagePreview('');
    setIsDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setImagePreview(project.image_url || '');
    setSelectedImage(null);
    setIsDialogOpen(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await projectService.delete(id);
      setProjects(projects.filter(p => p.id !== id));
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
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

  const handleSaveProject = async (formData: FormData) => {
    try {
      setSaving(true);

      const projectData: CreateProjectData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        demo_url: formData.get('demoUrl') as string || undefined,
        github_url: formData.get('githubUrl') as string || undefined,
        tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(Boolean),
        category: formData.get('category') as string,
        featured: formData.get('featured') === 'on',
        status: formData.get('status') as 'draft' | 'published' | 'archived',
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

          const fileName = `project-${Date.now()}-${selectedImage.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          console.log('Uploading to filename:', fileName);

          const imageUrl = await storageService.uploadProjectImage(selectedImage, fileName);
          console.log('Image uploaded successfully:', imageUrl);

          projectData.image_url = imageUrl;
          setUploadingImage(false);
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          toast.error(`Image upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
          setUploadingImage(false);
          return;
        }
      } else if (editingProject && !imagePreview) {
        // If editing and no image preview, remove the image
        projectData.image_url = undefined;
      }

      console.log('Saving project data:', projectData);

      if (editingProject) {
        console.log('Updating existing project:', editingProject.id);
        const updatedProject = await projectService.update(editingProject.id, projectData);
        console.log('Project updated successfully:', updatedProject);
        setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p));
        toast.success('Project updated successfully');
      } else {
        console.log('Creating new project');
        const newProject = await projectService.create(projectData);
        console.log('Project created successfully:', newProject);
        setProjects([newProject, ...projects]);
        toast.success('Project created successfully');
      }

      setIsDialogOpen(false);
      setSelectedImage(null);
      setImagePreview('');
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    } finally {
      setSaving(false);
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading projects...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Projects ({projects.length})</h2>
        <Button onClick={handleAddProject}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No projects found</p>
          <Button onClick={handleAddProject}>
            <Plus className="w-4 h-4 mr-2" />
            Create your first project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <div className="relative">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-32 bg-muted rounded-t-lg flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">No image</span>
                    </div>
                  )}
                  {project.featured && (
                    <Badge className="absolute top-2 right-2 bg-accent">Featured</Badge>
                  )}
                  <Badge
                    variant={project.status === 'published' ? 'default' : 'secondary'}
                    className="absolute top-2 left-2"
                  >
                    {project.status}
                  </Badge>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <div className="flex space-x-1">
                      <Button size="icon" variant="ghost" onClick={() => handleEditProject(project)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDeleteProject(project.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span className="capitalize">{project.category}</span>
                    <div className="flex space-x-2">
                      {project.demo_url && (
                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSaveProject(new FormData(e.currentTarget));
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={editingProject?.title} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue={editingProject?.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AI">AI</SelectItem>
                    <SelectItem value="Web">Web</SelectItem>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="IoT">IoT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={editingProject?.description} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" name="tags" defaultValue={editingProject?.tags?.join(', ')} placeholder="React, Node.js, TypeScript" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="demoUrl">Demo URL</Label>
                <Input id="demoUrl" name="demoUrl" type="url" defaultValue={editingProject?.demo_url} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input id="githubUrl" name="githubUrl" type="url" defaultValue={editingProject?.github_url} />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Project Image</Label>
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
                  Recommended: 800x600px or larger, max 5MB
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={editingProject?.status || 'draft'}>
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
              <div className="space-y-2">
                <Label htmlFor="featured">Featured Project</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    name="featured"
                    defaultChecked={editingProject?.featured || false}
                  />
                  <Label htmlFor="featured" className="text-sm">Show on homepage</Label>
                </div>
              </div>
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
                  `${editingProject ? 'Update' : 'Create'} Project`
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}