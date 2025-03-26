
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ClubFormData } from '@/hooks/club-admin/types';
import { useClubDialogValidation } from '@/hooks/club-admin/useClubDialogValidation';
import ClubDialogTabs from './ClubDialogTabs';
import ClubDialogContent from './ClubDialogContent';
import ClubDialogFooter from './ClubDialogFooter';

interface ClubDialogWrapperProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ClubFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onFileUpload?: (url: string, fileName: string, type?: 'logo' | 'document') => void;
  buttonText?: string;
  trigger?: React.ReactNode;
  isSubmitting?: boolean;
}

const ClubDialogWrapper: React.FC<ClubDialogWrapperProps> = ({
  isOpen,
  onOpenChange,
  formData,
  onInputChange,
  onSubmit,
  onFileUpload,
  buttonText = "Create Club",
  trigger,
  isSubmitting = false
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const { 
    validateBasicInfo, 
    validateDetails, 
    validateSocialMedia, 
    validateDocuments 
  } = useClubDialogValidation();

  const handleNext = () => {
    if (activeTab === 'basic' && validateBasicInfo(formData)) {
      setActiveTab('details');
    } else if (activeTab === 'details' && validateDetails(formData)) {
      setActiveTab('social');
    } else if (activeTab === 'social' && validateSocialMedia(formData)) {
      setActiveTab('documents');
    }
  };

  const handleBack = () => {
    if (activeTab === 'details') {
      setActiveTab('basic');
    } else if (activeTab === 'social') {
      setActiveTab('details');
    } else if (activeTab === 'documents') {
      setActiveTab('social');
    }
  };

  const handleSubmit = () => {
    console.log("ClubDialogWrapper: handleSubmit called");
    if (validateDocuments(formData)) {
      console.log("Form validation successful, triggering submission");
      onSubmit();
    } else {
      console.error("Form validation failed");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Club</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new club. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        
        <ClubDialogTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <ClubDialogContent 
          activeTab={activeTab}
          formData={formData}
          onInputChange={onInputChange}
          onFileUpload={onFileUpload}
        />
        
        <ClubDialogFooter 
          activeTab={activeTab}
          onBack={handleBack}
          onNext={handleNext}
          onSubmit={handleSubmit}
          buttonText={buttonText}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ClubDialogWrapper;
