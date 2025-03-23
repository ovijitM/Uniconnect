
import { useMatch } from 'react-router-dom';

export function useClubAdminRoutes() {
  // Match patterns for different routes
  const isOverview = useMatch('/club-admin-dashboard');
  const isEventsPage = useMatch('/club-admin-dashboard/events');
  const isClubsPage = useMatch('/club-admin-dashboard/clubs');
  const isMembersPage = useMatch('/club-admin-dashboard/members');
  const isAttendancePage = useMatch('/club-admin-dashboard/attendance');
  const isProfilePage = useMatch('/club-admin-dashboard/profile');

  // Explicitly type the currentView variable as the union type
  const currentView: 'overview' | 'events' | 'clubs' | 'members' | 'attendance' | 'profile' = 
    isEventsPage ? 'events' 
    : isClubsPage ? 'clubs'
    : isMembersPage ? 'members'
    : isAttendancePage ? 'attendance'
    : isProfilePage ? 'profile'
    : 'overview';

  return {
    isOverview,
    isEventsPage,
    isClubsPage,
    isMembersPage,
    isAttendancePage,
    isProfilePage,
    currentView
  };
}
