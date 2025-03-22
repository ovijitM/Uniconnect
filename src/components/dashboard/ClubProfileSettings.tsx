
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Club } from '@/types';
import { useClubProfileSettings } from '@/hooks/club-admin/useClubProfileSettings';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ClubProfileSettingsProps {
  club: Club | null;
  onRefresh: () => void;
  isLoading: boolean;
}

const ClubProfileSettings: React.FC<ClubProfileSettingsProps> = ({
  club,
  onRefresh,
  isLoading
}) => {
  const {
    profileData,
    setProfileData,
    handleInputChange,
    updateClubProfile,
    isSubmitting
  } = useClubProfileSettings(club, onRefresh);

  useEffect(() => {
    if (club) {
      setProfileData({
        name: club.name || '',
        description: club.description || '',
        category: club.category || '',
        tagline: club.tagline || '',
        logoUrl: club.logoUrl || '',
        establishedYear: club.establishedYear ? String(club.establishedYear) : '',
        affiliation: club.affiliation || '',
        whyJoin: club.whyJoin || '',
        regularEvents: club.regularEvents ? club.regularEvents.join(', ') : '',
        signatureEvents: club.signatureEvents ? club.signatureEvents.join(', ') : '',
        communityEngagement: club.communityEngagement || '',
        whoCanJoin: club.whoCanJoin || '',
        membershipFee: club.membershipFee || 'Free',
        howToJoin: club.howToJoin || '',
        presidentName: club.presidentName || '',
        presidentContact: club.presidentContact || '',
        executiveMembers: club.executiveMembers ? JSON.stringify(club.executiveMembers) : '',
        advisors: club.advisors ? club.advisors.join(', ') : '',
        phoneNumber: club.phoneNumber || '',
        website: club.website || '',
        facebookLink: club.facebookLink || '',
        instagramLink: club.instagramLink || '',
        twitterLink: club.twitterLink || '',
        discordLink: club.discordLink || ''
      });
    }
  }, [club]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle>Club Profile Settings</CardTitle>
          <CardDescription>Loading profile data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!club) {
    return (
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle>Club Profile Settings</CardTitle>
          <CardDescription>No club selected</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Please select a club to edit its profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Club Profile Settings</CardTitle>
        <CardDescription>Update your club's profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="social">Contact & Social</TabsTrigger>
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
                value={profileData.name}
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
                value={profileData.category}
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
                value={profileData.tagline}
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
                value={profileData.description}
                onChange={handleInputChange}
                className="col-span-3"
                rows={4}
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="logoUrl" className="text-right">
                Logo URL
              </Label>
              <Input
                id="logoUrl"
                name="logoUrl"
                value={profileData.logoUrl}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="https://example.com/logo.png"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="establishedYear" className="text-right">
                Established Year
              </Label>
              <Input
                id="establishedYear"
                name="establishedYear"
                value={profileData.establishedYear}
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
                value={profileData.affiliation}
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
                value={profileData.whyJoin}
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
                value={profileData.regularEvents}
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
                value={profileData.signatureEvents}
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
                value={profileData.communityEngagement}
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
                value={profileData.whoCanJoin}
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
                value={profileData.membershipFee}
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
                value={profileData.howToJoin}
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
                value={profileData.presidentName}
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
                value={profileData.presidentContact}
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
                value={profileData.executiveMembers}
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
                value={profileData.advisors}
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
                value={profileData.phoneNumber}
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
                value={profileData.website}
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
                value={profileData.facebookLink}
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
                value={profileData.instagramLink}
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
                value={profileData.twitterLink}
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
                value={profileData.discordLink}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="https://discord.gg/your-invite"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={updateClubProfile} 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : 'Save Changes'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClubProfileSettings;
