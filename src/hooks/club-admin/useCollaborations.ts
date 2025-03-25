
import { useState } from 'react';
import { useCollaborationsFetch } from './collaborations/useCollaborationsFetch';
import { useSendCollaborationRequest } from './collaborations/useSendCollaborationRequest';
import { useRespondToCollaborationRequest } from './collaborations/useRespondToCollaborationRequest';
import { Collaboration } from '@/types';

export const useCollaborations = (clubId?: string) => {
  const [isPending, setIsPending] = useState(false);
  
  const {
    incomingRequests,
    outgoingRequests,
    acceptedCollaborations,
    isLoading,
    fetchCollaborations
  } = useCollaborationsFetch(clubId);
  
  const { sendCollaborationRequest } = useSendCollaborationRequest(clubId, fetchCollaborations);
  
  const { respondToCollaborationRequest } = useRespondToCollaborationRequest(fetchCollaborations);
  
  const handleSendCollaborationRequest = async (requestedClubId: string) => {
    setIsPending(true);
    try {
      const result = await sendCollaborationRequest(requestedClubId);
      return result;
    } finally {
      setIsPending(false);
    }
  };
  
  const handleRespondToCollaborationRequest = async (collaborationId: string, accept: boolean) => {
    setIsPending(true);
    try {
      const result = await respondToCollaborationRequest(collaborationId, accept);
      return result;
    } finally {
      setIsPending(false);
    }
  };

  return {
    incomingRequests,
    outgoingRequests,
    acceptedCollaborations,
    isLoading,
    isPending,
    fetchCollaborations,
    sendCollaborationRequest: handleSendCollaborationRequest,
    respondToCollaborationRequest: handleRespondToCollaborationRequest
  };
};
