
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Calendar, 
  Home, 
  Users, 
  ClipboardCheck, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ClubAdminSidebar: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      icon: <Home className="h-4 w-4" />,
      name: 'Overview',
      href: '/club-admin-dashboard',
      active: pathname === '/club-admin-dashboard',
      badge: null
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      name: 'Events',
      href: '/club-admin-dashboard/events',
      active: pathname.includes('/club-admin-dashboard/events'),
      badge: null
    },
    {
      icon: <Users className="h-4 w-4" />,
      name: 'Clubs',
      href: '/club-admin-dashboard/clubs',
      active: pathname.includes('/club-admin-dashboard/clubs'),
      badge: null
    },
    {
      icon: <Users className="h-4 w-4" />,
      name: 'Members',
      href: '/club-admin-dashboard/members',
      active: pathname.includes('/club-admin-dashboard/members'),
      badge: null
    },
    {
      icon: <ClipboardCheck className="h-4 w-4" />,
      name: 'Attendance',
      href: '/club-admin-dashboard/attendance',
      active: pathname.includes('/club-admin-dashboard/attendance'),
      badge: null
    },
    {
      icon: <Settings className="h-4 w-4" />,
      name: 'Club Profile',
      href: '/club-admin-dashboard/profile',
      active: pathname.includes('/club-admin-dashboard/profile'),
      badge: null
    }
  ];

  const handleSignOut = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <aside className={cn(
      "relative h-screen py-6 flex flex-col border-r border-border bg-card transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <button 
        className="absolute -right-3 top-12 p-1 rounded-full bg-background border border-border z-10"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
      
      <div className={cn(
        "px-4 flex items-center mb-8",
        collapsed ? "justify-center" : "justify-start"
      )}>
        {collapsed ? (
          <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
            {user?.name?.charAt(0) || 'A'}
          </span>
        ) : (
          <>
            <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold mr-2">
              {user?.name?.charAt(0) || 'A'}
            </span>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold truncate">{user?.name || 'Club Admin'}</span>
              <span className="text-xs text-muted-foreground truncate">{user?.university || 'University'}</span>
            </div>
          </>
        )}
      </div>
      
      <nav className="space-y-1 px-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center px-4 py-2 text-sm rounded-md w-full",
              item.active
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
              collapsed ? "justify-center" : "justify-start"
            )}
          >
            {item.icon}
            {!collapsed && <span className="ml-2">{item.name}</span>}
            {!collapsed && item.badge && (
              <Badge variant="outline" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </Link>
        ))}
      </nav>
      
      <div className="mt-auto px-2">
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className={cn(
            "w-full flex items-center px-4 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
};

export default ClubAdminSidebar;
