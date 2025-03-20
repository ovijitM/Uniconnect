
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

interface Club {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string;
  logo_url?: string;
  rejection_reason?: string;
}

interface ManageClubsTableProps {
  clubs: Club[];
  isLoading: boolean;
  onRefresh: () => void;
}

const ManageClubsTable: React.FC<ManageClubsTableProps> = ({
  clubs,
  isLoading,
  onRefresh
}) => {
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    category: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openEditDialog = (club: Club) => {
    setSelectedClub(club);
    setEditFormData({
      name: club.name,
      description: club.description,
      category: club.category,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (club: Club) => {
    setSelectedClub(club);
    setIsDeleteDialogOpen(true);
  };

  const handleEditClub = async () => {
    if (!selectedClub) return;
    
    try {
      setIsSubmitting(true);
      
      // Check if all fields are filled
      if (!editFormData.name.trim() || !editFormData.description.trim() || !editFormData.category.trim()) {
        toast({
          title: "Missing information",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return;
      }
      
      // Update club in Supabase
      const { error } = await supabase
        .from('clubs')
        .update({
          name: editFormData.name,
          description: editFormData.description,
          category: editFormData.category,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedClub.id);
      
      if (error) throw error;
      
      toast({
        title: "Club updated",
        description: "The club has been updated successfully",
      });
      
      setIsEditDialogOpen(false);
      onRefresh();
    } catch (error) {
      console.error('Error updating club:', error);
      toast({
        title: "Update failed",
        description: "Failed to update club. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClub = async () => {
    if (!selectedClub) return;
    
    try {
      setIsSubmitting(true);
      
      // First, remove all club members
      const { error: memberError } = await supabase
        .from('club_members')
        .delete()
        .eq('club_id', selectedClub.id);
      
      if (memberError) throw memberError;
      
      // Next, remove club admins
      const { error: adminError } = await supabase
        .from('club_admins')
        .delete()
        .eq('club_id', selectedClub.id);
      
      if (adminError) throw adminError;

      // Finally, delete the club
      const { error } = await supabase
        .from('clubs')
        .delete()
        .eq('id', selectedClub.id);
      
      if (error) throw error;
      
      toast({
        title: "Club deleted",
        description: "The club has been deleted successfully",
      });
      
      setIsDeleteDialogOpen(false);
      onRefresh();
    } catch (error) {
      console.error('Error deleting club:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete club. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline" className="bg-yellow-100">Pending</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Manage Your Clubs</CardTitle>
          <CardDescription>Edit or delete clubs you administrate</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
          ) : clubs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">You don't have any clubs to manage yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clubs.map(club => (
                  <TableRow key={club.id}>
                    <TableCell className="font-medium">{club.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{club.category}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(club.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditDialog(club)}
                        >
                          <Pencil className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openDeleteDialog(club)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Club Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
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

      {/* Delete Club Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
    </>
  );
};

export default ManageClubsTable;
