
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

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

// Define query key constants for better cache management
const POSTS_QUERY_KEY = 'social-feed-posts';

export const useSocialFeed = (userId: string | undefined) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const fetchSocialFeed = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching social feed for user:', userId);
      
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
      console.log('User is a member of clubs:', clubIds);
      
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
          
          // Update the cache
          queryClient.setQueryData([POSTS_QUERY_KEY, userId], postsData.data);
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
  }, [userId, toast, queryClient]);
  
  useEffect(() => {
    // Try to load from cache first
    const cachedPosts = queryClient.getQueryData<Post[]>([POSTS_QUERY_KEY, userId]);
    
    if (cachedPosts) {
      console.log('Using cached posts data');
      setPosts(cachedPosts);
      setIsLoading(false);
      
      // Refresh in the background after using cache
      fetchSocialFeed();
    } else {
      fetchSocialFeed();
    }
  }, [userId, fetchSocialFeed, queryClient]);
  
  // Function to refresh the feed manually
  const refreshFeed = () => {
    fetchSocialFeed();
  };
  
  return { posts, isLoading, error, refreshFeed };
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
  
  try {
    console.log('Creating post for user:', userId, 'in club:', clubId);
    
    // Use the Edge Function to create the post
    const { data, error } = await supabase.functions.invoke(
      'create_post',
      {
        body: { userId, clubId, content }
      }
    );
    
    if (error) throw error;
    
    // Invalidate cache to trigger a refresh
    const queryClient = useQueryClient();
    queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEY, userId] });
    
    return data;
  } catch (err) {
    console.error('Error creating post:', err);
    throw err;
  }
};

export const likePost = async (userId: string, postId: string) => {
  if (!userId || !postId) {
    throw new Error('User ID and post ID are required');
  }
  
  try {
    console.log('Toggling like for post:', postId, 'by user:', userId);
    
    // Use the Edge Function to toggle the post like
    const { data, error } = await supabase.functions.invoke(
      'toggle_post_like',
      {
        body: { userId, postId }
      }
    );
    
    if (error) throw error;
    
    // Invalidate cache to trigger a refresh
    const queryClient = useQueryClient();
    queryClient.invalidateQueries({ queryKey: [POSTS_QUERY_KEY, userId] });
    
    return data;
  } catch (err) {
    console.error('Error toggling post like:', err);
    throw err;
  }
};
