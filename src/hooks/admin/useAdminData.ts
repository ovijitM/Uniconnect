
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAdminAccess } from './useAdminAccess';
import { useAdminUsers } from './useAdminUsers';
import { useAdminClubs } from './useAdminClubs';
import { useAdminEvents } from './useAdminEvents';
import { useAdminStatus } from './useAdminStatus';

export const useAdminData = (userId: string | undefined) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  
  // Verify admin access
  const { verifyAdminAccess } = useAdminAccess();
  
  // Import all the specialized hooks
  const { users, adminCount, fetchUsers } = useAdminUsers();
  const { clubs, fetchClubs, reviewClubOrEvent } = useAdminClubs();
  const { fetchEvents } = useAdminEvents();
  const { 
    systemStatus, 
    recentActivity, 
    systemAlerts, 
    buildRecentActivity, 
    setRecentActivity, 
    setSystemAlerts 
  } = useAdminStatus();

  const fetchAdminData = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      // Verify the user is an admin
      const isAdmin = await verifyAdminAccess(userId);
      
      if (!isAdmin) {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin permissions.',
          variant: 'destructive',
        });
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

      // Set mock system alerts for demonstration
      setSystemAlerts([
        {
          type: 'success',
          title: 'Database Backup Complete',
          time: '2 hours ago'
        },
        {
          type: 'warning',
          title: 'High Server Load',
          time: 'Yesterday, 8:45 PM'
        },
        {
          type: 'success',
          title: 'System Update Complete',
          time: '2 days ago'
        }
      ]);
      
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
