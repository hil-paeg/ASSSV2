
// // File: contexts/AuthContext.tsx
// 'use client';

// import React, { createContext, useContext, useState, ReactNode } from 'react';

// interface AuthContextType {
//   login: (username: string, password: string, role: 'user' | 'admin') => Promise<void>;
//   isLoading: boolean;
//   user: { id: string | number; role: 'client' | 'clientMember' | 'admin'; clientId?: number } | null;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<{ id: string | number; role: 'client' | 'clientMember' | 'admin'; clientId?: number } | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const login = async (username: string, password: string, role: 'user' | 'admin') => {
//     setIsLoading(true);
//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password, role }),
//       });

//       if (!response.ok) {
//         throw new Error('Login failed');
//       }

//       const data = await response.json();
//       setUser({ id: data.id, role: data.role, clientId: data.clientId });
//       localStorage.setItem('token', data.token);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('token');
//   };

//   return (
//     <AuthContext.Provider value={{ login, isLoading, user, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };



'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string | number;
  role: 'client' | 'clientMember' | 'admin';
  clientId?: number;
  token: string;
}

interface AuthContextType {
  login: (username: string, password: string, role: 'user' | 'admin') => Promise<void>;
  isLoading: boolean;
  user: User | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check for stored token on mount to restore session
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode token to extract user data (client-side, for simplicity)
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUser({
          id: decoded.id,
          role: decoded.role,
          clientId: decoded.clientId,
          token,
        });
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  const login = async (username: string, password: string, role: 'user' | 'admin') => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      const userData: User = {
        id: data.id,
        role: data.role,
        clientId: data.clientId,
        token: data.token,
      };
      setUser(userData);
      localStorage.setItem('token', data.token);
      router.push('/tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ login, isLoading, user, logout }}>
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