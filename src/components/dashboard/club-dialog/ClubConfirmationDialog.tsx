
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
import { Spinner } from '@/components/ui/spinner';
import { ClubFormData } from '@/hooks/club-admin/types';

interface ClubConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ClubFormData;
  onConfirm: () => void;
  isSubmitting: boolean;
}

const ClubConfirmationDialog: React.FC<ClubConfirmationDialogProps> = ({
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
          <DialogTitle>Confirm Club Details</DialogTitle>
          <DialogDescription>
            Please review all club information before final submission
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p>{formData.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Category</p>
                  <p>{formData.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">University</p>
                  <p>{formData.university}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tagline</p>
                  <p>{formData.tagline || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="mt-2 whitespace-pre-wrap">{formData.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Club Details</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Established Year</p>
                  <p>{formData.establishedYear || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Membership Fee</p>
                  <p>{formData.membershipFee || 'Free'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Who Can Join</p>
                  <p>{formData.whoCanJoin || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">How To Join</p>
                  <p>{formData.howToJoin || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Leadership</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">President Name</p>
                  <p>{formData.presidentName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">President Contact</p>
                  <p>{formData.presidentContact || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Executive Members</p>
                  <p>{formData.executiveMembers || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Advisors</p>
                  <p>{formData.advisors || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Activities</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Why Join</p>
                  <p>{formData.whyJoin || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Regular Events</p>
                  <p>{formData.regularEvents || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Signature Events</p>
                  <p>{formData.signatureEvents || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Community Engagement</p>
                  <p>{formData.communityEngagement || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                  <p>{formData.phoneNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Website</p>
                  <p>{formData.website || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Facebook</p>
                  <p>{formData.facebookLink || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Instagram</p>
                  <p>{formData.instagramLink || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Twitter</p>
                  <p>{formData.twitterLink || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Discord</p>
                  <p>{formData.discordLink || 'N/A'}</p>
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
            {isSubmitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Submitting...
              </>
            ) : (
              'Confirm & Submit'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClubConfirmationDialog;
