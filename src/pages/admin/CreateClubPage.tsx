
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AdminSidebar from '@/components/dashboard/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, RefreshCw } from 'lucide-react';
import BasicInfoTab from '@/components/dashboard/club-dialog/BasicInfoTab';
import DetailsTab from '@/components/dashboard/club-dialog/DetailsTab';
import SocialMediaTab from '@/components/dashboard/club-dialog/SocialMediaTab';
import DocumentUploadTab from '@/components/dashboard/club-dialog/DocumentUploadTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAdminClubCreation } from '@/hooks/admin/useAdminClubCreation';

const CreateClubPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('basic');
  
  // Initialize club form with success callback to navigate back to clubs list
  const {
    clubFormData,
    handleClubInputChange,
    handleCreateClub,
    isSubmitting,
    isLoadingProfile,
    profileError,
    handleFileUpload
  } = useAdminClubCreation(user?.id, () => {
    toast({
      title: "Club Created",
      description: "The club has been created successfully.",
    });
    navigate('/admin-dashboard/clubs');
  });

  // Redirect if not logged in or not an admin
  if (!user) {
    return null; // Will redirect to login via RequireAuth
  }

  const handleRetryProfile = () => {
    if (profileError) {
      toast({
        title: "Retrying",
        description: "Attempting to reload profile data...",
      });
      navigate(0); // Refresh the page
    }
  };

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
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Save size={16} />
            {isSubmitting ? 'Creating...' : 'Create Club'}
          </Button>
        </div>

        {profileError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Profile Error</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>{profileError}</p>
              <p>Failed to load your university information. This is required to create a club.</p>
              <Button 
                onClick={handleRetryProfile} 
                variant="outline" 
                size="sm" 
                className="w-fit mt-2"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry Loading Profile
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isLoadingProfile ? (
          <Card>
            <CardContent className="py-10">
              <div className="flex flex-col items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="mt-4 text-muted-foreground">Loading university information...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
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
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Club'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreateClubPage;
