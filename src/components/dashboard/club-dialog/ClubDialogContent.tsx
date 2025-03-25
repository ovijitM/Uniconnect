
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import BasicInfoTab from './BasicInfoTab';
import DetailsTab from './DetailsTab';
import SocialMediaTab from './SocialMediaTab';
import DocumentUploadTab from './DocumentUploadTab';
import { ClubFormData } from '@/hooks/club-admin/types';

interface ClubDialogContentProps {
  activeTab: string;
  formData: ClubFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileUpload?: (url: string, fileName: string, type?: 'logo' | 'document') => void;
}

const ClubDialogContent: React.FC<ClubDialogContentProps> = ({
  activeTab,
  formData,
  onInputChange,
  onFileUpload
}) => {
  return (
    <Tabs value={activeTab} className="w-full">
      <TabsContent value="basic">
        <BasicInfoTab formData={formData} onInputChange={onInputChange} />
      </TabsContent>
      
      <TabsContent value="details">
        <DetailsTab formData={formData} onInputChange={onInputChange} />
      </TabsContent>
      
      <TabsContent value="social">
        <SocialMediaTab formData={formData} onInputChange={onInputChange} />
      </TabsContent>
      
      <TabsContent value="documents">
        <DocumentUploadTab formData={formData} onFileUpload={onFileUpload} />
      </TabsContent>
    </Tabs>
  );
};

export default ClubDialogContent;
