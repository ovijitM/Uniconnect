
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Post {
  id: string;
  content: string;
  created_at: string;
  club_id: string;
  user_id: string;
  likes_count: number;
  comments_count: number;
  clubs?: {
    name: string;
    logo_url: string | null;
  };
  user?: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
}

export const useSocialFeed = (userId: string | undefined) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    const fetchSocialFeed = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // First, get the clubs this user has joined
        const { data: clubData, error: clubError } = await supabase
          .from('club_members')
          .select('club_id')
          .eq('user_id', userId);
        
        if (clubError) throw clubError;
        
        if (!clubData || clubData.length === 0) {
          setPosts([]);
          setIsLoading(false);
          return;
        }
        
        const clubIds = clubData.map(item => item.club_id);
        
        // Use Edge Function to get posts with details
        const { data: postsData, error: postsError } = await supabase.functions.invoke(
          'get_club_posts_with_details',
          {
            body: { clubIds }
          }
        );
        
        if (postsError) {
          console.error('Error fetching posts from edge function:', postsError);
          
          // Fallback to a simpler query if the edge function fails
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('club_posts')
            .select(`
              id,
              content,
              created_at,
              club_id,
              user_id,
              likes_count,
              comments_count
            `)
            .in('club_id', clubIds)
            .order('created_at', { ascending: false })
            .limit(10);
            
          if (fallbackError) throw fallbackError;
          setPosts(fallbackData as Post[] || []);
        } else {
          if (postsData && Array.isArray(postsData.data)) {
            setPosts(postsData.data as Post[]);
          } else {
            console.error('Invalid data format from edge function:', postsData);
            setPosts([]);
          }
        }
      } catch (err: any) {
        console.error('Error fetching social feed:', err);
        setError(err.message || 'Failed to load social feed');
        toast({
          title: 'Error',
          description: 'Failed to load social feed. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSocialFeed();
  }, [userId, toast]);
  
  return { posts, isLoading, error };
};

// Helper functions to create and like posts
export const createPost = async (userId: string, content: string) => {
  if (!userId || !content.trim()) {
    throw new Error('User ID and content are required');
  }
  
  // Get first club the user is a member of (simplified approach)
  const { data: clubData, error: clubError } = await supabase
    .from('club_members')
    .select('club_id')
    .eq('user_id', userId)
    .limit(1);
  
  if (clubError) throw clubError;
  if (!clubData || clubData.length === 0) {
    throw new Error('You must be a member of at least one club to post');
  }
  
  const clubId = clubData[0].club_id;
  
  // Use the Edge Function to create the post
  const { data, error } = await supabase.functions.invoke(
    'create_post',
    {
      body: { userId, clubId, content }
    }
  );
  
  if (error) throw error;
  return data;
};

export const likePost = async (userId: string, postId: string) => {
  if (!userId || !postId) {
    throw new Error('User ID and post ID are required');
  }
  
  try {
    // Use the Edge Function to toggle the post like
    const { data, error } = await supabase.functions.invoke(
      'toggle_post_like',
      {
        body: { userId, postId }
      }
    );
    
    if (error) throw error;
    
    return data;
  } catch (err) {
    console.error('Error toggling post like:', err);
    throw err;
  }
};
