
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicInfoTab from './BasicInfoTab';
import DetailsTab from './DetailsTab';
import LogisticsTab from './LogisticsTab';
import EventCollaboratorsTab from './EventCollaboratorsTab';

interface EventDialogWrapperProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
    maxParticipants: string;
    clubId: string;
    tagline?: string;
    eventType?: string;
    registrationDeadline?: string;
    onlinePlatform?: string;
    eligibility?: string;
    teamSize?: string;
    registrationLink?: string;
    entryFee?: string;
    theme?: string;
    subTracks?: string;
    prizePool?: string;
    prizeCategories?: string;
    additionalPerks?: string;
    judgingCriteria?: string;
    judges?: string;
    deliverables?: string;
    submissionPlatform?: string;
    mentors?: string;
    sponsors?: string;
    contactEmail?: string;
    communityLink?: string;
    eventWebsite?: string;
    eventHashtag?: string;
    documentUrl?: string;
    documentName?: string;
  };
  clubs: any[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: () => void;
  buttonText?: string;
  trigger?: React.ReactNode;
  isSubmitting?: boolean;
  onFileUpload?: (url: string, fileName: string) => void;
}

const EventDialogWrapper: React.FC<EventDialogWrapperProps> = ({
  isOpen,
  onOpenChange,
  formData,
  clubs,
  onInputChange,
  onSubmit,
  buttonText = "Create",
  trigger,
  isSubmitting = false,
  onFileUpload
}) => {
  const [activeTab, setActiveTab] = useState('basic-info');
  const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([]);

  const handleCollaboratorToggle = (clubId: string, selected: boolean) => {
    setSelectedCollaborators(prev => {
      if (selected) {
        return [...prev, clubId];
      } else {
        return prev.filter(id => id !== clubId);
      }
    });
  };

  const handleSubmit = async () => {
    // Call the provided onSubmit callback
    await onSubmit();
    
    // After successful submission, if we have collaborators, we'll add them
    // This will be handled in the component using this dialog wrapper
  };

  const handleFileUpload = (url: string, fileName: string) => {
    if (onFileUpload) {
      onFileUpload(url, fileName);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new event for your club
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full mb-4">
            <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="logistics">Logistics</TabsTrigger>
            <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic-info">
            <BasicInfoTab formData={formData} onInputChange={onInputChange} />
          </TabsContent>
          
          <TabsContent value="details">
            <DetailsTab 
              formData={formData} 
              onInputChange={onInputChange} 
              onFileUpload={handleFileUpload}
            />
          </TabsContent>
          
          <TabsContent value="logistics">
            <LogisticsTab formData={formData} clubs={clubs} onInputChange={onInputChange} />
          </TabsContent>
          
          <TabsContent value="collaborators">
            <EventCollaboratorsTab 
              clubId={formData.clubId} 
              selectedCollaborators={selectedCollaborators}
              onCollaboratorToggle={handleCollaboratorToggle}
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          {activeTab === 'collaborators' ? (
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : buttonText}
            </Button>
          ) : (
            <Button 
              onClick={() => {
                if (activeTab === 'basic-info') setActiveTab('details');
                else if (activeTab === 'details') setActiveTab('logistics');
                else if (activeTab === 'logistics') setActiveTab('collaborators');
              }}
            >
              Next
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialogWrapper;
