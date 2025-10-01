'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
  demoUrl: string;
  githubUrl: string;
  featured: boolean;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="group relative bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      {project.featured && (
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Featured
          </Badge>
        </div>
      )}

      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors duration-200">
            {project.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          {project.demoUrl && project.demoUrl !== '#' ? (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 hover:bg-accent hover:text-accent-foreground transition-colors"
              asChild
            >
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
                title={`View ${project.title} demo`}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Demo
              </a>
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 opacity-50 cursor-not-allowed"
              disabled
              title="Demo not available"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Demo
            </Button>
          )}

          {project.githubUrl && project.githubUrl !== '#' ? (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 hover:bg-accent hover:text-accent-foreground transition-colors"
              asChild
            >
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
                title={`View ${project.title} source code`}
              >
                <Github className="w-4 h-4 mr-2" />
                Code
              </a>
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 opacity-50 cursor-not-allowed"
              disabled
              title="Source code not available"
            >
              <Github className="w-4 h-4 mr-2" />
              Code
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}