
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import BasicInfoTab from './BasicInfoTab';
import DetailsTab from './DetailsTab';
import LogisticsTab from './LogisticsTab';

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
  };
  clubs: any[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: () => void;
  buttonText?: string;
  trigger?: React.ReactNode;
}

const EventDialogWrapper: React.FC<EventDialogWrapperProps> = ({
  isOpen,
  onOpenChange,
  formData,
  clubs,
  onInputChange,
  onSubmit,
  buttonText = "Create Event",
  trigger
}) => {
  // Get the current club name based on clubId
  const currentClub = clubs.find(club => club.id === formData.clubId);
  const clubName = currentClub ? currentClub.name : '';

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            {clubName ? (
              <>Fill in the details below to create a new event for <span className="font-medium">{clubName}</span>.</>
            ) : (
              <>Fill in the details below to create a new event for your club.</>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <p className="font-medium">All fields marked with * are required</p>
            <p className="mt-1">Please complete all required information across all tabs before submitting.</p>
          </div>
        </div>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="logistics">Logistics</TabsTrigger>
          </TabsList>
          
          {/* Basic Information Tab */}
          <TabsContent value="basic">
            <BasicInfoTab formData={formData} onInputChange={onInputChange} />
          </TabsContent>
          
          {/* Details Tab */}
          <TabsContent value="details">
            <DetailsTab formData={formData} onInputChange={onInputChange} />
          </TabsContent>
          
          {/* Logistics Tab */}
          <TabsContent value="logistics">
            <LogisticsTab formData={formData} clubs={clubs} onInputChange={onInputChange} />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-6">
          <Button type="submit" onClick={onSubmit}>{buttonText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDialogWrapper;
