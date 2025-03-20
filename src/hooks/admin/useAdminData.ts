
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
    if (!userId) {
      console.log("No user ID provided to fetchAdminData");
      return;
    }
    
    setIsLoading(true);
    try {
      console.log("Fetching admin data for user:", userId);
      
      // Verify the user is an admin
      const isAdmin = await verifyAdminAccess(userId);
      console.log("Admin access verification result:", isAdmin);
      
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
      console.log("Fetching users data...");
      const usersData = await fetchUsers();
      console.log("Fetching clubs data...");
      const clubsData = await fetchClubs();
      console.log("Fetching events data...");
      const eventsData = await fetchEvents();
      
      // Build recent activity
      console.log("Building recent activity...");
      const activity = buildRecentActivity(clubsData, eventsData);
      console.log("Recent activity data:", activity);
      setRecentActivity(activity);

      // Set mock system alerts for demonstration
      const alerts = [
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
      ];
      console.log("Setting system alerts:", alerts);
      setSystemAlerts(alerts);
      
      console.log("Admin data fetching complete");
      
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admin dashboard data.',
        variant: 'destructive',
      });
      throw error; // Re-throw to allow handling in component
    } finally {
      setIsLoading(false);
    }
  };

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
