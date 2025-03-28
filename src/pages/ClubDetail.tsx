
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Layout from '@/components/Layout';
import { useClubDetail } from '@/components/club-detail/hooks/useClubDetail';
import ClubDetailSkeleton from '@/components/club-detail/ClubDetailSkeleton';
import ClubDetailNotFound from '@/components/club-detail/ClubDetailNotFound';
import ClubHeader from '@/components/club-detail/ClubHeader';
import ClubEventsTabs from '@/components/club-detail/ClubEventsTabs';
import ClubSidebar from '@/components/club-detail/ClubSidebar';
import ClubDescription from '@/components/club-detail/ClubDescription';
import ClubDetailInfo from '@/components/club-detail/ClubDetailInfo';
import ClubCollaborations from '@/components/club-detail/ClubCollaborations';
import CollaborationRequestDialog from '@/components/club-detail/CollaborationRequestDialog';
import { Separator } from '@/components/ui/separator';
import { useCollaborations } from '@/hooks/club-admin/useCollaborations';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ClubDetailPage: React.FC = () => {
  const params = useParams<{ clubId: string }>();
  const clubId = params.clubId; 
  const { toast } = useToast();
  
  // Enhanced logging for debugging
  console.log("ClubDetailPage: URL parameters:", params);
  console.log("ClubDetailPage: Using clubId:", clubId);
  
  const {
    club,
    events,
    isLoading,
    isMember,
    isJoining,
    relatedClubs,
    isAdmin,
    isClubAdmin,
    handleJoinClub,
    checkMembership,
    error
  } = useClubDetail(clubId);

  const {
    incomingRequests,
    outgoingRequests,
    acceptedCollaborations,
    isLoading: isLoadingCollaborations,
    isPending,
    sendCollaborationRequest,
    respondToCollaborationRequest
  } = useCollaborations(club?.id);

  console.log("ClubDetailPage: Rendering with club data:", { 
    clubId, 
    isLoading, 
    clubExists: !!club, 
    memberCount: club?.memberCount,
    isMember,
    error: error ? { message: error.message, name: error.name } : null 
  });

  // Refresh membership status when club ID changes or when page loads
  useEffect(() => {
    if (clubId && checkMembership) {
      console.log(`Checking membership status for club ${clubId} on page load/change`);
      checkMembership();
    }
  }, [clubId, checkMembership]);

  const handleRetry = () => {
    // Force page refresh
    window.location.reload();
  };

  // If there's no clubId, show the not found page immediately
  if (!clubId) {
    console.error("ClubDetailPage: No clubId provided in URL parameters");
    return <ClubDetailNotFound />;
  }

  if (isLoading) {
    return <ClubDetailSkeleton />;
  }

  if (error) {
    return (
      <Layout>
        <div className="mb-6">
          <Link to="/clubs" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clubs
          </Link>
        </div>
        
        <Alert variant="destructive" className="my-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading club</AlertTitle>
          <AlertDescription className="mt-2">
            There was an error loading the club details. Please try again.
            {error.message && <p className="text-sm mt-1">{error.message}</p>}
            {process.env.NODE_ENV === 'development' && <pre className="text-xs mt-2 p-2 bg-background/50 rounded overflow-x-auto">{JSON.stringify(error, null, 2)}</pre>}
          </AlertDescription>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={handleRetry}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try again
          </Button>
        </Alert>
      </Layout>
    );
  }

  if (!club) {
    return <ClubDetailNotFound />;
  }

  return (
    <Layout>
      <div className="mb-6">
        <Link to="/clubs" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clubs
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <ClubHeader 
            club={club} 
            isAdmin={isAdmin} 
            isClubAdmin={isClubAdmin} 
          />

          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">About</h2>
            <ClubDescription description={club.description} />
          </div>
          
          <Separator className="my-8" />
          
          <div className="mb-10">
            <ClubDetailInfo club={club} />
          </div>

          {isClubAdmin && (
            <>
              <Separator className="my-8" />
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Club Collaborations</h2>
                <CollaborationRequestDialog 
                  clubId={club.id}
                  onSendRequest={sendCollaborationRequest}
                />
              </div>
              <ClubCollaborations 
                incomingRequests={incomingRequests}
                outgoingRequests={outgoingRequests}
                acceptedCollaborations={acceptedCollaborations}
                isLoading={isLoadingCollaborations}
                isPending={isPending}
                onAccept={(id) => respondToCollaborationRequest(id, true)}
                onReject={(id) => respondToCollaborationRequest(id, false)}
              />
            </>
          )}

          <Separator className="my-8" />
          
          <div className="pb-12">
            <h2 className="text-xl font-medium mb-6">Club Events</h2>
            <ClubEventsTabs events={events} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative z-10"
        >
          <div className="sticky top-24">
            <ClubSidebar
              club={club}
              events={events}
              isMember={isMember}
              isJoining={isJoining}
              handleJoinClub={handleJoinClub}
              relatedClubs={relatedClubs}
            />
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default ClubDetailPage;
