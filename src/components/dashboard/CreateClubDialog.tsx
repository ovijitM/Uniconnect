import React from 'react';
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
    tagline?: string;
    establishedYear?: string;
    affiliation?: string;
    whyJoin?: string;
    regularEvents?: string;
    signatureEvents?: string;
    communityEngagement?: string;
    whoCanJoin?: string;
    membershipFee?: string;
    howToJoin?: string;
    presidentName?: string;
    presidentContact?: string;
    executiveMembers?: string;
    advisors?: string;
    phoneNumber?: string;
    website?: string;
    facebookLink?: string;
    instagramLink?: string;
    twitterLink?: string;
    discordLink?: string;
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Club</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new club.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              placeholder="Enter club name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onInputChange}
              placeholder="Describe what your club is about"
              className="min-h-[100px]"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">
              Category
            </Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={onInputChange}
              placeholder="e.g., Sports, Technology, Arts"
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
