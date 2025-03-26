
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
import ClubsTable from '@/components/admin/ClubsTable';

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

  const handleCreateClub = () => {
    navigate('/admin-dashboard/clubs/create');
  };

  const handleClubStatusChange = () => {
    console.log("Club status changed, refreshing clubs data...");
    fetchAdminData();
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
        
        <ClubsTable 
          clubs={clubs} 
          isLoading={isLoading}
          onViewClub={handleViewClub}
          onClubStatusChange={handleClubStatusChange}
        />
      </div>
    </DashboardLayout>
  );
};

export default ClubsPage;
