
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
    tagline: string;
    eventType: string;
    registrationDeadline: string;
    onlinePlatform: string;
    eligibility: string;
    teamSize: string;
    registrationLink: string;
    entryFee: string;
    theme: string;
    subTracks: string;
    prizePool: string;
    prizeCategories: string;
    additionalPerks: string;
    judgingCriteria: string;
    judges: string;
    deliverables: string;
    submissionPlatform: string;
    mentors: string;
    sponsors: string;
    contactEmail: string;
    communityLink: string;
    eventWebsite: string;
    eventHashtag: string;
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
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new event for your club.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="participation">Participation</TabsTrigger>
            <TabsTrigger value="theme">Theme & Prizes</TabsTrigger>
            <TabsTrigger value="judges">Judging & Submission</TabsTrigger>
            <TabsTrigger value="contact">Contact & Social</TabsTrigger>
          </TabsList>
          
          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title*
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={onInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tagline" className="text-right">
                Tagline
              </Label>
              <Input
                id="tagline"
                name="tagline"
                value={formData.tagline}
                onChange={onInputChange}
                className="col-span-3"
                placeholder="Short catchy phrase"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description*
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={onInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventType" className="text-right">
                Event Type
              </Label>
              <select
                id="eventType"
                name="eventType"
                value={formData.eventType}
                onChange={onInputChange}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              >
                <option value="in-person">In-person</option>
                <option value="online">Online</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Start Date & Time*
              </Label>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={onInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="registrationDeadline" className="text-right">
                Registration Deadline
              </Label>
              <Input
                id="registrationDeadline"
                name="registrationDeadline"
                type="datetime-local"
                value={formData.registrationDeadline}
                onChange={onInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location*
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={onInputChange}
                className="col-span-3"
                required
                placeholder="University, Campus, Room No."
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="onlinePlatform" className="text-right">
                Online Platform
              </Label>
              <Input
                id="onlinePlatform"
                name="onlinePlatform"
                value={formData.onlinePlatform}
                onChange={onInputChange}
                className="col-span-3"
                placeholder="Zoom, Discord, etc."
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category*
              </Label>
              <Input
                id="category"
                name="category"
                value={formData.category}
                onChange={onInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            {clubs.length > 1 && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="clubId" className="text-right">
                  Club
                </Label>
                <select
                  id="clubId"
                  name="clubId"
                  value={formData.clubId}
                  onChange={onInputChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  required
                >
                  <option value="">Select a club</option>
                  {clubs.map(club => (
                    <option key={club.id} value={club.id}>{club.name}</option>
                  ))}
                </select>
              </div>
            )}
          </TabsContent>
          
          {/* Participation Tab */}
          <TabsContent value="participation" className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eligibility" className="text-right">
                Eligibility
              </Label>
              <Input
                id="eligibility"
                name="eligibility"
                value={formData.eligibility}
                onChange={onInputChange}
                className="col-span-3"
                placeholder="Who can participate?"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="teamSize" className="text-right">
                Team Size
              </Label>
              <Input
                id="teamSize"
                name="teamSize"
                value={formData.teamSize}
                onChange={onInputChange}
                className="col-span-3"
                placeholder="Min - Max members"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maxParticipants" className="text-right">
                Max Participants
              </Label>
              <Input
                id="maxParticipants"
                name="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={onInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="registrationLink" className="text-right">
                Registration Link
              </Label>
              <Input
                id="registrationLink"
                name="registrationLink"
                value={formData.registrationLink}
                onChange={onInputChange}
                className="col-span-3"
                placeholder="Sign-up URL"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="entryFee" className="text-right">
                Entry Fee
              </Label>
              <Input
                id="entryFee"
                name="entryFee"
                value={formData.entryFee}
                onChange={onInputChange}
                className="col-span-3"
                placeholder="Free / Paid"
              />
            </div>
          </TabsContent>
          
          {/* Theme & Prizes Tab */}
          <TabsContent value="theme" className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="theme" className="text-right">
                Main Theme
              </Label>
              <Input
                id="theme"
                name="theme"
                value={formData.theme}
                onChange={onInputChange}
                className="col-span-3"
                placeholder="AI, Blockchain, Sustainability, etc."
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subTracks" className="text-right">
                Sub-Tracks
              </Label>
              <Input
                id="subTracks"
                name="subTracks"
                value={formData.subTracks}
                onChange={onInputChange}
                className="col-span-3"
                placeholder="Track1, Track2, Track3 (comma separated)"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prizePool" className="text-right">
                Total Prize Pool
              </Label>
              <Input
                id="prizePool"
                name="prizePool"
                value={formData.prizePool}
                onChange={onInputChange}
                className="col-span-3"
                placeholder="$XXX"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prizeCategories" className="text-right">
                Prize Categories
              </Label>
              <Input
                id="prizeCategories"
                name="prizeCategories"
                value={formData.prizeCategories}
                onChange={onInputChange}
                className="col-span-3"
                placeholder="Best Overall, Best AI Project, etc. (comma separated)"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="additionalPerks" className="text-right">
                Additional Perks
              </Label>
              <Input
                id="additionalPerks"
                name="additionalPerks"
                value={formData.additionalPerks}
                onChange={onInputChange}
                className="col-span-3"
                placeholder="Swags, internships, certificates (comma separated)"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sponsors" className="text-right">
                Sponsors & Partners
              </Label>
              <Input
                id="sponsors"
                name="sponsors"
                value={formData.sponsors}
                onChange={onInputChange}
                className="col-span-3"
                placeholder="Company names (comma separated)"
              />
            </div>
          </TabsContent>
          
          {/* Judging & Submission Tab */}
          <TabsContent value="judges" className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="judgingCriteria" className="text-right">
                Judging Criteria
              </Label>
              <Input
                id="judgingCriteria"
                name="judgingCriteria"
                value={formData.judgingCriteria}
                onChange={onInputChange}
                className="col-span-3"
                placeholder="Innovation, Technical Execution, Impact, etc. (comma separated)"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="judges" className="text-right">
                Judges
              </Label>
              <Input
                id="judges"
                name="judges"
                value={formData.judges}
                onChange={onInputChange}
                className="col-span-3"
                placeholder="Names of experts (comma separated)"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deliverables" className="text-right">
                Deliverables
              </Label>
              <Input
                id="deliverables"
                name="deliverables"
                value={formData.deliverables}
                onChange={onInputChange}
                className="col-span-3"
                placeholder="GitHub Repo, Demo Video, Pitch Deck (comma separated)"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="submissionPlatform" className="text-right">
                Submission Platform
              </Label>
              <Input
                id="submissionPlatform"
                name="submissionPlatform"
                value={formData.submissionPlatform}
                onChange={onInputChange}
                className="col-span-3"
                placeholder="Devpost, Google Forms, etc."
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mentors" className="text-right">
                Mentors
              </Label>
              <Input
                id="mentors"
                name="mentors"
                value={formData.mentors}
                onChange={onInputChange}
                className="col-span-3"
                placeholder="Names & Expertise (comma separated)"
              />
            </div>
          </TabsContent>
          
          {/* Contact & Social Tab */}
          <TabsContent value="contact" className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactEmail" className="text-right">
                Contact Email
              </Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={onInputChange}
                className="col-span-3"
                placeholder="contact@example.com"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="communityLink" className="text-right">
                Community Link
              </Label>
              <Input
                id="communityLink"
                name="communityLink"
                value={formData.communityLink}
                onChange={onInputChange}
                className="col-span-3"
                placeholder="Discord/Telegram link"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventWebsite" className="text-right">
                Event Website
              </Label>
              <Input
                id="eventWebsite"
                name="eventWebsite"
                value={formData.eventWebsite}
                onChange={onInputChange}
                className="col-span-3"
                placeholder="https://example.com"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventHashtag" className="text-right">
                Event Hashtag
              </Label>
              <Input
                id="eventHashtag"
                name="eventHashtag"
                value={formData.eventHashtag}
                onChange={onInputChange}
                className="col-span-3"
                placeholder="#EventHashtag"
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
