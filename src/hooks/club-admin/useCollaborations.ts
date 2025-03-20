
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
          updated_at,
          requesterClub:requester_club_id(id, name, logo_url, category)
        `)
        .eq('requested_club_id', clubId)
        .eq('status', 'pending');
      
      if (incomingError) throw incomingError;
      
      // Fetch outgoing requests (where current club is requester_club_id)
      const { data: outgoingData, error: outgoingError } = await supabase
        .from('club_collaborations')
        .select(`
          id,
          requester_club_id,
          requested_club_id,
          status,
          created_at,
          updated_at,
          requestedClub:requested_club_id(id, name, logo_url, category)
        `)
        .eq('requester_club_id', clubId)
        .eq('status', 'pending');
      
      if (outgoingError) throw outgoingError;
      
      // Fetch accepted collaborations (both ways)
      const { data: acceptedData, error: acceptedError } = await supabase
        .from('club_collaborations')
        .select(`
          id,
          requester_club_id,
          requested_club_id,
          status,
          created_at,
          updated_at,
          requesterClub:requester_club_id(id, name, logo_url, category),
          requestedClub:requested_club_id(id, name, logo_url, category)
        `)
        .eq('status', 'accepted')
        .or(`requester_club_id.eq.${clubId},requested_club_id.eq.${clubId}`);
      
      if (acceptedError) throw acceptedError;
      
      const formattedIncoming = incomingData?.map((item) => ({
        id: item.id,
        requesterClubId: item.requester_club_id,
        requestedClubId: item.requested_club_id,
        status: item.status,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        requesterClub: item.requesterClub ? {
          id: item.requesterClub.id,
          name: item.requesterClub.name,
          logoUrl: item.requesterClub.logo_url,
          category: item.requesterClub.category,
          memberCount: 0,
          events: []
        } : undefined
      })) || [];
      
      const formattedOutgoing = outgoingData?.map((item) => ({
        id: item.id,
        requesterClubId: item.requester_club_id,
        requestedClubId: item.requested_club_id,
        status: item.status,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        requestedClub: item.requestedClub ? {
          id: item.requestedClub.id,
          name: item.requestedClub.name,
          logoUrl: item.requestedClub.logo_url,
          category: item.requestedClub.category,
          memberCount: 0,
          events: []
        } : undefined
      })) || [];
      
      const formattedAccepted = acceptedData?.map((item) => ({
        id: item.id,
        requesterClubId: item.requester_club_id,
        requestedClubId: item.requested_club_id,
        status: item.status,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        requesterClub: item.requesterClub ? {
          id: item.requesterClub.id,
          name: item.requesterClub.name,
          logoUrl: item.requesterClub.logo_url,
          category: item.requesterClub.category,
          memberCount: 0,
          events: []
        } : undefined,
        requestedClub: item.requestedClub ? {
          id: item.requestedClub.id,
          name: item.requestedClub.name,
          logoUrl: item.requestedClub.logo_url,
          category: item.requestedClub.category,
          memberCount: 0,
          events: []
        } : undefined
      })) || [];
      
      setIncomingRequests(formattedIncoming);
      setOutgoingRequests(formattedOutgoing);
      setAcceptedCollaborations(formattedAccepted);
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
