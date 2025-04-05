
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
 * Updated with improved SQL escaping and safer filter creation
 */
export const createVisibilityFilter = (userUniversity: string | null | undefined) => {
  if (!userUniversity) {
    // No university, only public items are visible
    return { 
      type: 'simple', 
      filter: 'public' 
    };
  }
  
  // Has university, but now use a safer approach that avoids problematic SQL syntax
  // This approach uses the 'in' filter which is more reliable with special characters
  return { 
    type: 'complex',
    university: userUniversity
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
