
import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { useEventDetail } from '@/hooks/useEventDetail';
import EventHeader from '@/components/event-detail/EventHeader';
import EventImage from '@/components/event-detail/EventImage';
import EventInfo from '@/components/event-detail/EventInfo';
import EventActions from '@/components/event-detail/EventActions';
import OrganizerCard from '@/components/event-detail/OrganizerCard';
import EventDetailSkeleton from '@/components/event-detail/EventDetailSkeleton';
import EventDetailNotFound from '@/components/event-detail/EventDetailNotFound';
import EventThemeAndPrizes from '@/components/event-detail/EventThemeAndPrizes';
import EventSubmissionAndContact from '@/components/event-detail/EventSubmissionAndContact';
import EventCollaborators from '@/components/event-detail/EventCollaborators';
import EventReviews from '@/components/event-detail/EventReviews';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { event, isLoading, isParticipating, canAccess, handleParticipate, handleUnregister } = useEventDetail(eventId);
  const { user } = useAuth();

  if (isLoading) {
    return (
      <Layout>
        <EventDetailSkeleton />
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <EventDetailNotFound />
      </Layout>
    );
  }

  // Fix the type error: Check if user exists and if the event visibility is restricted
  const isUniversityRestricted = event.visibility === 'university_only' && !canAccess && user !== null;

  return (
    <Layout>
      <EventHeader 
        title={event.title}
        tagline={event.tagline}
        date={event.date}
        location={event.location}
        category={event.category}
        participants={event.participants}
        maxParticipants={event.maxParticipants}
        visibility={event.visibility}
        organizerName={event.organizer.name}
        organizerUniversity={event.organizer.university}
      />

      {isUniversityRestricted && (
        <Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-900/20">
          <Lock className="h-4 w-4 text-amber-500" />
          <AlertTitle>University-Only Event</AlertTitle>
          <AlertDescription>
            This event is only available to students from {event.organizer.university}.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <EventImage 
            imageUrl={event.imageUrl}
            title={event.title}
            status={event.status}
          />
          
          {event.collaborators && event.collaborators.length > 0 && (
            <EventCollaborators
              collaborators={event.collaborators}
              organizer={event.organizer}
            />
          )}
          
          <EventThemeAndPrizes
            theme={event.theme}
            subTracks={event.subTracks}
            prizePool={event.prizePool}
            prizeCategories={event.prizeCategories}
            additionalPerks={event.additionalPerks}
            judgingCriteria={event.judgingCriteria}
            judges={event.judges}
          />
          
          <EventSubmissionAndContact
            deliverables={event.deliverables}
            submissionPlatform={event.submissionPlatform}
            mentors={event.mentors}
            sponsors={event.sponsors}
            contactEmail={event.contactEmail}
            communityLink={event.communityLink}
            eventWebsite={event.eventWebsite}
            eventHashtag={event.eventHashtag}
          />
          
          {/* Add Event Reviews Component */}
          {eventId && (
            <EventReviews eventId={eventId} />
          )}
        </motion.div>

        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <div className="glass-panel rounded-xl p-6 space-y-6">
            <EventInfo 
              date={event.date}
              location={event.location}
              participants={event.participants}
              maxParticipants={event.maxParticipants}
              eventType={event.eventType}
              onlinePlatform={event.onlinePlatform}
              registrationDeadline={event.registrationDeadline}
              registrationLink={event.registrationLink}
              entryFee={event.entryFee}
              teamSize={event.teamSize}
              eligibility={event.eligibility}
            />

            <EventActions 
              status={event.status}
              isParticipating={isParticipating}
              onParticipate={handleParticipate}
              onUnregister={handleUnregister}
              isDisabled={isUniversityRestricted}
              disabledReason={isUniversityRestricted ? "This event is only for students from " + event.organizer.university : undefined}
            />
          </div>

          <OrganizerCard 
            id={event.organizer.id}
            name={event.organizer.name}
            logoUrl={event.organizer.logoUrl}
            description={event.organizer.description}
            university={event.organizer.university}
          />
        </motion.div>
      </div>
    </Layout>
  );
};

export default EventDetailPage;
