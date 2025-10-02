'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Admin password - In production, this should be an environment variable
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

// Session storage key
const ADMIN_SESSION_KEY = 'admin_authenticated';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface AdminSession {
  authenticated: boolean;
  timestamp: number;
}

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = () => {
    try {
      const sessionData = localStorage.getItem(ADMIN_SESSION_KEY);
      if (sessionData) {
        const session: AdminSession = JSON.parse(sessionData);
        const now = Date.now();
        
        // Check if session is still valid (within 24 hours)
        if (session.authenticated && (now - session.timestamp) < SESSION_DURATION) {
          setIsAuthenticated(true);
        } else {
          // Session expired, clear it
          localStorage.removeItem(ADMIN_SESSION_KEY);
        }
      }
    } catch (error) {
      console.error('Error checking admin session:', error);
      localStorage.removeItem(ADMIN_SESSION_KEY);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      const session: AdminSession = {
        authenticated: true,
        timestamp: Date.now()
      };
      
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      setIsAuthenticated(true);
      toast.success('Successfully authenticated! Welcome to admin dashboard.');
      return true;
    } else {
      toast.error('Invalid password. Please try again.');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
    toast.success('Successfully logged out.');
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout
  };
}
