
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SaveAll } from 'lucide-react';
import { Club } from '@/types';
import { useClubProfileSettings } from '@/hooks/club-admin/useClubProfileSettings';
import { useClubContent } from '@/hooks/club-admin/useClubContent';

// Import the tab components
import BasicInfoTab from '@/components/dashboard/club-profile/BasicInfoTab';
import DetailsTab from '@/components/dashboard/club-profile/DetailsTab';
import SocialMediaTab from '@/components/dashboard/club-profile/SocialMediaTab';
import AnnouncementsTab from '@/components/dashboard/club-profile/AnnouncementsTab';
import ActivityPostsTab from '@/components/dashboard/club-profile/ActivityPostsTab';
import EmptyState from '@/components/dashboard/club-profile/EmptyState';
import LoadingState from '@/components/dashboard/club-profile/LoadingState';

interface ClubProfileSettingsProps {
  club: Club | null;
  isLoading: boolean;
  onRefresh: () => void;
}

const ClubProfileSettings: React.FC<ClubProfileSettingsProps> = ({
  club,
  isLoading,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState('basic-info');
  
  const {
    profileData,
    isSaving,
    handleInputChange,
    handleSave
  } = useClubProfileSettings(club?.id || '');
  
  const {
    announcements,
    activityPosts,
    isLoading: isContentLoading,
    fetchClubContent,
    postAnnouncement,
    postActivityUpdate
  } = useClubContent(club?.id || '');

  if (isLoading) {
    return <LoadingState />;
  }

  if (!club) {
    return <EmptyState />;
  }

  return (
    <Card className="w-full">
      <Tabs 
        defaultValue="basic-info" 
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="social-media">Social Media</TabsTrigger>
              <TabsTrigger value="announcements">Announcements</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>
            
            {(activeTab === 'basic-info' || activeTab === 'details' || activeTab === 'social-media') && (
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="ml-auto"
              >
                <SaveAll className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <TabsContent value="basic-info" className="mt-0">
            <BasicInfoTab 
              profileData={profileData} 
              handleInputChange={handleInputChange} 
            />
          </TabsContent>
          
          <TabsContent value="details" className="mt-0">
            <DetailsTab 
              profileData={profileData} 
              handleInputChange={handleInputChange} 
            />
          </TabsContent>
          
          <TabsContent value="social-media" className="mt-0">
            <SocialMediaTab 
              profileData={profileData} 
              handleInputChange={handleInputChange} 
            />
          </TabsContent>
          
          <TabsContent value="announcements" className="mt-0">
            <AnnouncementsTab 
              clubId={club.id}
              announcements={announcements}
              isLoading={isContentLoading}
              onPostAnnouncement={postAnnouncement}
              onRefresh={fetchClubContent}
            />
          </TabsContent>
          
          <TabsContent value="activity" className="mt-0">
            <ActivityPostsTab 
              clubId={club.id}
              activityPosts={activityPosts}
              isLoading={isContentLoading}
              onPostActivity={postActivityUpdate}
              onRefresh={fetchClubContent}
            />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};

export default ClubProfileSettings;
