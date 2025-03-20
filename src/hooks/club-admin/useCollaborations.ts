import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Collaboration, Club } from '@/types';

export const useCollaborations = (clubId?: string) => {
  const [incomingRequests, setIncomingRequests] = useState<Collaboration[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<Collaboration[]>([]);
  const [acceptedCollaborations, setAcceptedCollaborations] = useState<Collaboration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (clubId) {
      fetchCollaborations();
    }
  }, [clubId]);

  const fetchCollaborations = async () => {
    if (!clubId) return;
    
    try {
      setIsLoading(true);
      
      // Fetch incoming requests (where current club is requested_club_id)
      const { data: incomingData, error: incomingError } = await supabase
        .from('club_collaborations')
        .select(`
          id,
          requester_club_id,
          requested_club_id,
          status,
          created_at,
          updated_at
        `)
        .eq('requested_club_id', clubId)
        .eq('status', 'pending');
      
      if (incomingError) throw incomingError;
      
      // For each incoming request, fetch the requester club details
      const incomingWithClubDetails = await Promise.all(
        incomingData.map(async (item) => {
          const { data: clubData, error: clubError } = await supabase
            .from('clubs')
            .select('id, name, logo_url, category, description')
            .eq('id', item.requester_club_id)
            .single();
          
          if (clubError) {
            console.error('Error fetching requester club:', clubError);
            return null;
          }
          
          return {
            id: item.id,
            requesterClubId: item.requester_club_id,
            requestedClubId: item.requested_club_id,
            status: item.status as "pending" | "accepted" | "rejected",
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            requesterClub: clubData ? {
              id: clubData.id,
              name: clubData.name,
              logoUrl: clubData.logo_url,
              category: clubData.category,
              description: clubData.description,
              memberCount: 0,
              events: []
            } : undefined
          };
        })
      );
      
      const validIncomingRequests = incomingWithClubDetails.filter(Boolean) as Collaboration[];
      
      // Fetch outgoing requests (where current club is requester_club_id)
      const { data: outgoingData, error: outgoingError } = await supabase
        .from('club_collaborations')
        .select(`
          id,
          requester_club_id,
          requested_club_id,
          status,
          created_at,
          updated_at
        `)
        .eq('requester_club_id', clubId)
        .eq('status', 'pending');
      
      if (outgoingError) throw outgoingError;
      
      // For each outgoing request, fetch the requested club details
      const outgoingWithClubDetails = await Promise.all(
        outgoingData.map(async (item) => {
          const { data: clubData, error: clubError } = await supabase
            .from('clubs')
            .select('id, name, logo_url, category, description')
            .eq('id', item.requested_club_id)
            .single();
          
          if (clubError) {
            console.error('Error fetching requested club:', clubError);
            return null;
          }
          
          return {
            id: item.id,
            requesterClubId: item.requester_club_id,
            requestedClubId: item.requested_club_id,
            status: item.status as "pending" | "accepted" | "rejected",
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            requestedClub: clubData ? {
              id: clubData.id,
              name: clubData.name,
              logoUrl: clubData.logo_url,
              category: clubData.category,
              description: clubData.description,
              memberCount: 0,
              events: []
            } : undefined
          };
        })
      );
      
      const validOutgoingRequests = outgoingWithClubDetails.filter(Boolean) as Collaboration[];
      
      // Fetch accepted collaborations (both ways)
      const { data: acceptedData, error: acceptedError } = await supabase
        .from('club_collaborations')
        .select(`
          id,
          requester_club_id,
          requested_club_id,
          status,
          created_at,
          updated_at
        `)
        .eq('status', 'accepted')
        .or(`requester_club_id.eq.${clubId},requested_club_id.eq.${clubId}`);
      
      if (acceptedError) throw acceptedError;
      
      // For each accepted collaboration, fetch both clubs' details
      const acceptedWithClubDetails = await Promise.all(
        acceptedData.map(async (item) => {
          const { data: requesterClubData, error: requesterClubError } = await supabase
            .from('clubs')
            .select('id, name, logo_url, category, description')
            .eq('id', item.requester_club_id)
            .single();
          
          const { data: requestedClubData, error: requestedClubError } = await supabase
            .from('clubs')
            .select('id, name, logo_url, category, description')
            .eq('id', item.requested_club_id)
            .single();
          
          if (requesterClubError || requestedClubError) {
            console.error('Error fetching collaboration clubs:', requesterClubError || requestedClubError);
            return null;
          }
          
          return {
            id: item.id,
            requesterClubId: item.requester_club_id,
            requestedClubId: item.requested_club_id,
            status: item.status as "pending" | "accepted" | "rejected",
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            requesterClub: requesterClubData ? {
              id: requesterClubData.id,
              name: requesterClubData.name,
              logoUrl: requesterClubData.logo_url,
              category: requesterClubData.category,
              description: requesterClubData.description,
              memberCount: 0,
              events: []
            } : undefined,
            requestedClub: requestedClubData ? {
              id: requestedClubData.id,
              name: requestedClubData.name,
              logoUrl: requestedClubData.logo_url,
              category: requestedClubData.category,
              description: requestedClubData.description,
              memberCount: 0,
              events: []
            } : undefined
          };
        })
      );
      
      const validAcceptedCollaborations = acceptedWithClubDetails.filter(Boolean) as Collaboration[];
      
      setIncomingRequests(validIncomingRequests);
      setOutgoingRequests(validOutgoingRequests);
      setAcceptedCollaborations(validAcceptedCollaborations);
    } catch (error) {
      console.error('Error fetching collaborations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load collaboration data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendCollaborationRequest = async (requestedClubId: string) => {
    if (!clubId) return false;
    
    try {
      if (clubId === requestedClubId) {
        toast({
          title: 'Error',
          description: 'You cannot send a collaboration request to your own club.',
          variant: 'destructive',
        });
        return false;
      }
      
      const { data, error } = await supabase
        .from('club_collaborations')
        .insert([
          { requester_club_id: clubId, requested_club_id: requestedClubId }
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Request Sent',
        description: 'Collaboration request has been sent successfully.',
        variant: 'default',
      });
      
      fetchCollaborations();
      return true;
    } catch (error: any) {
      console.error('Error sending collaboration request:', error);
      
      // Check for unique constraint violation
      if (error.code === '23505') {
        toast({
          title: 'Request Already Exists',
          description: 'A collaboration request already exists with this club.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to send collaboration request. Please try again.',
          variant: 'destructive',
        });
      }
      
      return false;
    }
  };

  const respondToCollaborationRequest = async (collaborationId: string, accept: boolean) => {
    try {
      const { error } = await supabase
        .from('club_collaborations')
        .update({ 
          status: accept ? 'accepted' : 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', collaborationId);
      
      if (error) throw error;
      
      toast({
        title: accept ? 'Request Accepted' : 'Request Rejected',
        description: accept 
          ? 'Collaboration request has been accepted.' 
          : 'Collaboration request has been rejected.',
        variant: 'default',
      });
      
      fetchCollaborations();
      return true;
    } catch (error) {
      console.error('Error responding to collaboration request:', error);
      toast({
        title: 'Error',
        description: 'Failed to update collaboration request status. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    incomingRequests,
    outgoingRequests,
    acceptedCollaborations,
    isLoading,
    fetchCollaborations,
    sendCollaborationRequest,
    respondToCollaborationRequest
  };
};
