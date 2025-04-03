
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Club } from '@/types';

export const useClubRecommendations = (joinedClubIds: string[] = []) => {
  const [recommendations, setRecommendations] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Get the categories of clubs the user has joined
        let userCategories: string[] = [];
        
        if (joinedClubIds.length > 0) {
          const { data: joinedClubs, error: categoriesError } = await supabase
            .from('clubs')
            .select('category')
            .in('id', joinedClubIds);
            
          if (categoriesError) throw categoriesError;
          
          userCategories = joinedClubs.map(club => club.category);
        }
        
        // Fetch recommended clubs based on categories and exclude already joined clubs
        let query = supabase
          .from('clubs')
          .select(`
            id,
            name,
            description,
            logo_url,
            category,
            status,
            club_members(count),
            tagline,
            established_year,
            university
          `)
          .eq('status', 'approved');
        
        // If user has joined clubs, prioritize clubs in the same categories
        if (userCategories.length > 0) {
          query = query.in('category', userCategories);
        }
        
        // Exclude clubs the user has already joined
        if (joinedClubIds.length > 0) {
          query = query.not('id', 'in', `(${joinedClubIds.join(',')})`);
        }
        
        // Limit the number of recommendations
        query = query.limit(5);
        
        const { data: recommendedClubs, error: recommendationsError } = await query;
        
        if (recommendationsError) throw recommendationsError;
        
        // If we didn't get enough recommendations from similar categories,
        // fetch additional popular clubs from other categories
        if (recommendedClubs.length < 5 && userCategories.length > 0) {
          const { data: popularClubs, error: popularError } = await supabase
            .from('clubs')
            .select(`
              id,
              name,
              description,
              logo_url,
              category,
              status,
              club_members(count),
              tagline,
              established_year,
              university
            `)
            .eq('status', 'approved')
            .not('category', 'in', `(${userCategories.join(',')})`)
            .not('id', 'in', `(${joinedClubIds.join(',')})`)
            .order('club_members', { ascending: false })
            .limit(5 - recommendedClubs.length);
            
          if (popularError) throw popularError;
          
          // Combine the recommendations
          const combined = [...recommendedClubs, ...(popularClubs || [])];
          setRecommendations(combined.map(club => ({
            ...club,
            memberCount: club.club_members[0]?.count || 0,
            events: []
          })));
        } else {
          // Process the recommendations
          setRecommendations(recommendedClubs.map(club => ({
            ...club,
            memberCount: club.club_members[0]?.count || 0,
            events: []
          })));
        }
        
      } catch (err: any) {
        console.error('Error fetching club recommendations:', err);
        setError(err.message || 'Failed to fetch recommendations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [user, joinedClubIds]);

  return { recommendations, isLoading, error };
};
