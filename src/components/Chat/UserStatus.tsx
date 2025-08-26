import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

interface UserStatusProps {
  user: {
    id: string;
    name: string;
    role: 'user' | 'admin';
    company?: string;
  };
  isOnline: boolean;
  isTyping?: boolean;
  showDetails?: boolean;
}

const UserStatus: React.FC<UserStatusProps> = ({ 
  user, 
  isOnline, 
  isTyping = false, 
  showDetails = false 
}) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = () => {
    if (isTyping) return 'bg-yellow-500';
    if (isOnline) return 'bg-green-500';
    return 'bg-gray-400';
  };

  const getStatusText = () => {
    if (isTyping) return 'typing...';
    if (isOnline) return 'online';
    return 'offline';
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Avatar>
          <AvatarFallback className="bg-blue-600 text-white">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor()}`} />
      </div>
      
      {showDetails && (
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm truncate">{user.name}</h4>
            <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'} className="text-xs">
              {user.role}
            </Badge>
          </div>
          {user.company && (
            <p className="text-xs text-muted-foreground truncate">{user.company}</p>
          )}
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
            <span className="text-xs text-muted-foreground">{getStatusText()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserStatus;
