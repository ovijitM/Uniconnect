
import React from 'react';
import { Club } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface EditClubDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedClub: Club | null;
  editFormData: {
    name: string;
    description: string;
    category: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleEditClub: () => void;
  isSubmitting: boolean;
}

const EditClubDialog: React.FC<EditClubDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedClub,
  editFormData,
  handleInputChange,
  handleEditClub,
  isSubmitting,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Club</DialogTitle>
          <DialogDescription>
            Make changes to your club's information.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={editFormData.name}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              name="category"
              value={editFormData.category}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={editFormData.description}
              onChange={handleInputChange}
              className="col-span-3"
              rows={4}
            />
          </div>
          {selectedClub?.status === 'rejected' && selectedClub?.rejection_reason && (
            <div className="grid grid-cols-4 items-start gap-4">
              <div className="text-right mt-1">
                <AlertTriangle className="h-4 w-4 text-red-500 ml-auto" />
              </div>
              <div className="col-span-3 p-3 bg-red-50 border border-red-100 rounded text-sm">
                <p className="font-semibold text-red-600 mb-1">Rejection Reason:</p>
                <p className="text-red-600">{selectedClub.rejection_reason}</p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleEditClub} 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditClubDialog;
