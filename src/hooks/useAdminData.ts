
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAdminData = (userId: string | undefined) => {
  const { toast } = useToast();
  
  const [users, setUsers] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [adminCount, setAdminCount] = useState(0);
  const [systemStatus, setSystemStatus] = useState('Healthy');
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdminData = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    try {
      // Verify the user is an admin
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (userError) throw userError;
      
      if (userData.role !== 'admin') {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin permissions.',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (usersError) throw usersError;
      
      setUsers(usersData);
      
      // Count admins
      const adminUsers = usersData.filter(user => user.role === 'admin');
      setAdminCount(adminUsers.length);

      // Fetch all clubs
      const { data: clubsData, error: clubsError } = await supabase
        .from('clubs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (clubsError) throw clubsError;
      
      setClubs(clubsData);

      // Get recent club activity (newest 5 clubs)
      const recentClubs = clubsData.slice(0, 3).map(club => ({
        type: 'club',
        id: club.id,
        name: club.name,
        description: `New club created ${formatTimeAgo(club.created_at)}`,
        created_at: club.created_at
      }));

      // Fetch recent events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id, title, club_id, created_at, clubs(name)')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (eventsError) throw eventsError;
      
      const recentEvents = eventsData.map(event => ({
        type: 'event',
        id: event.id,
        name: event.title,
        description: `Event created by ${event.clubs?.name || 'Unknown Club'}`,
        created_at: event.created_at
      }));

      // Combine and sort recent activity
      const combinedActivity = [...recentClubs, ...recentEvents]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
      
      setRecentActivity(combinedActivity);

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
