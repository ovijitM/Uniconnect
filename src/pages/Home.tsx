
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
import { useToast } from '@/hooks/use-toast';
import { joinClub } from '@/hooks/student/utils/clubMembershipActions';

const Home = () => {
  const { isLoading, featuredEvent, featuredClubs, categories, upcomingEvents, clubs } = useHomePageData();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Only fetch joined clubs if user is logged in
  const { 
    joinedClubs, 
    joinedClubIds, 
    fetchClubs: refreshJoinedClubs,
    isLoadingClubs
  } = useStudentClubs(user?.id);
  
  // Get personalized recommendations
  const [recommendations, setRecommendations] = React.useState([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = React.useState(false);
  
  // Fetch recommendations when joinedClubIds changes
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user || !joinedClubIds) {
        setRecommendations([]);
        return;
      }
      
      setIsLoadingRecommendations(true);
      try {
        // This would be replaced with actual recommendation logic
        // For now, just use clubs that aren't already joined
        const recommendedClubs = clubs
          .filter(club => !joinedClubIds.includes(club.id))
          .slice(0, 3);
        
        setRecommendations(recommendedClubs);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      } finally {
        setIsLoadingRecommendations(false);
      }
    };
    
    if (clubs.length > 0) {
      fetchRecommendations();
    }
  }, [joinedClubIds, clubs, user]);

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
          console.log("Club join successful, refreshing clubs data");
          refreshJoinedClubs();
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
      <div className="flex flex-col gap-8 md:gap-16">
        <HeroSection />
        
        <div className="container px-4 mx-auto">
          <FeaturedEventSection 
            featuredEvent={featuredEvent} 
            isLoading={isLoading} 
          />
        </div>
        
        {/* Only show recommendations for logged in users */}
        {user && (
          <div className="container px-4 mx-auto">
            <RecommendedClubsSection
              recommendations={recommendations}
              isLoading={isLoadingRecommendations}
              onJoinClub={handleJoinClub}
              joinedClubIds={joinedClubIds || []}
            />
          </div>
        )}
        
        <div className="container px-4 mx-auto">
          <FeaturedClubsSection 
            clubs={featuredClubs} 
            isLoading={isLoading}
            onJoinClub={handleJoinClub}
            joinedClubIds={joinedClubIds || []}
          />
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900 py-8 md:py-12">
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
