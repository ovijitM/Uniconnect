
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Download } from 'lucide-react';

interface AttendeeControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExport: (format: 'csv' | 'pdf') => void;
}

const AttendeeControls: React.FC<AttendeeControlsProps> = ({
  searchQuery,
  setSearchQuery,
  onExport
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search attendees..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onExport('csv')}
        >
          <FileText className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onExport('pdf')}
        >
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>
    </div>
  );
};

export default AttendeeControls;
