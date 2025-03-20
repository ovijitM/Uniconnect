
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Club } from '@/types';

export const useClubMembership = (
  club: Club | null, 
  setClub: React.Dispatch<React.SetStateAction<Club | null>>
) => {
  const { clubId } = useParams<{ clubId: string }>();
  const [isMember, setIsMember] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    async function checkMembership() {
      if (!user || !clubId) return;
      
      const { data: membershipData, error: membershipError } = await supabase
        .from('club_members')
        .select('*')
        .eq('club_id', clubId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      setIsMember(!!membershipData);
      
      if (membershipError) {
        console.error('Error checking membership:', membershipError);
      }
    }
    
    checkMembership();
  }, [user, clubId]);

  const handleJoinClub = async () => {
    try {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to join clubs",
          variant: "destructive",
        });
        return;
      }
      
      if (!clubId) return;
      
      setIsJoining(true);
      
      // Check if the club is approved before joining
      if (club?.status !== 'approved') {
        toast({
          title: "Cannot join this club",
          description: "This club is not approved yet",
          variant: "destructive",
        });
        return;
      }
      
      const { error } = await supabase
        .from('club_members')
        .insert({
          club_id: clubId,
          user_id: user.id
        });
      
      if (error) {
        if (error.code === '23505') {
          // Duplicate key error - user is already a member
          toast({
            title: "Already a member",
            description: "You're already a member of this club",
            variant: "default",
          });
        } else {
          throw error;
        }
      } else {
        setIsMember(true);
        setClub(prev => prev ? { ...prev, memberCount: prev.memberCount + 1 } : null);
        
        toast({
          title: "Successfully joined!",
          description: `You're now a member of ${club?.name}`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error joining club:', error);
      toast({
        title: "Failed to join club",
        description: "There was an error joining the club. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  return {
    isMember,
    isJoining,
    handleJoinClub
  };
};
