
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useStudentProfile } from '@/hooks/student/useStudentProfile';
import { Button } from '@/components/ui/button';
import { PlusCircle, Info, User, School } from 'lucide-react';
import { Link } from 'react-router-dom';

// Components
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import ClubAdminSidebar from '@/components/dashboard/club-admin/ClubAdminSidebar';
import ClubAdminDashboardActions from '@/components/dashboard/club-admin/dashboard/ClubAdminDashboardActions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
      <div className="space-y-6">
        <ClubAdminDashboardActions
          profileError={profileError}
          isLoadingProfile={isLoadingProfile}
          handleRetryProfileFetch={handleRetryProfileFetch}
          userName={user.name}
        />
        
        <div className="grid grid-cols-1 gap-6">
          <Card className="border border-border/40 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-bold">Welcome to Your Club Admin Dashboard</CardTitle>
              <CardDescription>
                Manage your university clubs and events all in one place
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                This dashboard allows you to manage your university clubs. Currently, you can access your profile settings and create new clubs.
              </p>
              
              <Alert className="bg-secondary/30 border border-secondary/50">
                <Info className="h-4 w-4" />
                <AlertTitle className="font-medium">Get Started</AlertTitle>
                <AlertDescription>
                  Start by creating a new club or updating your profile information.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link to="/club-admin-dashboard/create-club-new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Club
                  </Link>
                </Button>
                <Button variant="outline" asChild className="border-border/60 hover:bg-secondary/50">
                  <Link to="/club-admin-dashboard/profile">
                    Update Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/40 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-bold">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <Avatar className="h-20 w-20 border-2 border-border">
                  <AvatarImage src={user.profileImage} alt={user.name} />
                  <AvatarFallback className="text-2xl bg-secondary/80">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="inline-block bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs px-2 py-1 rounded mt-2">
                    Club Administrator
                  </div>
                </div>
              </div>
              
              <Separator className="my-4 bg-border/40" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <School className="h-4 w-4" />
                    <span className="text-sm font-medium">University</span>
                  </div>
                  <p className="text-base">{userUniversity || 'Not specified'}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Account Status</span>
                  </div>
                  <p className="text-base">Active</p>
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Info className="h-4 w-4" />
                    <span className="text-sm font-medium">Account ID</span>
                  </div>
                  <p className="text-xs font-mono bg-secondary/20 p-2 rounded">{user.id}</p>
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
