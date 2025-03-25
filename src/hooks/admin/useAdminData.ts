
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAdminAccess } from './useAdminAccess';
import { useAdminUsers } from './useAdminUsers';
import { useAdminClubs } from './useAdminClubs';
import { useAdminEvents } from './useAdminEvents';
import { useAdminStatus, SystemAlert } from './useAdminStatus';

export const useAdminData = (userId: string | undefined) => {
  const { toast } = useToast();
  const { verifyAdminAccess, handleAccessDenied } = useAdminAccess();
  const { users, adminCount, fetchUsers } = useAdminUsers();
  const { clubs, fetchClubs, reviewClubOrEvent } = useAdminClubs();
  const { fetchEvents } = useAdminEvents();
  const { 
    systemStatus, 
    recentActivity, 
    systemAlerts,
    setSystemStatus,
    setRecentActivity,
    setSystemAlerts,
    buildRecentActivity,
    generateSystemAlerts
  } = useAdminStatus();
  
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdminData = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      // Verify the user is an admin
      const isAdmin = await verifyAdminAccess(userId);
      
      if (!isAdmin) {
        handleAccessDenied();
        setIsLoading(false);
        return;
      }

      // Fetch users and clubs
      const usersData = await fetchUsers();
      const clubsData = await fetchClubs();
      const eventsData = await fetchEvents();
      
      // Build recent activity
      const activity = buildRecentActivity(clubsData, eventsData);
      setRecentActivity(activity);

      // Set system alerts
      setSystemAlerts(generateSystemAlerts());
      
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admin dashboard data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAdminData();
    }
  }, [userId]);

  return {
    users,
    clubs,
    adminCount,
    systemStatus,
    recentActivity,
    systemAlerts,
    isLoading,
    reviewClubOrEvent,
    fetchAdminData,
  };
};
