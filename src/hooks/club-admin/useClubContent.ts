
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export const useClubContent = (clubId: string) => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [activityPosts, setActivityPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchClubContent = async () => {
    if (!clubId) return;
    
    setIsLoading(true);
    try {
      // Fetch announcements
      const { data: announcementsData, error: announcementsError } = await supabase
        .from('club_announcements')
        .select('*')
        .eq('club_id', clubId)
        .order('created_at', { ascending: false });
      
      if (announcementsError) throw announcementsError;
      setAnnouncements(announcementsData || []);
      
      // Fetch activity posts
      const { data: postsData, error: postsError } = await supabase
        .from('club_activity_posts')
        .select('*')
        .eq('club_id', clubId)
        .order('created_at', { ascending: false });
      
      if (postsError) throw postsError;
      setActivityPosts(postsData || []);
      
    } catch (error) {
      console.error('Error fetching club content:', error);
      toast({
        title: 'Error',
        description: 'Failed to load club content',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (clubId) {
      fetchClubContent();
    }
  }, [clubId]);

  const postAnnouncement = async (title: string, content: string) => {
    try {
      const { error } = await supabase
        .from('club_announcements')
        .insert({
          id: uuidv4(),
          club_id: clubId,
          title,
          content
        });
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Announcement posted successfully',
        variant: 'default',
      });
      
      // Refresh the announcements list
      fetchClubContent();
    } catch (error) {
      console.error('Error posting announcement:', error);
      toast({
        title: 'Error',
        description: 'Failed to post announcement',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const postActivityUpdate = async (title: string, content: string, imageUrl?: string) => {
    try {
      const { error } = await supabase
        .from('club_activity_posts')
        .insert({
          id: uuidv4(),
          club_id: clubId,
          title,
          content,
          image_url: imageUrl
        });
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Activity post created successfully',
        variant: 'default',
      });
      
      // Refresh the activity posts list
      fetchClubContent();
    } catch (error) {
      console.error('Error posting activity update:', error);
      toast({
        title: 'Error',
        description: 'Failed to post activity update',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    announcements,
    activityPosts,
    isLoading,
    fetchClubContent,
    postAnnouncement,
    postActivityUpdate
  };
};
