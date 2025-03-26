
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ClubsTableContent from './clubs-table/ClubsTableContent';
import RejectDialog from './clubs-table/RejectDialog';

interface Club {
  id: string;
  name: string;
  category: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
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
      setProcessingId(clubId);
      console.log("Approving club with ID:", clubId);
      
      const { error } = await supabase
        .from('clubs')
        .update({ status: 'approved' })
        .eq('id', clubId);

      if (error) {
        console.error('Error approving club:', error);
        throw error;
      }

      toast({
        title: 'Club Approved',
        description: 'The club has been approved successfully.',
      });

      if (onClubStatusChange) {
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
      setProcessingId(selectedClubId);
      const { error } = await supabase
        .from('clubs')
        .update({ 
          status: 'rejected',
          rejection_reason: rejectionReason 
        })
        .eq('id', selectedClubId);

      if (error) throw error;

      toast({
        title: 'Club Rejected',
        description: 'The club has been rejected with a reason provided.',
      });

      setIsRejectDialogOpen(false);
      setRejectionReason('');
      setSelectedClubId(null);

      if (onClubStatusChange) onClubStatusChange();
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
          <ClubsTableContent
            clubs={clubs}
            isLoading={isLoading}
            processingId={processingId}
            onApprove={handleApproveClub}
            onReject={openRejectDialog}
            onView={onViewClub}
          />
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
