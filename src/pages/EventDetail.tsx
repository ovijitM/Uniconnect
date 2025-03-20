
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

const EventDetailPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { event, isLoading, isParticipating, handleParticipate } = useEventDetail(eventId);

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

  return (
    <Layout>
      <EventHeader 
        title={event.title}
        description={event.description}
        category={event.category}
        status={event.status}
        organizerId={event.organizer.id}
        organizerName={event.organizer.name}
      />

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
            />

            <EventActions 
              status={event.status}
              isParticipating={isParticipating}
              onParticipate={handleParticipate}
            />
          </div>

          <OrganizerCard 
            id={event.organizer.id}
            name={event.organizer.name}
            logoUrl={event.organizer.logoUrl}
            description={event.organizer.description}
          />
        </motion.div>
      </div>
    </Layout>
  );
};

export default EventDetailPage;
