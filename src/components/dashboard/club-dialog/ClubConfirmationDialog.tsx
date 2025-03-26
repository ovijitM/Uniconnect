
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
import { Spinner } from '@/components/ui/spinner';
import { ClubFormData } from '@/hooks/club-admin/types';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  isSubmitting,
}) => {
  const renderSection = (title: string, fields: Array<{ key: keyof ClubFormData; label: string }>) => {
    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-3 border-b pb-1">{title}</h3>
        <div className="space-y-2">
          {fields.map(({ key, label }) => {
            const value = formData[key];
            if (!value || (typeof value === 'string' && value.trim() === '')) return null;
            
            return (
              <div key={key as string} className="grid grid-cols-3 gap-2">
                <dt className="text-xs text-muted-foreground">{label}:</dt>
                <dd className="text-xs col-span-2">{value as string}</dd>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Confirm Club Details</DialogTitle>
          <DialogDescription>
            Please review the club details before final submission. Once submitted, your club will be created and await approval.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-6">
              {formData.logoUrl && (
                <img 
                  src={formData.logoUrl} 
                  alt={formData.name} 
                  className="w-24 h-24 rounded-md object-cover"
                />
              )}
              <div>
                <h2 className="text-xl font-bold">{formData.name}</h2>
                {formData.tagline && <p className="text-sm text-muted-foreground">{formData.tagline}</p>}
                <p className="text-xs mt-1">Category: {formData.category}</p>
                <p className="text-xs">University: {formData.university}</p>
              </div>
            </div>

            {renderSection('Basic Information', [
              { key: 'description', label: 'Description' }
            ])}

            {renderSection('Club Details', [
              { key: 'establishedYear', label: 'Established Year' },
              { key: 'affiliation', label: 'Affiliation' },
              { key: 'whyJoin', label: 'Why Join' },
              { key: 'regularEvents', label: 'Regular Events' },
              { key: 'signatureEvents', label: 'Signature Events' },
              { key: 'communityEngagement', label: 'Community Engagement' },
              { key: 'whoCanJoin', label: 'Who Can Join' },
              { key: 'membershipFee', label: 'Membership Fee' },
              { key: 'howToJoin', label: 'How To Join' }
            ])}

            {renderSection('Leadership', [
              { key: 'presidentName', label: 'President Name' },
              { key: 'presidentContact', label: 'President Contact' },
              { key: 'executiveMembers', label: 'Executive Members' },
              { key: 'advisors', label: 'Advisors' }
            ])}

            {renderSection('Contact Information', [
              { key: 'phoneNumber', label: 'Phone Number' },
              { key: 'website', label: 'Website' }
            ])}

            {renderSection('Social Media', [
              { key: 'facebookLink', label: 'Facebook' },
              { key: 'instagramLink', label: 'Instagram' },
              { key: 'twitterLink', label: 'Twitter' },
              { key: 'discordLink', label: 'Discord' }
            ])}

            {formData.documentUrl && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3 border-b pb-1">Uploaded Documents</h3>
                <div className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <a 
                    href={formData.documentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline"
                  >
                    {formData.documentName || 'View Document'}
                  </a>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Go Back
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Creating Club...
              </>
            ) : (
              'Create Club'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClubConfirmationDialog;
