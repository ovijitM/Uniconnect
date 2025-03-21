
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Bookmark, 
  LogOut,
  Search,
  GraduationCap
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

const StudentSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <div className="font-semibold text-lg">Student Portal</div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {user?.name || 'Student'}
        </p>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/student-dashboard')}
              onClick={() => navigate('/student-dashboard')}
              tooltip="Dashboard"
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
            >
              <Users className="h-5 w-5" />
              <span>My Clubs</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/events')}
              onClick={() => navigate('/events')}
              tooltip="Discover Events"
            >
              <Search className="h-5 w-5" />
              <span>Discover Events</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/clubs')}
              onClick={() => navigate('/clubs')}
              tooltip="Discover Clubs"
            >
              <Bookmark className="h-5 w-5" />
              <span>Discover Clubs</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarSeparator />
        <div className="p-4">
          <SidebarMenuButton onClick={handleSignOut} tooltip="Sign Out">
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default StudentSidebar;
