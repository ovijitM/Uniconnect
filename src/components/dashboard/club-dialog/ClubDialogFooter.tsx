
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';

interface ClubDialogFooterProps {
  activeTab: string;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  buttonText?: string;
  isSubmitting?: boolean;
}

const ClubDialogFooter: React.FC<ClubDialogFooterProps> = ({
  activeTab,
  onBack,
  onNext,
  onSubmit,
  buttonText = "Create Club",
  isSubmitting = false
}) => {
  return (
    <DialogFooter className="flex justify-between items-center">
      {activeTab !== 'basic' && (
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>
          Back
        </Button>
      )}
      
      <div></div> {/* Spacer */}
      
      {activeTab !== 'documents' ? (
        <Button variant="default" onClick={onNext} disabled={isSubmitting}>
          Next
        </Button>
      ) : (
        <Button 
          variant="default" 
          onClick={onSubmit} 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Submitting...
            </>
          ) : (
            buttonText
          )}
        </Button>
      )}
    </DialogFooter>
  );
};

export default ClubDialogFooter;
