
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminClubCreation } from '@/hooks/admin/useAdminClubCreation';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import ClubAdminSidebar from '@/components/dashboard/club-admin/ClubAdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import ClubCreationForm from '@/components/dashboard/club-admin/ClubCreationForm';

const CreateClubPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
            <ClubCreationForm 
              formData={clubFormData}
              onInputChange={handleClubInputChange}
              onFileUpload={handleFileUpload}
              onSubmit={handleCreateClub}
              isSubmitting={isSubmitting}
              isLoadingProfile={isLoadingProfile}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CreateClubPage;
