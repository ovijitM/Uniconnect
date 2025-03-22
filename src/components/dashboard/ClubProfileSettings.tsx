
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicInfoTab from './club-profile/BasicInfoTab';
import DetailsTab from './club-profile/DetailsTab';
import SocialMediaTab from './club-profile/SocialMediaTab';
import AnnouncementsTab from './club-profile/AnnouncementsTab';
import ActivityPostsTab from './club-profile/ActivityPostsTab';
import EmptyState from './club-profile/EmptyState';
import LoadingState from './club-profile/LoadingState';
import { useClubProfileSettings } from '@/hooks/club-admin/useClubProfileSettings';
import { useClubContent } from '@/hooks/club-admin/useClubContent';
import { Club } from '@/types';

interface ClubProfileSettingsProps {
  club: Club;
  onRefresh: () => void;
  isLoading: boolean;
}

const ClubProfileSettings: React.FC<ClubProfileSettingsProps> = ({ club, onRefresh, isLoading }) => {
  const [activeTab, setActiveTab] = useState('basic-info');
  
  const { 
    profileData, 
    setProfileData, 
    handleInputChange, 
    updateClubProfile, 
    isSubmitting 
  } = useClubProfileSettings(club, onRefresh);
  
  const { 
    announcements, 
    activityPosts, 
    isLoading: isContentLoading, 
    isSaving: isContentSaving,
    fetchClubContent, 
    postAnnouncement, 
    postActivityUpdate 
  } = useClubContent(club?.id);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!club) {
    return <EmptyState />;
  }

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="social-media">Social Media</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="activity">Activity Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info" className="space-y-6">
          <BasicInfoTab 
            profileData={profileData} 
            setProfileData={setProfileData} 
            handleInputChange={handleInputChange} 
            isSaving={isSubmitting}
            handleSave={updateClubProfile}
          />
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <DetailsTab 
            profileData={profileData}
            setProfileData={setProfileData}
            handleInputChange={handleInputChange}
            isSaving={isSubmitting}
            handleSave={updateClubProfile}
          />
        </TabsContent>

        <TabsContent value="social-media" className="space-y-6">
          <SocialMediaTab 
            profileData={profileData}
            setProfileData={setProfileData}
            handleInputChange={handleInputChange}
            isSaving={isSubmitting}
            handleSave={updateClubProfile}
          />
        </TabsContent>

        <TabsContent value="announcements" className="space-y-6">
          <AnnouncementsTab
            clubId={club.id}
            announcements={announcements}
            isLoading={isContentLoading}
            isSaving={isContentSaving}
            onPostAnnouncement={postAnnouncement}
            onRefresh={fetchClubContent}
          />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <ActivityPostsTab
            clubId={club.id}
            activityPosts={activityPosts}
            isLoading={isContentLoading}
            isSaving={isContentSaving}
            onPostActivity={postActivityUpdate}
            onRefresh={fetchClubContent}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ClubProfileSettings;
