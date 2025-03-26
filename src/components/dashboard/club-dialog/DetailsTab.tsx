
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
          Established Year*
        </Label>
        <Input
          id="establishedYear"
          name="establishedYear"
          type="number"
          value={formData.establishedYear || ''}
          onChange={onInputChange}
          required
          placeholder="e.g., 2023"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="affiliation">
          Affiliation*
        </Label>
        <Input
          id="affiliation"
          name="affiliation"
          value={formData.affiliation || ''}
          onChange={onInputChange}
          required
          placeholder="Department, Organization, etc."
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="whyJoin">
          Why Join*
        </Label>
        <Textarea
          id="whyJoin"
          name="whyJoin"
          value={formData.whyJoin || ''}
          onChange={onInputChange}
          required
          placeholder="Explain the benefits of joining your club"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="whoCanJoin">
          Who Can Join*
        </Label>
        <Input
          id="whoCanJoin"
          name="whoCanJoin"
          value={formData.whoCanJoin || ''}
          onChange={onInputChange}
          required
          placeholder="Eligibility criteria for joining"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="membershipFee">
          Membership Fee*
        </Label>
        <Input
          id="membershipFee"
          name="membershipFee"
          value={formData.membershipFee || ''}
          onChange={onInputChange}
          required
          placeholder="Free, $10/semester, etc."
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="howToJoin">
          How To Join*
        </Label>
        <Textarea
          id="howToJoin"
          name="howToJoin"
          value={formData.howToJoin || ''}
          onChange={onInputChange}
          required
          placeholder="Describe the process to join your club"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="presidentName">
          President Name*
        </Label>
        <Input
          id="presidentName"
          name="presidentName"
          value={formData.presidentName || ''}
          onChange={onInputChange}
          required
          placeholder="Name of the club president"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="presidentContact">
          President Contact*
        </Label>
        <Input
          id="presidentContact"
          name="presidentContact"
          value={formData.presidentContact || ''}
          onChange={onInputChange}
          required
          placeholder="Email or phone of the president"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="regularEvents">
          Regular Events
        </Label>
        <Textarea
          id="regularEvents"
          name="regularEvents"
          value={formData.regularEvents || ''}
          onChange={onInputChange}
          placeholder="List regular events, separated by commas"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="signatureEvents">
          Signature Events
        </Label>
        <Textarea
          id="signatureEvents"
          name="signatureEvents"
          value={formData.signatureEvents || ''}
          onChange={onInputChange}
          placeholder="List signature events, separated by commas"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="communityEngagement">
          Community Engagement
        </Label>
        <Textarea
          id="communityEngagement"
          name="communityEngagement"
          value={formData.communityEngagement || ''}
          onChange={onInputChange}
          placeholder="How your club engages with the community"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="executiveMembers">
          Executive Members
        </Label>
        <Textarea
          id="executiveMembers"
          name="executiveMembers"
          value={formData.executiveMembers || ''}
          onChange={onInputChange}
          placeholder="JSON format: {'role': 'name'}"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="advisors">
          Advisors
        </Label>
        <Textarea
          id="advisors"
          name="advisors"
          value={formData.advisors || ''}
          onChange={onInputChange}
          placeholder="List advisors, separated by commas"
        />
      </div>
    </div>
  );
};

export default DetailsTab;
