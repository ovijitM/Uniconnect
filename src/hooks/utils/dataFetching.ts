
/**
 * Fetches the user's university from their profile
 */
export const fetchUserUniversity = async (userId: string | undefined) => {
  if (!userId) return null;
  
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('university')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching user university:', error);
      return null;
    }
    
    return data?.university || null;
  } catch (error) {
    console.error('Error in fetchUserUniversity:', error);
    return null;
  }
};

/**
 * Creates a visibility filter for database queries
 */
export const createVisibilityFilter = (userUniversity: string | null | undefined) => {
  if (!userUniversity) {
    // No university, only public items are visible
    return { 
      type: 'simple', 
      filter: 'public' 
    };
  }
  
  // Has university, use complex filter
  return { 
    type: 'or', 
    university: userUniversity 
  };
};
