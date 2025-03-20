
import React from 'react';
import { Club } from '@/types';
import { Separator } from '@/components/ui/separator';
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
    <div className="mt-6 space-y-6">
      <WhyJoinSection whyJoin={club.whyJoin} />
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActivitiesSection 
          regularEvents={club.regularEvents}
          signatureEvents={club.signatureEvents}
          communityEngagement={club.communityEngagement}
        />
        
        <MembershipSection 
          whoCanJoin={club.whoCanJoin}
          membershipFee={club.membershipFee}
          howToJoin={club.howToJoin}
        />
      </div>
      
      <Separator />
      
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
    </div>
  );
};

export default ClubDetailInfo;
