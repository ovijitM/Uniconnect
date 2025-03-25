
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
          <Button type="submit" onClick={onSubmit}>{buttonText}</Button>
        )}
      </div>
    </DialogFooter>
  );
};

export default ClubDialogFooter;
