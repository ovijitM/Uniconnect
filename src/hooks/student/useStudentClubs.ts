
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useStudentClubs = (userId: string | undefined, onSuccess?: () => void) => {
  const [isLoadingClubs, setIsLoadingClubs] = useState(false);
  const [clubs, setClubs] = useState<any[]>([]);
  const [joinedClubs, setJoinedClubs] = useState<any[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

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
      
      // Fetch detailed club information for joined clubs
      let joinedClubsQuery = supabase
        .from('clubs')
        .select('*');
        
      if (clubIds.length > 0) {
        joinedClubsQuery = joinedClubsQuery.in('id', clubIds);
      } else {
        // If no clubs joined, use a dummy ID to return empty result
        joinedClubsQuery = joinedClubsQuery.in('id', ['00000000-0000-0000-0000-000000000000']);
      }
      
      let { data: joinedClubsData, error: joinedClubsError } = await joinedClubsQuery;
          
      if (joinedClubsError) throw joinedClubsError;
      setJoinedClubs(joinedClubsData || []);
      
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
    if (!user || !userId) {
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
      
      // Join the club - ensure we're inserting with correct user_id
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
        } else if (error.message?.includes('row-level security policy')) {
          throw new Error('Permission denied. You may not have the right privileges to join this club.');
        } else {
          throw error;
        }
        return;
      }
      
      // Update the local state
      const club = clubs.find(c => c.id === clubId);
      if (club) {
        setJoinedClubs(prev => [...prev, club]);
      }
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error joining club:', error);
      throw error; // Re-throw to allow the component to handle the error
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
