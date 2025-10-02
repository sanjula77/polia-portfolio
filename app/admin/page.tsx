'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, MessageSquare, TrendingUp, Plus, LogOut } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectsAdmin from '@/components/admin/projects-admin';
import BlogAdmin from '@/components/admin/blog-admin';
import MessagesAdmin from '@/components/admin/messages-admin';
import CVAdmin from '@/components/admin/cv-admin';
import AdminLogin from '@/components/admin/admin-login';
import { useAdminAuth } from '@/hooks/use-admin-auth';

const statsData = [
  {
    title: 'Total Visitors',
    value: '12,543',
    change: '+12%',
    icon: Users,
    positive: true,
  },
  {
    title: 'Projects',
    value: '24',
    change: '+3',
    icon: FileText,
    positive: true,
  },
  {
    title: 'Blog Posts',
    value: '18',
    change: '+2',
    icon: FileText,
    positive: true,
  },
  {
    title: 'Messages',
    value: '47',
    change: '+8',
    icon: MessageSquare,
    positive: true,
  },
];

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, isLoading, login, logout } = useAdminAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your portfolio content and analytics</p>
          </div>
          <Button
            variant="outline"
            onClick={logout}
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statsData.map((stat, index) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Tabs defaultValue="projects" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="blog">Blog Posts</TabsTrigger>
              <TabsTrigger value="cv">CV Management</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-6">
              <ProjectsAdmin />
            </TabsContent>

            <TabsContent value="blog" className="space-y-6">
              <BlogAdmin />
            </TabsContent>

            <TabsContent value="cv" className="space-y-6">
              <CVAdmin />
            </TabsContent>

            <TabsContent value="messages" className="space-y-6">
              <MessagesAdmin />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}