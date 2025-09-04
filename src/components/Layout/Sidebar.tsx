'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Ticket, 
  FolderOpen, 
  Plus, 
  Users, 
  BarChart3, 
  MessageSquare,
  BarChart,
  ChartAreaIcon
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  showBadge?: boolean;
};

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const newTicketNotifications = 3;

  const userNavItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Tickets', href: '/tickets', icon: Ticket },
    { name: 'Create Ticket', href: '/tickets/new', icon: Plus },
    { name: 'Analytics', href: '/client-analytics', icon: BarChart },
    { name: 'Messages', href: '/chat', icon: MessageSquare },
    { name: 'Knowledge Hub', href: '/knowledge', icon: FolderOpen },
  ];

  const adminNavItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'All Tickets', href: '/tickets', icon: Ticket, showBadge: true },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Messages', href: '/chat', icon: MessageSquare },
    { name: 'Reports', href: '/reports', icon: ChartAreaIcon },
    { name: 'Client Control', href: '/clientcontrol', icon: Users },
    { name: 'Knowledge Hub', href: '/knowledge', icon: FolderOpen },
    {name: 'Client Definition',href :'/client-definition', icon: Plus}
    // { name: 'Create Client', href: '/create-client', icon: Plus },
    //  { name: 'client contract', href: '/client-contract', icon: Plus },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

  return (
    <div className="bg-gradient-to-b from-blue-900 to-blue-800 text-white w-64 min-h-screen">
      <div className="p-6">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-lg'
                    : 'text-blue-200 hover:bg-blue-700/50 hover:text-white'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </div>

                {item.showBadge && newTicketNotifications > 0 && (
                  <span className="ml-auto inline-block text-xs bg-red-500 text-white font-semibold px-2 py-0.5 rounded-full">
                    {newTicketNotifications}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
