
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building,
  Settings, 
  LogOut,
  Bell,
  Shield,
  GraduationCap,
  AlertCircle
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

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <div className="font-semibold text-lg">Admin Portal</div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {user?.name || 'Administrator'}
        </p>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/admin-dashboard')}
              onClick={() => navigate('/admin-dashboard')}
              tooltip="Dashboard"
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Overview</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/admin-dashboard/users')}
              onClick={() => navigate('/admin-dashboard/users')}
              tooltip="Users Management"
            >
              <Users className="h-5 w-5" />
              <span>Users</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/admin-dashboard/clubs')}
              onClick={() => navigate('/admin-dashboard/clubs')}
              tooltip="Clubs Management"
            >
              <Building className="h-5 w-5" />
              <span>Clubs</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/admin-dashboard/universities')}
              onClick={() => navigate('/admin-dashboard/universities')}
              tooltip="Universities"
            >
              <GraduationCap className="h-5 w-5" />
              <span>Universities</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/admin-dashboard/alerts')}
              onClick={() => navigate('/admin-dashboard/alerts')}
              tooltip="System Alerts"
            >
              <AlertCircle className="h-5 w-5" />
              <span>System Alerts</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/admin-dashboard/activity')}
              onClick={() => navigate('/admin-dashboard/activity')}
              tooltip="Recent Activity"
            >
              <Bell className="h-5 w-5" />
              <span>Activity</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/admin-dashboard/settings')}
              onClick={() => navigate('/admin-dashboard/settings')}
              tooltip="Settings"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
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

export default AdminSidebar;
