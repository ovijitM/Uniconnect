
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
        
        // Use raw SQL for more complex queries
        const { data: postsData, error: postsError } = await supabase
          .rpc('get_club_posts_with_details', { user_club_ids: clubIds })
          .limit(10);
        
        if (postsError) {
          // Fallback to a simpler query if the RPC fails
          console.error('Fallback to direct query due to RPC error:', postsError);
          
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
          setPosts(postsData as Post[] || []);
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
  
  // Create post using direct SQL
  const { data, error } = await supabase
    .rpc('create_post', {
      p_user_id: userId,
      p_club_id: clubId,
      p_content: content
    });
  
  if (error) {
    // Fallback to direct insert if RPC fails
    console.error('Fallback to direct insert due to RPC error:', error);
    
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('club_posts')
      .insert([
        {
          user_id: userId,
          club_id: clubId,
          content,
          likes_count: 0,
          comments_count: 0
        }
      ]);
    
    if (fallbackError) throw fallbackError;
    return fallbackData;
  }
  
  return data;
};

export const likePost = async (userId: string, postId: string) => {
  if (!userId || !postId) {
    throw new Error('User ID and post ID are required');
  }
  
  try {
    // Use RPC for atomic operations
    const { data, error } = await supabase
      .rpc('toggle_post_like', {
        p_user_id: userId,
        p_post_id: postId
      });
    
    if (error) {
      // Fallback if RPC is not available
      console.error('RPC error, using fallback:', error);
      
      // Check if user already liked this post
      const { data: likeData, error: likeCheckError } = await supabase
        .from('post_likes')
        .select('id')
        .eq('user_id', userId)
        .eq('post_id', postId);
      
      if (likeCheckError) throw likeCheckError;
      
      if (likeData && likeData.length > 0) {
        // User already liked this post, so unlike it
        const { error: unlikeError } = await supabase
          .from('post_likes')
          .delete()
          .eq('id', likeData[0].id);
        
        if (unlikeError) throw unlikeError;
        
        // Execute raw SQL to decrement likes count
        await supabase.query(`
          UPDATE public.club_posts
          SET likes_count = GREATEST(0, likes_count - 1)
          WHERE id = '${postId}'
        `);
      } else {
        // User hasn't liked this post yet, so like it
        const { error: createLikeError } = await supabase
          .from('post_likes')
          .insert([
            {
              user_id: userId,
              post_id: postId
            }
          ]);
        
        if (createLikeError) throw createLikeError;
        
        // Execute raw SQL to increment likes count
        await supabase.query(`
          UPDATE public.club_posts
          SET likes_count = likes_count + 1
          WHERE id = '${postId}'
        `);
      }
    }
    
    return true;
  } catch (err) {
    console.error('Error toggling post like:', err);
    throw err;
  }
};
