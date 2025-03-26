
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BasicInfoTab from './BasicInfoTab';
import ClubDetailsTab from './ClubDetailsTab';
import LeadershipTab from './LeadershipTab';
import MembershipTab from './MembershipTab';
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
  const [activeTab, setActiveTab] = useState('basic-info');
  
  const tabs = [
    'basic-info',
    'club-details',
    'leadership',
    'membership',
    'media-contact'
  ];
  
  const handleNextTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };
  
  const handlePreviousTab = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <Card className="mb-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-5 mb-4">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="club-details">Club Details</TabsTrigger>
          <TabsTrigger value="leadership">Leadership</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="media-contact">Media & Contact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic-info">
          <BasicInfoTab
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleLogoUpload={handleLogoUpload}
            universities={universities}
            isLoadingUniversities={isLoadingUniversities}
            clubCategories={clubCategories}
          />
          <div className="flex justify-end mt-4 px-6 pb-6">
            <Button type="button" onClick={handleNextTab}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="club-details">
          <ClubDetailsTab
            formData={formData}
            handleInputChange={handleInputChange}
          />
          <div className="flex justify-between mt-4 px-6 pb-6">
            <Button type="button" variant="outline" onClick={handlePreviousTab}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button type="button" onClick={handleNextTab}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="leadership">
          <LeadershipTab
            formData={formData}
            handleInputChange={handleInputChange}
          />
          <div className="flex justify-between mt-4 px-6 pb-6">
            <Button type="button" variant="outline" onClick={handlePreviousTab}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button type="button" onClick={handleNextTab}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="membership">
          <MembershipTab
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
          />
          <div className="flex justify-between mt-4 px-6 pb-6">
            <Button type="button" variant="outline" onClick={handlePreviousTab}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button type="button" onClick={handleNextTab}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="media-contact">
          <MediaContactTab
            formData={formData}
            handleInputChange={handleInputChange}
            handleLogoUpload={handleLogoUpload}
            handleDocumentUpload={handleDocumentUpload}
          />
          <div className="flex justify-between mt-4 px-6 pb-6">
            <Button type="button" variant="outline" onClick={handlePreviousTab}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ClubFormTabs;
