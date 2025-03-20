
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
        // First, fetch the club members
        const { data: membersData, error: membersError } = await supabase
          .from('club_members')
          .select('user_id, created_at, club_id')
          .eq('club_id', clubId);
        
        if (membersError) throw membersError;
        
        // Now, for each member, fetch their profile information
        const members = await Promise.all(
          membersData.map(async (member) => {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('name, email')
              .eq('id', member.user_id)
              .single();
            
            if (profileError) {
              console.warn(`Could not fetch profile for user ${member.user_id}:`, profileError);
              return {
                ...member,
                profiles: { name: 'Unknown User', email: 'N/A' },
                clubId,
                clubName: clubs.find(club => club.id === clubId)?.name || 'Unknown Club'
              };
            }
            
            return {
              ...member,
              profiles: profileData,
              clubId,
              clubName: clubs.find(club => club.id === clubId)?.name || 'Unknown Club'
            };
          })
        );
        
        totalMembers += members.length;
        return members;
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
