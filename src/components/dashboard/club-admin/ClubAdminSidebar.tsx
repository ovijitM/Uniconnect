
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
      {title}
    </>
  );

  return (
    <Button
      variant={active ? 'secondary' : 'ghost'}
      className={cn(
        'w-full justify-start',
        active ? 'bg-muted hover:bg-muted' : 'hover:bg-transparent hover:underline',
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

const ClubAdminSidebar: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="pb-12 w-full">
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Club Admin Dashboard
          </h2>
          <div className="space-y-1">
            <SidebarItem
              href="/club-admin-dashboard"
              icon={<Gauge className="mr-2 h-4 w-4" />}
              title="Overview"
              active={pathname === '/club-admin-dashboard'}
            />
            <SidebarItem
              icon={<Building2 className="mr-2 h-4 w-4" />}
              title="My Clubs"
              active={pathname.includes('/clubs') && !pathname.includes('/create-club')}
              disabled={true}
            />
            <SidebarItem
              href="/club-admin-dashboard/create-club-new"
              icon={<PlusCircle className="mr-2 h-4 w-4" />}
              title="Create Club"
              active={pathname === '/club-admin-dashboard/create-club-new'}
            />
            <SidebarItem
              icon={<Calendar className="mr-2 h-4 w-4" />}
              title="Events"
              disabled={true}
            />
            <SidebarItem
              icon={<Users className="mr-2 h-4 w-4" />}
              title="Members"
              disabled={true}
            />
            <SidebarItem
              icon={<UserCheck className="mr-2 h-4 w-4" />}
              title="Attendance"
              disabled={true}
            />
          </div>
        </div>
        <div className="px-4 py-2">
          <div className="space-y-1">
            <SidebarItem
              href="/club-admin-dashboard/profile"
              icon={<Settings className="mr-2 h-4 w-4" />}
              title="Profile Settings"
              active={pathname.includes('/profile')}
            />
            <SidebarItem
              href="/"
              icon={<Home className="mr-2 h-4 w-4" />}
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
