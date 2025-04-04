
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetches a user's university from their profile
 */
export const fetchUserUniversity = async (userId: string): Promise<string | null> => {
  if (!userId) return null;
  
  console.log("Fetching university for user:", userId);
  const { data: profileData } = await supabase
    .from('profiles')
    .select('university')
    .eq('id', userId)
    .single();
    
  if (profileData?.university) {
    console.log("Found user university:", profileData.university);
    return profileData.university;
  }
  
  return null;
};

/**
 * Creates a visibility filter for queries based on user's university
 * Optimized to use proper Supabase Filter syntax
 */
export const createVisibilityFilter = (userUniversity: string | null | undefined) => {
  if (userUniversity) {
    // For university users, construct a filter that correctly handles spaces in university name
    // Using an array of conditions that will be joined with OR
    return {
      filter: [
        { visibility: 'public' },
        { 
          visibility: 'university_only',
          clubs: { university: userUniversity }
        }
      ],
      type: 'or' as const
    };
  } 
  
  // For non-university users, only show public events
  return {
    filter: 'public',
    type: 'eq' as const
  };
};

/**
 * Memoizes data fetching functions to prevent redundant network calls
 */
export const memoize = <T, R>(fn: (arg: T) => Promise<R>) => {
  const cache = new Map<string, { timestamp: number, value: R }>();
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache
  
  return async (arg: T): Promise<R> => {
    const key = JSON.stringify(arg);
    const cached = cache.get(key);
    const now = Date.now();
    
    if (cached && now - cached.timestamp < CACHE_TTL) {
      console.log("Using cached data for", key);
      return cached.value;
    }
    
    console.log("Cache miss for", key);
    const result = await fn(arg);
    cache.set(key, { timestamp: now, value: result });
    return result;
  };
};
