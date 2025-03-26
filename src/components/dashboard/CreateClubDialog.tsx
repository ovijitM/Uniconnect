
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClubFormData } from '@/hooks/club-admin/types';
import { Spinner } from '@/components/ui/spinner';
import BasicInfoTab from '@/components/dashboard/club-dialog/BasicInfoTab';
import DetailsTab from '@/components/dashboard/club-dialog/DetailsTab';
import SocialMediaTab from '@/components/dashboard/club-dialog/SocialMediaTab';
import DocumentUploadTab from '@/components/dashboard/club-dialog/DocumentUploadTab';

interface CreateClubDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ClubFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileUpload?: (url: string, fileName: string, type?: 'logo' | 'document') => void;
  onSubmit: () => void;
  buttonText?: string;
  isSubmitting?: boolean;
}

const CreateClubDialog: React.FC<CreateClubDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  onInputChange,
  onFileUpload,
  onSubmit,
  buttonText = "Create Club",
  isSubmitting = false,
}) => {
  const [activeTab, setActiveTab] = useState('basic');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Club</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new club. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
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
              <div className="flex justify-end mt-6">
                <Button type="button" onClick={() => setActiveTab('details')}>
                  Next: Details
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="pt-4">
              <DetailsTab 
                formData={formData} 
                onInputChange={onInputChange} 
              />
              <div className="flex justify-between mt-6">
                <Button type="button" variant="outline" onClick={() => setActiveTab('basic')}>
                  Back
                </Button>
                <Button type="button" onClick={() => setActiveTab('social')}>
                  Next: Social Media
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="social" className="pt-4">
              <SocialMediaTab 
                formData={formData} 
                onInputChange={onInputChange} 
              />
              <div className="flex justify-between mt-6">
                <Button type="button" variant="outline" onClick={() => setActiveTab('details')}>
                  Back
                </Button>
                <Button type="button" onClick={() => setActiveTab('documents')}>
                  Next: Documents
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="pt-4">
              <DocumentUploadTab 
                formData={formData}
                onFileUpload={onFileUpload}
              />
              <div className="flex justify-between mt-6">
                <Button type="button" variant="outline" onClick={() => setActiveTab('social')}>
                  Back
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Creating...
                    </>
                  ) : (
                    buttonText
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClubDialog;
