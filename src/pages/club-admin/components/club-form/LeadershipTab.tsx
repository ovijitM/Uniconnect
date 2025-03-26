
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
            <Label htmlFor="presidentChairName">President/Chair Name</Label>
            <Input
              id="presidentChairName"
              name="presidentChairName"
              value={formData.presidentChairName || ''}
              onChange={handleInputChange}
              placeholder="Name of the club president or chair"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="presidentChairContact">President/Chair Contact</Label>
            <Input
              id="presidentChairContact"
              name="presidentChairContact"
              value={formData.presidentChairContact || ''}
              onChange={handleInputChange}
              placeholder="Email or phone of the president"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="executiveMembersRoles">Executive Members</Label>
          <Textarea
            id="executiveMembersRoles"
            name="executiveMembersRoles"
            value={formData.executiveMembersRoles || ''}
            onChange={handleInputChange}
            placeholder="List names and roles separated by commas (e.g., Jane Doe - Secretary, John Smith - Treasurer)"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="facultyAdvisors">Faculty Advisors</Label>
            <Textarea
              id="facultyAdvisors"
              name="facultyAdvisors"
              value={formData.facultyAdvisors || ''}
              onChange={handleInputChange}
              placeholder="Names of faculty advisors separated by commas"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryFacultyAdvisor">Primary Faculty Advisor</Label>
            <Input
              id="primaryFacultyAdvisor"
              name="primaryFacultyAdvisor"
              value={formData.primaryFacultyAdvisor || ''}
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
