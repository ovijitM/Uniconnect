
import { useMatch, useLocation } from 'react-router-dom';

export function useClubAdminRoutes() {
  const location = useLocation();
  
  // Match patterns for different routes
  const isOverview = useMatch('/club-admin-dashboard');
  const isEventsPage = useMatch('/club-admin-dashboard/events');
  const isClubsPage = useMatch('/club-admin-dashboard/clubs');
  const isMembersPage = useMatch('/club-admin-dashboard/members');
  const isAttendancePage = useMatch('/club-admin-dashboard/attendance');
  const isProfilePage = useMatch('/club-admin-dashboard/profile');
  
  // Match for event edit routes
  const isEventEdit = location.pathname.includes('/events/') && location.pathname.includes('/edit');
  // Match for club edit routes
  const isClubEdit = location.pathname.includes('/clubs/') && location.pathname.includes('/edit');

  // Explicitly type the currentView variable as the union type
  const currentView: 'overview' | 'events' | 'clubs' | 'members' | 'attendance' | 'profile' = 
    isEventsPage || isEventEdit ? 'events' 
    : isClubsPage || isClubEdit ? 'clubs'
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
    isEventEdit,
    isClubEdit,
    currentView
  };
}
