
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Define interfaces for our data types
interface Announcement {
  id: string;
  club_id: string;
  title: string;
  content: string;
  created_at: string;
}

interface ActivityPost {
  id: string;
  club_id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
}

export const useClubContent = (clubId: string | undefined) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activityPosts, setActivityPosts] = useState<ActivityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
    if (!clubId) {
      toast({
        title: 'Error',
        description: 'Club ID is missing',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
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
    } finally {
      setIsSaving(false);
    }
  };

  const postActivityUpdate = async (title: string, content: string, imageUrl?: string) => {
    if (!clubId) {
      toast({
        title: 'Error',
        description: 'Club ID is missing',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSaving(true);
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
    } finally {
      setIsSaving(false);
    }
  };

  return {
    announcements,
    activityPosts,
    isLoading,
    isSaving,
    fetchClubContent,
    postAnnouncement,
    postActivityUpdate
  };
};
