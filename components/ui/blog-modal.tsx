'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Tag, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Components } from 'react-markdown';
import 'highlight.js/styles/github-dark.css';

interface Blog {
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

interface BlogModalProps {
    blog: Blog | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function BlogModal({ blog, isOpen, onClose }: BlogModalProps) {
    if (!blog) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed inset-4 md:inset-8 lg:inset-16 bg-card border border-border rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden max-w-4xl mx-auto"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
                            <div className="flex items-center space-x-3">
                                <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                                    {blog.category}
                                </Badge>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{blog.read_time} min read</span>
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="hover:bg-muted"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-hidden">
                            <div className="h-full overflow-y-auto">
                                <div className="p-6 space-y-6">
                                    {/* Blog Image */}
                                    {blog.image_url && (
                                        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                                            <img
                                                src={blog.image_url}
                                                alt={blog.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    {/* Blog Title */}
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                                            {blog.title}
                                        </h1>
                                        <p className="text-lg text-muted-foreground leading-relaxed">
                                            {blog.excerpt}
                                        </p>
                                    </div>

                                    {/* Blog Content */}
                                    <div className="prose prose-lg dark:prose-invert max-w-none">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            rehypePlugins={[rehypeHighlight]}
                                            components={{
                                                h1: ({ children }) => (
                                                    <h1 className="text-3xl font-bold mt-8 mb-4 text-foreground">{children}</h1>
                                                ),
                                                h2: ({ children }) => (
                                                    <h2 className="text-2xl font-semibold mt-6 mb-3 text-foreground">{children}</h2>
                                                ),
                                                h3: ({ children }) => (
                                                    <h3 className="text-xl font-semibold mt-5 mb-2 text-foreground">{children}</h3>
                                                ),
                                                p: ({ children }) => (
                                                    <p className="mb-4 leading-relaxed text-muted-foreground">{children}</p>
                                                ),
                                                ul: ({ children }) => (
                                                    <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>
                                                ),
                                                ol: ({ children }) => (
                                                    <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>
                                                ),
                                                li: ({ children }) => (
                                                    <li className="text-muted-foreground">{children}</li>
                                                ),
                                                blockquote: ({ children }) => (
                                                    <blockquote className="border-l-4 border-accent pl-4 my-4 italic text-muted-foreground bg-muted/30 py-2 rounded-r-md">
                                                        {children}
                                                    </blockquote>
                                                ),
                                                code: ({ inline, children, ...props }: any) => (
                                                    inline ? (
                                                        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-accent" {...props}>
                                                            {children}
                                                        </code>
                                                    ) : (
                                                        <code className="block bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto" {...props}>
                                                            {children}
                                                        </code>
                                                    )
                                                ),
                                                pre: ({ children }) => (
                                                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
                                                        {children}
                                                    </pre>
                                                ),
                                                a: ({ children, href }) => (
                                                    <a
                                                        href={href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-accent hover:text-accent/80 underline underline-offset-2"
                                                    >
                                                        {children}
                                                    </a>
                                                ),
                                                strong: ({ children }) => (
                                                    <strong className="font-semibold text-foreground">{children}</strong>
                                                ),
                                                em: ({ children }) => (
                                                    <em className="italic text-muted-foreground">{children}</em>
                                                ),
                                            }}
                                        >
                                            {blog.content}
                                        </ReactMarkdown>
                                    </div>

                                    {/* Blog Footer */}
                                    <div className="border-t border-border pt-6 mt-8">
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                                            <div className="text-sm text-muted-foreground">
                                                <p>Published on {new Date(blog.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}</p>
                                                {blog.updated_at !== blog.created_at && (
                                                    <p className="mt-1">
                                                        Last updated on {new Date(blog.updated_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Badge variant="outline" className="text-xs">
                                                    <Tag className="w-3 h-3 mr-1" />
                                                    {blog.category}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {blog.read_time} min
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-border bg-muted/30">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-muted-foreground">
                                    Thanks for reading! 📚
                                </div>
                                <Button variant="outline" onClick={onClose}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
