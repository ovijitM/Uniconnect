
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import ClubAdminSidebar from '@/components/dashboard/club-admin/ClubAdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/file-upload/FileUpload';
import { useToast } from '@/hooks/use-toast';
import { useEventCreation } from '@/hooks/club-admin/useEventCreation';
import ConfirmationDialog from '@/components/dashboard/event-dialog/ConfirmationDialog';

const CreateEventPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  // Initialize event form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: '',
    maxParticipants: '',
    clubId: '',
    imageUrl: '',
    
    // Details tab fields
    tagline: '',
    theme: '',
    subTracks: '',
    prizePool: '',
    prizeCategories: '',
    additionalPerks: '',
    judgingCriteria: '',
    judges: '',
    deliverables: '',
    submissionPlatform: '',
    mentors: '',
    sponsors: '',
    eventType: 'in-person',
    
    // Logistics tab fields
    registrationDeadline: '',
    onlinePlatform: '',
    eligibility: '',
    teamSize: '',
    registrationLink: '',
    entryFee: 'Free',
    
    // Contact tab fields
    contactEmail: '',
    communityLink: '',
    eventWebsite: '',
    eventHashtag: '',
    documentUrl: '',
    documentName: '',
    
    // Required for the API
    visibility: 'public' as 'public' | 'university_only',
  });

  // Hook for event creation logic
  const { isSubmitting, createEvent } = useEventCreation(user?.id, () => {
    toast({
      title: "Event Created",
      description: "Your event has been created successfully",
    });
    navigate('/club-admin-dashboard/events');
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (url: string, fileName: string) => {
    setFormData(prev => ({
      ...prev,
      documentUrl: url,
      documentName: fileName
    }));
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: url
    }));
  };

  const handleReviewSubmit = () => {
    // Validate required fields before opening confirmation dialog
    if (!formData.title) {
      toast({
        title: "Missing Information",
        description: "Please provide an event title",
        variant: "destructive"
      });
      setActiveTab('basic');
      return;
    }

    if (!formData.description) {
      toast({
        title: "Missing Information",
        description: "Please provide an event description",
        variant: "destructive"
      });
      setActiveTab('basic');
      return;
    }

    if (!formData.date) {
      toast({
        title: "Missing Information",
        description: "Please provide an event date",
        variant: "destructive"
      });
      setActiveTab('basic');
      return;
    }

    if (!formData.location) {
      toast({
        title: "Missing Information",
        description: "Please provide an event location",
        variant: "destructive"
      });
      setActiveTab('basic');
      return;
    }

    if (!formData.category) {
      toast({
        title: "Missing Information",
        description: "Please select an event category",
        variant: "destructive"
      });
      setActiveTab('basic');
      return;
    }

    // Open the confirmation dialog
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    // Submit the form to the database
    await createEvent(formData, setFormData, () => setIsConfirmDialogOpen(false));
  };

  return (
    <DashboardLayout sidebar={<ClubAdminSidebar />}>
      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigate('/club-admin-dashboard/events')}
            >
              <ArrowLeft size={16} />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
          </div>
          <Button onClick={handleReviewSubmit} disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            Review & Submit
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Event Information</CardTitle>
            <CardDescription>
              Fill in the details below to create a new event. Fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="logistics">Logistics</TabsTrigger>
                <TabsTrigger value="contact">Contact & Media</TabsTrigger>
              </TabsList>

              {/* Basic Info Tab */}
              <TabsContent value="basic">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-medium">Title *</label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter event title"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="tagline" className="text-sm font-medium">Tagline</label>
                      <Input
                        id="tagline"
                        name="tagline"
                        value={formData.tagline}
                        onChange={handleInputChange}
                        placeholder="A short description of your event"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description *</label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Detailed description of the event"
                      rows={5}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="date" className="text-sm font-medium">Date *</label>
                      <Input
                        id="date"
                        name="date"
                        type="datetime-local"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium">Location *</label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Event location"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="category" className="text-sm font-medium">Category *</label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => handleSelectChange('category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hackathon">Hackathon</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="conference">Conference</SelectItem>
                          <SelectItem value="meetup">Meetup</SelectItem>
                          <SelectItem value="competition">Competition</SelectItem>
                          <SelectItem value="training">Training</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="eventType" className="text-sm font-medium">Event Type</label>
                      <Select 
                        value={formData.eventType} 
                        onValueChange={(value) => handleSelectChange('eventType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-person">In-Person</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="imageUpload" className="text-sm font-medium">Event Image</label>
                    <p className="text-xs text-muted-foreground mb-2">Upload a cover image for your event</p>
                    <FileUpload
                      onUploadComplete={(url) => handleImageUpload(url)}
                      buttonText="Upload Event Image"
                      uploadType="image"
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button onClick={() => setActiveTab('details')}>
                    Next: Details
                  </Button>
                </div>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="theme" className="text-sm font-medium">Event Theme</label>
                    <Input
                      id="theme"
                      name="theme"
                      value={formData.theme}
                      onChange={handleInputChange}
                      placeholder="Main theme of the event"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subTracks" className="text-sm font-medium">Sub-tracks or Categories</label>
                    <Textarea
                      id="subTracks"
                      name="subTracks"
                      value={formData.subTracks}
                      onChange={handleInputChange}
                      placeholder="Separate with commas"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="prizePool" className="text-sm font-medium">Prize Pool</label>
                      <Input
                        id="prizePool"
                        name="prizePool"
                        value={formData.prizePool}
                        onChange={handleInputChange}
                        placeholder="Total prize amount"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="prizeCategories" className="text-sm font-medium">Prize Categories</label>
                      <Textarea
                        id="prizeCategories"
                        name="prizeCategories"
                        value={formData.prizeCategories}
                        onChange={handleInputChange}
                        placeholder="Separate with commas"
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="additionalPerks" className="text-sm font-medium">Additional Perks</label>
                    <Textarea
                      id="additionalPerks"
                      name="additionalPerks"
                      value={formData.additionalPerks}
                      onChange={handleInputChange}
                      placeholder="Separate with commas"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="judgingCriteria" className="text-sm font-medium">Judging Criteria</label>
                      <Textarea
                        id="judgingCriteria"
                        name="judgingCriteria"
                        value={formData.judgingCriteria}
                        onChange={handleInputChange}
                        placeholder="Separate with commas"
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="judges" className="text-sm font-medium">Judges</label>
                      <Textarea
                        id="judges"
                        name="judges"
                        value={formData.judges}
                        onChange={handleInputChange}
                        placeholder="Separate with commas"
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="deliverables" className="text-sm font-medium">Deliverables</label>
                    <Textarea
                      id="deliverables"
                      name="deliverables"
                      value={formData.deliverables}
                      onChange={handleInputChange}
                      placeholder="Separate with commas"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="submissionPlatform" className="text-sm font-medium">Submission Platform</label>
                    <Input
                      id="submissionPlatform"
                      name="submissionPlatform"
                      value={formData.submissionPlatform}
                      onChange={handleInputChange}
                      placeholder="e.g., Devpost, GitHub, etc."
                    />
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setActiveTab('basic')}>
                    Back
                  </Button>
                  <Button onClick={() => setActiveTab('logistics')}>
                    Next: Logistics
                  </Button>
                </div>
              </TabsContent>

              {/* Logistics Tab */}
              <TabsContent value="logistics">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="maxParticipants" className="text-sm font-medium">Maximum Participants</label>
                      <Input
                        id="maxParticipants"
                        name="maxParticipants"
                        type="number"
                        value={formData.maxParticipants}
                        onChange={handleInputChange}
                        placeholder="Leave empty for no limit"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="registrationDeadline" className="text-sm font-medium">Registration Deadline</label>
                      <Input
                        id="registrationDeadline"
                        name="registrationDeadline"
                        type="datetime-local"
                        value={formData.registrationDeadline}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {formData.eventType === 'online' || formData.eventType === 'hybrid' ? (
                    <div className="space-y-2">
                      <label htmlFor="onlinePlatform" className="text-sm font-medium">Online Platform</label>
                      <Input
                        id="onlinePlatform"
                        name="onlinePlatform"
                        value={formData.onlinePlatform}
                        onChange={handleInputChange}
                        placeholder="e.g., Zoom, Google Meet, etc."
                      />
                    </div>
                  ) : null}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="teamSize" className="text-sm font-medium">Team Size</label>
                      <Input
                        id="teamSize"
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleInputChange}
                        placeholder="e.g., 1-4 members"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="entryFee" className="text-sm font-medium">Entry Fee</label>
                      <Input
                        id="entryFee"
                        name="entryFee"
                        value={formData.entryFee}
                        onChange={handleInputChange}
                        placeholder="e.g., Free, $10, etc."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="eligibility" className="text-sm font-medium">Eligibility</label>
                    <Textarea
                      id="eligibility"
                      name="eligibility"
                      value={formData.eligibility}
                      onChange={handleInputChange}
                      placeholder="Who can participate in this event"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="registrationLink" className="text-sm font-medium">External Registration Link</label>
                    <Input
                      id="registrationLink"
                      name="registrationLink"
                      value={formData.registrationLink}
                      onChange={handleInputChange}
                      placeholder="Leave empty to use platform registration"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="mentors" className="text-sm font-medium">Mentors</label>
                      <Textarea
                        id="mentors"
                        name="mentors"
                        value={formData.mentors}
                        onChange={handleInputChange}
                        placeholder="Separate with commas"
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="sponsors" className="text-sm font-medium">Sponsors</label>
                      <Textarea
                        id="sponsors"
                        name="sponsors"
                        value={formData.sponsors}
                        onChange={handleInputChange}
                        placeholder="Separate with commas"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setActiveTab('details')}>
                    Back
                  </Button>
                  <Button onClick={() => setActiveTab('contact')}>
                    Next: Contact & Media
                  </Button>
                </div>
              </TabsContent>

              {/* Contact & Media Tab */}
              <TabsContent value="contact">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="contactEmail" className="text-sm font-medium">Contact Email</label>
                      <Input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        placeholder="Email for inquiries"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="eventWebsite" className="text-sm font-medium">Event Website</label>
                      <Input
                        id="eventWebsite"
                        name="eventWebsite"
                        value={formData.eventWebsite}
                        onChange={handleInputChange}
                        placeholder="Website URL"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="communityLink" className="text-sm font-medium">Community Link</label>
                      <Input
                        id="communityLink"
                        name="communityLink"
                        value={formData.communityLink}
                        onChange={handleInputChange}
                        placeholder="e.g., Discord, Slack, etc."
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="eventHashtag" className="text-sm font-medium">Event Hashtag</label>
                      <Input
                        id="eventHashtag"
                        name="eventHashtag"
                        value={formData.eventHashtag}
                        onChange={handleInputChange}
                        placeholder="e.g., #YourEventName"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="eventDocument" className="text-sm font-medium">Event Document</label>
                    <p className="text-xs text-muted-foreground mb-2">Upload any detailed guidelines, rules, or additional information</p>
                    <FileUpload 
                      onUploadComplete={handleFileUpload}
                      buttonText="Upload Event Document"
                      uploadType="document"
                    />
                    {formData.documentName && (
                      <div className="mt-2 p-2 bg-muted rounded flex items-center justify-between">
                        <span>{formData.documentName}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormData(prev => ({ ...prev, documentUrl: '', documentName: '' }))}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setActiveTab('logistics')}>
                    Back
                  </Button>
                  <Button onClick={handleReviewSubmit}>
                    Review & Submit
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        formData={formData}
        onConfirm={handleConfirmSubmit}
        isSubmitting={isSubmitting}
      />
    </DashboardLayout>
  );
};

export default CreateEventPage;
