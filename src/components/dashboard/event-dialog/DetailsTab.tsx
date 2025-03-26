
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/file-upload/FileUpload';

interface DetailsTabProps {
  formData: {
    title: string;
    description: string;
    date: string;
    location: string;
    category: string;
    maxParticipants: string;
    clubId: string;
    tagline?: string;
    eventType?: string;
    theme?: string;
    subTracks?: string[] | string;
    prizePool?: string;
    prizeCategories?: string[] | string;
    additionalPerks?: string[] | string;
    judgingCriteria?: string[] | string;
    judges?: string[] | string;
    deliverables?: string[] | string;
    submissionPlatform?: string;
    mentors?: string[] | string;
    sponsors?: string[] | string;
    contactEmail?: string;
    communityLink?: string;
    eventWebsite?: string;
    eventHashtag?: string;
    documentUrl?: string;
    documentName?: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileUpload?: (url: string, fileName: string) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({
  formData,
  onInputChange,
  onFileUpload
}) => {
  const handleFileUpload = (url: string, fileName: string) => {
    if (onFileUpload) {
      onFileUpload(url, fileName);
    }
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <label htmlFor="tagline" className="text-sm font-medium">Tagline</label>
        <Input
          id="tagline"
          name="tagline"
          value={formData.tagline || ''}
          onChange={onInputChange}
          placeholder="A short description of your event"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="theme" className="text-sm font-medium">Event Theme</label>
        <Input
          id="theme"
          name="theme"
          value={formData.theme || ''}
          onChange={onInputChange}
          placeholder="Main theme of the event"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="subTracks" className="text-sm font-medium">Sub-tracks or Categories</label>
        <Textarea
          id="subTracks"
          name="subTracks"
          value={typeof formData.subTracks === 'string' ? formData.subTracks : (formData.subTracks || []).join(',')}
          onChange={onInputChange}
          placeholder="Separate with commas"
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="prizePool" className="text-sm font-medium">Prize Pool</label>
          <Input
            id="prizePool"
            name="prizePool"
            value={formData.prizePool || ''}
            onChange={onInputChange}
            placeholder="Total prize amount"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="prizeCategories" className="text-sm font-medium">Prize Categories</label>
          <Textarea
            id="prizeCategories"
            name="prizeCategories"
            value={typeof formData.prizeCategories === 'string' ? formData.prizeCategories : (formData.prizeCategories || []).join(',')}
            onChange={onInputChange}
            placeholder="Separate with commas"
            rows={2}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="additionalPerks" className="text-sm font-medium">Additional Perks</label>
        <Textarea
          id="additionalPerks"
          name="additionalPerks"
          value={typeof formData.additionalPerks === 'string' ? formData.additionalPerks : (formData.additionalPerks || []).join(',')}
          onChange={onInputChange}
          placeholder="Separate with commas"
          rows={2}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="judgingCriteria" className="text-sm font-medium">Judging Criteria</label>
          <Textarea
            id="judgingCriteria"
            name="judgingCriteria"
            value={typeof formData.judgingCriteria === 'string' ? formData.judgingCriteria : (formData.judgingCriteria || []).join(',')}
            onChange={onInputChange}
            placeholder="Separate with commas"
            rows={2}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="judges" className="text-sm font-medium">Judges</label>
          <Textarea
            id="judges"
            name="judges"
            value={typeof formData.judges === 'string' ? formData.judges : (formData.judges || []).join(',')}
            onChange={onInputChange}
            placeholder="Separate with commas"
            rows={2}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="deliverables" className="text-sm font-medium">Deliverables</label>
        <Textarea
          id="deliverables"
          name="deliverables"
          value={typeof formData.deliverables === 'string' ? formData.deliverables : (formData.deliverables || []).join(',')}
          onChange={onInputChange}
          placeholder="Separate with commas"
          rows={2}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="eventDocument" className="text-sm font-medium">Event Document</label>
        <p className="text-xs text-muted-foreground mb-2">Upload any detailed guidelines, rules, or additional information</p>
        <FileUpload 
          onUploadComplete={handleFileUpload}
          buttonText="Upload Event Document"
          uploadType="document"
          bucket="event_documents"
          acceptedFileTypes={["application/pdf", "application/msword", "text/plain"]}
          maxFileSize={5}
        />
      </div>
    </div>
  );
};

export default DetailsTab;
