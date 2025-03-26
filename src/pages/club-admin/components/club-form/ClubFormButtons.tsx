
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@/components/ui/spinner';

interface ClubFormButtonsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  isEditing?: boolean;
}

const ClubFormButtons: React.FC<ClubFormButtonsProps> = ({
  isSubmitting,
  onCancel,
  isEditing = false
}) => {
  return (
    <div className="flex justify-end gap-4 mt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Spinner className="mr-2" size={16} />
            {isEditing ? 'Saving...' : 'Creating...'}
          </>
        ) : (
          isEditing ? 'Save Club' : 'Create Club'
        )}
      </Button>
    </div>
  );
};

export default ClubFormButtons;
