
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Helper function to format time ago
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

export const useAdminData = (userId: string | undefined) => {
  const { toast } = useToast();
  
  const [users, setUsers] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [adminCount, setAdminCount] = useState(0);
  const [systemStatus, setSystemStatus] = useState('Healthy');
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const verifyAdminAccess = async () => {
    if (!userId) return false;
    
    try {
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (userError) throw userError;
      
      return userData.role === 'admin';
    } catch (error) {
      console.error('Error verifying admin access:', error);
      return false;
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setUsers(data);
      
      // Count admins
      const adminUsers = data.filter(user => user.role === 'admin');
      setAdminCount(adminUsers.length);
      
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  const fetchClubs = async () => {
    try {
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setClubs(data);
      return data;
    } catch (error) {
      console.error('Error fetching clubs:', error);
      throw error;
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('id, title, club_id, created_at, clubs(name)')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  };

  const buildRecentActivity = (clubsData: any[], eventsData: any[]) => {
    // Get recent club activity (newest 3 clubs)
    const recentClubs = clubsData.slice(0, 3).map(club => ({
      type: 'club',
      id: club.id,
      name: club.name,
      description: `New club created ${formatTimeAgo(club.created_at)}`,
      created_at: club.created_at,
      status: club.status
    }));

    const recentEvents = eventsData.map(event => ({
      type: 'event',
      id: event.id,
      name: event.title,
      description: `Event created by ${event.clubs?.name || 'Unknown Club'}`,
      created_at: event.created_at
    }));

    // Combine and sort recent activity
    return [...recentClubs, ...recentEvents]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  };

  const fetchAdminData = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      // Verify the user is an admin
      const isAdmin = await verifyAdminAccess();
      
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

  // Function to approve a club
  const reviewClubOrEvent = async (id: string, type: 'club' | 'event') => {
    try {
      toast({
        title: 'Review Started',
        description: `You are now reviewing this ${type}.`,
      });
      
      // In a real implementation, this would open a detailed review interface
      // For now we'll just navigate to the detail page
      return { success: true, id, type };
    } catch (error) {
      console.error(`Error reviewing ${type}:`, error);
      toast({
        title: 'Error',
        description: `Could not start review process for this ${type}.`,
        variant: 'destructive',
      });
      return { success: false };
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
