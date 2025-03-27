
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export const useStudentClubs = (userId: string | undefined, onSuccess?: () => void) => {
  const [isLoadingClubs, setIsLoadingClubs] = useState(false);
  const [clubs, setClubs] = useState<any[]>([]);
  const [joinedClubs, setJoinedClubs] = useState<any[]>([]);
  const [joinedClubIds, setJoinedClubIds] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchClubs = async (userUniversity?: string | null) => {
    if (!userId) return;
    
    setIsLoadingClubs(true);
    try {
      console.log('Fetching clubs for user:', userId);
      
      // Fetch clubs the student has joined
      const { data: membershipData, error: membershipError } = await supabase
        .from('club_members')
        .select('club_id')
        .eq('user_id', userId);

      if (membershipError) throw membershipError;
      
      const clubIds = membershipData?.map(item => item.club_id) || [];
      setJoinedClubIds(clubIds);
      console.log('Joined club IDs:', clubIds);
      
      // Fetch detailed club information for joined clubs
      if (clubIds.length > 0) {
        const { data: joinedClubsData, error: joinedClubsError } = await supabase
          .from('clubs')
          .select('*')
          .in('id', clubIds);
          
        if (joinedClubsError) throw joinedClubsError;
        console.log('Joined clubs data:', joinedClubsData);
        setJoinedClubs(joinedClubsData || []);
      } else {
        setJoinedClubs([]);
      }
      
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
      
      // Immediately update the local state
      const clubToAdd = clubs.find(c => c.id === clubId);
      if (clubToAdd) {
        setJoinedClubs(prev => [...prev, clubToAdd]);
        setJoinedClubIds(prev => [...prev, clubId]);
      }
      
      toast({
        title: 'Success',
        description: 'You have joined the club successfully',
        variant: 'default',
      });
      
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
      
      // Immediately update local state
      setJoinedClubs(prev => prev.filter(club => club.id !== clubId));
      setJoinedClubIds(prev => prev.filter(id => id !== clubId));
      
      toast({
        title: 'Success',
        description: 'You have left the club',
        variant: 'default',
      });
      
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

  // Add useEffect to log joinedClubs whenever it changes
  useEffect(() => {
    console.log('Current joined clubs:', joinedClubs);
    console.log('Current joined club IDs:', joinedClubIds);
  }, [joinedClubs, joinedClubIds]);

  return {
    clubs,
    joinedClubs,
    joinedClubIds,
    isLoadingClubs,
    fetchClubs,
    joinClub,
    leaveClub
  };
};
