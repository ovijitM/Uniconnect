
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
    const { userId, clubId, content } = await req.json();
    
    if (!userId || !clubId || !content) {
      return new Response(
        JSON.stringify({ error: 'User ID, Club ID, and content are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate content length
    if (content.trim().length < 1 || content.length > 1000) {
      return new Response(
        JSON.stringify({ error: 'Content must be between 1 and 1000 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log(`Creating post for user ${userId} in club ${clubId}`);
    
    // Create the post
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
      ])
      .select();
    
    if (error) {
      console.error('Error creating post:', error);
      throw error;
    }
    
    console.log(`Post created successfully with id: ${data?.[0]?.id}`);
    
    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in create_post:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
