
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: any;
  onConfirm: () => void;
  isSubmitting: boolean;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  onConfirm,
  isSubmitting
}) => {
  // Format arrays for display
  const formatArray = (arr: string[] | undefined) => {
    if (!arr || arr.length === 0) return 'None';
    return arr.join(', ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Confirm Event Details</DialogTitle>
          <DialogDescription>
            Please review all event information before final submission
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Title</p>
                  <p>{formData.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tagline</p>
                  <p>{formData.tagline || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{formData.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Location</p>
                  <p>{formData.location}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <p>{formData.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Event Type</p>
                  <p>{formData.eventType || 'In-person'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="mt-2 whitespace-pre-wrap">{formData.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Event Details</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Theme</p>
                  <p>{formData.theme || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sub-tracks</p>
                  <p>{formData.subTracks || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Prize Pool</p>
                  <p>{formData.prizePool || 'None'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Prize Categories</p>
                  <p>{formData.prizeCategories || 'None'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Additional Perks</p>
                  <p>{formData.additionalPerks || 'None'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Logistics</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Max Participants</p>
                  <p>{formData.maxParticipants || 'Unlimited'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Registration Deadline</p>
                  <p>{formData.registrationDeadline || 'None'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Team Size</p>
                  <p>{formData.teamSize || 'Individual'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Entry Fee</p>
                  <p>{formData.entryFee || 'Free'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Eligibility</p>
                  <p>{formData.eligibility || 'Open to all'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact Email</p>
                  <p>{formData.contactEmail || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Event Website</p>
                  <p>{formData.eventWebsite || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Community Link</p>
                  <p>{formData.communityLink || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Event Hashtag</p>
                  <p>{formData.eventHashtag || 'N/A'}</p>
                </div>
              </div>
            </div>

            {formData.documentName && (
              <div>
                <h3 className="text-lg font-semibold">Attached Document</h3>
                <p>{formData.documentName}</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Edit
          </Button>
          <Button onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Confirm & Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
