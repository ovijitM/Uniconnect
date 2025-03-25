
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicInfoTab from './BasicInfoTab';
import DetailsTab from './DetailsTab';
import SocialMediaTab from './SocialMediaTab';
import DocumentUploadTab from './DocumentUploadTab';
import { useToast } from '@/hooks/use-toast';

interface ClubDialogWrapperProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    name: string;
    description: string;
    category: string;
    tagline?: string;
    logoUrl?: string;
    establishedYear?: string;
    affiliation?: string;
    whyJoin?: string;
    regularEvents?: string;
    signatureEvents?: string;
    communityEngagement?: string;
    whoCanJoin?: string;
    membershipFee?: string;
    howToJoin?: string;
    presidentName?: string;
    presidentContact?: string;
    executiveMembers?: string;
    advisors?: string;
    phoneNumber?: string;
    website?: string;
    facebookLink?: string;
    instagramLink?: string;
    twitterLink?: string;
    discordLink?: string;
    documentUrl?: string;
    documentName?: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onFileUpload?: (url: string, fileName: string) => void;
  buttonText?: string;
  trigger?: React.ReactNode;
}

const ClubDialogWrapper: React.FC<ClubDialogWrapperProps> = ({
  isOpen,
  onOpenChange,
  formData,
  onInputChange,
  onSubmit,
  onFileUpload,
  buttonText = "Create Club",
  trigger
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const { toast } = useToast();

  const validateBasicInfo = () => {
    if (!formData.name?.trim()) {
      toast({ title: "Missing Club Name", description: "Please provide a name for your club.", variant: "destructive" });
      return false;
    }
    if (!formData.description?.trim()) {
      toast({ title: "Missing Description", description: "Please provide a description for your club.", variant: "destructive" });
      return false;
    }
    if (!formData.category?.trim()) {
      toast({ title: "Missing Category", description: "Please select a category for your club.", variant: "destructive" });
      return false;
    }
    if (!formData.tagline?.trim()) {
      toast({ title: "Missing Tagline", description: "Please provide a tagline for your club.", variant: "destructive" });
      return false;
    }
    if (!formData.establishedYear?.trim()) {
      toast({ title: "Missing Established Year", description: "Please provide the year your club was established.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const validateDetails = () => {
    if (!formData.whyJoin?.trim()) {
      toast({ title: "Missing Why Join", description: "Please explain why students should join your club.", variant: "destructive" });
      return false;
    }
    if (!formData.presidentName?.trim()) {
      toast({ title: "Missing President Name", description: "Please provide the club president's name.", variant: "destructive" });
      return false;
    }
    if (!formData.presidentContact?.trim()) {
      toast({ title: "Missing President Contact", description: "Please provide the club president's contact information.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const validateSocialMedia = () => {
    if (!formData.phoneNumber?.trim()) {
      toast({ title: "Missing Phone Number", description: "Please provide a contact phone number for your club.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const validateDocuments = () => {
    if (!formData.logoUrl) {
      toast({ title: "Missing Logo", description: "Please upload a logo for your club.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (activeTab === 'basic' && validateBasicInfo()) {
      setActiveTab('details');
    } else if (activeTab === 'details' && validateDetails()) {
      setActiveTab('social');
    } else if (activeTab === 'social' && validateSocialMedia()) {
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
    if (validateDocuments()) {
      onSubmit();
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="social">Social & Contact</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          {/* Basic Information Tab */}
          <TabsContent value="basic">
            <BasicInfoTab formData={formData} onInputChange={onInputChange} />
          </TabsContent>
          
          {/* Details Tab */}
          <TabsContent value="details">
            <DetailsTab formData={formData} onInputChange={onInputChange} />
          </TabsContent>
          
          {/* Social Media Tab */}
          <TabsContent value="social">
            <SocialMediaTab formData={formData} onInputChange={onInputChange} />
          </TabsContent>
          
          {/* Document Upload Tab */}
          <TabsContent value="documents">
            <DocumentUploadTab formData={formData} onFileUpload={onFileUpload} />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-6 flex justify-between">
          {activeTab !== 'basic' && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleBack}
            >
              Back
            </Button>
          )}
          
          <div>
            {activeTab !== 'documents' ? (
              <Button type="button" onClick={handleNext}>Next</Button>
            ) : (
              <Button type="submit" onClick={handleSubmit}>{buttonText}</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClubDialogWrapper;
