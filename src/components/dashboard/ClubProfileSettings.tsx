
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Club } from '@/types';
import { useClubProfileSettings } from '@/hooks/club-admin/useClubProfileSettings';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import refactored components
import BasicInfoTab from './club-profile/BasicInfoTab';
import DetailsTab from './club-profile/DetailsTab';
import SocialMediaTab from './club-profile/SocialMediaTab';
import LoadingState from './club-profile/LoadingState';
import EmptyState from './club-profile/EmptyState';

interface ClubProfileSettingsProps {
  club: Club | null;
  onRefresh: () => void;
  isLoading: boolean;
}

const ClubProfileSettings: React.FC<ClubProfileSettingsProps> = ({
  club,
  onRefresh,
  isLoading
}) => {
  const {
    profileData,
    setProfileData,
    handleInputChange,
    updateClubProfile,
    isSubmitting
  } = useClubProfileSettings(club, onRefresh);

  useEffect(() => {
    if (club) {
      setProfileData({
        name: club.name || '',
        description: club.description || '',
        category: club.category || '',
        tagline: club.tagline || '',
        logoUrl: club.logoUrl || '',
        establishedYear: club.establishedYear ? String(club.establishedYear) : '',
        affiliation: club.affiliation || '',
        whyJoin: club.whyJoin || '',
        regularEvents: club.regularEvents ? club.regularEvents.join(', ') : '',
        signatureEvents: club.signatureEvents ? club.signatureEvents.join(', ') : '',
        communityEngagement: club.communityEngagement || '',
        whoCanJoin: club.whoCanJoin || '',
        membershipFee: club.membershipFee || 'Free',
        howToJoin: club.howToJoin || '',
        presidentName: club.presidentName || '',
        presidentContact: club.presidentContact || '',
        executiveMembers: club.executiveMembers ? JSON.stringify(club.executiveMembers) : '',
        advisors: club.advisors ? club.advisors.join(', ') : '',
        phoneNumber: club.phoneNumber || '',
        website: club.website || '',
        facebookLink: club.facebookLink || '',
        instagramLink: club.instagramLink || '',
        twitterLink: club.twitterLink || '',
        discordLink: club.discordLink || ''
      });
    }
  }, [club]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!club) {
    return <EmptyState />;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Club Profile Settings</CardTitle>
        <CardDescription>Update your club's profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="social">Contact & Social</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <BasicInfoTab 
              profileData={profileData} 
              handleInputChange={handleInputChange} 
            />
          </TabsContent>
          
          <TabsContent value="details">
            <DetailsTab 
              profileData={profileData} 
              handleInputChange={handleInputChange}
              setProfileData={setProfileData} 
            />
          </TabsContent>
          
          <TabsContent value="social">
            <SocialMediaTab 
              profileData={profileData} 
              handleInputChange={handleInputChange} 
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={updateClubProfile} 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClubProfileSettings;
