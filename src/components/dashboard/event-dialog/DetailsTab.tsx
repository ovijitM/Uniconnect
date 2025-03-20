
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface DetailsTabProps {
  formData: {
    date: string;
    location: string;
    maxParticipants: string;
    eligibility?: string;
    teamSize?: string;
    theme?: string;
    prizePool?: string;
    prizeCategories?: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="date">
          Date & Time* <span className="text-xs text-muted-foreground">(Required)</span>
        </Label>
        <Input
          id="date"
          name="date"
          type="datetime-local"
          value={formData.date}
          onChange={onInputChange}
          required
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="location">
          Location* <span className="text-xs text-muted-foreground">(Required)</span>
        </Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={onInputChange}
          required
          placeholder="University, Campus, Room No."
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="maxParticipants">
          Max Participants* <span className="text-xs text-muted-foreground">(Required)</span>
        </Label>
        <Input
          id="maxParticipants"
          name="maxParticipants"
          type="number"
          value={formData.maxParticipants}
          onChange={onInputChange}
          required
          placeholder="e.g., 50, 100, 200"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="eligibility">
          Eligibility* <span className="text-xs text-muted-foreground">(Required)</span>
        </Label>
        <Input
          id="eligibility"
          name="eligibility"
          value={formData.eligibility || ''}
          onChange={onInputChange}
          required
          placeholder="e.g., All university students, Freshmen only"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="teamSize">
          Team Size* <span className="text-xs text-muted-foreground">(Required)</span>
        </Label>
        <Input
          id="teamSize"
          name="teamSize"
          value={formData.teamSize || ''}
          onChange={onInputChange}
          required
          placeholder="e.g., Individual, 2-4 members"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="theme">
          Theme
        </Label>
        <Input
          id="theme"
          name="theme"
          value={formData.theme || ''}
          onChange={onInputChange}
          placeholder="Main theme of the event"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="prizePool">
          Prize Pool
        </Label>
        <Input
          id="prizePool"
          name="prizePool"
          value={formData.prizePool || ''}
          onChange={onInputChange}
          placeholder="e.g., $500, Certificates & Trophies"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="prizeCategories">
          Prize Categories
        </Label>
        <Textarea
          id="prizeCategories"
          name="prizeCategories"
          value={formData.prizeCategories || ''}
          onChange={onInputChange}
          placeholder="First Place, Best Design, etc. (comma separated)"
          className="min-h-[80px]"
        />
      </div>
    </div>
  );
};

export default DetailsTab;
