
import React, { useState } from 'react';
import { ClubFormData } from '@/hooks/club-admin/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import BasicInfoTab from '@/components/dashboard/club-dialog/BasicInfoTab';
import DetailsTab from '@/components/dashboard/club-dialog/DetailsTab';
import SocialMediaTab from '@/components/dashboard/club-dialog/SocialMediaTab';
import DocumentUploadTab from '@/components/dashboard/club-dialog/DocumentUploadTab';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateTab = (tabName: string): boolean => {
    // Basic validation for each tab
    switch (tabName) {
      case 'basic':
        if (!formData.name || !formData.description || !formData.category) {
          setValidationError('Please fill in all required fields in Basic Info tab.');
          return false;
        }
        if (!formData.logoUrl) {
          setValidationError('Please upload a logo for your club.');
          return false;
        }
        break;
      // Add more validations for other tabs if needed
    }
    setValidationError(null);
    return true;
  };

  const handleNext = () => {
    if (validateTab(activeTab)) {
      const nextTab = {
        'basic': 'details',
        'details': 'social',
        'social': 'documents'
      }[activeTab];
      if (nextTab) setActiveTab(nextTab);
    }
  };

  const handlePrevious = () => {
    const prevTab = {
      'details': 'basic',
      'social': 'details',
      'documents': 'social'
    }[activeTab];
    if (prevTab) setActiveTab(prevTab);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log form data before submission
    console.log("Submitting form data:", formData);
    
    // Perform final validation
    if (!formData.name || !formData.description || !formData.category) {
      setValidationError('Club name, description and category are required.');
      setActiveTab('basic');
      return;
    }
    
    if (!formData.logoUrl) {
      setValidationError('Please upload a logo for your club.');
      setActiveTab('basic');
      return;
    }
    
    // Clear any validation errors
    setValidationError(null);
    
    // Submit the form
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {validationError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}
      
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
          onClick={handlePrevious}
          disabled={activeTab === 'basic' || isSubmitting}
        >
          Previous
        </Button>
        
        {activeTab !== 'documents' ? (
          <Button 
            type="button" 
            onClick={handleNext}
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
