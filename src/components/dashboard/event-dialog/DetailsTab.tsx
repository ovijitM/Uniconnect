
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface DetailsTabProps {
  formData: {
    date: string;
    location: string;
    maxParticipants: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="date">
          Date & Time*
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
          Location*
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
          Max Participants
        </Label>
        <Input
          id="maxParticipants"
          name="maxParticipants"
          type="number"
          value={formData.maxParticipants}
          onChange={onInputChange}
        />
      </div>
    </div>
  );
};

export default DetailsTab;
