
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useStudentClubs = (userId: string | undefined, onSuccess?: () => void) => {
  const [isLoadingClubs, setIsLoadingClubs] = useState(false);
  const [clubs, setClubs] = useState<any[]>([]);
  const [joinedClubs, setJoinedClubs] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchClubs = async (userUniversity?: string | null) => {
    if (!userId) return;
    
    setIsLoadingClubs(true);
    try {
      // Fetch clubs the student has joined
      const { data: membershipData, error: membershipError } = await supabase
        .from('club_members')
        .select('club_id')
        .eq('user_id', userId);

      if (membershipError) throw membershipError;
      
      const clubIds = membershipData?.map(item => item.club_id) || [];
      
      // Fetch detailed club information
      let { data: clubsData, error: clubsError } = await supabase
        .from('clubs')
        .select('*')
        .in('id', clubIds.length ? clubIds : ['00000000-0000-0000-0000-000000000000']); // Use a dummy ID if no clubs
          
      if (clubsError) throw clubsError;
      setJoinedClubs(clubsData || []);
      
      // Fetch all available clubs
      let clubsQuery = supabase
        .from('clubs')
        .select('*')
        .eq('status', 'approved');
      
      // Filter by university if provided
      if (userUniversity) {
        clubsQuery = clubsQuery.or(`university.eq.${userUniversity},university.is.null`);
      }
      
      const { data: allClubs, error: allClubsError } = await clubsQuery;
      
      if (allClubsError) throw allClubsError;
      setClubs(allClubs || []);
    } catch (error) {
      console.error('Error fetching club data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load club data',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingClubs(false);
    }
  };

  const joinClub = async (clubId: string) => {
    if (!userId) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to join clubs',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      console.log("Attempting to join club:", clubId, "for user:", userId);
      
      // Check if already a member
      const { data: existing, error: checkError } = await supabase
        .from('club_members')
        .select('*')
        .eq('user_id', userId)
        .eq('club_id', clubId)
        .maybeSingle();
      
      if (checkError) {
        console.error('Error checking membership:', checkError);
        throw checkError;
      }
      
      if (existing) {
        toast({
          title: 'Already a member',
          description: 'You are already a member of this club',
          variant: 'default',
        });
        return;
      }
      
      // Join the club
      const { error } = await supabase
        .from('club_members')
        .insert({
          user_id: userId,
          club_id: clubId
        });
      
      if (error) {
        console.error('Error joining club:', error);
        
        if (error.code === '23505') {
          toast({
            title: 'Already a member',
            description: 'You are already a member of this club',
            variant: 'default',
          });
        } else {
          throw error;
        }
        return;
      }
      
      toast({
        title: 'Success',
        description: 'Successfully joined the club',
        variant: 'default',
      });
      
      // Update the local state
      const club = clubs.find(c => c.id === clubId);
      if (club) {
        setJoinedClubs(prev => [...prev, club]);
      }
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error joining club:', error);
      toast({
        title: 'Failed to join club',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const leaveClub = async (clubId: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('club_members')
        .delete()
        .eq('user_id', userId)
        .eq('club_id', clubId);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'You have left the club',
        variant: 'default',
      });
      
      // Update the local state
      setJoinedClubs(prev => prev.filter(club => club.id !== clubId));
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error leaving club:', error);
      toast({
        title: 'Error',
        description: 'Failed to leave club',
        variant: 'destructive',
      });
    }
  };

  return {
    clubs,
    joinedClubs,
    isLoadingClubs,
    fetchClubs,
    joinClub,
    leaveClub
  };
};
