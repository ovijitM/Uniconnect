
import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/home/HeroSection';
import FeaturedEventSection from '@/components/home/FeaturedEventSection';
import UpcomingEventsSection from '@/components/home/UpcomingEventsSection';
import FeaturedClubsSection from '@/components/home/FeaturedClubsSection';
import { useHomePageData } from '@/hooks/useHomePageData';

const Index: React.FC = () => {
  const { events, clubs, featuredEvent, isLoading } = useHomePageData();

  return (
    <Layout>
      <section className="mb-16">
        <HeroSection />
        <FeaturedEventSection featuredEvent={featuredEvent} isLoading={isLoading} />
        <UpcomingEventsSection events={events} isLoading={isLoading} />
        <FeaturedClubsSection clubs={clubs} isLoading={isLoading} />
      </section>
    </Layout>
  );
};

export default Index;
