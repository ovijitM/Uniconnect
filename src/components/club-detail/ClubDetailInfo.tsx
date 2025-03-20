
import React from 'react';
import { Club } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import WhyJoinSection from './sections/WhyJoinSection';
import ActivitiesSection from './sections/ActivitiesSection';
import MembershipSection from './sections/MembershipSection';
import LeadershipSection from './sections/LeadershipSection';
import ContactSection from './sections/ContactSection';

interface ClubDetailInfoProps {
  club: Club;
}

const ClubDetailInfo: React.FC<ClubDetailInfoProps> = ({ club }) => {
  return (
    <div className="space-y-6">
      <WhyJoinSection whyJoin={club.whyJoin} />
      
      <Tabs defaultValue="activities" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="activities">Activities & Events</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="leadership">Leadership & Contact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="activities" className="mt-6">
          <ActivitiesSection 
            regularEvents={club.regularEvents}
            signatureEvents={club.signatureEvents}
            communityEngagement={club.communityEngagement}
          />
        </TabsContent>
        
        <TabsContent value="membership" className="mt-6">
          <MembershipSection 
            whoCanJoin={club.whoCanJoin}
            membershipFee={club.membershipFee}
            howToJoin={club.howToJoin}
          />
        </TabsContent>
        
        <TabsContent value="leadership" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LeadershipSection 
              presidentName={club.presidentName}
              presidentContact={club.presidentContact}
              executiveMembers={club.executiveMembers}
              advisors={club.advisors}
            />
            
            <ContactSection 
              phoneNumber={club.phoneNumber}
              website={club.website}
              facebookLink={club.facebookLink}
              instagramLink={club.instagramLink}
              twitterLink={club.twitterLink}
              discordLink={club.discordLink}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClubDetailInfo;
