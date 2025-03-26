
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UserProfile from '@/components/UserProfile';
import DocumentManager from '@/components/file-upload/DocumentManager';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStudentProfile } from '@/hooks/student/useStudentProfile';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const { error, isLoadingProfile, fetchUserProfile } = useStudentProfile(user?.id);

  const handleRetry = () => {
    if (user?.id) {
      fetchUserProfile();
    }
  };

  return (
    <Layout>
      <div className="container max-w-5xl py-10">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-fit"
                onClick={handleRetry}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry loading profile
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Manage your personal information and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ErrorBoundary>
                  <UserProfile />
                </ErrorBoundary>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents">
            <DocumentManager 
              title="My Documents"
              description="Upload and manage your personal documents"
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ProfilePage;
