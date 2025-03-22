
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';

export interface DetailsTabProps {
  profileData: {
    name: string;
    description: string;
    category: string;
    tagline: string;
    logoUrl: string;
    establishedYear: string;
    affiliation: string;
    whyJoin: string;
    regularEvents: string;
    signatureEvents: string;
    communityEngagement: string;
    advisors: string;
    presidentName: string;
    presidentContact: string;
    phoneNumber: string;
    membershipFee: string;
    whoCanJoin: string;
    howToJoin: string;
    website: string;
    facebookLink: string;
    instagramLink: string;
    twitterLink: string;
    discordLink: string;
  };
  setProfileData: React.Dispatch<React.SetStateAction<any>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isSaving: boolean;
  handleSave: () => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ 
  profileData, 
  setProfileData,
  handleInputChange, 
  isSaving,
  handleSave 
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="whyJoin">Why Join</Label>
          <Textarea
            id="whyJoin"
            name="whyJoin"
            value={profileData.whyJoin || ''}
            onChange={handleInputChange}
            placeholder="Explain why students would want to join your club"
            className="min-h-[120px]"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="howToJoin">How to Join</Label>
          <Textarea
            id="howToJoin"
            name="howToJoin"
            value={profileData.howToJoin || ''}
            onChange={handleInputChange}
            placeholder="Explain the process for joining your club"
            className="min-h-[120px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="whoCanJoin">Who Can Join</Label>
          <Input
            id="whoCanJoin"
            name="whoCanJoin"
            value={profileData.whoCanJoin || ''}
            onChange={handleInputChange}
            placeholder="Any eligibility requirements"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="membershipFee">Membership Fee</Label>
          <Input
            id="membershipFee"
            name="membershipFee"
            value={profileData.membershipFee || ''}
            onChange={handleInputChange}
            placeholder="e.g. $10/semester, Free, etc."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="regularEvents">Regular Events</Label>
          <Input
            id="regularEvents"
            name="regularEvents"
            value={profileData.regularEvents || ''}
            onChange={handleInputChange}
            placeholder="Weekly meetings, monthly workshops, etc."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signatureEvents">Signature Events</Label>
          <Input
            id="signatureEvents"
            name="signatureEvents"
            value={profileData.signatureEvents || ''}
            onChange={handleInputChange}
            placeholder="Annual hackathon, conference, etc."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="communityEngagement">Community Engagement</Label>
        <Textarea
          id="communityEngagement"
          name="communityEngagement"
          value={profileData.communityEngagement || ''}
          onChange={handleInputChange}
          placeholder="Describe how your club engages with the broader community"
          className="min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="presidentName">President/Leader Name</Label>
          <Input
            id="presidentName"
            name="presidentName"
            value={profileData.presidentName || ''}
            onChange={handleInputChange}
            placeholder="Full name of club president or leader"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="presidentContact">President/Leader Contact</Label>
          <Input
            id="presidentContact"
            name="presidentContact"
            value={profileData.presidentContact || ''}
            onChange={handleInputChange}
            placeholder="Email or other contact info"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="advisors">Faculty Advisors</Label>
          <Input
            id="advisors"
            name="advisors"
            value={profileData.advisors || ''}
            onChange={handleInputChange}
            placeholder="Names of faculty advisors"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Club Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={profileData.phoneNumber || ''}
            onChange={handleInputChange}
            placeholder="Optional contact number"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Details
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DetailsTab;
