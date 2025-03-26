
import React, { useState } from 'react';
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
    social: {
      website: '',
      instagram: '',
      facebook: '',
      twitter: ''
    },
    documentUrl: '',
    documentName: ''
  });

  // Fetch universities when the component mounts
  React.useEffect(() => {
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
          ...prev[parent as keyof typeof prev],
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
            <Card className="mb-6">
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
                
                <div className="space-y-2">
                  <Label htmlFor="mission">Mission Statement</Label>
                  <Textarea
                    id="mission"
                    name="mission"
                    value={formData.mission}
                    onChange={handleInputChange}
                    placeholder="What is your club's mission?"
                    rows={2}
                  />
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
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How can students reach your club?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>Add your club's social media links</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Club Media</CardTitle>
                <CardDescription>Upload your club's logo and documents</CardDescription>
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
              </CardContent>
            </Card>
            
            <div className="flex justify-end gap-4">
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
