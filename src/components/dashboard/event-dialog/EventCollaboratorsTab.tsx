
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Club, Collaboration } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Handshake } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';

interface EventCollaboratorsTabProps {
  clubId: string;
  selectedCollaborators: string[];
  onCollaboratorToggle: (clubId: string, selected: boolean) => void;
}

const EventCollaboratorsTab: React.FC<EventCollaboratorsTabProps> = ({ 
  clubId, 
  selectedCollaborators,
  onCollaboratorToggle
}) => {
  const [availableCollaborators, setAvailableCollaborators] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (clubId) {
      fetchCollaborators();
    }
  }, [clubId]);

  const fetchCollaborators = async () => {
    try {
      setIsLoading(true);
      
      // Fetch accepted collaborations for this club
      const { data, error } = await supabase
        .from('club_collaborations')
        .select(`
          id,
          requester_club_id,
          requested_club_id,
          status,
          requesterClub:requester_club_id(id, name, logo_url, category),
          requestedClub:requested_club_id(id, name, logo_url, category)
        `)
        .eq('status', 'accepted')
        .or(`requester_club_id.eq.${clubId},requested_club_id.eq.${clubId}`);
      
      if (error) throw error;
      
      // Extract partner clubs
      const partnerClubs: Club[] = [];
      
      data.forEach(collab => {
        let partner: any;
        
        if (collab.requester_club_id === clubId) {
          partner = collab.requestedClub;
        } else {
          partner = collab.requesterClub;
        }
        
        if (partner) {
          partnerClubs.push({
            id: partner.id,
            name: partner.name,
            logoUrl: partner.logo_url,
            category: partner.category,
            description: '',
            memberCount: 0,
            events: []
          });
        }
      });
      
      setAvailableCollaborators(partnerClubs);
    } catch (error) {
      console.error('Error fetching collaborating clubs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div>
        <Label className="mb-3 block">Add Collaborating Clubs</Label>
        
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : availableCollaborators.length > 0 ? (
          <div className="space-y-2">
            {availableCollaborators.map(club => (
              <div key={club.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <Checkbox 
                  id={`club-${club.id}`}
                  checked={selectedCollaborators.includes(club.id)}
                  onCheckedChange={(checked) => onCollaboratorToggle(club.id, Boolean(checked))}
                />
                <div className="flex items-center flex-1 gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={club.logoUrl || ''} alt={club.name} />
                    <AvatarFallback>{club.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <Label htmlFor={`club-${club.id}`} className="font-medium cursor-pointer">
                    {club.name}
                  </Label>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 border rounded-lg">
            <Handshake className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-2" />
            <p className="text-muted-foreground">No collaborating clubs available</p>
            <p className="text-xs text-muted-foreground mt-1">
              Establish collaborations with other clubs first
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCollaboratorsTab;
