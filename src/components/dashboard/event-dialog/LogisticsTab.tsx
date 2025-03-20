
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface LogisticsTabProps {
  formData: {
    clubId: string;
    eventType?: string;
    registrationDeadline?: string;
    registrationLink?: string;
    contactEmail?: string;
    submissionPlatform?: string;
    communityLink?: string;
    eventWebsite?: string;
  };
  clubs: any[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const LogisticsTab: React.FC<LogisticsTabProps> = ({ formData, clubs, onInputChange }) => {
  // Get the current club name based on clubId
  const currentClub = clubs.find(club => club.id === formData.clubId);
  const clubName = currentClub ? currentClub.name : '';

  return (
    <div className="space-y-4 py-4">
      {clubs.length > 1 ? (
        <div className="grid gap-2">
          <Label htmlFor="clubId">
            Select Club* <span className="text-xs text-muted-foreground">(Required)</span>
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
      ) : clubs.length === 1 ? (
        <div className="grid gap-2">
          <Label htmlFor="organizing-club">Organizing Club</Label>
          <div className="flex h-10 w-full items-center rounded-md border border-input bg-muted px-3 py-2 text-sm font-medium">
            {clubs[0].name}
            <input type="hidden" name="clubId" value={clubs[0].id} />
          </div>
        </div>
      ) : null}
      
      <div className="grid gap-2">
        <Label htmlFor="eventType">
          Event Type* <span className="text-xs text-muted-foreground">(Required)</span>
        </Label>
        <select
          id="eventType"
          name="eventType"
          value={formData.eventType || 'in-person'}
          onChange={onInputChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          required
        >
          <option value="in-person">In-person</option>
          <option value="online">Online</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="registrationDeadline">
          Registration Deadline* <span className="text-xs text-muted-foreground">(Required)</span>
        </Label>
        <Input
          id="registrationDeadline"
          name="registrationDeadline"
          type="datetime-local"
          value={formData.registrationDeadline || ''}
          onChange={onInputChange}
          required
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="registrationLink">
          Registration Link
        </Label>
        <Input
          id="registrationLink"
          name="registrationLink"
          type="url"
          value={formData.registrationLink || ''}
          onChange={onInputChange}
          placeholder="Link to external registration form/page"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="contactEmail">
          Contact Email* <span className="text-xs text-muted-foreground">(Required)</span>
        </Label>
        <Input
          id="contactEmail"
          name="contactEmail"
          type="email"
          value={formData.contactEmail || ''}
          onChange={onInputChange}
          required
          placeholder="Email for inquiries"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="submissionPlatform">
          Submission Platform
        </Label>
        <Input
          id="submissionPlatform"
          name="submissionPlatform"
          value={formData.submissionPlatform || ''}
          onChange={onInputChange}
          placeholder="e.g., Google Forms, Devpost, GitHub"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="communityLink">
          Community Link
        </Label>
        <Input
          id="communityLink"
          name="communityLink"
          type="url"
          value={formData.communityLink || ''}
          onChange={onInputChange}
          placeholder="Discord, Slack, WhatsApp, etc."
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="eventWebsite">
          Event Website
        </Label>
        <Input
          id="eventWebsite"
          name="eventWebsite"
          type="url"
          value={formData.eventWebsite || ''}
          onChange={onInputChange}
          placeholder="Official event website"
        />
      </div>
    </div>
  );
};

export default LogisticsTab;
