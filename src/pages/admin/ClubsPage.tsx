
import React, { useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/shared/DashboardLayout';
import AdminSidebar from '@/components/dashboard/admin/AdminSidebar';
import { ClubsTableContent } from '@/components/admin/clubs-table';
import { useAdminData } from '@/hooks/admin';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Navigate, useNavigate } from 'react-router-dom';

const ClubsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { clubs, isLoading, fetchAdminData, reviewClubOrEvent } = useAdminData(user?.id);
  
  // Redirect if not logged in or not an admin
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to={`/${user.role.replace('_', '-')}-dashboard`} />;

  useEffect(() => {
    if (user?.id) {
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
    const result = await reviewClubOrEvent(id, 'club');
    if (result.success) {
      navigate(`/clubs/${id}`);
    }
  };

  const handleViewClub = (clubId: string) => {
    navigate(`/clubs/${clubId}`);
  };

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="container p-6">
        <h1 className="text-2xl font-bold mb-6">Clubs Management</h1>
        <ClubsTableContent 
          clubs={clubs} 
          isLoading={isLoading}
          processingId={null}
          onApprove={handleReview}
          onReject={handleReview}
          onView={handleViewClub}
        />
      </div>
    </DashboardLayout>
  );
};

export default ClubsPage;
