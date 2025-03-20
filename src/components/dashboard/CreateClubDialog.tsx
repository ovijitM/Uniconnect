
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateClubDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: {
    name: string;
    description: string;
    category: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  buttonText?: string;
  trigger?: React.ReactNode;
}

const CreateClubDialog: React.FC<CreateClubDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  onInputChange,
  onSubmit,
  buttonText = "Create New Club",
  trigger
}) => {
  const { toast } = useToast();
  
  // Validate form data before submission
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a club name.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a club description.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.category.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a club category.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  // Handler to correctly close dialog after successful submission
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
      // Dialog will be closed by the parent component after successful submission
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger ? (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            {buttonText}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Club</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new club.
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
              value={formData.name}
              onChange={onInputChange}
              className="col-span-3"
              required
              placeholder="Enter club name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onInputChange}
              className="col-span-3"
              required
              placeholder="Describe what your club is about"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={onInputChange}
              className="col-span-3"
              placeholder="e.g., Sports, Technology, Arts"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Create Club</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClubDialog;
