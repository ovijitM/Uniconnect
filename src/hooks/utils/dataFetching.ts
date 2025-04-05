
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
 * Updated to handle SQL escaping properly
 */
export const createVisibilityFilter = (userUniversity: string | null | undefined) => {
  if (!userUniversity) {
    // No university, only public items are visible
    return { 
      type: 'simple', 
      filter: 'public' 
    };
  }
  
  // Has university, use complex filter with properly escaped university name
  return { 
    type: 'or', 
    university: userUniversity,
    // Ensure university is JSON-escaped when used in a filter
    escapedUniversity: JSON.stringify(userUniversity)
  };
};

/**
 * Simple memoization function to cache results of expensive functions
 */
export const memoize = <T extends (...args: any[]) => any>(fn: T): T => {
  const cache = new Map();
  
  return ((...args: any[]) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};
