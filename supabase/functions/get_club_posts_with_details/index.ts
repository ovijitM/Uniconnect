
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
    const { clubIds } = await req.json();
    
    if (!clubIds || !Array.isArray(clubIds) || clubIds.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid or missing clubIds parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Log request information for debugging
    console.log(`Fetching posts for clubs: ${clubIds.join(', ')}`);
    
    // Query posts with club and user details
    const { data, error } = await supabase
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
      .limit(15);
    
    if (error) {
      console.error('Database query error:', error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} posts`);
    
    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get_club_posts_with_details:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
