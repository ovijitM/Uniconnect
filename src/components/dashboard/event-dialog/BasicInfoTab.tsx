
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BasicInfoTabProps {
  formData: {
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
    maxParticipants: string;
    tagline: string; // Required
    visibility: 'public' | 'university_only';
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({ formData, onInputChange }) => {
  return (
    <div className="space-y-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="title">
          Event Title* <span className="text-xs text-muted-foreground">(Required)</span>
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={onInputChange}
          required
          placeholder="Enter a concise, descriptive title"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="tagline">
          Tagline* <span className="text-xs text-muted-foreground">(Required)</span>
        </Label>
        <Input
          id="tagline"
          name="tagline"
          value={formData.tagline}
          onChange={onInputChange}
          required
          placeholder="A short, catchy phrase describing your event"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="description">
          Description* <span className="text-xs text-muted-foreground">(Required)</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={onInputChange}
          required
          placeholder="Provide details about the event"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="date">
          Date and Time* <span className="text-xs text-muted-foreground">(Required)</span>
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
          placeholder="Physical location or online platform"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="category">
          Category* <span className="text-xs text-muted-foreground">(Required)</span>
        </Label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={onInputChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          required
        >
          <option value="">Select a category</option>
          <option value="Academic">Academic</option>
          <option value="Arts & Culture">Arts & Culture</option>
          <option value="Career & Professional">Career & Professional</option>
          <option value="Community Service">Community Service</option>
          <option value="Competition">Competition</option>
          <option value="Conference">Conference</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Hackathon">Hackathon</option>
          <option value="Networking">Networking</option>
          <option value="Social">Social</option>
          <option value="Sports & Recreation">Sports & Recreation</option>
          <option value="Technology">Technology</option>
          <option value="Workshop">Workshop</option>
          <option value="Other">Other</option>
        </select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="maxParticipants">
          Maximum Participants
        </Label>
        <Input
          id="maxParticipants"
          name="maxParticipants"
          type="number"
          min="1"
          value={formData.maxParticipants}
          onChange={onInputChange}
          placeholder="Leave empty for unlimited"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="visibility">
          Event Visibility* <span className="text-xs text-muted-foreground">(Required)</span>
        </Label>
        <select
          id="visibility"
          name="visibility"
          value={formData.visibility}
          onChange={onInputChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          required
        >
          <option value="public">Public (Open to everyone)</option>
          <option value="university_only">University Only (Your university students only)</option>
        </select>
        <p className="text-xs text-muted-foreground">
          Public events are visible to everyone. University-only events are only visible to students from your university.
        </p>
      </div>
    </div>
  );
};

export default BasicInfoTab;
