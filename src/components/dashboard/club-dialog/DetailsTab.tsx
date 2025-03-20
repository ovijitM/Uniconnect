
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface DetailsTabProps {
  formData: {
    establishedYear?: string;
    affiliation?: string;
    whyJoin?: string;
    regularEvents?: string;
    signatureEvents?: string;
    communityEngagement?: string;
    whoCanJoin?: string;
    membershipFee?: string;
    howToJoin?: string;
    presidentName?: string;
    presidentContact?: string;
    executiveMembers?: string;
    advisors?: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="establishedYear">
          Established Year
        </Label>
        <Input
          id="establishedYear"
          name="establishedYear"
          type="number"
          value={formData.establishedYear || ''}
          onChange={onInputChange}
          placeholder="e.g., 2023"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="affiliation">
          Affiliation
        </Label>
        <Input
          id="affiliation"
          name="affiliation"
          value={formData.affiliation || ''}
          onChange={onInputChange}
          placeholder="Department, Organization, etc."
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="whyJoin">
          Why Join
        </Label>
        <Textarea
          id="whyJoin"
          name="whyJoin"
          value={formData.whyJoin || ''}
          onChange={onInputChange}
          placeholder="Explain the benefits of joining your club"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="whoCanJoin">
          Who Can Join
        </Label>
        <Input
          id="whoCanJoin"
          name="whoCanJoin"
          value={formData.whoCanJoin || ''}
          onChange={onInputChange}
          placeholder="Eligibility criteria for joining"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="membershipFee">
          Membership Fee
        </Label>
        <Input
          id="membershipFee"
          name="membershipFee"
          value={formData.membershipFee || ''}
          onChange={onInputChange}
          placeholder="Free, $10/semester, etc."
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="howToJoin">
          How To Join
        </Label>
        <Textarea
          id="howToJoin"
          name="howToJoin"
          value={formData.howToJoin || ''}
          onChange={onInputChange}
          placeholder="Describe the process to join your club"
        />
      </div>
    </div>
  );
};

export default DetailsTab;
