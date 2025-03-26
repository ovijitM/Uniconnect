
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClubFormData } from '@/hooks/club-admin/types';

interface DetailsTabProps {
  formData: ClubFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ formData, onInputChange }) => {
  const handleMembershipFeeChange = (value: string) => {
    const event = {
      target: {
        name: 'membershipFee',
        value
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onInputChange(event);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Label htmlFor="affiliation" className="text-base font-semibold">
          Affiliation
        </Label>
        <Input
          id="affiliation"
          name="affiliation"
          value={formData.affiliation}
          onChange={onInputChange}
          placeholder="Department or organization the club is affiliated with"
        />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="whyJoin" className="text-base font-semibold">
          Why Join
        </Label>
        <Textarea
          id="whyJoin"
          name="whyJoin"
          value={formData.whyJoin}
          onChange={onInputChange}
          placeholder="Reasons why students should join your club"
          rows={3}
        />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="regularEvents" className="text-base font-semibold">
          Regular Events
        </Label>
        <Textarea
          id="regularEvents"
          name="regularEvents"
          value={formData.regularEvents}
          onChange={onInputChange}
          placeholder="Comma-separated list of regular events (weekly, monthly)"
          rows={2}
        />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="signatureEvents" className="text-base font-semibold">
          Signature Events
        </Label>
        <Textarea
          id="signatureEvents"
          name="signatureEvents"
          value={formData.signatureEvents}
          onChange={onInputChange}
          placeholder="Comma-separated list of major annual events"
          rows={2}
        />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="communityEngagement" className="text-base font-semibold">
          Community Engagement
        </Label>
        <Textarea
          id="communityEngagement"
          name="communityEngagement"
          value={formData.communityEngagement}
          onChange={onInputChange}
          placeholder="How the club engages with the broader community"
          rows={3}
        />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="whoCanJoin" className="text-base font-semibold">
          Who Can Join
        </Label>
        <Textarea
          id="whoCanJoin"
          name="whoCanJoin"
          value={formData.whoCanJoin}
          onChange={onInputChange}
          placeholder="Eligibility criteria for joining the club"
          rows={2}
        />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="membershipFee" className="text-base font-semibold">
          Membership Fee
        </Label>
        <Select 
          value={formData.membershipFee} 
          onValueChange={handleMembershipFeeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select membership fee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Free">Free</SelectItem>
            <SelectItem value="Less than $10">Less than $10</SelectItem>
            <SelectItem value="$10 - $20">$10 - $20</SelectItem>
            <SelectItem value="$20 - $50">$20 - $50</SelectItem>
            <SelectItem value="More than $50">More than $50</SelectItem>
            <SelectItem value="Varies">Varies</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="howToJoin" className="text-base font-semibold">
          How To Join
        </Label>
        <Textarea
          id="howToJoin"
          name="howToJoin"
          value={formData.howToJoin}
          onChange={onInputChange}
          placeholder="Process for joining the club"
          rows={2}
        />
      </div>
    </div>
  );
};

export default DetailsTab;
