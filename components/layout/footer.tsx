'use client';

import { motion } from 'framer-motion';
import { Heart, Code } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">John Doe</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Full Stack Developer passionate about creating innovative digital experiences 
              with modern technologies and thoughtful design.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-medium">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {['About', 'Projects', 'Blog', 'Contact'].map((link) => (
                <li key={link}>
                  <a 
                    href={`#${link.toLowerCase()}`} 
                    className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-medium">Contact Info</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>San Francisco, CA</p>
              <p>john.doe@example.com</p>
              <p>Available for freelance work</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0"
          >
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>© 2024 John Doe. Built with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>and</span>
              <Code className="w-4 h-4 text-accent" />
              <span>using Next.js</span>
            </div>
            
            <div className="flex space-x-6">
              {['Privacy Policy', 'Terms of Service'].map((link) => (
                <a 
                  key={link}
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}