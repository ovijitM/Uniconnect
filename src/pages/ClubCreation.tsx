
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useAdminClubCreation } from '@/hooks/admin/useAdminClubCreation';
import ClubCreationForm from '@/components/dashboard/club-admin/ClubCreationForm';

const ClubCreation: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
    toast({
      title: "Club Created",
      description: "Your club has been created successfully and is pending approval.",
    });
    navigate('/clubs');
  });

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Layout>
      <div className="container py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate('/clubs')}>
              <ArrowLeft size={16} />
            </Button>
            <h1 className="text-2xl font-bold">Create New Club</h1>
          </div>
        </div>

        {profileError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {profileError}. Unable to load your university information. Please try again later.
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
    </Layout>
  );
};

export default ClubCreation;
