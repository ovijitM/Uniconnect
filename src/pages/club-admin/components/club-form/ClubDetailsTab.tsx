
import React from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface ClubDetailsTabProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ClubDetailsTab: React.FC<ClubDetailsTabProps> = ({
  formData,
  handleInputChange
}) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Club Details</CardTitle>
        <CardDescription>Tell us more about your club's activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="whyJoin">Why Join?</Label>
          <Textarea
            id="whyJoin"
            name="whyJoin"
            value={formData.whyJoin}
            onChange={handleInputChange}
            placeholder="Why should students join your club?"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="regularEvents">Regular Events</Label>
            <Textarea
              id="regularEvents"
              name="regularEvents"
              value={formData.regularEvents}
              onChange={handleInputChange}
              placeholder="List regular events separated by commas (e.g., Weekly meetings, Monthly workshops)"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signatureEvents">Signature Events</Label>
            <Textarea
              id="signatureEvents"
              name="signatureEvents"
              value={formData.signatureEvents}
              onChange={handleInputChange}
              placeholder="List major annual events separated by commas"
              rows={2}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="communityEngagement">Community Engagement</Label>
          <Textarea
            id="communityEngagement"
            name="communityEngagement"
            value={formData.communityEngagement}
            onChange={handleInputChange}
            placeholder="How does your club engage with the community?"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="studentCount">Approximate Member Count</Label>
            <Input
              id="studentCount"
              name="studentCount"
              type="number"
              value={formData.studentCount}
              onChange={handleInputChange}
              placeholder="Current number of members"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meetingInfo">Meeting Information</Label>
            <Input
              id="meetingInfo"
              name="meetingInfo"
              value={formData.meetingInfo}
              onChange={handleInputChange}
              placeholder="When and where do you typically meet?"
            />
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default ClubDetailsTab;
