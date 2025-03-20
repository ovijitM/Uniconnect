
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Club } from '@/types';

export const useEventCollaborations = (eventId: string | undefined) => {
  const [collaborators, setCollaborators] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!eventId) return;
    
    const fetchCollaborators = async () => {
      try {
        setIsLoading(true);
        
        // Fetch collaborating clubs
        const { data: collaboratorsData, error: collaboratorsError } = await supabase
          .from('event_collaborators')
          .select(`
            club_id,
            club:clubs!event_collaborators_club_id_fkey (
              id,
              name,
              description,
              logo_url,
              category,
              club_members(count)
            )
          `)
          .eq('event_id', eventId);
        
        if (collaboratorsError) throw collaboratorsError;
        
        // Format the collaborators data
        if (collaboratorsData && collaboratorsData.length > 0) {
          const formattedCollaborators = collaboratorsData.map(item => {
            const club = item.club;
            // Handle different possible formats of club_members count
            let memberCount = 0;
            
            // Type guard to handle various possible shapes of the count data
            if (Array.isArray(club.club_members)) {
              // If it's an array, it might contain an object with count property
              if (club.club_members.length > 0 && typeof club.club_members[0] === 'object') {
                memberCount = club.club_members[0]?.count || 0;
              } else {
                // If it's an array but not of objects, use the length
                memberCount = club.club_members.length;
              }
            } else if (typeof club.club_members === 'object') {
              // Direct object with count property
              memberCount = (club.club_members as any)?.count || 0;
            }
              
            return {
              id: club.id,
              name: club.name,
              description: club.description,
              logoUrl: club.logo_url,
              category: club.category,
              memberCount: memberCount,
              events: []
            };
          });
          
          setCollaborators(formattedCollaborators);
        } else {
          setCollaborators([]);
        }
      } catch (error) {
        console.error('Error fetching collaborating clubs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load collaborating clubs.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCollaborators();
  }, [eventId, toast]);

  return {
    collaborators,
    isLoading
  };
};
