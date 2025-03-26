
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AdminSidebar from '@/components/dashboard/admin/AdminSidebar';
import { ClubsTableContent } from '@/components/admin/clubs-table';
import { useAdminData } from '@/hooks/admin';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Spinner } from '@/components/ui/spinner';

const ClubsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { clubs, isLoading, fetchAdminData, reviewClubOrEvent } = useAdminData(user?.id);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Redirect if not logged in or not an admin
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to={`/${user.role.replace('_', '-')}-dashboard`} />;

  useEffect(() => {
    if (user?.id) {
      console.log("ClubsPage: Fetching admin data");
      fetchAdminData().catch(error => {
        console.error("Error fetching admin data:", error);
        toast({
          title: 'Error',
          description: 'Failed to load admin dashboard data.',
          variant: 'destructive',
        });
      });
    }
  }, [user?.id]);

  const handleReview = async (id: string) => {
    console.log("Starting review process for club ID:", id);
    try {
      const result = await reviewClubOrEvent(id, 'club');
      console.log("Review result:", result);
      if (result.success) {
        navigate(`/clubs/${id}`);
      }
    } catch (error) {
      console.error("Error in handleReview:", error);
      toast({
        title: 'Error',
        description: 'Failed to review club.',
        variant: 'destructive',
      });
    }
  };

  const handleViewClub = (clubId: string) => {
    console.log("Navigating to club detail page:", clubId);
    navigate(`/clubs/${clubId}`);
  };

  const handleCreateClub = () => {
    navigate('/admin-dashboard/clubs/create');
  };

  const handleApproveClub = async (clubId: string) => {
    try {
      console.log("Starting club approval process for club ID:", clubId);
      setProcessingId(clubId);
      
      const { error, data } = await supabase
        .from('clubs')
        .update({ status: 'approved' })
        .eq('id', clubId)
        .select();

      if (error) {
        console.error('Error approving club:', error);
        throw error;
      }

      console.log("Club approval successful:", data);
      
      toast({
        title: 'Club Approved',
        description: 'The club has been approved successfully.',
      });

      // Refresh the data
      await fetchAdminData();
    } catch (error) {
      console.error('Error approving club:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve club. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectClub = async (clubId: string) => {
    try {
      console.log("Opening reject dialog for club ID:", clubId);
      setProcessingId(clubId);
      // Just navigate to review page for rejection since we need a reason
      handleReview(clubId);
    } catch (error) {
      console.error('Error starting reject process:', error);
      setProcessingId(null);
    }
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="container p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Clubs Management</h1>
          <Button onClick={handleCreateClub} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create New Club
          </Button>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Spinner className="h-8 w-8 text-primary" />
          </div>
        ) : (
          <ClubsTableContent 
            clubs={clubs} 
            isLoading={isLoading}
            processingId={processingId}
            onApprove={handleApproveClub}
            onReject={handleRejectClub}
            onView={handleViewClub}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClubsPage;
