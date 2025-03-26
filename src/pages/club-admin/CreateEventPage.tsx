
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminClubCreation } from '@/hooks/admin/useAdminClubCreation';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import ClubAdminSidebar from '@/components/dashboard/club-admin/ClubAdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BasicInfoTab from '@/components/dashboard/club-dialog/BasicInfoTab';
import DetailsTab from '@/components/dashboard/club-dialog/DetailsTab';
import SocialMediaTab from '@/components/dashboard/club-dialog/SocialMediaTab';
import DocumentUploadTab from '@/components/dashboard/club-dialog/DocumentUploadTab';
import { Spinner } from '@/components/ui/spinner';
import ClubConfirmationDialog from '@/components/dashboard/club-dialog/ClubConfirmationDialog';

const ClubCreationPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  // Initialize club creation hooks
  const {
    clubFormData,
    isSubmitting,
    isLoadingProfile,
    profileError,
    handleClubInputChange,
    handleCreateClub,
    handleFileUpload
  } = useAdminClubCreation(user?.id, () => {
    navigate('/club-admin-dashboard/clubs');
  });

  // Redirect if not logged in or not a club admin
  useEffect(() => {
    if (user && user.role !== 'club_admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmationOpen(true);
  };

  const handleConfirm = () => {
    handleCreateClub();
    setIsConfirmationOpen(false);
  };

  return (
    <DashboardLayout sidebar={<ClubAdminSidebar />}>
      <div className="container py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Create New Club</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/club-admin-dashboard/clubs')}
          >
            Back to Clubs
          </Button>
        </div>

        {profileError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {profileError}. Unable to load your university information.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Club Details</CardTitle>
            <CardDescription>
              Fill in the details below to create a new club. Required fields are marked with an asterisk (*).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-8">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="social">Social Media</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="pt-4">
                  <BasicInfoTab 
                    formData={clubFormData} 
                    onInputChange={handleClubInputChange}
                    onFileUpload={handleFileUpload} 
                  />
                </TabsContent>
                
                <TabsContent value="details" className="pt-4">
                  <DetailsTab 
                    formData={clubFormData} 
                    onInputChange={handleClubInputChange} 
                  />
                </TabsContent>
                
                <TabsContent value="social" className="pt-4">
                  <SocialMediaTab 
                    formData={clubFormData} 
                    onInputChange={handleClubInputChange} 
                  />
                </TabsContent>
                
                <TabsContent value="documents" className="pt-4">
                  <DocumentUploadTab 
                    formData={clubFormData} 
                    onFileUpload={handleFileUpload} 
                  />
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-between mt-8">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    const prevTab = {
                      'details': 'basic',
                      'social': 'details',
                      'documents': 'social'
                    }[activeTab];
                    if (prevTab) setActiveTab(prevTab);
                  }}
                  disabled={activeTab === 'basic' || isSubmitting}
                >
                  Previous
                </Button>
                
                {activeTab !== 'documents' ? (
                  <Button 
                    type="button" 
                    onClick={() => {
                      const nextTab = {
                        'basic': 'details',
                        'details': 'social',
                        'social': 'documents'
                      }[activeTab];
                      if (nextTab) setActiveTab(nextTab);
                    }}
                    disabled={isSubmitting}
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || isLoadingProfile}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4" />
                        Processing...
                      </>
                    ) : (
                      'Review Club Details'
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <ClubConfirmationDialog 
          isOpen={isConfirmationOpen} 
          onOpenChange={setIsConfirmationOpen}
          formData={clubFormData}
          onConfirm={handleConfirm}
          isSubmitting={isSubmitting}
        />
      </div>
    </DashboardLayout>
  );
};

export default ClubCreationPage;
