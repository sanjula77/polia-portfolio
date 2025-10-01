'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, MapPin, Award } from 'lucide-react';
import SkillsVisualization from '@/components/ui/skills-visualization';

const timeline = [
  {
    year: '2024',
    title: 'Senior Full Stack Developer',
    company: 'Tech Innovations Inc.',
    location: 'San Francisco, CA',
    description: 'Leading development of AI-powered applications using React, Node.js, and cloud technologies.',
    icon: Award,
  },
  {
    year: '2023',
    title: 'Software Engineer Intern',
    company: 'Microsoft',
    location: 'Seattle, WA',
    description: 'Developed features for Azure cloud services, working with distributed systems and microservices architecture.',
    icon: Award,
  },
  {
    year: '2022',
    title: 'Computer Science Degree',
    company: 'Stanford University',
    location: 'Stanford, CA',
    description: 'B.S. in Computer Science with focus on AI/ML and software engineering. Graduated Magna Cum Laude.',
    icon: Award,
  },
];

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="py-20 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">About Me</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          I thrive in dynamic environments, quickly mastering new technologies and applying
           them to real-world problems. With a strong focus on AI, machine learning, and backend development,
            I enjoy creating solutions that are innovative, efficient, and sustainable, 
            delivering meaningful impact.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-semibold mb-8">Experience & Education</h3>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-accent/20"></div>
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="relative flex items-start space-x-6 pb-8"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center border-2 border-accent/20">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-accent">{item.year}</span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        {item.location}
                      </div>
                    </div>
                    <h4 className="text-lg font-semibold mb-1">{item.title}</h4>
                    <p className="text-accent font-medium mb-2">{item.company}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-semibold mb-8">Skills & Technologies</h3>
            <SkillsVisualization />
          </motion.div>
        </div>
      </div>
    </section>
  );
}