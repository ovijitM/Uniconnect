
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { ClubFormData } from '@/hooks/club-admin/types';

interface NoClubsViewProps {
  isDialogOpen?: boolean;
  setIsDialogOpen?: (open: boolean) => void;
  clubFormData?: ClubFormData;
  handleClubInputChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCreateClub?: () => void;
}

const NoClubsView: React.FC<NoClubsViewProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  clubFormData,
  handleClubInputChange,
  handleCreateClub
}) => {
  const navigate = useNavigate();
  
  const handleCreateClubClick = () => {
    if (handleCreateClub) {
      handleCreateClub();
    } else if (setIsDialogOpen) {
      setIsDialogOpen(true);
    } else {
      // Navigate to the club creation form if no callback is provided
      navigate('/club-admin-dashboard/create-club');
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-8 max-w-3xl mx-auto">
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="p-4 rounded-full bg-primary-50">
          <PlusCircle className="h-12 w-12 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Create Your First Club</h2>
          <p className="text-gray-500 max-w-lg">
            You don't have any clubs yet. Create a club to start hosting events, manage memberships, and connect with your community.
          </p>
        </div>
        
        <Button 
          onClick={handleCreateClubClick} 
          className="px-6"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Club
        </Button>
      </div>
    </div>
  );
};

export default NoClubsView;
