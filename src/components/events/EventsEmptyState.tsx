
import React from 'react';
import { CalendarX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventsEmptyStateProps {
  clearFilters: () => void;
}

const EventsEmptyState = ({ clearFilters }: EventsEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-muted/50 h-64">
      <CalendarX className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-2">No events found</h3>
      <p className="text-sm text-muted-foreground text-center mb-4">
        No events match your current filters. Try adjusting your search criteria.
      </p>
      <Button onClick={clearFilters} variant="outline">
        Clear Filters
      </Button>
    </div>
  );
};

export default EventsEmptyState;
