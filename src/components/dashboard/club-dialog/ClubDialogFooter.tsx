
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { ChevronLeft, ChevronRight, Save, Loader2 } from 'lucide-react';

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
    <DialogFooter className="flex justify-between items-center border-t pt-4 mt-2">
      <div>
        {activeTab !== 'basic' && (
          <Button 
            variant="outline" 
            onClick={onBack} 
            disabled={isSubmitting}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
        )}
      </div>
      
      <div>
        {activeTab !== 'documents' ? (
          <Button 
            variant="default" 
            onClick={onNext} 
            disabled={isSubmitting}
            className="gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            variant="default" 
            onClick={onSubmit} 
            disabled={isSubmitting}
            className="gap-2 min-w-28"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {buttonText}
              </>
            )}
          </Button>
        )}
      </div>
    </DialogFooter>
  );
};

export default ClubDialogFooter;
