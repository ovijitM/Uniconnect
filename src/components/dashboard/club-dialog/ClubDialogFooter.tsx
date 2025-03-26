
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';

interface ClubDialogFooterProps {
  activeTab: string;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  buttonText: string;
}

const ClubDialogFooter: React.FC<ClubDialogFooterProps> = ({
  activeTab,
  onBack,
  onNext,
  onSubmit,
  buttonText
}) => {
  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Submit button clicked! Calling onSubmit handler");
    onSubmit();
  };

  return (
    <DialogFooter className="mt-6 flex justify-between">
      {activeTab !== 'basic' && (
        <Button 
          type="button" 
          variant="outline" 
          onClick={onBack}
        >
          Back
        </Button>
      )}
      
      <div>
        {activeTab !== 'documents' ? (
          <Button type="button" onClick={onNext}>Next</Button>
        ) : (
          <Button 
            type="button" 
            onClick={handleSubmit}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </DialogFooter>
  );
};

export default ClubDialogFooter;
