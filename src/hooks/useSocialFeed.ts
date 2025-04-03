
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSocialFeed = (userId: string | undefined) => {
  const [posts, setPosts] = useState<any[]>([]);
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
        
        // Get posts from these clubs
        const { data: postsData, error: postsError } = await supabase
          .from('club_posts')
          .select(`
            id,
            content,
            created_at,
            club_id,
            user_id,
            likes_count,
            comments_count,
            clubs:club_id (name, logo_url),
            user:user_id (id, name, avatar_url)
          `)
          .in('club_id', clubIds)
          .order('created_at', { ascending: false })
          .limit(10);
        
        if (postsError) throw postsError;
        
        setPosts(postsData || []);
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
  
  // Create post
  const { data, error } = await supabase
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
  
  if (error) throw error;
  return data;
};

export const likePost = async (userId: string, postId: string) => {
  if (!userId || !postId) {
    throw new Error('User ID and post ID are required');
  }
  
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
    
    // Decrement likes count
    const { error: updateError } = await supabase.rpc('decrement_post_likes', {
      post_id: postId
    });
    
    if (updateError) throw updateError;
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
    
    // Increment likes count
    const { error: updateError } = await supabase.rpc('increment_post_likes', {
      post_id: postId
    });
    
    if (updateError) throw updateError;
  }
  
  return true;
};
