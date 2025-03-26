
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { useDocumentUpload } from '@/hooks/useDocumentUpload';
import { FileUpload } from '@/components/file-upload/FileUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const clubCategories = [
  'Academic',
  'Arts',
  'Cultural',
  'Environmental',
  'Hobby',
  'Media',
  'Music',
  'Professional',
  'Service',
  'Social',
  'Sports',
  'Technology',
  'Other'
];

const CreateClubForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [universities, setUniversities] = useState<any[]>([]);
  const [isLoadingUniversities, setIsLoadingUniversities] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    university: '',
    contactEmail: '',
    contactPhone: '',
    logoUrl: '',
    mission: '',
    tagline: '',
    establishedYear: '',
    affiliation: '',
    whyJoin: '',
    regularEvents: '',
    signatureEvents: '',
    communityEngagement: '',
    whoCanJoin: '',
    membershipFee: '',
    howToJoin: '',
    presidentName: '',
    presidentContact: '',
    executiveMembers: '',
    advisors: '',
    phoneNumber: '',
    website: '',
    social: {
      website: '',
      instagram: '',
      facebook: '',
      twitter: '',
      linkedin: '',
      discord: ''
    },
    documentUrl: '',
    documentName: '',
    studentCount: '',
    facultyAdvisor: '',
    meetingInfo: '',
    additionalNotes: ''
  });

  // Fetch universities when the component mounts
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const { data, error } = await supabase
          .from('universities')
          .select('id, name')
          .order('name');
          
        if (error) throw error;
        setUniversities(data || []);
      } catch (error) {
        console.error('Error fetching universities:', error);
        toast({
          title: 'Error',
          description: 'Failed to load universities. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingUniversities(false);
      }
    };

    fetchUniversities();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, string>),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (url: string, fileName: string) => {
    setFormData(prev => ({ ...prev, logoUrl: url }));
    toast({
      title: 'Logo Uploaded',
      description: 'Club logo has been uploaded successfully',
    });
  };

  const handleDocumentUpload = (url: string, fileName: string) => {
    setFormData(prev => ({ 
      ...prev, 
      documentUrl: url,
      documentName: fileName
    }));
    toast({
      title: 'Document Uploaded',
      description: 'Club document has been uploaded successfully',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to create a club',
        variant: 'destructive',
      });
      return;
    }

    // Validate form
    if (!formData.name || !formData.description || !formData.category || !formData.university) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Prepare social media links for database
      const socialMediaLinks = {
        website: formData.social.website,
        instagram: formData.social.instagram,
        facebook: formData.social.facebook,
        twitter: formData.social.twitter,
        linkedin: formData.social.linkedin,
        discord: formData.social.discord
      };

      // Prepare executive members structure (simple JSON for now)
      const executiveMembers = formData.executiveMembers 
        ? { members: formData.executiveMembers.split(',').map(m => m.trim()) } 
        : null;

      // Prepare advisors array
      const advisors = formData.advisors 
        ? formData.advisors.split(',').map(a => a.trim()) 
        : null;

      // Prepare regular events array
      const regularEvents = formData.regularEvents 
        ? formData.regularEvents.split(',').map(e => e.trim()) 
        : null;
      
      // Prepare signature events array
      const signatureEvents = formData.signatureEvents 
        ? formData.signatureEvents.split(',').map(e => e.trim()) 
        : null;
      
      // Insert club data
      const { data, error } = await supabase.rpc('insert_club', {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        university: formData.university,
        university_id: formData.university,
        logo_url: formData.logoUrl,
        club_admin_id: user.id
      });
      
      if (error) throw error;

      // Update additional fields
      const clubId = data;
      const { error: updateError } = await supabase
        .from('clubs')
        .update({
          tagline: formData.tagline || null,
          established_year: formData.establishedYear ? parseInt(formData.establishedYear) : null,
          affiliation: formData.affiliation || null,
          why_join: formData.whyJoin || null,
          regular_events: regularEvents,
          signature_events: signatureEvents,
          community_engagement: formData.communityEngagement || null,
          who_can_join: formData.whoCanJoin || null,
          membership_fee: formData.membershipFee || 'Free',
          how_to_join: formData.howToJoin || null,
          president_name: formData.presidentName || null,
          president_contact: formData.presidentContact || null,
          executive_members: executiveMembers,
          advisors: advisors,
          phone_number: formData.phoneNumber || null,
          website: formData.social.website || null,
          facebook_link: formData.social.facebook || null,
          instagram_link: formData.social.instagram || null,
          twitter_link: formData.social.twitter || null,
          discord_link: formData.social.discord || null,
          document_url: formData.documentUrl || null,
          document_name: formData.documentName || null
        })
        .eq('id', clubId);

      if (updateError) throw updateError;
      
      toast({
        title: 'Club Created',
        description: 'Your club has been created successfully and is pending approval',
      });
      
      // Redirect to the club admin dashboard
      navigate('/club-admin-dashboard');
      
    } catch (error: any) {
      console.error('Error creating club:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create club. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create a New Club</h1>
          
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="basic" className="mb-6">
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Club Details</TabsTrigger>
                <TabsTrigger value="membership">Membership</TabsTrigger>
                <TabsTrigger value="leadership">Leadership</TabsTrigger>
                <TabsTrigger value="media">Media & Contact</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Provide the essential details about your club</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Club Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Enter club name"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select 
                          value={formData.category} 
                          onValueChange={(value) => handleSelectChange(value, 'category')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {clubCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your club's purpose and activities"
                        rows={4}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input
                          id="tagline"
                          name="tagline"
                          value={formData.tagline}
                          onChange={handleInputChange}
                          placeholder="A short slogan for your club"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="establishedYear">Established Year</Label>
                        <Input
                          id="establishedYear"
                          name="establishedYear"
                          type="number"
                          value={formData.establishedYear}
                          onChange={handleInputChange}
                          placeholder="e.g., 2023"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="university">University *</Label>
                      {isLoadingUniversities ? (
                        <div className="flex items-center space-x-2">
                          <Spinner size={16} />
                          <span className="text-sm text-muted-foreground">Loading universities...</span>
                        </div>
                      ) : (
                        <Select 
                          value={formData.university} 
                          onValueChange={(value) => handleSelectChange(value, 'university')}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a university" />
                          </SelectTrigger>
                          <SelectContent>
                            {universities.map((university) => (
                              <SelectItem key={university.id} value={university.id}>
                                {university.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="affiliation">Affiliation</Label>
                      <Input
                        id="affiliation"
                        name="affiliation"
                        value={formData.affiliation}
                        onChange={handleInputChange}
                        placeholder="Any department or organization your club is affiliated with"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Club Details</CardTitle>
                    <CardDescription>Tell us more about your club's activities</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="whyJoin">Why Join?</Label>
                      <Textarea
                        id="whyJoin"
                        name="whyJoin"
                        value={formData.whyJoin}
                        onChange={handleInputChange}
                        placeholder="Why should students join your club?"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="regularEvents">Regular Events</Label>
                        <Textarea
                          id="regularEvents"
                          name="regularEvents"
                          value={formData.regularEvents}
                          onChange={handleInputChange}
                          placeholder="List regular events separated by commas (e.g., Weekly meetings, Monthly workshops)"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signatureEvents">Signature Events</Label>
                        <Textarea
                          id="signatureEvents"
                          name="signatureEvents"
                          value={formData.signatureEvents}
                          onChange={handleInputChange}
                          placeholder="List major annual events separated by commas"
                          rows={2}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="communityEngagement">Community Engagement</Label>
                      <Textarea
                        id="communityEngagement"
                        name="communityEngagement"
                        value={formData.communityEngagement}
                        onChange={handleInputChange}
                        placeholder="How does your club engage with the community?"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="studentCount">Approximate Member Count</Label>
                        <Input
                          id="studentCount"
                          name="studentCount"
                          type="number"
                          value={formData.studentCount}
                          onChange={handleInputChange}
                          placeholder="Current number of members"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="meetingInfo">Meeting Information</Label>
                        <Input
                          id="meetingInfo"
                          name="meetingInfo"
                          value={formData.meetingInfo}
                          onChange={handleInputChange}
                          placeholder="When and where do you typically meet?"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="membership">
                <Card>
                  <CardHeader>
                    <CardTitle>Membership Information</CardTitle>
                    <CardDescription>Details about joining your club</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="whoCanJoin">Who Can Join?</Label>
                      <Textarea
                        id="whoCanJoin"
                        name="whoCanJoin"
                        value={formData.whoCanJoin}
                        onChange={handleInputChange}
                        placeholder="Any requirements or restrictions for membership?"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="membershipFee">Membership Fee</Label>
                        <Input
                          id="membershipFee"
                          name="membershipFee"
                          value={formData.membershipFee}
                          onChange={handleInputChange}
                          placeholder="e.g., Free, $10/semester"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="howToJoin">How To Join</Label>
                        <Input
                          id="howToJoin"
                          name="howToJoin"
                          value={formData.howToJoin}
                          onChange={handleInputChange}
                          placeholder="Application process or steps to join"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="leadership">
                <Card>
                  <CardHeader>
                    <CardTitle>Leadership Structure</CardTitle>
                    <CardDescription>Information about your club's leadership</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="presidentName">President/Chair Name</Label>
                        <Input
                          id="presidentName"
                          name="presidentName"
                          value={formData.presidentName}
                          onChange={handleInputChange}
                          placeholder="Name of the club president or chair"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="presidentContact">President/Chair Contact</Label>
                        <Input
                          id="presidentContact"
                          name="presidentContact"
                          value={formData.presidentContact}
                          onChange={handleInputChange}
                          placeholder="Email or phone of the president"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="executiveMembers">Executive Members</Label>
                      <Textarea
                        id="executiveMembers"
                        name="executiveMembers"
                        value={formData.executiveMembers}
                        onChange={handleInputChange}
                        placeholder="List names and roles separated by commas (e.g., Jane Doe - Secretary, John Smith - Treasurer)"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="advisors">Faculty Advisors</Label>
                        <Textarea
                          id="advisors"
                          name="advisors"
                          value={formData.advisors}
                          onChange={handleInputChange}
                          placeholder="Names of faculty advisors separated by commas"
                          rows={2}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="facultyAdvisor">Primary Faculty Advisor</Label>
                        <Input
                          id="facultyAdvisor"
                          name="facultyAdvisor"
                          value={formData.facultyAdvisor}
                          onChange={handleInputChange}
                          placeholder="Name of primary faculty advisor"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="media">
                <Card>
                  <CardHeader>
                    <CardTitle>Media & Contact Information</CardTitle>
                    <CardDescription>Upload media and add contact details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Club Logo</Label>
                      <FileUpload
                        onUploadComplete={handleLogoUpload}
                        acceptedFileTypes={["image/jpeg", "image/png", "image/gif"]}
                        maxFileSize={2}
                        buttonText="Upload Logo"
                        helperText="Upload your club logo (Max 2MB, JPEG, PNG, or GIF)"
                        uploadType="logo"
                        bucket="club_logos"
                      />
                      {formData.logoUrl && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                          <img 
                            src={formData.logoUrl} 
                            alt="Club Logo Preview" 
                            className="w-24 h-24 object-contain border rounded-md" 
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Club Documents</Label>
                      <FileUpload
                        onUploadComplete={handleDocumentUpload}
                        acceptedFileTypes={["application/pdf"]}
                        maxFileSize={5}
                        buttonText="Upload Document"
                        helperText="Upload club constitution or other important documents (Max 5MB, PDF only)"
                        uploadType="document"
                        bucket="club_documents"
                      />
                      {formData.documentUrl && (
                        <div className="mt-2 flex items-center space-x-2">
                          <p className="text-sm font-medium">Uploaded: </p>
                          <a 
                            href={formData.documentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {formData.documentName}
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input
                          id="contactEmail"
                          name="contactEmail"
                          type="email"
                          value={formData.contactEmail}
                          onChange={handleInputChange}
                          placeholder="club@example.com"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Contact Phone</Label>
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="(123) 456-7890"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="mb-2 block">Social Media Links</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="social.website">Website</Label>
                          <Input
                            id="social.website"
                            name="social.website"
                            value={formData.social.website}
                            onChange={handleInputChange}
                            placeholder="https://yourclub.com"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="social.instagram">Instagram</Label>
                          <Input
                            id="social.instagram"
                            name="social.instagram"
                            value={formData.social.instagram}
                            onChange={handleInputChange}
                            placeholder="https://instagram.com/yourclub"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="social.facebook">Facebook</Label>
                          <Input
                            id="social.facebook"
                            name="social.facebook"
                            value={formData.social.facebook}
                            onChange={handleInputChange}
                            placeholder="https://facebook.com/yourclub"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="social.twitter">Twitter</Label>
                          <Input
                            id="social.twitter"
                            name="social.twitter"
                            value={formData.social.twitter}
                            onChange={handleInputChange}
                            placeholder="https://twitter.com/yourclub"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="social.linkedin">LinkedIn</Label>
                          <Input
                            id="social.linkedin"
                            name="social.linkedin"
                            value={formData.social.linkedin}
                            onChange={handleInputChange}
                            placeholder="https://linkedin.com/company/yourclub"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="social.discord">Discord</Label>
                          <Input
                            id="social.discord"
                            name="social.discord"
                            value={formData.social.discord}
                            onChange={handleInputChange}
                            placeholder="https://discord.gg/yourclub"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="additionalNotes">Additional Notes</Label>
                      <Textarea
                        id="additionalNotes"
                        name="additionalNotes"
                        value={formData.additionalNotes}
                        onChange={handleInputChange}
                        placeholder="Any other information you'd like to share about your club"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end gap-4 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/club-admin-dashboard')}
              >
                Cancel
              </Button>
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Spinner className="mr-2" size={16} />
                    Creating...
                  </>
                ) : (
                  'Create Club'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateClubForm;
