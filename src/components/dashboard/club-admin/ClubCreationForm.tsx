
import React, { useState } from 'react';
import { ClubFormData } from '@/hooks/club-admin/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import BasicInfoTab from '@/components/dashboard/club-dialog/BasicInfoTab';
import DetailsTab from '@/components/dashboard/club-dialog/DetailsTab';
import SocialMediaTab from '@/components/dashboard/club-dialog/SocialMediaTab';
import DocumentUploadTab from '@/components/dashboard/club-dialog/DocumentUploadTab';

interface ClubCreationFormProps {
  formData: ClubFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileUpload?: (url: string, fileName: string, type?: 'logo' | 'document') => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isLoadingProfile: boolean;
}

const ClubCreationForm: React.FC<ClubCreationFormProps> = ({
  formData,
  onInputChange,
  onFileUpload,
  onSubmit,
  isSubmitting,
  isLoadingProfile
}) => {
  const [activeTab, setActiveTab] = useState('basic');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="pt-4">
          <BasicInfoTab 
            formData={formData} 
            onInputChange={onInputChange}
            onFileUpload={onFileUpload} 
          />
        </TabsContent>
        
        <TabsContent value="details" className="pt-4">
          <DetailsTab 
            formData={formData} 
            onInputChange={onInputChange} 
          />
        </TabsContent>
        
        <TabsContent value="social" className="pt-4">
          <SocialMediaTab 
            formData={formData} 
            onInputChange={onInputChange} 
          />
        </TabsContent>
        
        <TabsContent value="documents" className="pt-4">
          <DocumentUploadTab 
            formData={formData} 
            onFileUpload={onFileUpload} 
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between mt-8">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            const prevTab = {
              'details': 'basic',
              'social': 'details',
              'documents': 'social'
            }[activeTab];
            if (prevTab) setActiveTab(prevTab);
          }}
          disabled={activeTab === 'basic' || isSubmitting}
        >
          Previous
        </Button>
        
        {activeTab !== 'documents' ? (
          <Button 
            type="button" 
            onClick={() => {
              const nextTab = {
                'basic': 'details',
                'details': 'social',
                'social': 'documents'
              }[activeTab];
              if (nextTab) setActiveTab(nextTab);
            }}
            disabled={isSubmitting}
          >
            Next
          </Button>
        ) : (
          <Button 
            type="submit" 
            disabled={isSubmitting || isLoadingProfile}
          >
            {isSubmitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Submitting...
              </>
            ) : (
              'Create Club'
            )}
          </Button>
        )}
      </div>
    </form>
  );
};

export default ClubCreationForm;
