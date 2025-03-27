
import React from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import EventsContainer from '@/components/events/EventsContainer';
import Layout from '@/components/Layout';

const Events = () => {
  return (
    <Layout>
      <ErrorBoundary>
        <EventsContainer />
      </ErrorBoundary>
    </Layout>
  );
};

export default Events;
