
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Club } from '@/types';
import { Input } from '@/components/ui/input';
import { Search, Handshake } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CollaborationRequestDialogProps {
  clubId: string;
  onSendRequest: (requestedClubId: string) => Promise<boolean>;
}

const CollaborationRequestDialog: React.FC<CollaborationRequestDialogProps> = ({
  clubId,
  onSendRequest
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Club[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      setIsSearching(true);
      
      const { data, error } = await supabase
        .from('clubs')
        .select(`
          id,
          name,
          description,
          logo_url,
          category
        `)
        .neq('id', clubId)  // Exclude the current club
        .or(`name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
        .limit(10);
      
      if (error) throw error;
      
      const formattedResults = data.map(club => ({
        id: club.id,
        name: club.name,
        description: club.description,
        logoUrl: club.logo_url,
        category: club.category,
        memberCount: 0,  // Not needed for search results
        events: [] // Not needed for search results
      }));
      
      setSearchResults(formattedResults);
    } catch (error) {
      console.error('Error searching clubs:', error);
      toast({
        title: 'Search Error',
        description: 'Failed to search for clubs. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async (requestedClubId: string) => {
    try {
      setIsSending(true);
      const success = await onSendRequest(requestedClubId);
      if (success) {
        setIsOpen(false);
        setSearchTerm('');
        setSearchResults([]);
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Handshake className="h-4 w-4" />
          Add Collaborator
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Find Clubs to Collaborate With</DialogTitle>
          <DialogDescription>
            Search for clubs to send collaboration requests to
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search by club name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleSearch}
              disabled={isSearching || !searchTerm.trim()}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="max-h-80 overflow-y-auto">
          {isSearching ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-2">
              {searchResults.map(club => (
                <div key={club.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={club.logoUrl || ''} alt={club.name} />
                      <AvatarFallback>{club.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-sm">{club.name}</h4>
                      <p className="text-xs text-muted-foreground">{club.category}</p>
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    onClick={() => handleSendRequest(club.id)}
                    disabled={isSending}
                  >
                    <Handshake className="h-4 w-4 mr-1" />
                    Request
                  </Button>
                </div>
              ))}
            </div>
          ) : searchTerm ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No clubs found matching "{searchTerm}"</p>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollaborationRequestDialog;
