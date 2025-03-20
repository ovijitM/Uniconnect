
import React from 'react';
import { Club } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EditClubDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClub: Club | null;
  editFormData: {
    name: string;
    description: string;
    category: string;
    tagline: string;
    establishedYear: string;
    affiliation: string;
    whyJoin: string;
    regularEvents: string;
    signatureEvents: string;
    communityEngagement: string;
    whoCanJoin: string;
    membershipFee: string;
    howToJoin: string;
    presidentName: string;
    presidentContact: string;
    executiveMembers: string;
    advisors: string;
    phoneNumber: string;
    website: string;
    facebookLink: string;
    instagramLink: string;
    twitterLink: string;
    discordLink: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleEditClub: () => void;
  isSubmitting: boolean;
}

const EditClubDialog: React.FC<EditClubDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedClub,
  editFormData,
  handleInputChange,
  handleEditClub,
  isSubmitting,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Club</DialogTitle>
          <DialogDescription>
            Make changes to your club's information.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="mt-2">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>
          
          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name *
              </Label>
              <Input
                id="name"
                name="name"
                value={editFormData.name}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category *
              </Label>
              <Input
                id="category"
                name="category"
                value={editFormData.category}
                onChange={handleInputChange}
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
                value={editFormData.tagline}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="A short catchy phrase for your club"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description *
              </Label>
              <Textarea
                id="description"
                name="description"
                value={editFormData.description}
                onChange={handleInputChange}
                className="col-span-3"
                rows={4}
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="establishedYear" className="text-right">
                Established Year
              </Label>
              <Input
                id="establishedYear"
                name="establishedYear"
                value={editFormData.establishedYear}
                onChange={handleInputChange}
                className="col-span-3"
                type="number"
                placeholder="e.g., 2020"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="affiliation" className="text-right">
                Affiliation
              </Label>
              <Input
                id="affiliation"
                name="affiliation"
                value={editFormData.affiliation}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Department or external organization"
              />
            </div>
          </TabsContent>
          
          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="whyJoin" className="text-right mt-3">
                Why Join
              </Label>
              <Textarea
                id="whyJoin"
                name="whyJoin"
                value={editFormData.whyJoin}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
                placeholder="Why students should join your club"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="regularEvents" className="text-right mt-3">
                Regular Events
              </Label>
              <Textarea
                id="regularEvents"
                name="regularEvents"
                value={editFormData.regularEvents}
                onChange={handleInputChange}
                className="col-span-3"
                rows={2}
                placeholder="List regular events, separated by commas"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="signatureEvents" className="text-right mt-3">
                Signature Events
              </Label>
              <Textarea
                id="signatureEvents"
                name="signatureEvents"
                value={editFormData.signatureEvents}
                onChange={handleInputChange}
                className="col-span-3"
                rows={2}
                placeholder="List your signature events, separated by commas"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="communityEngagement" className="text-right mt-3">
                Community Engagement
              </Label>
              <Textarea
                id="communityEngagement"
                name="communityEngagement"
                value={editFormData.communityEngagement}
                onChange={handleInputChange}
                className="col-span-3"
                rows={2}
                placeholder="How your club engages with the community"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="whoCanJoin" className="text-right mt-3">
                Who Can Join
              </Label>
              <Textarea
                id="whoCanJoin"
                name="whoCanJoin"
                value={editFormData.whoCanJoin}
                onChange={handleInputChange}
                className="col-span-3"
                rows={2}
                placeholder="Eligibility criteria for joining"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="membershipFee" className="text-right">
                Membership Fee
              </Label>
              <Select 
                name="membershipFee" 
                value={editFormData.membershipFee}
                onValueChange={(value) => {
                  const event = {
                    target: { name: 'membershipFee', value }
                  } as React.ChangeEvent<HTMLSelectElement>;
                  handleInputChange(event);
                }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select membership fee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="howToJoin" className="text-right mt-3">
                How To Join
              </Label>
              <Textarea
                id="howToJoin"
                name="howToJoin"
                value={editFormData.howToJoin}
                onChange={handleInputChange}
                className="col-span-3"
                rows={2}
                placeholder="Process for joining your club"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="presidentName" className="text-right">
                President Name
              </Label>
              <Input
                id="presidentName"
                name="presidentName"
                value={editFormData.presidentName}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Club president's name"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="presidentContact" className="text-right">
                President Contact
              </Label>
              <Input
                id="presidentContact"
                name="presidentContact"
                value={editFormData.presidentContact}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Club president's contact info"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="executiveMembers" className="text-right mt-3">
                Executive Members
              </Label>
              <Textarea
                id="executiveMembers"
                name="executiveMembers"
                value={editFormData.executiveMembers}
                onChange={handleInputChange}
                className="col-span-3"
                rows={3}
                placeholder="JSON format: {'role': 'name'}"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="advisors" className="text-right mt-3">
                Advisors
              </Label>
              <Textarea
                id="advisors"
                name="advisors"
                value={editFormData.advisors}
                onChange={handleInputChange}
                className="col-span-3"
                rows={2}
                placeholder="List advisors, separated by commas"
              />
            </div>
          </TabsContent>
          
          {/* Social Media Tab */}
          <TabsContent value="social" className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={editFormData.phoneNumber}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Contact phone number"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="website" className="text-right">
                Website
              </Label>
              <Input
                id="website"
                name="website"
                value={editFormData.website}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="https://your-club-website.com"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="facebookLink" className="text-right">
                Facebook
              </Label>
              <Input
                id="facebookLink"
                name="facebookLink"
                value={editFormData.facebookLink}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="https://facebook.com/your-club"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="instagramLink" className="text-right">
                Instagram
              </Label>
              <Input
                id="instagramLink"
                name="instagramLink"
                value={editFormData.instagramLink}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="https://instagram.com/your-club"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="twitterLink" className="text-right">
                Twitter
              </Label>
              <Input
                id="twitterLink"
                name="twitterLink"
                value={editFormData.twitterLink}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="https://twitter.com/your-club"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="discordLink" className="text-right">
                Discord
              </Label>
              <Input
                id="discordLink"
                name="discordLink"
                value={editFormData.discordLink}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="https://discord.gg/your-invite"
              />
            </div>
          </TabsContent>
        </Tabs>
        
        {selectedClub?.status === 'rejected' && selectedClub?.rejectionReason && (
          <div className="grid grid-cols-4 items-start gap-4 mt-4">
            <div className="text-right mt-1">
              <AlertTriangle className="h-4 w-4 text-red-500 ml-auto" />
            </div>
            <div className="col-span-3 p-3 bg-red-50 border border-red-100 rounded text-sm">
              <p className="font-semibold text-red-600 mb-1">Rejection Reason:</p>
              <p className="text-red-600">{selectedClub.rejectionReason}</p>
            </div>
          </div>
        )}
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleEditClub} 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditClubDialog;
