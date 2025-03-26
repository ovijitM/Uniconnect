
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Building2, 
  Gauge, 
  Home, 
  PlusCircle, 
  Settings,
  Users,
  Calendar,
  UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarItemProps {
  href?: string;
  icon: React.ReactNode;
  title: string;
  active?: boolean;
  disabled?: boolean;
}

interface ClubAdminSidebarProps {
  currentView?: 'overview' | 'events' | 'clubs' | 'members' | 'attendance' | 'profile';
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  href,
  icon,
  title,
  active,
  disabled
}) => {
  const content = (
    <>
      {icon}
      <span className="ml-2">{title}</span>
    </>
  );

  return (
    <Button
      variant={active ? 'secondary' : 'ghost'}
      className={cn(
        'w-full justify-start text-sm h-10 font-medium',
        active ? 'bg-secondary/80 text-secondary-foreground' : 'text-muted-foreground hover:text-foreground',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent hover:no-underline'
      )}
      disabled={disabled}
      asChild={!disabled && !!href}
    >
      {!disabled && href ? (
        <Link to={href}>
          {content}
        </Link>
      ) : (
        <div>{content}</div>
      )}
    </Button>
  );
};

const ClubAdminSidebar: React.FC<ClubAdminSidebarProps> = ({ currentView }) => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="pb-12 w-64 border-r border-border/40 h-full bg-background/95">
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-4 px-2 text-lg font-semibold tracking-tight">
            Club Admin Dashboard
          </h2>
          <div className="space-y-1">
            <SidebarItem
              href="/club-admin-dashboard"
              icon={<Gauge className="h-4 w-4" />}
              title="Overview"
              active={pathname === '/club-admin-dashboard' || currentView === 'overview'}
            />
            <SidebarItem
              href="/club-admin-dashboard/clubs"
              icon={<Building2 className="h-4 w-4" />}
              title="My Clubs"
              active={(pathname.includes('/clubs') && !pathname.includes('/create-club')) || currentView === 'clubs'}
            />
            <SidebarItem
              href="/club-admin-dashboard/create-club-new"
              icon={<PlusCircle className="h-4 w-4" />}
              title="Create Club"
              active={pathname === '/club-admin-dashboard/create-club-new'}
            />
            <SidebarItem
              href="/club-admin-dashboard/events"
              icon={<Calendar className="h-4 w-4" />}
              title="Events"
              active={pathname.includes('/events') || currentView === 'events'}
            />
            <SidebarItem
              href="/club-admin-dashboard/members"
              icon={<Users className="h-4 w-4" />}
              title="Members"
              active={pathname.includes('/members') || currentView === 'members'}
            />
            <SidebarItem
              href="/club-admin-dashboard/attendance"
              icon={<UserCheck className="h-4 w-4" />}
              title="Attendance"
              active={pathname.includes('/attendance') || currentView === 'attendance'}
            />
          </div>
        </div>
        <div className="px-4 py-2">
          <div className="space-y-1">
            <SidebarItem
              href="/club-admin-dashboard/profile"
              icon={<Settings className="h-4 w-4" />}
              title="Profile Settings"
              active={pathname.includes('/profile') || currentView === 'profile'}
            />
            <SidebarItem
              href="/"
              icon={<Home className="h-4 w-4" />}
              title="Back to Home"
              active={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubAdminSidebar;
