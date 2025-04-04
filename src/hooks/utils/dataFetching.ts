
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
 */
export const createVisibilityFilter = (userUniversity: string | null) => {
  if (userUniversity) {
    // For university users, show both public events and events from their university
    return {
      filter: `visibility.eq.public,and(visibility.eq.university_only,clubs.university.eq."${userUniversity}")`,
      type: 'or' as const
    };
  } 
  
  // For non-university users, only show public events
  return {
    filter: 'public',
    type: 'eq' as const
  };
};
