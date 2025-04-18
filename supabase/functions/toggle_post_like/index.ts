
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, postId } = await req.json();
    
    if (!userId || !postId) {
      return new Response(
        JSON.stringify({ error: 'User ID and Post ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log(`Toggle like for post ${postId} by user ${userId}`);
    
    // Check if like exists
    const { data: likeData, error: checkError } = await supabase
      .from('post_likes')
      .select('id')
      .eq('user_id', userId)
      .eq('post_id', postId);
    
    if (checkError) {
      console.error('Error checking existing like:', checkError);
      throw checkError;
    }
    
    let result;
    
    if (likeData && likeData.length > 0) {
      // User already liked this post, so unlike it
      console.log(`User ${userId} is unliking post ${postId}`);
      
      const { error: unlikeError } = await supabase
        .from('post_likes')
        .delete()
        .eq('id', likeData[0].id);
      
      if (unlikeError) {
        console.error('Error deleting like:', unlikeError);
        throw unlikeError;
      }
      
      // Decrement likes count
      const { error: updateError } = await supabase
        .from('club_posts')
        .update({ likes_count: supabase.rpc('decrement', { value: 1, min: 0 }) })
        .eq('id', postId);
      
      if (updateError) {
        console.error('Error decrementing likes count:', updateError);
        throw updateError;
      }
      
      result = { action: 'unliked' };
    } else {
      // User hasn't liked this post yet, so like it
      console.log(`User ${userId} is liking post ${postId}`);
      
      const { error: createLikeError } = await supabase
        .from('post_likes')
        .insert([{ user_id: userId, post_id: postId }]);
      
      if (createLikeError) {
        console.error('Error creating like:', createLikeError);
        throw createLikeError;
      }
      
      // Increment likes count
      const { error: updateError } = await supabase
        .from('club_posts')
        .update({ likes_count: supabase.rpc('increment', { value: 1 }) })
        .eq('id', postId);
      
      if (updateError) {
        console.error('Error incrementing likes count:', updateError);
        throw updateError;
      }
      
      result = { action: 'liked' };
    }
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in toggle_post_like:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
