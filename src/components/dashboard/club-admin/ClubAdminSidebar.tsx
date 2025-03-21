
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  PlusCircle,
  Briefcase,
  Clipboard
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

const ClubAdminSidebar: React.FC = () => {
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
          <Briefcase className="h-6 w-6 text-primary" />
          <div className="font-semibold text-lg">Club Management</div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {user?.name || 'Club Administrator'}
        </p>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/club-admin-dashboard')}
              onClick={() => navigate('/club-admin-dashboard')}
              tooltip="Dashboard"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Overview</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => navigate('/club-admin-dashboard', { state: { openEventDialog: true }})}
              tooltip="Create Event"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Create Event</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/club-admin-dashboard/events')}
              onClick={() => navigate('/club-admin-dashboard/events')}
              tooltip="Events"
            >
              <Calendar className="h-5 w-5" />
              <span>Manage Events</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/club-admin-dashboard/clubs')}
              onClick={() => navigate('/club-admin-dashboard/clubs')}
              tooltip="Clubs"
            >
              <Briefcase className="h-5 w-5" />
              <span>Manage Clubs</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/club-admin-dashboard/members')}
              onClick={() => navigate('/club-admin-dashboard/members')}
              tooltip="Members"
            >
              <Users className="h-5 w-5" />
              <span>Club Members</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/club-admin-dashboard/attendance')}
              onClick={() => navigate('/club-admin-dashboard/attendance')}
              tooltip="Attendance"
            >
              <Clipboard className="h-5 w-5" />
              <span>Attendance</span>
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

export default ClubAdminSidebar;
