
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useClubMembers = () => {
  const { toast } = useToast();
  const [clubMembers, setClubMembers] = useState<any[]>([]);
  const [totalMembersCount, setTotalMembersCount] = useState(0);

  const fetchClubMembers = async (clubIds: string[], clubs: any[]) => {
    if (!clubIds.length) {
      setClubMembers([]);
      setTotalMembersCount(0);
      return [];
    }
    
    try {
      let totalMembers = 0;
      const allMembersPromises = clubIds.map(async (clubId) => {
        const { data: membersData, error: membersError } = await supabase
          .from('club_members')
          .select(`
            user_id,
            created_at,
            profiles(name, email)
          `)
          .eq('club_id', clubId);
        
        if (membersError) throw membersError;
        
        totalMembers += membersData.length;
        return membersData.map(member => ({
          ...member,
          clubId,
          clubName: clubs.find(club => club.id === clubId)?.name || 'Unknown Club'
        }));
      });
      
      const allMembersArrays = await Promise.all(allMembersPromises);
      const allMembers = allMembersArrays.flat();
      
      setClubMembers(allMembers);
      setTotalMembersCount(totalMembers);
      
      return allMembers;
    } catch (error) {
      console.error('Error fetching club members:', error);
      toast({
        title: 'Error',
        description: 'Failed to load members data. Please try again.',
        variant: 'destructive',
      });
      return [];
    }
  };

  return {
    clubMembers,
    totalMembersCount,
    fetchClubMembers
  };
};
