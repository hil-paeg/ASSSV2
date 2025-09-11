
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



// 'use client';

// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { useRouter } from 'next/navigation';

// interface User {
//   id: string | number;
//   role: 'client' | 'clientMember' | 'admin';
//   clientId?: number;
//   token: string;
// }

// interface AuthContextType {
//   login: (username: string, password: string, role: 'user' | 'admin') => Promise<void>;
//   isLoading: boolean;
//   user: User | null;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   // Check for stored token on mount to restore session
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         // Decode token to extract user data (client-side, for simplicity)
//         const decoded = JSON.parse(atob(token.split('.')[1]));
//         setUser({
//           id: decoded.id,
//           role: decoded.role,
//           clientId: decoded.clientId,
//           token,
//         });
//       } catch (error) {
//         console.error('Error decoding token:', error);
//         localStorage.removeItem('token');
//         setUser(null);
//       }
//     }
//   }, []);

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
//       const userData: User = {
//         id: data.id,
//         role: data.role,
//         clientId: data.clientId,
//         token: data.token,
//       };
//       setUser(userData);
//       localStorage.setItem('token', data.token);
//       router.push('/tickets');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('token');
//     router.push('/');
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








// 'use client';

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import jwt from 'jsonwebtoken';

// interface User {
//   id: string | number;
//   role: 'admin' | 'client' | 'clientMember';
//   clientId?: number;
//   email?: string;
//   name?: string;
//   ticketsRemaining?: number;
//   contractStartDate?: string;  
//   contractEndDate?: string;
//   company?: string;
//   phone?: string;

// }

// interface AuthContextType {
//   user: User | null;
//   login: (username: string, password: string, role: string) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-fallback-secret') as User;
//         setUser(decoded);
//       } catch (error) {
//         console.error('Invalid token:', error);
//         localStorage.removeItem('token');
//         setUser(null);
//       }
//     }
//   }, []);

//   const login = async (username: string, password: string, role: string) => {
//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password, role }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         localStorage.setItem('token', data.token);
//         setUser({ id: data.id, role: data.role, clientId: data.clientId });
//         router.push('/dashboard');
//       } else {
//         throw new Error(data.error || 'Login failed');
//       }
//     } catch (error) {
//       console.error('Login Error:', error);
//       throw error;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     router.push('/login');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
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




// 'use client';

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import jwt from 'jsonwebtoken';

// interface User {
//   id: string | number;
//   role: 'admin' | 'client' | 'clientMember';
//   clientId?: number;
//   email?: string;
//   name?: string;
//   ticketsRemaining?: number;
//   contractStartDate?: string;
//   contractEndDate?: string;
//   company?: string;
//   phone?: string;
//   token: string;
// }

// interface LoginResponse {
//   id: string | number;
//   role: 'admin' | 'client' | 'clientMember';
//   clientId?: number;
//   token: string;
//   error?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (username: string, password: string, role: string) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-fallback-secret') as User;
//         setUser(decoded);
//       } catch (error) {
//         console.error('Invalid token:', error);
//         localStorage.removeItem('token');
//         setUser(null);
//       }
//     }
//   }, []);

//   const login = async (username: string, password: string, role: string) => {
//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password, role }),
//       });
//       const data: LoginResponse = await response.json();
//       if (response.ok) {
//         localStorage.setItem('token', data.token);
//         setUser({
//           id: data.id,
//           role: data.role,
//           clientId: data.clientId,
//           token: data.token,
//         });
//         router.push('/dashboard');
//       } else {
//         throw new Error(data.error || 'Login failed');
//       }
//     } catch (error) {
//       console.error('Login Error:', error);
//       throw error;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     router.push('/login');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
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




// 'use client';

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// interface User {
//   id: string | number;
//   role: 'admin' | 'client' | 'clientMember';
//   clientId?: number;
//   email?: string;
//   name?: string;
//   username?: string;
//   client_name?: string;
//   client_username?: string;
//   member_id?: number;
//   phone_number?: string;
//   ticketsRemaining?: number;
//   contractStartDate?: string;
//   contractEndDate?: string;
//   company?: string;
//   phone?: string;
//   token: string;
// }

// interface LoginResponse {
//   id: string | number;
//   role: 'admin' | 'client' | 'clientMember';
//   clientId?: number;
//   token: string;
//   username?: string;
//   error?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: (username: string, password: string, role: string) => Promise<void>;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   // Function to fetch user details using the token
//   const fetchUserDetails = async (token: string): Promise<User | null> => {
//     try {
//       const response = await fetch('/api/auth/user-details', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch user details');
//       }

//       const userData = await response.json();
//       return userData;
//     } catch (error) {
//       console.error('Error fetching user details:', error);
//       return null;
//     }
//   };

//   // Function to validate token and get user data
//   const validateTokenAndSetUser = async (token: string) => {
//     try {
//       // First, try to decode the token payload (client-side, just for basic info)
//       const payload = JSON.parse(atob(token.split('.')[1]));
      
//       // Check if token is expired
//       if (payload.exp && payload.exp < Date.now() / 1000) {
//         throw new Error('Token expired');
//       }

//       // Fetch complete user details from server
//       const userDetails = await fetchUserDetails(token);
      
//       if (userDetails) {
//         setUser({
//           id: payload.id,
//           role: payload.role,
//           clientId: payload.clientId,
//           username: payload.username,
//           token: token,
//           ...userDetails, // Merge server-fetched details
//         });
//       } else {
//         throw new Error('Failed to fetch user details');
//       }
//     } catch (error) {
//       console.error('Token validation failed:', error);
//       localStorage.removeItem('token');
//       setUser(null);
//     }
//   };

//   useEffect(() => {
//     const initializeAuth = async () => {
//       setLoading(true);
//       const token = localStorage.getItem('token');
      
//       if (token) {
//         await validateTokenAndSetUser(token);
//       }
      
//       setLoading(false);
//     };

//     initializeAuth();
//   }, []);

//   const login = async (username: string, password: string, role: string) => {
//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ username, password, role }),
//       });
      
//       const data: LoginResponse = await response.json();
      
//       if (response.ok && data.token) {
//         localStorage.setItem('token', data.token);
        
//         // Fetch complete user details after successful login
//         const userDetails = await fetchUserDetails(data.token);
        
//         setUser({
//           id: data.id,
//           role: data.role,
//           clientId: data.clientId,
//           username: data.username,
//           token: data.token,
//           ...userDetails, // Merge server-fetched details
//         });
        
//         router.push('/dashboard');
//       } else {
//         throw new Error(data.error || 'Login failed');
//       }
//     } catch (error) {
//       console.error('Login Error:', error);
//       throw error;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     router.push('/login');
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout }}>
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

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
    router.push('/');
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