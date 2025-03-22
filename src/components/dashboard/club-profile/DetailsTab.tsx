
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DetailsTabProps {
  profileData: {
    whyJoin: string;
    regularEvents: string;
    signatureEvents: string;
    communityEngagement: string;
    whoCanJoin: string;
    membershipFee: string;
    howToJoin: string;
    presidentName: string;
    presidentContact: string;
    executiveMembers: string;
    advisors: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setProfileData: (setter: (prev: any) => any) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ 
  profileData, 
  handleInputChange,
  setProfileData
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="whyJoin" className="text-right mt-3">
          Why Join
        </Label>
        <Textarea
          id="whyJoin"
          name="whyJoin"
          value={profileData.whyJoin}
          onChange={handleInputChange}
          className="col-span-3"
          rows={3}
          placeholder="Why students should join your club"
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="regularEvents" className="text-right mt-3">
          Regular Events
        </Label>
        <Textarea
          id="regularEvents"
          name="regularEvents"
          value={profileData.regularEvents}
          onChange={handleInputChange}
          className="col-span-3"
          rows={2}
          placeholder="List regular events, separated by commas"
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="signatureEvents" className="text-right mt-3">
          Signature Events
        </Label>
        <Textarea
          id="signatureEvents"
          name="signatureEvents"
          value={profileData.signatureEvents}
          onChange={handleInputChange}
          className="col-span-3"
          rows={2}
          placeholder="List your signature events, separated by commas"
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="communityEngagement" className="text-right mt-3">
          Community Engagement
        </Label>
        <Textarea
          id="communityEngagement"
          name="communityEngagement"
          value={profileData.communityEngagement}
          onChange={handleInputChange}
          className="col-span-3"
          rows={2}
          placeholder="How your club engages with the community"
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="whoCanJoin" className="text-right mt-3">
          Who Can Join
        </Label>
        <Textarea
          id="whoCanJoin"
          name="whoCanJoin"
          value={profileData.whoCanJoin}
          onChange={handleInputChange}
          className="col-span-3"
          rows={2}
          placeholder="Eligibility criteria for joining"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="membershipFee" className="text-right">
          Membership Fee
        </Label>
        <Select 
          name="membershipFee" 
          value={profileData.membershipFee}
          onValueChange={(value) => {
            setProfileData(prev => ({ ...prev, membershipFee: value }));
          }}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select membership fee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Free">Free</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="howToJoin" className="text-right mt-3">
          How To Join
        </Label>
        <Textarea
          id="howToJoin"
          name="howToJoin"
          value={profileData.howToJoin}
          onChange={handleInputChange}
          className="col-span-3"
          rows={2}
          placeholder="Process for joining your club"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="presidentName" className="text-right">
          President Name
        </Label>
        <Input
          id="presidentName"
          name="presidentName"
          value={profileData.presidentName}
          onChange={handleInputChange}
          className="col-span-3"
          placeholder="Club president's name"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="presidentContact" className="text-right">
          President Contact
        </Label>
        <Input
          id="presidentContact"
          name="presidentContact"
          value={profileData.presidentContact}
          onChange={handleInputChange}
          className="col-span-3"
          placeholder="Club president's contact info"
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="executiveMembers" className="text-right mt-3">
          Executive Members
        </Label>
        <Textarea
          id="executiveMembers"
          name="executiveMembers"
          value={profileData.executiveMembers}
          onChange={handleInputChange}
          className="col-span-3"
          rows={3}
          placeholder="JSON format: {'role': 'name'}"
        />
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="advisors" className="text-right mt-3">
          Advisors
        </Label>
        <Textarea
          id="advisors"
          name="advisors"
          value={profileData.advisors}
          onChange={handleInputChange}
          className="col-span-3"
          rows={2}
          placeholder="List advisors, separated by commas"
        />
      </div>
    </div>
  );
};

export default DetailsTab;
