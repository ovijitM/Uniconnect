
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ClubsTableContent from './clubs-table/ClubsTableContent';
import RejectDialog from './clubs-table/RejectDialog';
import { Spinner } from '@/components/ui/spinner';

interface Club {
  id: string;
  name: string;
  category: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  document_url?: string;
  document_name?: string;
}

interface ClubsTableProps {
  clubs: Club[];
  isLoading: boolean;
  onViewClub: (clubId: string) => void;
  onClubStatusChange?: () => void;
}

const ClubsTable: React.FC<ClubsTableProps> = ({
  clubs,
  isLoading,
  onViewClub,
  onClubStatusChange
}) => {
  const { toast } = useToast();
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

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

      if (onClubStatusChange) {
        console.log("Triggering club status change callback");
        onClubStatusChange();
      }
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

  const openRejectDialog = (clubId: string) => {
    setSelectedClubId(clubId);
    setRejectionReason('');
    setIsRejectDialogOpen(true);
  };

  const handleRejectClub = async () => {
    if (!selectedClubId || !rejectionReason.trim()) return;

    try {
      console.log("Starting club rejection process for club ID:", selectedClubId);
      setProcessingId(selectedClubId);
      
      const { error, data } = await supabase
        .from('clubs')
        .update({ 
          status: 'rejected',
          rejection_reason: rejectionReason 
        })
        .eq('id', selectedClubId)
        .select();

      if (error) {
        console.error('Error rejecting club:', error);
        throw error;
      }

      console.log("Club rejection successful:", data);
      
      toast({
        title: 'Club Rejected',
        description: 'The club has been rejected with a reason provided.',
      });

      setIsRejectDialogOpen(false);
      setRejectionReason('');
      setSelectedClubId(null);

      if (onClubStatusChange) {
        console.log("Triggering club status change callback");
        onClubStatusChange();
      }
    } catch (error) {
      console.error('Error rejecting club:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject club. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Club Management</CardTitle>
          <CardDescription>All clubs in the system</CardDescription>
        </CardHeader>
        <CardContent>
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
              onReject={openRejectDialog}
              onView={onViewClub}
            />
          )}
        </CardContent>
      </Card>

      <RejectDialog
        isOpen={isRejectDialogOpen}
        onOpenChange={setIsRejectDialogOpen}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        onConfirm={handleRejectClub}
      />
    </>
  );
};

export default ClubsTable;
