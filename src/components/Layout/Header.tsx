'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface UserDetails {
  username: string;
  member_id?: number;
  phone_number?: string | null;
  client_username?: string;
  client_name?:string;
}

const Header = () => {
  const { user, logout } = useAuth();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Example, replace with API call if needed

  useEffect(() => {
    if (user && user.role !== 'admin') {
      // Fetch user details for client or clientMember
      const fetchUserDetails = async () => {
        setIsLoading(true);
        try {
          const response = await fetch('/api/auth/user-details', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch user details');
          }
          const data = await response.json();
          setUserDetails(data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUserDetails();
    } else if (user && user.role === 'admin') {
      // Set static details for admin
      setUserDetails({ username: 'admin@gmail.com' });
    }
  }, [user]);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="w-full">
        <div className="flex justify-between items-center h-16 px-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="text-red-500 font-bold text-xl">Company Logo</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              ASSS Portal
            </h1>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100 relative">
                <Bell className="h-5 w-5 text-gray-600" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Button>
              {user?.role === 'admin' && (
                <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded-lg py-1 px-2 mt-2 -ml-16 z-10">
                  New tickets added
                </div>
              )}
            </div>

            {user && userDetails && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100">
                    <User className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {userDetails.username}
                    </span>
                    <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded-full">
                      {user.role === 'admin' ? 'ADMIN' : user.role === 'client' ? 'CLIENT' : 'MEMBER'}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4">
                  <div className="space-y-2">
                    <div>
                      <span className="font-semibold">Username: </span>
                      <span>{userDetails.username}</span>
                    </div>
                    {user.role === 'clientMember' && (
                      <>
                        <div>
                          <span className="font-semibold">Member ID: </span>
                          <span>{userDetails.member_id}</span>
                        </div>
                        {userDetails.phone_number && (
                          <div>
                            <span className="font-semibold">Phone: </span>
                            <span>{userDetails.phone_number}</span>
                          </div>
                        )}
                        <div>
                          <span className="font-semibold">Client Username: </span>
                          <span>{userDetails.client_name}</span>
                        </div>
                      </>
                    )}
                    {user.role === 'client' && (
                      <div>
                        <span className="font-semibold">Client Username: </span>
                        <span>{userDetails.client_name}</span>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="hover:bg-red-50 hover:border-red-200 flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;