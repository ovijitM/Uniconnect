
import React from 'react';
import { Club } from '@/types';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from 'lucide-react';

interface DeleteClubDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClub: Club | null;
  handleDeleteClub: () => void;
  isSubmitting: boolean;
}

const DeleteClubDialog: React.FC<DeleteClubDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedClub,
  handleDeleteClub,
  isSubmitting,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete {selectedClub?.name} and remove all associated data including members and events.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteClub}
            disabled={isSubmitting}
            className="bg-red-500 hover:bg-red-600"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : 'Delete Club'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteClubDialog;
