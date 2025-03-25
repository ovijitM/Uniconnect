
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users, School } from 'lucide-react';
import { ClubFormData } from '@/hooks/club-admin/types';
import { useClubValidation } from '@/hooks/club-admin/useClubValidation';
import ManageClubsTable from '@/components/dashboard/ManageClubsTable';

interface ClubsViewProps {
  clubs: any[];
  isLoading: boolean;
  onRefresh: () => void;
  isClubDialogOpen: boolean;
  setIsClubDialogOpen: (open: boolean) => void;
  clubFormData: ClubFormData;
  handleClubInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCreateClub: () => void;
  handleClubFileUpload?: (url: string, fileName: string) => void;
}

const ClubsView: React.FC<ClubsViewProps> = ({
  clubs,
  isLoading,
  onRefresh,
  isClubDialogOpen,
  setIsClubDialogOpen,
  clubFormData,
  handleClubInputChange,
  handleCreateClub,
  handleClubFileUpload
}) => {
  const { validateClubData } = useClubValidation();
  
  // Group clubs by university
  const clubsByUniversity = clubs.reduce((acc: Record<string, any[]>, club) => {
    const university = club.university || 'Other';
    if (!acc[university]) {
      acc[university] = [];
    }
    acc[university].push(club);
    return acc;
  }, {});
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Club Management</h1>
        <Button onClick={() => setIsClubDialogOpen(true)} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Club
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Total Clubs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{clubs.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5 text-purple-500" />
              Universities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Object.keys(clubsByUniversity).length}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>My Clubs</CardTitle>
          <CardDescription>Manage all your clubs</CardDescription>
        </CardHeader>
        <CardContent>
          <ManageClubsTable
            clubs={clubs}
            isLoading={isLoading}
            onRefresh={onRefresh}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubsView;
