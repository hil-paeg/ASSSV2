




'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SessionProvider } from 'next-auth/react';

interface User {
  id: string | number;
  role: 'admin' | 'client' | 'clientMember';
  clientId?: number;
  username?: string;
  name?: string;
  client_name?: string;
  client_username?: string;
  member_id?: number;
  member_name?: string;
  designation?: string;
  email?: string;
  phone_number?: string;
  escalation_level?: number;
  start_date?: string;
  payment_cycle?: string;
  ticketsRemaining?: number;
  contractStartDate?: string;
  contract?: any;
  token: string;
}

interface LoginResponse {
  id: string | number;
  role: 'admin' | 'client' | 'clientMember';
  clientId?: number;
  token: string;
  username?: string;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Function to fetch user details using the token
  const fetchUserDetails = async (token: string): Promise<User | null> => {
    try {
      const response = await fetch('/api/auth/user-details', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  };

  // Function to validate token and get user data
  const validateTokenAndSetUser = async (token: string) => {
    try {
      // First, try to decode the token payload (client-side, just for basic info)
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      // Check if token is expired
      if (payload.exp && payload.exp < Date.now() / 1000) {
        throw new Error('Token expired');
      }

      // Fetch complete user details from server
      const userDetails = await fetchUserDetails(token);
      
      if (userDetails) {
        setUser({
          id: payload.id,
          role: payload.role,
          clientId: payload.clientId,
          username: payload.username,
          token: token,
          ...userDetails, // Merge server-fetched details
        });
      } else {
        throw new Error('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (token) {
        await validateTokenAndSetUser(token);
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (username: string, password: string, role: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });
      
      const data: LoginResponse = await response.json();
      
      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        
        // Fetch complete user details after successful login
        const userDetails = await fetchUserDetails(data.token);
        
        setUser({
          id: data.id,
          role: data.role,
          clientId: data.clientId,
          username: data.username,
          token: data.token,
          ...userDetails, // Merge server-fetched details
        });
        
        router.push('/dashboard');
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login Error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // Only navigate if we're not already on the home page
    if (pathname !== '/') {
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};