
import React from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface MembershipTabProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const MembershipTab: React.FC<MembershipTabProps> = ({
  formData,
  handleInputChange
}) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Membership Information</CardTitle>
        <CardDescription>Details about joining your club</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="whoCanJoin">Who Can Join?</Label>
          <Textarea
            id="whoCanJoin"
            name="whoCanJoin"
            value={formData.whoCanJoin}
            onChange={handleInputChange}
            placeholder="Any requirements or restrictions for membership?"
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="membershipFee">Membership Fee</Label>
            <Input
              id="membershipFee"
              name="membershipFee"
              value={formData.membershipFee}
              onChange={handleInputChange}
              placeholder="e.g., Free, $10/semester"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="howToJoin">How To Join</Label>
            <Input
              id="howToJoin"
              name="howToJoin"
              value={formData.howToJoin}
              onChange={handleInputChange}
              placeholder="Application process or steps to join"
            />
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default MembershipTab;
