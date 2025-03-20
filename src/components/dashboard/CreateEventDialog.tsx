import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';

interface CreateEventDialogProps {
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

const CreateEventDialog: React.FC<CreateEventDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  clubs,
  onInputChange,
  onSubmit,
  buttonText = "Create New Event",
  trigger
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            {buttonText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new event for your club.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="logistics">Logistics</TabsTrigger>
          </TabsList>
          
          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">
                Title*
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={onInputChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">
                Description*
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={onInputChange}
                required
                className="min-h-[100px]"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="category">
                Category*
              </Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={onInputChange}
                required
              />
            </div>
          </TabsContent>
          
          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="date">
                Date & Time*
              </Label>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={onInputChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">
                Location*
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={onInputChange}
                required
                placeholder="University, Campus, Room No."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="maxParticipants">
                Max Participants
              </Label>
              <Input
                id="maxParticipants"
                name="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={onInputChange}
              />
            </div>
          </TabsContent>
          
          {/* Logistics Tab */}
          <TabsContent value="logistics" className="space-y-4 py-4">
            {clubs.length > 1 && (
              <div className="grid gap-2">
                <Label htmlFor="clubId">
                  Select Club*
                </Label>
                <select
                  id="clubId"
                  name="clubId"
                  value={formData.clubId}
                  onChange={onInputChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  required
                >
                  <option value="">Select a club</option>
                  {clubs.map(club => (
                    <option key={club.id} value={club.id}>{club.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="eventType">
                Event Type
              </Label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType || 'in-person'}
                onChange={onInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="in-person">In-person</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="registrationDeadline">
                Registration Deadline
              </Label>
              <Input
                id="registrationDeadline"
                name="registrationDeadline"
                type="datetime-local"
                value={formData.registrationDeadline || ''}
                onChange={onInputChange}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-6">
          <Button type="submit" onClick={onSubmit}>Create Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;
