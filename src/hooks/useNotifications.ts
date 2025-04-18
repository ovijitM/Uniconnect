
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  title: string;
  content: string;
  read: boolean;
  created_at: string;
  user_id: string;
}

export const useNotifications = (userId: string | undefined) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    const fetchNotifications = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Use a more direct approach with raw SQL query
        const { data, error: notifError } = await supabase
          .from('user_notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20);
        
        if (notifError) throw notifError;
        
        // Explicitly cast the data to ensure correct typing
        const typedData = data as unknown as Notification[];
        setNotifications(typedData || []);
        
        // Count unread notifications
        const unread = (typedData || []).filter(n => !n.read).length;
        setUnreadCount(unread);
      } catch (err: any) {
        console.error('Error fetching notifications:', err);
        setError(err.message || 'Failed to load notifications');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Initial fetch
    fetchNotifications();
    
    // Subscribe to new notifications
    const subscription = supabase
      .channel('user_notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'user_notifications',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        // Add the new notification to state
        const newNotification = payload.new as unknown as Notification;
        setNotifications(current => [newNotification, ...current]);
        setUnreadCount(count => count + 1);
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);
  
  const markAsRead = async (notificationId: string) => {
    try {
      // Use raw SQL to update the notification
      const { error } = await supabase
        .from('user_notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(current => 
        current.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(count => Math.max(0, count - 1));
      
      return true;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return false;
    }
  };
  
  const markAllAsRead = async () => {
    try {
      // Use raw SQL for bulk update
      const { error } = await supabase
        .from('user_notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(current => 
        current.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
      
      return true;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return false;
    }
  };
  
  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead
  };
};
