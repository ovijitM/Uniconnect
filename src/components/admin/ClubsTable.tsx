
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Check, X } from 'lucide-react';

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
      const { error } = await supabase
        .from('clubs')
        .update({ status: 'approved' })
        .eq('id', clubId);

      if (error) throw error;

      toast({
        title: 'Club Approved',
        description: 'The club has been approved successfully.',
      });

      if (onClubStatusChange) onClubStatusChange();
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

  const openRejectDialog = (clubId: string) => {
    setSelectedClubId(clubId);
    setRejectionReason('');
    setIsRejectDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline" className="bg-yellow-100">Pending</Badge>;
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
            <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clubs.map(club => (
                  <TableRow key={club.id}>
                    <TableCell className="font-medium">{club.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{club.category}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(club.status)}</TableCell>
                    <TableCell>{new Date(club.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {club.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleApproveClub(club.id)}
                              disabled={processingId === club.id}
                              className="bg-green-100 hover:bg-green-200"
                            >
                              <Check className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openRejectDialog(club.id)}
                              disabled={processingId === club.id}
                              className="bg-red-100 hover:bg-red-200"
                            >
                              <X className="h-4 w-4 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onViewClub(club.id)}
                        >
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Club</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this club. This will be visible to the club admin.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rejectionReason" className="text-right">
              Rejection Reason
            </Label>
            <Textarea
              id="rejectionReason"
              placeholder="Enter rejection reason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="mt-2"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRejectClub}
              disabled={!rejectionReason.trim()}
            >
              Reject Club
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ClubsTable;
