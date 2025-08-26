
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '@/types';
import { io, Socket } from 'socket.io-client';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Check for stored auth
    const storedUser = localStorage.getItem('amc_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Initialize socket connection for authenticated user
      if (userData) {
        const newSocket = io('http://localhost:3001', {
          auth: { 
            userId: userData.id, 
            name: userData.name, 
            role: userData.role 
          },
          path: '/socket.io',
          transports: ['websocket', 'polling']
        });
        setSocket(newSocket);
      }
    }
    setIsLoading(false);
  }, []);

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    company: string;
    phone?: string;
  }) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }

      const newUser = await response.json();
      return newUser;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, role: 'user' | 'admin') => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Invalid credentials');
      }

      const foundUser = await response.json();
      setUser(foundUser);
      localStorage.setItem('amc_user', JSON.stringify(foundUser));
      
      // Initialize socket connection
      const newSocket = io('http://localhost:3001', {
        auth: { 
          userId: foundUser.id, 
          name: foundUser.name, 
          role: foundUser.role 
        },
        path: '/socket.io',
        transports: ['websocket', 'polling']
      });
      setSocket(newSocket);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('amc_user');
    
    // Disconnect socket
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('amc_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register,
      updateUser,
      socket,
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
