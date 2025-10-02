'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, MapPin, GraduationCap, Code, Database, Cloud, Brain, Wrench, User, Briefcase, Award, Clock, Monitor, Palette } from 'lucide-react';
import StacksCard from '@/components/ui/stacks-card';

const timeline = [
  {
    year: '2022-2026',
    title: 'BSc (Hons) in Information Technology',
    company: 'Horizon Campus',
    location: 'Sri Lanka',
    description: 'Currently pursuing undergraduate degree with focus on software development, AI/ML, and modern web technologies.',
    icon: GraduationCap,
    status: 'Current'
  }
];

const skillCategories = [
  {
    title: 'Languages & Fundamentals',
    icon: Code,
    skills: [
      { name: 'Python', level: 85 },
      { name: 'Java', level: 80 },
      { name: 'JavaScript', level: 90 },
      { name: 'TypeScript', level: 85 },
      { name: 'SQL', level: 75 },
      { name: 'C', level: 70 }
    ]
  },
  {
    title: 'Frameworks & Libraries',
    icon: Wrench,
    skills: [
      { name: 'Next.js', level: 90 },
      { name: 'FastAPI', level: 85 },
      { name: 'Jetpack Compose', level: 75 },
      { name: 'Laravel', level: 80 },
      { name: 'Django', level: 85 }
    ]
  },
  {
    title: 'Databases',
    icon: Database,
    skills: [
      { name: 'MongoDB', level: 85 },
      { name: 'Firebase', level: 80 },
      { name: 'Supabase', level: 85 },
      { name: 'PostgreSQL', level: 80 },
      { name: 'MySQL', level: 75 }
    ]
  },
  {
    title: 'Cloud & DevOps',
    icon: Cloud,
    skills: [
      { name: 'Docker', level: 75 },
      { name: 'Jenkins', level: 70 },
      { name: 'GitHub Actions', level: 80 },
      { name: 'AWS', level: 75 }
    ]
  },
  {
    title: 'AI / Data Science',
    icon: Brain,
    skills: [
      { name: 'NumPy', level: 80 },
      { name: 'Pandas', level: 85 },
      { name: 'Machine Learning', level: 75 },
      { name: 'Streamlit', level: 80 }
    ]
  }
];

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">About Me</h2>
          <div className="w-16 h-1 bg-blue-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            I'm a passionate Information Technology student with a strong focus on full-stack development,
            AI/ML technologies, and modern web applications. I love building innovative solutions
            and exploring cutting-edge technologies to solve real-world problems.
          </p>
        </motion.div>

        {/* Main Content Grid - Equal Widths */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Tech Stack Section - Left Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full"
          >
            <div className="bg-white dark:bg-[#1d293b] rounded-2xl pt-10 px-6 pb-8 shadow-lg h-full">
              {/* Tech Stack Only */}
              <StacksCard />
            </div>
          </motion.div>

          {/* Stats Cards - Right Side - 2x2 Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full grid grid-cols-2 gap-4"
          >
            {/* Education Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileHover={{
                scale: 1.02,
                y: -4
              }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="bg-white dark:bg-[#1d293b] rounded-xl p-6 shadow-lg cursor-pointer group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-3 group-hover:rotate-6 transition-transform duration-150 ease-out">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">BSc IT</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Horizon Campus</div>
              </div>
            </motion.div>

            {/* Projects Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileHover={{
                scale: 1.02,
                y: -4
              }}
              transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
              className="bg-white dark:bg-[#1d293b] rounded-xl p-6 shadow-lg cursor-pointer group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-3 group-hover:rotate-6 transition-transform duration-150 ease-out">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">10+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Projects Completed</div>
              </div>
            </motion.div>

            {/* Certifications Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileHover={{
                scale: 1.02,
                y: -4
              }}
              transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
              className="bg-white dark:bg-[#1d293b] rounded-xl p-6 shadow-lg cursor-pointer group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-3 group-hover:rotate-6 transition-transform duration-150 ease-out">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">5+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Certifications</div>
              </div>
            </motion.div>

            {/* Years Learning Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              whileHover={{
                scale: 1.02,
                y: -4
              }}
              transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
              className="bg-white dark:bg-[#1d293b] rounded-xl p-6 shadow-lg cursor-pointer group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-3 group-hover:rotate-6 transition-transform duration-150 ease-out">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">3+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Years Learning</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Areas of Expertise - Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {/* Frontend Development */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileHover={{
              scale: 1.02,
              y: -4
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="bg-white dark:bg-[#1d293b] rounded-xl p-6 shadow-lg cursor-pointer group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4 group-hover:rotate-6 transition-transform duration-150 ease-out">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Frontend Development</h4>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Creating responsive, accessible interfaces with React, TypeScript, and modern CSS frameworks
            </p>
          </motion.div>

          {/* Backend Architecture */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileHover={{
              scale: 1.02,
              y: -4
            }}
            transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
            className="bg-white dark:bg-[#1d293b] rounded-xl p-6 shadow-lg cursor-pointer group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4 group-hover:rotate-6 transition-transform duration-150 ease-out">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Backend Architecture</h4>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Building scalable APIs and databases with Python, FastAPI, and cloud infrastructure
            </p>
          </motion.div>

          {/* AI & Data Science */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileHover={{
              scale: 1.02,
              y: -4
            }}
            transition={{ duration: 0.6, delay: 1.3, ease: "easeOut" }}
            className="bg-white dark:bg-[#1d293b] rounded-xl p-6 shadow-lg cursor-pointer group"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mr-4 group-hover:rotate-6 transition-transform duration-150 ease-out">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">AI & Data Science</h4>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              Developing machine learning models and data analysis solutions with Python and modern AI tools
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}