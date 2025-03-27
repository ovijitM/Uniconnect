
import React from 'react';
import { Search } from 'lucide-react';

interface EventsHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const EventsHeader = ({ searchTerm, setSearchTerm }: EventsHeaderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-muted-foreground">Discover upcoming events from all university clubs</p>
        </div>
      </div>
      
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full rounded-md border border-input bg-background"
        />
      </div>
    </div>
  );
};

export default EventsHeader;
