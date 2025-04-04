
import { useState, useEffect, useCallback } from 'react';
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
  const [lastCheckTimestamp, setLastCheckTimestamp] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();

  // Create a memoized membership checking function
  const checkMembership = useCallback(async () => {
    if (!user || !clubId) return false;
    
    try {
      console.log(`Checking membership for user ${user.id} in club ${clubId}`);
      setLastCheckTimestamp(Date.now()); // Update timestamp for dependency tracking
      
      const { data: membershipData, error: membershipError } = await supabase
        .from('club_members')
        .select('*')
        .eq('club_id', clubId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      const isUserMember = !!membershipData;
      console.log(`User membership status for club ${clubId}: ${isUserMember ? 'Member' : 'Not member'}`);
      setIsMember(isUserMember);
      
      if (membershipError && membershipError.code !== 'PGRST116') { // PGRST116 means no rows returned
        console.error('Error checking membership:', membershipError);
      }
      
      return isUserMember;
    } catch (error) {
      console.error('Error in checkMembership:', error);
      return false;
    }
  }, [user, clubId, lastCheckTimestamp]);

  // Check membership on component mount and when dependencies change
  useEffect(() => {
    checkMembership();
  }, [checkMembership]);

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
      
      if (!clubId) {
        toast({
          title: "Club not found",
          description: "Unable to find club information",
          variant: "destructive",
        });
        return;
      }
      
      setIsJoining(true);
      
      // Check if the club is approved before joining
      if (club?.status !== 'approved') {
        toast({
          title: "Cannot join this club",
          description: "This club is not approved yet",
          variant: "destructive",
        });
        setIsJoining(false);
        return;
      }
      
      // Check if already a member
      const isMemberNow = await checkMembership();
      
      if (isMemberNow) {
        toast({
          title: "Already a member",
          description: "You're already a member of this club",
          variant: "default",
        });
        setIsMember(true); // Ensure UI is updated even if already a member
        setIsJoining(false);
        return;
      }
      
      // Join the club
      const { error } = await supabase
        .from('club_members')
        .insert({
          club_id: clubId,
          user_id: user.id
        });
      
      if (error) {
        console.error('Error joining club:', error);
        
        if (error.code === '23505') {
          // Duplicate key error - user is already a member
          toast({
            title: "Already a member",
            description: "You're already a member of this club",
            variant: "default",
          });
          setIsMember(true); // Update state to reflect membership
        } else {
          throw error;
        }
      } else {
        setIsMember(true);
        
        // Update the club member count
        setClub(prev => {
          if (!prev) return null;
          return {
            ...prev,
            memberCount: (prev.memberCount || 0) + 1
          };
        });
        
        toast({
          title: "Successfully joined!",
          description: `You're now a member of ${club?.name}`,
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error('Error joining club:', error);
      toast({
        title: "Failed to join club",
        description: error.message || "There was an error joining the club. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
      
      // Recheck membership status after join attempt
      checkMembership();
    }
  };

  return {
    isMember,
    isJoining,
    handleJoinClub,
    checkMembership
  };
};
