'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Trash2, Eye, Check, X, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cvService, storageService, type CVFile, type CreateCVData } from '@/lib/database';

export default function CVAdmin() {
    const [cvFiles, setCvFiles] = useState<CVFile[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Load CV files on component mount
    useEffect(() => {
        loadCVFiles();
    }, []);

    const loadCVFiles = async () => {
        try {
            setLoading(true);
            const data = await cvService.getAllAdmin();
            setCvFiles(data);
        } catch (error) {
            console.error('Error loading CV files:', error);
            toast.error('Failed to load CV files');
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Please select a PDF or Word document');
                return;
            }

            // Validate file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                toast.error('File size must be less than 10MB');
                return;
            }

            setSelectedFile(file);
        }
    };

    const handleUploadCV = async () => {
        if (!selectedFile) {
            toast.error('Please select a file first');
            return;
        }

        try {
            setUploading(true);

            // Upload file to storage
            const fileName = `cv-${Date.now()}-${selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const fileUrl = await storageService.uploadCVFile(selectedFile, fileName);

            // Create CV record in database
            const cvData: CreateCVData = {
                file_name: selectedFile.name,
                file_url: fileUrl,
                file_size: selectedFile.size,
                file_type: selectedFile.type,
                version: `v${Date.now()}`,
                is_active: cvFiles.length === 0, // Make first CV active by default
                description: `CV uploaded on ${new Date().toLocaleDateString()}`
            };

            const newCV = await cvService.create(cvData);
            setCvFiles([newCV, ...cvFiles]);

            toast.success('CV uploaded successfully');
            setIsDialogOpen(false);
            setSelectedFile(null);

            // Reset file input
            const fileInput = document.getElementById('cv-file') as HTMLInputElement;
            if (fileInput) fileInput.value = '';

        } catch (error) {
            console.error('Error uploading CV:', error);
            toast.error('Failed to upload CV');
        } finally {
            setUploading(false);
        }
    };

    const handleSetActive = async (id: string) => {
        try {
            await cvService.setActive(id);
            setCvFiles(cvFiles.map(cv => ({
                ...cv,
                is_active: cv.id === id
            })));
            toast.success('CV set as active');
        } catch (error) {
            console.error('Error setting active CV:', error);
            toast.error('Failed to set active CV');
        }
    };

    const handleDeleteCV = async (id: string, fileName: string) => {
        if (!confirm('Are you sure you want to delete this CV?')) return;

        try {
            // Delete from storage
            await storageService.deleteCVFile(fileName);

            // Delete from database
            await cvService.delete(id);
            setCvFiles(cvFiles.filter(cv => cv.id !== id));

            toast.success('CV deleted successfully');
        } catch (error) {
            console.error('Error deleting CV:', error);
            toast.error('Failed to delete CV');
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (fileType: string) => {
        if (fileType.includes('pdf')) return '📄';
        if (fileType.includes('word')) return '📝';
        return '📁';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="ml-2">Loading CV files...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">CV Management ({cvFiles.length})</h2>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload CV
                </Button>
            </div>

            {cvFiles.length === 0 ? (
                <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No CV files found</p>
                    <Button onClick={() => setIsDialogOpen(true)}>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload your first CV
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {cvFiles.map((cv, index) => (
                        <motion.div
                            key={cv.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2 flex-1">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-2xl">{getFileIcon(cv.file_type || '')}</span>
                                                <CardTitle className="text-lg">{cv.file_name}</CardTitle>
                                                {cv.is_active && (
                                                    <Badge variant="default" className="bg-green-600">
                                                        <Check className="w-3 h-3 mr-1" />
                                                        Active
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                <span>Version: {cv.version}</span>
                                                <span>Size: {cv.file_size ? formatFileSize(cv.file_size) : 'Unknown'}</span>
                                                <span>Type: {cv.file_type || 'Unknown'}</span>
                                                <span>Uploaded: {new Date(cv.created_at).toLocaleDateString()}</span>
                                            </div>
                                            {cv.description && (
                                                <p className="text-sm text-muted-foreground">{cv.description}</p>
                                            )}
                                        </div>
                                        <div className="flex space-x-1">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                title="Download CV"
                                                asChild
                                            >
                                                <a href={cv.file_url} target="_blank" rel="noopener noreferrer">
                                                    <Download className="w-4 h-4" />
                                                </a>
                                            </Button>
                                            {!cv.is_active && (
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleSetActive(cv.id)}
                                                    title="Set as Active"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </Button>
                                            )}
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleDeleteCV(cv.id, cv.file_name)}
                                                title="Delete CV"
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Upload Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Upload New CV</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="cv-file">Select CV File</Label>
                            <Input
                                id="cv-file"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileSelect}
                                className="flex-1"
                            />
                            <p className="text-xs text-muted-foreground">
                                Supported formats: PDF, DOC, DOCX (max 10MB)
                            </p>
                        </div>

                        {selectedFile && (
                            <div className="p-3 bg-muted rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <span className="text-2xl">{getFileIcon(selectedFile.type)}</span>
                                    <div>
                                        <p className="font-medium">{selectedFile.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatFileSize(selectedFile.size)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUploadCV}
                                disabled={!selectedFile || uploading}
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload CV
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
