
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AdminSidebar from '@/components/dashboard/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save } from 'lucide-react';
import { ClubFormData } from '@/hooks/club-admin/types';
import { useClubForm } from '@/hooks/club-admin/useClubForm';
import { useClubFileUpload } from '@/hooks/club-admin/useClubFileUpload';
import { useStudentProfile } from '@/hooks/student/useStudentProfile';
import BasicInfoTab from '@/components/dashboard/club-dialog/BasicInfoTab';
import DetailsTab from '@/components/dashboard/club-dialog/DetailsTab';
import SocialMediaTab from '@/components/dashboard/club-dialog/SocialMediaTab';
import DocumentUploadTab from '@/components/dashboard/club-dialog/DocumentUploadTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CreateClubPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic');
  const { userUniversity, fetchUserProfile, isLoadingProfile, error: profileError } = useStudentProfile(user?.id);
  
  // Initialize club form with success callback to navigate back to clubs list
  const {
    clubFormData,
    handleClubInputChange,
    handleCreateClub,
    isSubmitting,
    isLoadingProfile: isLoadingClubProfile,
    profileError: clubProfileError
  } = useClubForm(user?.id, () => {
    toast({
      title: "Club Created",
      description: "The club has been created successfully.",
    });
    navigate('/admin-dashboard/clubs');
  });

  // Initialize file upload hook
  const { handleClubFileUpload, isUploading } = useClubFileUpload();

  // Fetch user profile when component mounts
  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user?.id, fetchUserProfile]);

  // Handle file uploads for logo and documents
  const handleFileUpload = (url: string, fileName: string, type: 'logo' | 'document' = 'document') => {
    handleClubFileUpload(url, fileName, type);
  };

  // Redirect if not logged in or not an admin
  if (!user) {
    return null; // Will redirect to login via RequireAuth
  }

  // Show error if there's a profile error
  if (profileError || clubProfileError) {
    const error = profileError || clubProfileError;
    return (
      <DashboardLayout sidebar={<AdminSidebar />}>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertTitle>Error Loading Profile</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button 
              onClick={() => fetchUserProfile()} 
              variant="outline" 
              className="mt-4"
            >
              Retry
            </Button>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="container p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate('/admin-dashboard/clubs')}>
              <ArrowLeft size={16} />
            </Button>
            <h1 className="text-2xl font-bold">Create New Club</h1>
          </div>
          <Button 
            onClick={() => handleCreateClub()} 
            disabled={isSubmitting || isUploading}
            className="flex items-center gap-2"
          >
            <Save size={16} />
            {isSubmitting ? 'Creating...' : 'Create Club'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Club Information</CardTitle>
            <CardDescription>
              Fill in the details below to create a new club. All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic">
                <BasicInfoTab 
                  formData={clubFormData}
                  onInputChange={handleClubInputChange}
                />
                <div className="flex justify-end mt-6">
                  <Button onClick={() => setActiveTab('details')}>
                    Next: Details
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="details">
                <DetailsTab 
                  formData={clubFormData}
                  onInputChange={handleClubInputChange}
                />
                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setActiveTab('basic')}>
                    Back
                  </Button>
                  <Button onClick={() => setActiveTab('social')}>
                    Next: Social Media
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="social">
                <SocialMediaTab 
                  formData={clubFormData}
                  onInputChange={handleClubInputChange}
                />
                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setActiveTab('details')}>
                    Back
                  </Button>
                  <Button onClick={() => setActiveTab('documents')}>
                    Next: Documents
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="documents">
                <DocumentUploadTab 
                  formData={clubFormData}
                  onFileUpload={handleFileUpload}
                />
                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={() => setActiveTab('social')}>
                    Back
                  </Button>
                  <Button 
                    onClick={() => handleCreateClub()} 
                    disabled={isSubmitting || isUploading}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Club'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateClubPage;
