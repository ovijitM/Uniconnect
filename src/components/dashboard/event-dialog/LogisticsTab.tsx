
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface LogisticsTabProps {
  formData: {
    clubId: string;
    eventType?: string;
    registrationDeadline?: string;
  };
  clubs: any[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const LogisticsTab: React.FC<LogisticsTabProps> = ({ formData, clubs, onInputChange }) => {
  return (
    <div className="space-y-4 py-4">
      {clubs.length > 1 && (
        <div className="grid gap-2">
          <Label htmlFor="clubId">
            Select Club*
          </Label>
          <select
            id="clubId"
            name="clubId"
            value={formData.clubId}
            onChange={onInputChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            required
          >
            <option value="">Select a club</option>
            {clubs.map(club => (
              <option key={club.id} value={club.id}>{club.name}</option>
            ))}
          </select>
        </div>
      )}
      
      <div className="grid gap-2">
        <Label htmlFor="eventType">
          Event Type
        </Label>
        <select
          id="eventType"
          name="eventType"
          value={formData.eventType || 'in-person'}
          onChange={onInputChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
        >
          <option value="in-person">In-person</option>
          <option value="online">Online</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="registrationDeadline">
          Registration Deadline
        </Label>
        <Input
          id="registrationDeadline"
          name="registrationDeadline"
          type="datetime-local"
          value={formData.registrationDeadline || ''}
          onChange={onInputChange}
        />
      </div>
    </div>
  );
};

export default LogisticsTab;
