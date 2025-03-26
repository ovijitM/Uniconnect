
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudentProfile } from '@/hooks/student/useStudentProfile';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Components
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import ClubAdminSidebar from '@/components/dashboard/club-admin/ClubAdminSidebar';
import ClubAdminDashboardActions from '@/components/dashboard/club-admin/dashboard/ClubAdminDashboardActions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const ClubAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    userUniversity, 
    fetchUserProfile, 
    isLoadingProfile, 
    error: profileError 
  } = useStudentProfile(user?.id);

  // Fetch the user's profile on initial load
  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user?.id, fetchUserProfile]);

  // Redirect if not logged in or not a club admin
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'club_admin') {
    toast({
      title: "Access Denied",
      description: "You don't have permissions for the club admin dashboard.",
      variant: "destructive",
    });
    return <Navigate to={`/${user.role.replace('_', '-')}-dashboard`} />;
  }

  const handleRetryProfileFetch = () => {
    fetchUserProfile();
    toast({
      title: "Retrying",
      description: "Attempting to reload your profile data...",
    });
  };

  return (
    <DashboardLayout sidebar={<ClubAdminSidebar />}>
      <div className="max-w-7xl mx-auto px-4">
        <ClubAdminDashboardActions
          profileError={profileError}
          isLoadingProfile={isLoadingProfile}
          handleRetryProfileFetch={handleRetryProfileFetch}
          userName={user.name}
        />
        
        <div className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Your Club Admin Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                This dashboard allows you to manage your university clubs. Currently, you can access your profile settings and create new clubs.
              </p>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Get Started</AlertTitle>
                <AlertDescription>
                  Start by creating a new club or updating your profile information.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild>
                  <Link to="/club-admin-dashboard/create-club-new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Club
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/club-admin-dashboard/profile">
                    Update Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.profileImage} alt={user.name} />
                  <AvatarFallback className="text-2xl">
                    {user.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-2">
                    Club Administrator
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">University</h4>
                  <p className="text-base">{userUniversity || 'Not specified'}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Account ID</h4>
                  <p className="text-base font-mono text-xs">{user.id}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Account Status</h4>
                  <p className="text-base">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClubAdminDashboard;
