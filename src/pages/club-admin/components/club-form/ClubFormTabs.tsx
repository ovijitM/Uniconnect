
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicInfoTab from './BasicInfoTab';
import ClubDetailsTab from './ClubDetailsTab';
import MembershipTab from './MembershipTab';
import LeadershipTab from './LeadershipTab';
import MediaContactTab from './MediaContactTab';

interface ClubFormTabsProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (value: string, name: string) => void;
  handleLogoUpload: (url: string, fileName: string) => void;
  handleDocumentUpload: (url: string, fileName: string) => void;
  universities: any[];
  isLoadingUniversities: boolean;
  clubCategories: string[];
}

const ClubFormTabs: React.FC<ClubFormTabsProps> = ({
  formData,
  handleInputChange,
  handleSelectChange,
  handleLogoUpload,
  handleDocumentUpload,
  universities,
  isLoadingUniversities,
  clubCategories
}) => {
  return (
    <Tabs defaultValue="basic" className="mb-6">
      <TabsList className="grid grid-cols-5 mb-4">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="details">Club Details</TabsTrigger>
        <TabsTrigger value="membership">Membership</TabsTrigger>
        <TabsTrigger value="leadership">Leadership</TabsTrigger>
        <TabsTrigger value="media">Media & Contact</TabsTrigger>
      </TabsList>

      <TabsContent value="basic">
        <Card>
          <BasicInfoTab 
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            universities={universities}
            isLoadingUniversities={isLoadingUniversities}
            clubCategories={clubCategories}
          />
        </Card>
      </TabsContent>

      <TabsContent value="details">
        <Card>
          <ClubDetailsTab 
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </Card>
      </TabsContent>

      <TabsContent value="membership">
        <Card>
          <MembershipTab 
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </Card>
      </TabsContent>

      <TabsContent value="leadership">
        <Card>
          <LeadershipTab 
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </Card>
      </TabsContent>

      <TabsContent value="media">
        <Card>
          <MediaContactTab 
            formData={formData}
            handleInputChange={handleInputChange}
            handleLogoUpload={handleLogoUpload}
            handleDocumentUpload={handleDocumentUpload}
          />
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ClubFormTabs;
