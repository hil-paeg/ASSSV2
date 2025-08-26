import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, Bell } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();

  // Example notification count (you can fetch this dynamically)
  const notificationCount = 3;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="w-full">
        <div className="flex justify-between items-center h-16 px-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className='text-red-500 font-bold text-xl'>
              Company Logo
            </div>
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

            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                {user?.role === 'admin' ? 'HIL-ADMIN' : 'Mr. Bhore'}
              </span>
              <span className="text-xs text-gray-500 bg-blue-100 px-2 py-1 rounded-full">
                {user?.role === 'admin' ? 'ADMIN' : 'CLIENT'}
              </span>
            </div>

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