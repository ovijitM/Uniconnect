
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Bookmark, 
  LogOut,
  Search,
  Settings,
  Bell,
  HelpCircle,
  Home,
  BarChart3,
  MessagesSquare,
  UserCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';

const StudentSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications(user?.id);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src={user?.profileImage} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user?.name ? getInitials(user.name) : 'ST'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="font-semibold line-clamp-1">{user?.name || 'Student'}</div>
            <p className="text-xs text-muted-foreground line-clamp-1">{user?.university || 'University Student'}</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/student-dashboard')}
              onClick={() => navigate('/student-dashboard')}
              tooltip="Dashboard"
              className="gap-3"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Overview</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/student-dashboard/events')}
              onClick={() => navigate('/student-dashboard/events')}
              tooltip="Events"
              className="gap-3"
            >
              <Calendar className="h-5 w-5" />
              <span>My Events</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/student-dashboard/clubs')}
              onClick={() => navigate('/student-dashboard/clubs')}
              tooltip="Clubs"
              className="gap-3"
            >
              <Users className="h-5 w-5" />
              <span>My Clubs</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/student-dashboard/notifications')}
              onClick={() => navigate('/student-dashboard/notifications')}
              tooltip="Notifications"
              className="gap-3 relative"
            >
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
              
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className={cn(
                    "absolute top-0 right-0 transform translate-x-1 -translate-y-1 px-1 py-0.5 min-w-[20px] h-5 flex items-center justify-center"
                  )}
                >
                  {unreadCount}
                </Badge>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/student-dashboard/messages')}
              onClick={() => navigate('/student-dashboard/messages')}
              tooltip="Messages"
              className="gap-3"
            >
              <MessagesSquare className="h-5 w-5" />
              <span>Messages</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarSeparator />
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/events')}
              onClick={() => navigate('/events')}
              tooltip="Discover Events"
              className="gap-3"
            >
              <Search className="h-5 w-5" />
              <span>Discover</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/')}
              onClick={() => navigate('/')}
              tooltip="Home"
              className="gap-3"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarSeparator />
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/profile')}
              onClick={() => navigate('/profile')}
              tooltip="Profile"
              className="gap-3"
            >
              <UserCircle className="h-5 w-5" />
              <span>Profile</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/settings')}
              onClick={() => navigate('/settings')}
              tooltip="Settings"
              className="gap-3"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate('/help')}
              tooltip="Help & Support"
              className="gap-3 text-muted-foreground"
            >
              <HelpCircle className="h-5 w-5" />
              <span>Help & Support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        <SidebarSeparator />
        
        <div className="p-4">
          <SidebarMenuButton 
            onClick={handleSignOut} 
            tooltip="Sign Out" 
            className="gap-3 text-destructive hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default StudentSidebar;
