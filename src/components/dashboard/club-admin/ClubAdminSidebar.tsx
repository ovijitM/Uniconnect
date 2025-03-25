
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard,
  Calendar, 
  Building2, 
  Users, 
  ClipboardCheck, 
  Settings, 
  LogOut,
  MenuIcon,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ClubAdminSidebar: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      icon: <LayoutDashboard className="h-4 w-4" />,
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
      icon: <Building2 className="h-4 w-4" />,
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

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* Mobile menu button (only visible on small screens) */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <Button
          variant="outline" 
          size="icon" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-full"
        >
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Shadcn Sidebar implementation */}
      <Sidebar
        className={cn(
          "transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <SidebarHeader>
          <div className="flex items-center px-4 py-2">
            <Avatar className="h-10 w-10 mr-2">
              <AvatarImage src={user?.profileImage} alt={user?.name || 'User'} />
              <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{user?.name || 'Club Admin'}</span>
              <span className="text-xs text-muted-foreground">{user?.university || 'University'}</span>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton 
                  asChild 
                  isActive={item.active}
                >
                  <Link to={item.href} className="flex items-center">
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                    {item.badge && (
                      <Badge variant="outline" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter>
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full flex items-center justify-start px-4 py-2 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50"
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Sign Out</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

export default ClubAdminSidebar;
