
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Confirm Club Submission</DialogTitle>
          <DialogDescription>
            Please review your club information before final submission.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <section className="border rounded-md p-4">
            <h3 className="font-semibold text-lg">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Club Name</p>
                <p className="font-medium">{formData.name || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{formData.category || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">University</p>
                <p className="font-medium">{formData.university || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tagline</p>
                <p className="font-medium">{formData.tagline || 'Not provided'}</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="font-medium">{formData.description || 'Not provided'}</p>
            </div>
          </section>

          <section className="border rounded-md p-4">
            <h3 className="font-semibold text-lg">Club Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Established Year</p>
                <p className="font-medium">{formData.establishedYear || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Affiliation</p>
                <p className="font-medium">{formData.affiliation || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Membership Fee</p>
                <p className="font-medium">{formData.membershipFee || 'Free'}</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm text-muted-foreground">Why Join</p>
              <p className="font-medium">{formData.whyJoin || 'Not provided'}</p>
            </div>
          </section>

          <section className="border rounded-md p-4">
            <h3 className="font-semibold text-lg">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">President Name</p>
                <p className="font-medium">{formData.presidentName || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">President Contact</p>
                <p className="font-medium">{formData.presidentContact || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">{formData.phoneNumber || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Website</p>
                <p className="font-medium">{formData.website || 'Not provided'}</p>
              </div>
            </div>
          </section>

          <section className="border rounded-md p-4">
            <h3 className="font-semibold text-lg">Social Media</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-muted-foreground">Facebook</p>
                <p className="font-medium">{formData.facebookLink || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Instagram</p>
                <p className="font-medium">{formData.instagramLink || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Twitter</p>
                <p className="font-medium">{formData.twitterLink || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Discord</p>
                <p className="font-medium">{formData.discordLink || 'Not provided'}</p>
              </div>
            </div>
          </section>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Go Back & Edit
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isSubmitting}
          >
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
