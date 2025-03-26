
import React from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { membershipTypes } from './constants';

interface MembershipTabProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (value: string, name: string) => void;
}

const MembershipTab: React.FC<MembershipTabProps> = ({
  formData,
  handleInputChange,
  handleSelectChange
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
            <Select 
              value={formData.membershipFee} 
              onValueChange={(value) => handleSelectChange(value, 'membershipFee')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select membership fee" />
              </SelectTrigger>
              <SelectContent>
                {membershipTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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

        <div className="space-y-2">
          <Label htmlFor="studentCount">Estimated Student Count</Label>
          <Input
            id="studentCount"
            name="studentCount"
            value={formData.studentCount}
            onChange={handleInputChange}
            type="number"
            placeholder="Approximate number of members"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="facultyAdvisor">Faculty Advisor</Label>
          <Input
            id="facultyAdvisor"
            name="facultyAdvisor"
            value={formData.facultyAdvisor}
            onChange={handleInputChange}
            placeholder="Name of faculty advisor (if any)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meetingInfo">Meeting Information</Label>
          <Textarea
            id="meetingInfo"
            name="meetingInfo"
            value={formData.meetingInfo}
            onChange={handleInputChange}
            placeholder="Regular meeting times and locations"
            rows={2}
          />
        </div>
      </CardContent>
    </>
  );
};

export default MembershipTab;
