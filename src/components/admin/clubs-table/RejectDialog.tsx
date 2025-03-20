
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface RejectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  onConfirm: () => void;
}

const RejectDialog: React.FC<RejectDialogProps> = ({
  isOpen,
  onOpenChange,
  rejectionReason,
  setRejectionReason,
  onConfirm
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={!rejectionReason.trim()}
          >
            Reject Club
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RejectDialog;
