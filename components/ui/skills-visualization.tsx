'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const skills = [
  { name: 'React/Next.js', level: 95 },
  { name: 'Node.js/Express', level: 90 },
  { name: 'TypeScript', level: 88 },
  { name: 'Python/Django', level: 85 },
  { name: 'AWS/Azure', level: 80 },
  { name: 'MongoDB/SQL', level: 85 },
  { name: 'GraphQL', level: 75 },
  { name: 'Machine Learning', level: 70 },
];

export default function SkillsVisualization() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="space-y-6">
      {skills.map((skill, index) => (
        <motion.div
          key={skill.name}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="space-y-2"
        >
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm">{skill.name}</span>
            <span className="text-sm text-muted-foreground">{skill.level}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
              transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}