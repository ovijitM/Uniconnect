
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/home/HeroSection';
import FeaturedEventSection from '@/components/home/FeaturedEventSection';
import FeaturedClubsSection from '@/components/home/FeaturedClubsSection';
import PopularCategoriesSection from '@/components/home/PopularCategoriesSection';
import UpcomingEventsSection from '@/components/home/UpcomingEventsSection';
import CallToActionSection from '@/components/home/CallToActionSection';
import RecommendedClubsSection from '@/components/home/RecommendedClubsSection';
import { useHomePageData } from '@/hooks/useHomePageData';
import { useAuth } from '@/contexts/AuthContext';
import { useStudentClubs } from '@/hooks/student/useStudentClubs';
import { useClubRecommendations } from '@/hooks/student/useClubRecommendations';
import { joinClub } from '@/hooks/student/utils/clubMembershipActions';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const { isLoading, featuredEvent, featuredClubs, categories, upcomingEvents } = useHomePageData();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Only fetch joined clubs if user is logged in
  const { 
    joinedClubs, 
    joinedClubIds, 
    fetchClubs 
  } = useStudentClubs(user?.id);
  
  // Get personalized recommendations
  const { 
    recommendations, 
    isLoading: isLoadingRecommendations 
  } = useClubRecommendations(joinedClubIds);

  // Handle joining a club
  const handleJoinClub = async (clubId: string) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to join clubs',
        variant: 'destructive',
      });
      return;
    }

    try {
      await joinClub(user.id, clubId, toast, {
        onSuccess: () => {
          // Refresh the clubs data after joining
          fetchClubs();
        }
      });
    } catch (error: any) {
      console.error('Error joining club:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to join club',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-16 py-8">
        <HeroSection />
        
        <FeaturedEventSection 
          event={featuredEvent} 
          isLoading={isLoading} 
        />
        
        {/* Only show recommendations for logged in users */}
        {user && (
          <div className="container px-4 mx-auto">
            <RecommendedClubsSection
              recommendations={recommendations}
              isLoading={isLoadingRecommendations}
              onJoinClub={handleJoinClub}
              joinedClubIds={joinedClubIds}
            />
          </div>
        )}
        
        <div className="container px-4 mx-auto">
          <FeaturedClubsSection 
            clubs={featuredClubs} 
            isLoading={isLoading}
            onJoinClub={handleJoinClub}
            joinedClubIds={joinedClubIds}
          />
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="container px-4 mx-auto">
            <PopularCategoriesSection 
              categories={categories} 
              isLoading={isLoading} 
            />
          </div>
        </div>
        
        <div className="container px-4 mx-auto">
          <UpcomingEventsSection 
            events={upcomingEvents} 
            isLoading={isLoading} 
          />
        </div>
        
        <CallToActionSection />
      </div>
    </Layout>
  );
};

export default Home;
