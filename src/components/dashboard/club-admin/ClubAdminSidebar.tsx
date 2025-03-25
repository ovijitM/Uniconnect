
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Calendar, Home, Users, ClipboardCheck, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ClubAdminSidebar: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    {
      icon: <Home className="h-4 w-4 mr-2" />,
      name: 'Overview',
      href: '/club-admin-dashboard',
      active: pathname === '/club-admin-dashboard'
    },
    {
      icon: <Calendar className="h-4 w-4 mr-2" />,
      name: 'Events',
      href: '/club-admin-dashboard/events',
      active: pathname.includes('/club-admin-dashboard/events')
    },
    {
      icon: <Users className="h-4 w-4 mr-2" />,
      name: 'Clubs',
      href: '/club-admin-dashboard/clubs',
      active: pathname.includes('/club-admin-dashboard/clubs')
    },
    {
      icon: <Users className="h-4 w-4 mr-2" />,
      name: 'Members',
      href: '/club-admin-dashboard/members',
      active: pathname.includes('/club-admin-dashboard/members')
    },
    {
      icon: <ClipboardCheck className="h-4 w-4 mr-2" />,
      name: 'Attendance',
      href: '/club-admin-dashboard/attendance',
      active: pathname.includes('/club-admin-dashboard/attendance')
    },
    {
      icon: <Settings className="h-4 w-4 mr-2" />,
      name: 'Club Profile',
      href: '/club-admin-dashboard/profile',
      active: pathname.includes('/club-admin-dashboard/profile')
    }
  ];

  const handleSignOut = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="py-6 px-2 md:px-4">
      <h2 className="text-lg font-semibold tracking-tight mb-4 px-4">Club Admin</h2>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center px-4 py-2 text-sm rounded-md w-full",
              item.active
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>
      
      {/* Add logout button */}
      <div className="absolute bottom-8 left-0 right-0 px-4">
        <button
          onClick={handleSignOut}
          className="flex items-center px-4 py-2 text-sm rounded-md w-full text-muted-foreground hover:text-foreground hover:bg-accent/50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default ClubAdminSidebar;
