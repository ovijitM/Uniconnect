
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/home/HeroSection';
import FeaturedEventSection from '@/components/home/FeaturedEventSection';
import UpcomingEventsSection from '@/components/home/UpcomingEventsSection';
import FeaturedClubsSection from '@/components/home/FeaturedClubsSection';
import PopularCategoriesSection from '@/components/home/PopularCategoriesSection';
import CallToActionSection from '@/components/home/CallToActionSection';
import { useHomePageData } from '@/hooks/useHomePageData';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { events, clubs, featuredEvent, isLoading } = useHomePageData();
  const { user } = useAuth();
  
  // Log home page data for debugging
  useEffect(() => {
    console.log("Home page rendered with:", {
      eventsCount: events.length,
      clubsCount: clubs.length,
      hasFeaturedEvent: !!featuredEvent,
      isLoading
    });
  }, [events, clubs, featuredEvent, isLoading]);

  // Redirect logged in users to their appropriate dashboard
  if (user) {
    const dashboardRoute = 
      user.role === 'admin' ? '/admin-dashboard' :
      user.role === 'club_admin' ? '/club-admin-dashboard' :
      user.role === 'student' ? '/student-dashboard' : null;
      
    if (dashboardRoute) {
      console.log(`Redirecting ${user.role} to ${dashboardRoute}`);
      return <Navigate to={dashboardRoute} />;
    }
  }

  return (
    <Layout>
      <div className="space-y-16 py-6">
        <HeroSection />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <FeaturedEventSection featuredEvent={featuredEvent} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-1">
            <PopularCategoriesSection categories={clubs.map(club => club.category)} />
          </div>
        </div>
        
        <UpcomingEventsSection events={events} isLoading={isLoading} />
        <FeaturedClubsSection clubs={clubs} isLoading={isLoading} />
        <CallToActionSection />
      </div>
    </Layout>
  );
};

export default Home;
