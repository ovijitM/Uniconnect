
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useClubMembers = () => {
  const [clubMembers, setClubMembers] = useState<any[]>([]);
  const [totalMembersCount, setTotalMembersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchClubMembers = async (clubIds: string[], clubs: any[]) => {
    if (!clubIds || clubIds.length === 0) {
      setClubMembers([]);
      setTotalMembersCount(0);
      return;
    }
    
    try {
      console.log("Fetching members for clubs:", clubIds);
      
      // Fetch all members for the clubs
      const { data: membersData, error: membersError } = await supabase
        .from('club_members')
        .select(`
          *,
          profiles:user_id(id, name, email, role, profile_image, university)
        `)
        .in('club_id', clubIds);
      
      if (membersError) {
        console.error("Error fetching members:", membersError);
        throw membersError;
      }
      
      console.log("Members fetched:", membersData);
      
      // Add club name to each member
      const membersWithClubName = membersData?.map(member => {
        const club = clubs.find(c => c.id === member.club_id);
        return {
          ...member,
          club_name: club ? club.name : 'Unknown Club'
        };
      }) || [];
      
      setClubMembers(membersWithClubName);
      setTotalMembersCount(membersWithClubName.length);
      
    } catch (error) {
      console.error('Error fetching club members:', error);
      toast({
        title: 'Error',
        description: 'Failed to load members data. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return {
    clubMembers,
    totalMembersCount,
    fetchClubMembers,
    isLoading,
    setIsLoading
  };
};
