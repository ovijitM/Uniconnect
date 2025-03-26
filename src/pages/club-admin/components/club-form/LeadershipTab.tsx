
import React from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface LeadershipTabProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const LeadershipTab: React.FC<LeadershipTabProps> = ({
  formData,
  handleInputChange
}) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Leadership Structure</CardTitle>
        <CardDescription>Information about your club's leadership</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="presidentName">President/Chair Name</Label>
            <Input
              id="presidentName"
              name="presidentName"
              value={formData.presidentName}
              onChange={handleInputChange}
              placeholder="Name of the club president or chair"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="presidentContact">President/Chair Contact</Label>
            <Input
              id="presidentContact"
              name="presidentContact"
              value={formData.presidentContact}
              onChange={handleInputChange}
              placeholder="Email or phone of the president"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="executiveMembers">Executive Members</Label>
          <Textarea
            id="executiveMembers"
            name="executiveMembers"
            value={formData.executiveMembers}
            onChange={handleInputChange}
            placeholder="List names and roles separated by commas (e.g., Jane Doe - Secretary, John Smith - Treasurer)"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="advisors">Faculty Advisors</Label>
            <Textarea
              id="advisors"
              name="advisors"
              value={formData.advisors}
              onChange={handleInputChange}
              placeholder="Names of faculty advisors separated by commas"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facultyAdvisor">Primary Faculty Advisor</Label>
            <Input
              id="facultyAdvisor"
              name="facultyAdvisor"
              value={formData.facultyAdvisor}
              onChange={handleInputChange}
              placeholder="Name of primary faculty advisor"
            />
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default LeadershipTab;
