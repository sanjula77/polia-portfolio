'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Download, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FloatingGeometry from '@/components/3d/floating-geometry';
import { cvService, type CVFile } from '@/lib/database';
import { toast } from 'sonner';

export default function HeroSection() {
  const [cvFile, setCvFile] = useState<CVFile | null>(null);
  const [loadingCV, setLoadingCV] = useState(true);

  useEffect(() => {
    loadActiveCV();
  }, []);

  const loadActiveCV = async () => {
    try {
      setLoadingCV(true);
      const cv = await cvService.getActive();
      setCvFile(cv);
    } catch (error) {
      console.error('Error loading CV:', error);
    } finally {
      setLoadingCV(false);
    }
  };

  const scrollToAbout = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownloadCV = () => {
    if (!cvFile) {
      toast.error('CV not available');
      return;
    }

    try {
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = cvFile.file_url;
      link.download = cvFile.file_name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('CV download started');
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast.error('Failed to download CV');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <FloatingGeometry />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
          >
            <span className="block">Building the Future</span>
            <span className="block text-accent">with Code & AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Exploring the power of artificial intelligence and modern engineering to design intelligent, scalable, and meaningful digital solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6"
          >
            <Button
              size="lg"
              onClick={handleDownloadCV}
              disabled={loadingCV || !cvFile}
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingCV ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : cvFile ? (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download CV
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  CV Not Available
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToAbout}
              className="px-8 py-3 text-base font-medium"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Projects
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <button
            onClick={scrollToAbout}
            className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <span className="text-sm font-medium mb-2">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowDown className="h-5 w-5" />
            </motion.div>
          </button>
        </motion.div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-5" />
    </section>
  );
}