// 'use client';

// import React, { useState } from 'react';
// import { useAuth } from '@/contexts/AuthContext';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
// import { Loader2, Shield, User, UserPlus } from 'lucide-react';
// import { toast } from '@/hooks/use-toast';

// const LoginForm: React.FC = () => {
//   const { login, isLoading } = useAuth();
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [activeTab, setActiveTab] = useState('user');
//   const [showRegister, setShowRegister] = useState(false);
//   const [forgotEmail, setForgotEmail] = useState('');
//   const [isSendingReset, setIsSendingReset] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       await login(username, password, activeTab as 'user' | 'admin');
//       toast({
//         title: 'Login Successful',
//         description: `Welcome to AMC Portal, ${activeTab === 'user' ? 'Client' : 'Admin'}!`,
//       });
//     } catch (error) {
//       toast({
//         title: 'Login Failed',
//         description: 'Invalid username or password. Please try again.',
//         variant: 'destructive',
//       });
//     }
//   };

//   const handleForgotPassword = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSendingReset(true);

//     try {
//       const response = await fetch('/api/auth/forgot-password/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           email: forgotEmail,
//           userType: activeTab === 'user' ? 'client' : 'admin' 
//         }),
//       });

//       if (response.ok) {
//         toast({
//           title: 'Password Reset Email Sent',
//           description: 'Check your email for a password reset link.',
//         });
//         setForgotEmail('');
//       } else {
//         const data = await response.json();
//         toast({
//           title: 'Error',
//           description: data.error || 'Failed to send reset email.',
//           variant: 'destructive',
//         });
//       }
//     } catch (error) {
//       toast({
//         title: 'Error',
//         description: 'An unexpected error occurred.',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsSendingReset(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
//       <Card className="w-full max-w-md shadow-xl">
//         <CardHeader className="text-center">
//           <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
//             ASSS Portal
//           </CardTitle>
//           <CardDescription className="text-gray-600">
//             After sales service support
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="user" className="flex items-center gap-2">
//                 <User className="h-4 w-4" />
//                 Client
//               </TabsTrigger>
//               <TabsTrigger value="admin" className="flex items-center gap-2">
//                 <Shield className="h-4 w-4" />
//                 Admin
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="user" className="mt-6">
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="username">Username</Label>
//                   <Input
//                     id="username"
//                     type="text"
//                     placeholder="Enter username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="password">Password</Label>
//                   <Input
//                     id="password"
//                     type="password"
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <Button type="submit" className="w-full" disabled={isLoading}>
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Signing in...
//                     </>
//                   ) : (
//                     'Sign In as Client'
//                   )}
//                 </Button>
//                 <div className="text-center">
//                   <button
//                     type="button"
//                     onClick={() => setShowRegister(false)}
//                     className="text-sm text-blue-600 hover:text-blue-800 mt-2"
//                   >
//                     Forgot Password?
//                   </button>
//                 </div>
//               </form>
             
//             </TabsContent>

//             <TabsContent value="admin" className="mt-6">
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="admin-username">Admin Username</Label>
//                   <Input
//                     id="admin-username"
//                     type="text"
//                     placeholder="admin@gmail.com"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="admin-password">Password</Label>
//                   <Input
//                     id="admin-password"
//                     type="password"
//                     placeholder="Enter admin password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                   />
//                 </div>
//                 <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700" disabled={isLoading}>
//                   {isLoading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Signing in...
//                     </>
//                   ) : (
//                     'Sign In as Admin'
//                   )}
//                 </Button>
//               </form>
//             </TabsContent>
//           </Tabs>
//         </CardContent>


//       </Card>
//     </div>
//   );
// };

// export default LoginForm;




'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, Shield, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('user');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(username, password, activeTab as 'user' | 'admin');
      toast({
        title: 'Login Successful',
        description: `Welcome to AMC Portal, ${activeTab === 'user' ? 'Client' : 'Admin'}!`,
      });
    } catch (error: any) {
      let errorMessage = 'Incorrect username or password.';
      if (error.response?.status === 401) {
        if (error.response?.data?.error === 'Invalid admin credentials') {
          errorMessage = 'Incorrect admin username or password.';
        } else if (error.response?.data?.error === 'Invalid username or password') {
          errorMessage = 'Incorrect username or password.';
        }
      } else if (error.response?.status === 400) {
        errorMessage = 'Please provide both username and password.';
      }
      setError(errorMessage);
      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            ASSS Portal
          </CardTitle>
          <CardDescription className="text-gray-600">
            After sales service support
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Client
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isSubmitting || isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting || isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full relative" 
                  disabled={isSubmitting || isLoading}
                >
                  {(isSubmitting || isLoading) ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In as Client'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="admin" className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="admin-username">Admin Username</Label>
                  <Input
                    id="admin-username"
                    type="text"
                    placeholder="admin@gmail.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={isSubmitting || isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isSubmitting || isLoading}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-orange-600 hover:bg-orange-700 relative" 
                  disabled={isSubmitting || isLoading}
                >
                  {(isSubmitting || isLoading) ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    'Sign In as Admin'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;