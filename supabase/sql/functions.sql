
-- Function to get posts with club and user details
CREATE OR REPLACE FUNCTION public.get_club_posts_with_details(user_club_ids UUID[])
RETURNS TABLE (
  id UUID,
  content TEXT,
  created_at TIMESTAMPTZ,
  club_id UUID,
  user_id UUID,
  likes_count INTEGER,
  comments_count INTEGER,
  club_name TEXT,
  club_logo_url TEXT,
  user_name TEXT,
  user_avatar_url TEXT
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    cp.id,
    cp.content,
    cp.created_at,
    cp.club_id,
    cp.user_id,
    cp.likes_count,
    cp.comments_count,
    c.name AS club_name,
    c.logo_url AS club_logo_url,
    p.name AS user_name,
    p.profile_image AS user_avatar_url
  FROM 
    club_posts cp
    LEFT JOIN clubs c ON cp.club_id = c.id
    LEFT JOIN profiles p ON cp.user_id = p.id
  WHERE 
    cp.club_id = ANY(user_club_ids)
  ORDER BY 
    cp.created_at DESC
  LIMIT 10;
$$;

-- Function to toggle a post like (add if doesn't exist, remove if it does)
CREATE OR REPLACE FUNCTION public.toggle_post_like(p_user_id UUID, p_post_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  existing_like_id UUID;
  result JSONB;
BEGIN
  -- Check if the like already exists
  SELECT id INTO existing_like_id
  FROM post_likes
  WHERE user_id = p_user_id AND post_id = p_post_id;
  
  IF existing_like_id IS NOT NULL THEN
    -- Unlike: remove the like
    DELETE FROM post_likes
    WHERE id = existing_like_id;
    
    -- Decrement the likes count
    UPDATE club_posts
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = p_post_id;
    
    result = '{"action": "unliked"}'::JSONB;
  ELSE
    -- Like: add a new like
    INSERT INTO post_likes (user_id, post_id)
    VALUES (p_user_id, p_post_id);
    
    -- Increment the likes count
    UPDATE club_posts
    SET likes_count = likes_count + 1
    WHERE id = p_post_id;
    
    result = '{"action": "liked"}'::JSONB;
  END IF;
  
  RETURN result;
END;
$$;

-- Function to create a post
CREATE OR REPLACE FUNCTION public.create_post(p_user_id UUID, p_club_id UUID, p_content TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_post_id UUID;
  result JSONB;
BEGIN
  -- Insert the new post
  INSERT INTO club_posts (user_id, club_id, content, likes_count, comments_count)
  VALUES (p_user_id, p_club_id, p_content, 0, 0)
  RETURNING id INTO new_post_id;
  
  -- Return the created post
  SELECT json_build_object(
    'id', cp.id,
    'content', cp.content,
    'created_at', cp.created_at,
    'club_id', cp.club_id,
    'user_id', cp.user_id,
    'likes_count', cp.likes_count,
    'comments_count', cp.comments_count
  ) INTO result
  FROM club_posts cp
  WHERE id = new_post_id;
  
  RETURN result;
END;
$$;
